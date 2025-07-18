import { USER_ROLES, APP_CONFIG } from "./constants";

export const formatUserRole = (role?: string): string => {
  switch (role) {
    case USER_ROLES.ADMIN:
      return "Administrator";
    case USER_ROLES.RESEARCHER:
      return "Researcher";
    case USER_ROLES.HARVESTING_ADMIN:
      return "Harvesting Administrator";
    case USER_ROLES.HARVESTING_CAPTAIN:
      return "Harvesting Captain";
    case USER_ROLES.APPLICANT:
      return "Applicant";
    default:
      return "Unknown";
  }
};

export const getRoleBadgeColor = (role?: string): string => {
  switch (role) {
    case USER_ROLES.ADMIN:
      return "bg-red-100 text-red-800 border-red-200";
    case USER_ROLES.RESEARCHER:
      return "bg-blue-100 text-blue-800 border-blue-200";
    case USER_ROLES.HARVESTING_ADMIN:
      return "bg-green-100 text-green-800 border-green-200";
    case USER_ROLES.HARVESTING_CAPTAIN:
      return "bg-purple-100 text-purple-800 border-purple-200";
    case USER_ROLES.APPLICANT:
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export const formatDate = (date: string | Date): string => {
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
};

export const formatDateTime = (date: string | Date): string => {
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + "...";
};

export const validateFileSize = (file: File): boolean => {
  return file.size <= APP_CONFIG.MAX_FILE_SIZE;
};

export const validateFileType = (file: File): boolean => {
  const allowedTypes = APP_CONFIG.ALLOWED_FILE_TYPES as readonly string[];
  return allowedTypes.includes(file.type);
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};
