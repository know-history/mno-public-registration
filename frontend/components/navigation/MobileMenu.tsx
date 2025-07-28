import React from "react";
import { ChevronDown } from "lucide-react";
import type { NavigationSection } from "../../lib/auth/constants/landing/navigation";

interface MobileMenuProps {
  isOpen: boolean;
  onToggle: () => void;
  openDropdown: string | null;
  onToggleDropdown: (menuName: string) => void;
  sections: NavigationSection[];
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onToggle,
  openDropdown,
  onToggleDropdown,
  sections,
}) => {
  if (!isOpen) return null;

  return (
    <div className="lg:hidden bg-white border-b border-gray-200 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4 space-y-4">
        {sections.map((section) => (
          <div key={section.key}>
            <button
              onClick={() => onToggleDropdown(section.key)}
              className="flex items-center justify-between w-full text-left text-gray-900 hover:text-blue-600 font-medium py-2 transition-colors"
            >
              {section.title}
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  openDropdown === section.key ? "rotate-180" : ""
                }`}
              />
            </button>

            {openDropdown === section.key && (
              <div className="ml-4 space-y-1 mt-2">
                {section.items.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="block px-3 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
                    onClick={onToggle}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
