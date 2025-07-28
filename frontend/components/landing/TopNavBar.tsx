import React from "react";
import { Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react";
import { TOP_NAV_LINKS } from "../../lib/auth/constants/landing/navigation";
import { SOCIAL_LINKS as SOCIAL_CONFIG } from "../../lib/auth/constants/landing/socialLinks";

const SocialIcon = ({ iconName }: { iconName: string }) => {
  const iconMap = {
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
    Youtube,
  };

  const IconComponent = iconMap[iconName as keyof typeof iconMap];
  return IconComponent ? <IconComponent className="w-full h-full" /> : null;
};

export const TopNavBar: React.FC = () => {
  return (
    <div className="bg-blue-700 text-white text-base py-2">
      <div className="max-w-7xl mx-auto px-4 flex flex-col lg:flex-row justify-between items-center space-y-2 lg:space-y-0">
        <div className="flex flex-wrap justify-center lg:justify-start space-x-4 lg:space-x-6">
          {TOP_NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="hover:text-blue-200 cursor-pointer transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex space-x-2">
            {SOCIAL_CONFIG.map((social) => (
              <a
                key={social.name}
                href={social.href}
                className="w-5 h-5 hover:opacity-80 cursor-pointer transition-opacity"
                aria-label={social.name}
              >
                <SocialIcon iconName={social.icon} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
