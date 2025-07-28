import { ReactNode } from "react";

export interface FormFieldProps {
  name: string;
  type?: string;
  label: string;
  placeholder?: string;
  icon?: ReactNode;
  disabled?: boolean;
  required?: boolean;
  autoComplete?: string;
  className?: string;
  inputClassName?: string;
}

export interface PasswordFieldProps {
  name: string;
  label: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  showToggle?: boolean;
  showStrength?: boolean;
  showRequirements?: boolean;
  className?: string;
}

export interface AuthModalProps {
  children: ReactNode;
  onClose?: () => void;
  title?: string;
  subtitle?: string;
  showCloseButton?: boolean;
  closeOnEscape?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}