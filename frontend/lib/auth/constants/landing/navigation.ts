export interface NavigationItem {
  label: string;
  href: string;
}

export interface NavigationSection {
  title: string;
  key: string;
  items: NavigationItem[];
}

export const TOP_NAV_LINKS: NavigationItem[] = [
  {
    label: "ABOUT",
    href: "https://www.metisnation.org/about-the-mno/",
  },
  {
    label: "CULTURE",
    href: "https://www.metisnation.org/culture-heritage/",
  },
  {
    label: "CONTACT US",
    href: "https://www.metisnation.org/about-the-mno/contact-us/",
  },
  {
    label: "CAREERS",
    href: "https://can232.dayforcehcm.com/CandidatePortal/en-US/metis",
  },
];

export const MAIN_NAVIGATION: NavigationSection[] = [
  {
    title: "PROGRAMS & SERVICES",
    key: "programs",
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
    key: "governance",
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
    key: "councils",
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
    key: "registry",
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
      {
        label: "Registry Database",
        href: "https://www.metisnation.org/registry/registry-database/",
      },
    ],
  },
];

export const BREADCRUMB_LINKS: NavigationItem[] = [
  {
    label: "HOME",
    href: "https://www.metisnation.org/",
  },
  {
    label: "REGISTRY",
    href: "https://www.metisnation.org/registry/",
  },
];
