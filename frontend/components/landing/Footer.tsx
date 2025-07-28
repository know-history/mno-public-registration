import React from "react";
import { Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react";
import { SOCIAL_LINKS } from "../../lib/auth/constants/landing/socialLinks";
import { CONTACT_INFO } from "../../lib/auth/constants/landing/contactInfo";

const SocialIcon = ({ iconName }: { iconName: string }) => {
  const iconMap = {
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
    Youtube,
  };

  const IconComponent = iconMap[iconName as keyof typeof iconMap];
  return IconComponent ? <IconComponent className="w-6 h-6" /> : null;
};

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-200 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-gray-900 mb-4">
              {CONTACT_INFO.name}
            </h3>
            <div className="space-y-2 text-base text-gray-700">
              <div>
                <p>{CONTACT_INFO.address.street}</p>
                <p>
                  {CONTACT_INFO.address.city}, {CONTACT_INFO.address.province}{" "}
                  {CONTACT_INFO.address.postalCode}
                </p>
                <a
                  href={`mailto:${CONTACT_INFO.email}`}
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Click Here to Email Us
                </a>
              </div>
            </div>

            <div className="mt-6 space-y-1 text-base text-gray-700">
              <p>Tel.: {CONTACT_INFO.phone}</p>
              <p>Toll Free: {CONTACT_INFO.tollFree}</p>
              <p>Registry Tel.: {CONTACT_INFO.registryPhone}</p>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-4">Office Hours</h3>
            <div className="space-y-2 text-base text-gray-700">
              <p>{CONTACT_INFO.hours.weekdays}</p>
              <p>{CONTACT_INFO.hours.weekends}</p>
            </div>

            <div className="mt-6">
              <h4 className="font-semibold text-gray-900 mb-3">Follow Us</h4>
              <div className="flex space-x-3">
                {SOCIAL_LINKS.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                    aria-label={social.name}
                  >
                    <SocialIcon iconName={social.icon} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-4">
              Registry Information
            </h3>
            <div className="space-y-3 text-base text-gray-700">
              <p>
                The Registry maintains records of Métis citizens and provides
                services related to citizenship and harvesting rights.
              </p>
              <div className="space-y-2">
                <a
                  href="https://www.metisnation.org/registry/citizenship/"
                  className="block text-blue-600 hover:text-blue-800 transition-colors"
                >
                  → Citizenship Information
                </a>
                <a
                  href="https://www.metisnation.org/registry/harvesting/"
                  className="block text-blue-600 hover:text-blue-800 transition-colors"
                >
                  → Harvesting Rights
                </a>
                <a
                  href="https://www.metisnation.org/registry/registry-database/"
                  className="block text-blue-600 hover:text-blue-800 transition-colors"
                >
                  → Registry Database
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
