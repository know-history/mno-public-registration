import React from "react";
import { ChevronDown } from "lucide-react";
import type { NavigationSection } from "../../lib/auth/constants/landing/navigation";

interface NavigationDropdownProps {
  section: NavigationSection;
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
}

export const NavigationDropdown: React.FC<NavigationDropdownProps> = ({
  section,
  isOpen,
  onToggle,
  className = "",
}) => {
  return (
    <div className={`relative ${className}`}>
      <button
        onClick={onToggle}
        className="flex items-center space-x-1 text-gray-900 hover:text-blue-600 font-medium text-base transition-colors"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span>{section.title}</span>
        <ChevronDown 
          className={`w-4 h-4 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`} 
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          {section.items.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
            >
              {item.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};