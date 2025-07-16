import React, { useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";

interface HeaderProps {
  onLoginClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLoginClick }) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleDropdown = (menuName: string) => {
    setOpenDropdown(openDropdown === menuName ? null : menuName);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    setOpenDropdown(null);
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <a href="https://www.metisnation.org/" className="cursor-pointer">
            <img
              src="/logo.png"
              alt="Métis Nation of Ontario"
              className="h-16"
            />
          </a>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex space-x-8">
          <div className="relative group">
            <button
              className="text-blue-600 font-medium hover:text-blue-800 flex items-center cursor-pointer"
              onClick={() => toggleDropdown("programs")}
            >
              PROGRAMS & SERVICES <ChevronDown className="w-4 h-4 ml-1" />
            </button>
            {openDropdown === "programs" && (
              <div className="absolute top-full left-0 mt-1 w-64 bg-white shadow-lg rounded border z-50">
                <a
                  href="https://www.metisnation.org/programs-and-services/healing-wellness/"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  Healing & Wellness
                </a>
                <a
                  href="https://www.metisnation.org/programs-and-services/education-training/"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  Education & Training
                </a>
                <a
                  href="https://www.metisnation.org/programs-and-services/housing-infrastructure/"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  Housing & Infrastructure
                </a>
                <a
                  href="https://www.metisnation.org/programs-and-services/lands-resources-consultations/"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  Lands, Resources & Consultations
                </a>
                <a
                  href="https://www.metisnation.org/programs-and-services/intergovernmental-relations/"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  Intergovernmental Relations
                </a>
                <a
                  href="https://www.metisnation.org/programs-and-services/economic-development/"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  Economic Development
                </a>
              </div>
            )}
          </div>

          <div className="relative group">
            <button
              className="text-blue-600 font-medium hover:text-blue-800 flex items-center cursor-pointer"
              onClick={() => toggleDropdown("governance")}
            >
              GOVERNANCE <ChevronDown className="w-4 h-4 ml-1" />
            </button>
            {openDropdown === "governance" && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-white shadow-lg rounded border z-50">
                <a
                  href="https://www.metisnation.org/governance/self-government/"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  Self-Government
                </a>
                <a
                  href="https://www.metisnation.org/governance/governing-structure/"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  Governing Structure
                </a>
                <a
                  href="https://www.metisnation.org/governance/aga-business/"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  AGA Business
                </a>
                <a
                  href="https://www.metisnation.org/governance/reference-documents/"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  Reference Documents
                </a>
              </div>
            )}
          </div>

          <div className="relative group">
            <button
              className="text-blue-600 font-medium hover:text-blue-800 flex items-center cursor-pointer"
              onClick={() => toggleDropdown("councils")}
            >
              COMMUNITY COUNCILS <ChevronDown className="w-4 h-4 ml-1" />
            </button>
            {openDropdown === "councils" && (
              <div className="absolute top-full left-0 mt-1 w-56 bg-white shadow-lg rounded border z-50">
                <a
                  href="https://www.metisnation.org/community-councils/"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  Overview and Vacancy Notices
                </a>
                <a
                  href="https://www.metisnation.org/community-councils/council-contacts/"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  Council Contacts
                </a>
                <a
                  href="https://www.metisnation.org/community-councils/community-councils-map/"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  Community Councils Map
                </a>
              </div>
            )}
          </div>

          <div className="relative group">
            <button
              className="text-blue-600 font-medium hover:text-blue-800 flex items-center cursor-pointer"
              onClick={() => toggleDropdown("registry")}
            >
              REGISTRY <ChevronDown className="w-4 h-4 ml-1" />
            </button>
            {openDropdown === "registry" && (
              <div className="absolute top-full left-0 mt-1 w-44 bg-white shadow-lg rounded border z-50">
                <a
                  href="https://www.metisnation.org/registry/"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  Registry Overview
                </a>
                <a
                  href="https://www.metisnation.org/registry/citizenship/"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  Citizenship
                </a>
                <a
                  href="https://www.metisnation.org/registry/harvesting/"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  Harvesting
                </a>
                <a
                  href="https://www.metisnation.org/registry/rights/"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  Rights
                </a>
                <a
                  href="https://www.metisnation.org/registry/the-powley-case/"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  The Powley Case
                </a>
              </div>
            )}
          </div>

          <div className="relative group">
            <button
              className="text-blue-600 font-medium hover:text-blue-800 flex items-center cursor-pointer"
              onClick={() => toggleDropdown("news")}
            >
              NEWS <ChevronDown className="w-4 h-4 ml-1" />
            </button>
            {openDropdown === "news" && (
              <div className="absolute top-full left-0 mt-1 w-52 bg-white shadow-lg rounded border z-50">
                <a
                  href="https://www.metisnation.org/mno-news/"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  News & Events
                </a>
                <a
                  href="https://www.metisnation.org/mno-news/pcmno-recaps/"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  PCMNO Recaps
                </a>
                <a
                  href="https://www.metisnation.org/covid-19-support-programs/"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  COVID-19 Support Programs
                </a>
              </div>
            )}
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-2 space-y-1">
            <button
              onClick={onLoginClick}
              className="w-full text-left px-3 py-2 text-blue-600 font-medium hover:bg-gray-100 rounded cursor-pointer"
            >
              LOGIN TO YOUR ACCOUNT
            </button>
            
            <div className="space-y-1">
              <button
                onClick={() => toggleDropdown("programs")}
                className="w-full text-left px-3 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded cursor-pointer flex items-center justify-between"
              >
                PROGRAMS & SERVICES
                <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === "programs" ? "rotate-180" : ""}`} />
              </button>
              {openDropdown === "programs" && (
                <div className="pl-6 space-y-1">
                  <a href="https://www.metisnation.org/programs-and-services/healing-wellness/" className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded cursor-pointer">
                    Healing & Wellness
                  </a>
                  <a href="https://www.metisnation.org/programs-and-services/education-training/" className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded cursor-pointer">
                    Education & Training
                  </a>
                  <a href="https://www.metisnation.org/programs-and-services/housing-infrastructure/" className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded cursor-pointer">
                    Housing & Infrastructure
                  </a>
                  <a href="https://www.metisnation.org/programs-and-services/lands-resources-consultations/" className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded cursor-pointer">
                    Lands, Resources & Consultations
                  </a>
                  <a href="https://www.metisnation.org/programs-and-services/intergovernmental-relations/" className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded cursor-pointer">
                    Intergovernmental Relations
                  </a>
                  <a href="https://www.metisnation.org/programs-and-services/economic-development/" className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded cursor-pointer">
                    Economic Development
                  </a>
                </div>
              )}

              <button
                onClick={() => toggleDropdown("governance")}
                className="w-full text-left px-3 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded cursor-pointer flex items-center justify-between"
              >
                GOVERNANCE
                <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === "governance" ? "rotate-180" : ""}`} />
              </button>
              {openDropdown === "governance" && (
                <div className="pl-6 space-y-1">
                  <a href="https://www.metisnation.org/governance/self-government/" className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded cursor-pointer">
                    Self-Government
                  </a>
                  <a href="https://www.metisnation.org/governance/governing-structure/" className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded cursor-pointer">
                    Governing Structure
                  </a>
                  <a href="https://www.metisnation.org/governance/aga-business/" className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded cursor-pointer">
                    AGA Business
                  </a>
                  <a href="https://www.metisnation.org/governance/reference-documents/" className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded cursor-pointer">
                    Reference Documents
                  </a>
                </div>
              )}

              <button
                onClick={() => toggleDropdown("councils")}
                className="w-full text-left px-3 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded cursor-pointer flex items-center justify-between"
              >
                COMMUNITY COUNCILS
                <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === "councils" ? "rotate-180" : ""}`} />
              </button>
              {openDropdown === "councils" && (
                <div className="pl-6 space-y-1">
                  <a href="https://www.metisnation.org/community-councils/" className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded cursor-pointer">
                    Overview and Vacancy Notices
                  </a>
                  <a href="https://www.metisnation.org/community-councils/council-contacts/" className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded cursor-pointer">
                    Council Contacts
                  </a>
                  <a href="https://www.metisnation.org/community-councils/community-councils-map/" className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded cursor-pointer">
                    Community Councils Map
                  </a>
                </div>
              )}

              <button
                onClick={() => toggleDropdown("registry")}
                className="w-full text-left px-3 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded cursor-pointer flex items-center justify-between"
              >
                REGISTRY
                <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === "registry" ? "rotate-180" : ""}`} />
              </button>
              {openDropdown === "registry" && (
                <div className="pl-6 space-y-1">
                  <a href="https://www.metisnation.org/registry/" className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded cursor-pointer">
                    Registry Overview
                  </a>
                  <a href="https://www.metisnation.org/registry/citizenship/" className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded cursor-pointer">
                    Citizenship
                  </a>
                  <a href="https://www.metisnation.org/registry/harvesting/" className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded cursor-pointer">
                    Harvesting
                  </a>
                  <a href="https://www.metisnation.org/registry/rights/" className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded cursor-pointer">
                    Rights
                  </a>
                  <a href="https://www.metisnation.org/registry/the-powley-case/" className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded cursor-pointer">
                    The Powley Case
                  </a>
                </div>
              )}

              <button
                onClick={() => toggleDropdown("news")}
                className="w-full text-left px-3 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded cursor-pointer flex items-center justify-between"
              >
                NEWS
                <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === "news" ? "rotate-180" : ""}`} />
              </button>
              {openDropdown === "news" && (
                <div className="pl-6 space-y-1">
                  <a href="https://www.metisnation.org/mno-news/" className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded cursor-pointer">
                    News & Events
                  </a>
                  <a href="https://www.metisnation.org/mno-news/pcmno-recaps/" className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded cursor-pointer">
                    PCMNO Recaps
                  </a>
                  <a href="https://www.metisnation.org/covid-19-support-programs/" className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded cursor-pointer">
                    COVID-19 Support Programs
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;