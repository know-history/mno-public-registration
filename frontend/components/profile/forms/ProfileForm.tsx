"use client";

import React, { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Save } from "lucide-react";
import { FormField, SubmitButton, ErrorAlert, SuccessAlert } from "@/components/ui/shared";
import { DatePicker } from "@/components/form/DatePicker";
import { updateProfile } from "@/app/actions/profile";
import { updateUserAttributes } from "aws-amplify/auth";

const profileSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  middle_name: z.string().optional(),
  birth_date: z.string().min(1, "Date of birth is required"),
  gender_id: z.number().optional(),
  another_gender_value: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  userId: string;
  initialData?: Partial<ProfileFormData>;
  genderTypes: any[];
  onSuccess?: () => void;
}

export function ProfileForm({ userId, initialData, genderTypes, onSuccess }: ProfileFormProps) {
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showCustomGender, setShowCustomGender] = useState(false);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: initialData?.first_name || "",
      last_name: initialData?.last_name || "",
      middle_name: initialData?.middle_name || "",
      birth_date: initialData?.birth_date || "",
      gender_id: initialData?.gender_id || undefined,
      another_gender_value: initialData?.another_gender_value || "",
    },
  });

  const watchedGenderId = form.watch("gender_id");
  const watchedValues = form.watch();

  // Check if "Another Gender" is selected (assuming it has a specific ID)
  useEffect(() => {
    const anotherGenderType = genderTypes.find(g => g.code === "another_gender" || g.html_value_en.toLowerCase().includes("another"));
    if (anotherGenderType && watchedGenderId === anotherGenderType.id) {
      setShowCustomGender(true);
    } else {
      setShowCustomGender(false);
      form.setValue("another_gender_value", "");
    }
  }, [watchedGenderId, genderTypes, form]);

  // Check if form has changes
  const hasChanges = React.useMemo(() => {
    if (!initialData) return true;
    
    return (
      watchedValues.first_name !== (initialData.first_name || "") ||
      watchedValues.last_name !== (initialData.last_name || "") ||
      watchedValues.middle_name !== (initialData.middle_name || "") ||
      watchedValues.birth_date !== (initialData.birth_date || "") ||
      watchedValues.gender_id !== initialData.gender_id ||
      watchedValues.another_gender_value !== (initialData.another_gender_value || "")
    );
  }, [watchedValues, initialData]);

  const handleSubmit = async (data: ProfileFormData) => {
    try {
      setLoading(true);
      setErrorMessage("");
      setSuccessMessage("");

      // Sanitize the custom gender input
      let sanitizedData = { ...data };
      if (data.another_gender_value) {
        sanitizedData.another_gender_value = data.another_gender_value
          .trim()
          .replace(/[<>\"'%;()&+]/g, "") // Remove potentially dangerous characters
          .substring(0, 100); // Limit length
      }

      // Update profile in database
      const result = await updateProfile(userId, sanitizedData);
      
      if (result.success) {
        // Update AWS Cognito attributes
        try {
          await updateUserAttributes({
            userAttributes: {
              given_name: data.first_name,
              family_name: data.last_name,
            },
          });
        } catch (awsError) {
          console.warn("Failed to update AWS attributes:", awsError);
          // Don't fail the entire operation if AWS update fails
        }

        setSuccessMessage("Profile updated successfully!");
        onSuccess?.();
      } else {
        setErrorMessage(result.error || "Failed to update profile");
      }
    } catch (error) {
      console.error("Profile update error:", error);
      setErrorMessage("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        {successMessage && <SuccessAlert message={successMessage} />}
        {errorMessage && <ErrorAlert message={errorMessage} />}

        <FormField
          name="first_name"
          label="First Name"
          placeholder="Enter your first name"
          required
        />

        <FormField
          name="middle_name"
          label="Middle Name (Optional)"
          placeholder="Enter your middle name"
        />

        <FormField
          name="last_name"
          label="Last Name"
          placeholder="Enter your last name"
          required
        />
        
        <DatePicker
          name="birth_date"
          label="Date of Birth"
          placeholder="Select your birth date"
          required
        />
        
        <div className="relative">
          <label className="flex items-center space-x-1 text-[13px] bg-white text-slate-700 font-medium absolute px-2 top-[-10px] left-[18px] z-10 cursor-pointer">
            <span>Gender</span>
          </label>
          <select
            {...form.register("gender_id", { valueAsNumber: true })}
            className="px-4 py-3.5 pr-10 bg-white text-slate-900 font-medium w-full text-base border-2 border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg outline-none transition-all appearance-none"
          >
            <option value="">Select Gender</option>
            {genderTypes.map((option) => (
              <option key={option.id} value={option.id}>
                {option.html_value_en}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {showCustomGender && (
          <FormField
            name="another_gender_value"
            label="Specify Your Gender"
            placeholder="Please specify your gender"
            required
          />
        )}

        <div className="flex justify-end">
          <SubmitButton
            loading={loading}
            disabled={loading || !hasChanges}
            text={hasChanges ? "Save Changes" : "No Changes"}
            loadingText="Saving..."
          />
        </div>
      </form>
    </FormProvider>
  );
}