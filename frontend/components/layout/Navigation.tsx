"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { clsx } from "clsx";

interface NavigationItem {
  title: string;
  href?: string;
  items?: { label: string; href: string }[];
}

const navigationItems: NavigationItem[] = [
  {
    title: "PROGRAMS & SERVICES",
    items: [
      {
        label: "Healing & Wellness",
        href: "https://www.metisnation.org/programs-and-services/healing-wellness/",
      },
      {
        label: "Education & Training",
        href: "https://www.metisnation.org/programs-and-services/education-training/",
      },
      {
        label: "Housing & Infrastructure",
        href: "https://www.metisnation.org/programs-and-services/housing-infrastructure/",
      },
      {
        label: "Lands, Resources & Consultations",
        href: "https://www.metisnation.org/programs-and-services/lands-resources-consultations/",
      },
      {
        label: "Intergovernmental Relations",
        href: "https://www.metisnation.org/programs-and-services/intergovernmental-relations/",
      },
      {
        label: "Economic Development",
        href: "https://www.metisnation.org/programs-and-services/economic-development/",
      },
    ],
  },
  {
    title: "GOVERNANCE",
    items: [
      {
        label: "Self-Government",
        href: "https://www.metisnation.org/governance/self-government/",
      },
      {
        label: "Governing Structure",
        href: "https://www.metisnation.org/governance/governing-structure/",
      },
      {
        label: "AGA Business",
        href: "https://www.metisnation.org/governance/aga-business/",
      },
      {
        label: "Reference Documents",
        href: "https://www.metisnation.org/governance/reference-documents/",
      },
    ],
  },
  {
    title: "COMMUNITY COUNCILS",
    items: [
      {
        label: "Overview and Vacancy Notices",
        href: "https://www.metisnation.org/community-councils/",
      },
      {
        label: "Council Contacts",
        href: "https://www.metisnation.org/community-councils/council-contacts/",
      },
      {
        label: "Community Councils Map",
        href: "https://www.metisnation.org/community-councils/community-councils-map/",
      },
    ],
  },
  {
    title: "REGISTRY",
    items: [
      {
        label: "Registry Overview",
        href: "https://www.metisnation.org/registry/",
      },
      {
        label: "Citizenship",
        href: "https://www.metisnation.org/registry/citizenship/",
      },
      {
        label: "Harvesting",
        href: "https://www.metisnation.org/registry/harvesting/",
      },
      { label: "Rights", href: "https://www.metisnation.org/registry/rights/" },
      {
        label: "The Powley Case",
        href: "https://www.metisnation.org/registry/the-powley-case/",
      },
    ],
  },
  {
    title: "NEWS",
    items: [
      { label: "News & Events", href: "https://www.metisnation.org/mno-news/" },
      {
        label: "PCMNO Recaps",
        href: "https://www.metisnation.org/mno-news/pcmno-recaps/",
      },
      {
        label: "COVID-19 Support Programs",
        href: "https://www.metisnation.org/covid-19-support-programs/",
      },
    ],
  },
];

interface NavigationProps {
  isMobile?: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({ isMobile = false }) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleDropdown = (title: string) => {
    setOpenDropdown(openDropdown === title ? null : title);
  };

  if (isMobile) {
    return (
      <nav className="space-y-2" role="navigation" aria-label="Main navigation">
        {navigationItems.map((item) => (
          <div key={item.title}>
            <button
              onClick={() => toggleDropdown(item.title)}
              className="w-full text-left px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-expanded={openDropdown === item.title}
            >
              {item.title}
              <ChevronDown
                className={clsx(
                  "w-4 h-4 transition-transform",
                  openDropdown === item.title && "rotate-180"
                )}
                aria-hidden="true"
              />
            </button>

            {openDropdown === item.title && item.items && (
              <div className="pl-4 mt-2 space-y-1">
                {item.items.map((subItem) => (
                  <a
                    key={subItem.label}
                    href={subItem.href}
                    className="block px-3 py-2 text-sm text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {subItem.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    );
  }

  return (
    <nav
      className="flex space-x-8"
      role="navigation"
      aria-label="Main navigation"
    >
      {navigationItems.map((item) => (
        <div key={item.title} className="relative group">
          <button
            onClick={() => toggleDropdown(item.title)}
            onMouseEnter={() => setOpenDropdown(item.title)}
            className="text-blue-600 font-medium hover:text-blue-800 flex items-center px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
            aria-expanded={openDropdown === item.title}
            aria-haspopup="true"
          >
            {item.title}
            <ChevronDown className="w-4 h-4 ml-1" aria-hidden="true" />
          </button>

          {openDropdown === item.title && item.items && (
            <div
              className="absolute top-full left-0 mt-1 w-64 bg-white shadow-lg rounded-md border border-gray-200 z-50"
              onMouseLeave={() => setOpenDropdown(null)}
            >
              {item.items.map((subItem) => (
                <a
                  key={subItem.label}
                  href={subItem.href}
                  className="block px-4 py-3 text-sm text-gray-700 hover:text-blue-600 hover:bg-gray-50 first:rounded-t-md last:rounded-b-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                >
                  {subItem.label}
                </a>
              ))}
            </div>
          )}
        </div>
      ))}
    </nav>
  );
};
