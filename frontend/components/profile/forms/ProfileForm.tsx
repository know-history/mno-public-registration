"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormField,
  SubmitButton,
  ErrorAlert,
  SuccessAlert,
  SelectField,
} from "@/components/ui/shared";
import { DatePicker } from "@/components/form/DatePicker";
import { updateProfile } from "@/app/actions/profile";
import { updateUserAttributes } from "aws-amplify/auth";
import {
  profileSchema,
  type ProfileFormData,
  type GenderType,
  PROFILE_CONSTANTS,
  SUCCESS_MESSAGES,
  ERROR_MESSAGES,
} from "@/lib/auth";

interface ProfileFormProps {
  userId: string;
  initialData?: Partial<ProfileFormData>;
  genderTypes: GenderType[];
  onSuccess?: () => void;
}

export function ProfileForm({
  userId,
  initialData,
  genderTypes,
  onSuccess,
}: ProfileFormProps) {
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showCustomGender, setShowCustomGender] = useState(false);
  const [flashHelpText, setFlashHelpText] = useState(false);

  const visibleGenderTypes = useMemo(
    () =>
      genderTypes.filter(
        (g) =>
          g.code !== "unknown" && g.html_value_en.toLowerCase() !== "unknown"
      ),
    [genderTypes]
  );

  const anotherGenderType = useMemo(
    () =>
      visibleGenderTypes.find(
        (g) =>
          g.code === "another_gender" ||
          g.html_value_en.toLowerCase().includes("another")
      ),
    [visibleGenderTypes]
  );

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: initialData?.first_name || "",
      last_name: initialData?.last_name || "",
      middle_name: initialData?.middle_name || "",
      birth_date: initialData?.birth_date || "",
      gender_id:
        initialData?.gender_id === PROFILE_CONSTANTS.UNKNOWN_GENDER_ID
          ? undefined
          : initialData?.gender_id,
      another_gender_value: initialData?.another_gender_value || "",
    },
    mode: "onChange",
  });

  const watchedGenderId = form.watch("gender_id");
  const watchedValues = form.watch();

  useEffect(() => {
    const shouldShow = anotherGenderType
      ? watchedGenderId === anotherGenderType.id
      : false;
    setShowCustomGender(shouldShow);

    if (!shouldShow && form.getValues("another_gender_value")) {
      form.setValue("another_gender_value", "", { shouldValidate: true });
    }
  }, [watchedGenderId, anotherGenderType, form]);

  const hasChanges = useMemo(() => {
    if (!initialData) return true;

    const currentGenderId =
      watchedValues.gender_id || PROFILE_CONSTANTS.UNKNOWN_GENDER_ID;
    const initialGenderId =
      initialData.gender_id || PROFILE_CONSTANTS.UNKNOWN_GENDER_ID;

    return (
      watchedValues.first_name !== (initialData.first_name || "") ||
      watchedValues.last_name !== (initialData.last_name || "") ||
      watchedValues.middle_name !== (initialData.middle_name || "") ||
      watchedValues.birth_date !== (initialData.birth_date || "") ||
      currentGenderId !== initialGenderId ||
      watchedValues.another_gender_value !==
        (initialData.another_gender_value || "")
    );
  }, [watchedValues, initialData]);

  const sanitizeCustomGender = useCallback((value: string): string => {
    return value
      .trim()
      .replace(PROFILE_CONSTANTS.CUSTOM_GENDER_SANITIZE_PATTERN, "")
      .substring(0, PROFILE_CONSTANTS.CUSTOM_GENDER_MAX_LENGTH);
  }, []);

  const handleSubmit = async (data: ProfileFormData) => {
    if (anotherGenderType && data.gender_id === anotherGenderType.id) {
      if (
        !data.another_gender_value ||
        data.another_gender_value.trim() === ""
      ) {
        setFlashHelpText(true);
        setTimeout(() => setFlashHelpText(false), 2000);
        return;
      }
    }

    try {
      setLoading(true);
      setErrorMessage("");
      setSuccessMessage("");

      const processedData = {
        ...data,
        gender_id: data.gender_id || PROFILE_CONSTANTS.UNKNOWN_GENDER_ID,
        another_gender_value: data.another_gender_value
          ? sanitizeCustomGender(String(data.another_gender_value))
          : undefined,
      };

      const result = await updateProfile(userId, processedData);

      if (result.success) {
        try {
          await updateUserAttributes({
            userAttributes: {
              given_name: processedData.first_name,
              family_name: processedData.last_name,
            },
          });
        } catch (cognitoError) {
          console.warn("Failed to update Cognito attributes:", cognitoError);
        }

        setSuccessMessage(SUCCESS_MESSAGES.PROFILE_UPDATED);
        onSuccess?.();
      } else {
        setErrorMessage(result.error || ERROR_MESSAGES.PROFILE_UPDATE_FAILED);
      }
    } catch (error) {
      console.error("Profile update error:", error);
      setErrorMessage(ERROR_MESSAGES.SOMETHING_WENT_WRONG);
    } finally {
      setLoading(false);
    }
  };

  const dismissError = useCallback(() => setErrorMessage(""), []);
  const dismissSuccess = useCallback(() => setSuccessMessage(""), []);

  const genderOptions = [
    ...visibleGenderTypes.map((type) => ({
      value: type.id,
      label: type.html_value_en,
    })),
  ];

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        {successMessage && (
          <SuccessAlert message={successMessage} onDismiss={dismissSuccess} />
        )}
        {errorMessage && (
          <ErrorAlert message={errorMessage} onDismiss={dismissError} />
        )}

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

        <SelectField
          name="gender_id"
          label="Gender"
          options={genderOptions}
          placeholder="Select Gender"
          required
          setValueAs={(value) => {
            if (value === "" || value === null || value === undefined) {
              return PROFILE_CONSTANTS.UNKNOWN_GENDER_ID;
            }
            const parsed = parseInt(String(value), 10);
            return isNaN(parsed) ? PROFILE_CONSTANTS.UNKNOWN_GENDER_ID : parsed;
          }}
        />

        {showCustomGender && (
          <div className="space-y-2">
            <FormField
              name="another_gender_value"
              label="Specify Your Gender"
              placeholder="Please specify your gender identity"
              required
            />
            <p
              className={`text-xs transition-colors duration-300 ${
                flashHelpText
                  ? "text-red-500 font-medium animate-pulse"
                  : "text-gray-500"
              }`}
            >
              Please enter your specific gender identity. If you&#39;d prefer not to
              specify, please select &#34;Prefer not to say&#34; from the gender
              dropdown above.
            </p>
          </div>
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
