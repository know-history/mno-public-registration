import React from "react";
import { cn } from "@/lib/utils";
import { PASSWORD_REQUIREMENTS } from "@/lib/auth/constants";

interface PasswordRequirement {
  key: string;
  label: string;
  test: (password: string) => boolean;
  met: boolean;
}

interface PasswordRequirementsProps {
  password?: string;
  showProgress?: boolean;
  className?: string;
  variant?: "static" | "dynamic";
}

export function PasswordRequirements({
  password = "",
  showProgress = true,
  className,
  variant = "dynamic",
}: PasswordRequirementsProps) {
  const requirements: PasswordRequirement[] = [
    {
      key: "minLength",
      label: PASSWORD_REQUIREMENTS.MIN_LENGTH,
      test: (pwd: string) => pwd.length >= 8,
      met: password.length >= 8,
    },
    {
      key: "lowercase",
      label: PASSWORD_REQUIREMENTS.LOWERCASE,
      test: (pwd: string) => /[a-z]/.test(pwd),
      met: /[a-z]/.test(password),
    },
    {
      key: "uppercase",
      label: PASSWORD_REQUIREMENTS.UPPERCASE,
      test: (pwd: string) => /[A-Z]/.test(pwd),
      met: /[A-Z]/.test(password),
    },
    {
      key: "numbers",
      label: PASSWORD_REQUIREMENTS.NUMBERS,
      test: (pwd: string) => /\d/.test(pwd),
      met: /\d/.test(password),
    },
    {
      key: "specialChars",
      label: PASSWORD_REQUIREMENTS.SPECIAL_CHARS,
      test: (pwd: string) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd),
      met: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    },
  ];

  const getIndicator = (requirement: PasswordRequirement) => {
    if (variant === "static") {
      return <span className="text-xs mr-2">○</span>;
    }
    
    if (showProgress) {
      return (
        <span className="text-xs mr-2">
          {requirement.met ? "●" : "○"}
        </span>
      );
    }
    
    return (
      <div
        className={cn(
          "w-1.5 h-1.5 rounded-full mr-3",
          requirement.met ? "bg-green-500" : "bg-gray-300"
        )}
      />
    );
  };

  const getTextColor = (requirement: PasswordRequirement) => {
    if (variant === "static") {
      return "text-gray-600";
    }
    
    return requirement.met ? "text-green-600" : "text-gray-500";
  };

  return (
    <div className={cn("bg-blue-50 p-4 rounded-lg", className)}>
      <h4 className="text-sm font-medium text-slate-700 mb-2">
        Password Requirements
      </h4>
      <ul className="text-sm space-y-1">
        {requirements.map((requirement) => (
          <li
            key={requirement.key}
            className={cn(
              "flex items-center",
              getTextColor(requirement)
            )}
          >
            {getIndicator(requirement)}
            {requirement.label}
          </li>
        ))}
      </ul>
    </div>
  );
}