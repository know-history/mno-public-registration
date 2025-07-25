export interface FormFieldProps {
  name: string;
  type?: "text" | "email" | "password" | "date";
  label: string;
  placeholder?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

export interface PasswordFieldProps extends Omit<FormFieldProps, "type"> {
  showToggle?: boolean;
  strength?: boolean;
}

export interface SubmitButtonProps {
  children: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  variant?: "primary" | "secondary";
  className?: string;
}

export interface AuthFormProps {
  loading?: boolean;
  error?: string;
  onSubmit: (data: any) => Promise<void>;
  onBack?: () => void;
  onClose?: () => void;
}

export interface ConfirmationProps extends AuthFormProps {
  email: string;
  onResendCode?: () => Promise<void>;
  type: "signup" | "passwordReset";
}
