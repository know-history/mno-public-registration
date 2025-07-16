import React from "react";
import { ChevronRight } from "lucide-react";

interface HeroSectionProps {
  onLoginClick: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onLoginClick }) => {
  return (
    <div
      className="bg-gradient-to-r from-blue-700 to-blue-800 text-white py-8 sm:py-16"
      style={{
        backgroundImage: "url(/interior-banner.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-6">
          <div className="flex items-center text-blue-200 text-sm mb-2">
            <a
              href="https://www.metisnation.org/"
              className="hover:text-white cursor-pointer"
            >
              HOME
            </a>
            <ChevronRight className="w-4 h-4 mx-2" />
            <a
              href="https://www.metisnation.org/registry/"
              className="hover:text-white cursor-pointer"
            >
              REGISTRY
            </a>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold mb-4">Registry Applications</h1>
          <button
            onClick={onLoginClick}
            className="bg-gray-800 hover:bg-gray-700 text-white px-4 sm:px-6 py-2 rounded font-medium transition-colors cursor-pointer text-sm sm:text-base"
          >
            LOGIN TO YOUR ACCOUNT
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;