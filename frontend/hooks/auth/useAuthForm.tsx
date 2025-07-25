import { useForm, UseFormReturn, FieldValues, DefaultValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCallback, useState } from "react";
import { useErrorHandling } from "./useErrorHandling";

interface UseAuthFormOptions<T extends FieldValues> {
  defaultValues?: DefaultValues<T>;
  onSuccess?: (data: T) => void | Promise<void>;
  onError?: (error: unknown) => void;
  resetOnSuccess?: boolean;
  context?: "login" | "signup" | "reset";
}

interface UseAuthFormReturn<T extends FieldValues> {
  register: UseFormReturn<T>['register'];
  formState: UseFormReturn<T>['formState'];
  watch: UseFormReturn<T>['watch'];
  reset: UseFormReturn<T>['reset'];
  setValue: UseFormReturn<T>['setValue'];
  getValues: UseFormReturn<T>['getValues'];
  control: UseFormReturn<T>['control'];
  getFieldState: UseFormReturn<T>['getFieldState'];
  clearErrors: UseFormReturn<T>['clearErrors'];
  trigger: UseFormReturn<T>['trigger'];
  resetField: UseFormReturn<T>['resetField'];
  setError: UseFormReturn<T>['setError'];
  setFocus: UseFormReturn<T>['setFocus'];
  unregister: UseFormReturn<T>['unregister'];
  subscribe: UseFormReturn<T>['subscribe'];
  handleSubmit: UseFormReturn<T>['handleSubmit'];
  
  handleAuthSubmit: (onSubmit: (data: T) => void | Promise<void>) => (e?: React.BaseSyntheticEvent) => Promise<void>;
  
  isSubmitting: boolean;
  submitError: string;
  hasError: boolean;
  isRateLimitError: boolean;
  isConfirmationRequired: boolean;
  
  dismissError: () => void;
  setFormError: (error: unknown) => void;
  clearError: () => void;
  resetForm: () => void;
}

export function useAuthForm<T extends FieldValues>(
  schema: z.ZodSchema<T>,
  options: UseAuthFormOptions<T> = {}
): UseAuthFormReturn<T> {
  const {
    defaultValues,
    onSuccess,
    onError,
    resetOnSuccess = false,
    context = "login",
  } = options;

  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { 
    errorMessage: submitError, 
    hasError,
    isRateLimitError,
    isConfirmationRequired,
    setError, 
    dismissError,
    clearError 
  } = useErrorHandling(undefined, { context });

  const form = useForm({
    resolver: zodResolver(schema as any),
    defaultValues: defaultValues as any,
    mode: "onChange" as const,
  }) as UseFormReturn<T>;

  const handleAuthSubmit = useCallback(
    (onSubmit: (data: T) => void | Promise<void>) => {
      return form.handleSubmit(async (data) => {
        if (isSubmitting) return;
        
        setIsSubmitting(true);
        clearError();

        try {
          await onSubmit(data as T);
          
          if (onSuccess) {
            await onSuccess(data as T);
          }
          
          if (resetOnSuccess) {
            form.reset();
          }
        } catch (error) {
          setError(error);
          
          if (onError) {
            onError(error);
          }
        } finally {
          setIsSubmitting(false);
        }
      });
    },
    [form, isSubmitting, clearError, setError, onSuccess, onError, resetOnSuccess]
  );

  const resetForm = useCallback(() => {
    form.reset();
    clearError();
    setIsSubmitting(false);
  }, [form, clearError]);

  return {
    register: form.register,
    formState: form.formState,
    watch: form.watch,
    reset: form.reset,
    setValue: form.setValue,
    getValues: form.getValues,
    control: form.control,
    getFieldState: form.getFieldState,
    clearErrors: form.clearErrors,
    trigger: form.trigger,
    resetField: form.resetField,
    setError: form.setError,
    setFocus: form.setFocus,
    unregister: form.unregister,
    subscribe: form.subscribe,
    handleSubmit: form.handleSubmit,
    
    handleAuthSubmit,
    
    isSubmitting,
    submitError,
    hasError,
    isRateLimitError,
    isConfirmationRequired,
    
    dismissError,
    setFormError: setError,
    clearError,
    resetForm,
  };
}