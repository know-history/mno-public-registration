import React from "react";
import { ChevronRight } from "lucide-react";
import { BREADCRUMB_LINKS } from "../../lib/auth/constants/landing/navigation";

interface HeroSectionProps {
  onLoginClick: () => void;
  onDashboardClick: () => void;
  isAuthenticated: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onLoginClick,
  onDashboardClick, 
  isAuthenticated,
}) => {
  return (
    <div
      className="bg-gradient-to-r from-blue-700 to-blue-800 text-white py-8 sm:py-16"
      style={{
        backgroundImage: "url('interior-banner.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-6">
          <div className="flex items-center text-blue-200 text-base mb-2">
            {BREADCRUMB_LINKS.map((link, index) => (
              <React.Fragment key={link.label}>
                <a
                  href={link.href}
                  className="hover:text-white cursor-pointer transition-colors"
                >
                  {link.label}
                </a>
                {index < BREADCRUMB_LINKS.length - 1 && (
                  <ChevronRight className="w-4 h-4 mx-2" />
                )}
              </React.Fragment>
            ))}
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold mb-4">
            Registry Applications
          </h1>

          {isAuthenticated ? (
            <button
              onClick={onDashboardClick}
              className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Go to Dashboard
            </button>
          ) : (
            <button
              onClick={onLoginClick}
              className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Get Started
            </button>
          )}
        </div>
      </div>
    </div>
  );
};