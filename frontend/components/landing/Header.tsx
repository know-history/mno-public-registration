import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import { NavigationDropdown } from "../navigation/NavigationDropdown";
import { MobileMenu } from "../navigation/MobileMenu";
import { MAIN_NAVIGATION } from "../../lib/auth/constants/landing/navigation";

interface HeaderProps {
  openDropdown: string | null;
  onToggleDropdown: (menuName: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  openDropdown,
  onToggleDropdown,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">
          <div className="flex items-center">
            <a
              href="https://www.metisnation.org/"
              className="flex items-center"
            >
              <Image
                src="/mno-logo.png"
                alt="Métis Nation of Ontario"
                width={120}
                height={40}
                className="h-10 w-auto"
              />
            </a>
          </div>

          <button
            onClick={toggleMobileMenu}
            className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>

          <nav className="hidden lg:flex space-x-8">
            {MAIN_NAVIGATION.map((section) => (
              <NavigationDropdown
                key={section.key}
                section={section}
                isOpen={openDropdown === section.key}
                onToggle={() => onToggleDropdown(section.key)}
              />
            ))}
          </nav>
        </div>
      </header>

      <MobileMenu
        isOpen={mobileMenuOpen}
        onToggle={toggleMobileMenu}
        openDropdown={openDropdown}
        onToggleDropdown={onToggleDropdown}
        sections={MAIN_NAVIGATION}
      />
    </>
  );
};
