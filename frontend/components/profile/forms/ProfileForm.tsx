"use client";

import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Save } from "lucide-react";
import { FormField, SubmitButton, ErrorAlert, SuccessAlert } from "@/components/ui/shared";
import { updateProfile, getGenderTypes, UpdateProfileData } from "@/app/actions/profile";

const profileSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  birth_date: z.string().optional(),
  gender_id: z.number().optional(),
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

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: initialData?.first_name || "",
      last_name: initialData?.last_name || "",
      birth_date: initialData?.birth_date || "",
      gender_id: initialData?.gender_id || undefined,
    },
  });

  const handleSubmit = async (data: ProfileFormData) => {
    try {
      setLoading(true);
      setErrorMessage("");
      setSuccessMessage("");

      const result = await updateProfile(userId, data);
      
      if (result.success) {
        setSuccessMessage("Profile updated successfully!");
        onSuccess?.();
      } else {
        setErrorMessage(result.error || "Failed to update profile");
      }
    } catch (error) {
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            name="first_name"
            label="First Name"
            placeholder="Enter your first name"
            required
          />
          <FormField
            name="last_name"
            label="Last Name"
            placeholder="Enter your last name"
            required
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date of Birth
            </label>
            <input
              {...form.register("birth_date")}
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gender
            </label>
            <select
              {...form.register("gender_id", { valueAsNumber: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Gender</option>
              {genderTypes.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.html_value_en}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end">
          <SubmitButton
            loading={loading}
            disabled={loading}
            text="Save Changes"
            loadingText="Saving..."
            icon={<Save className="w-4 h-4" />}
          />
        </div>
      </form>
    </FormProvider>
  );
}