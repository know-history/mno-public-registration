import React, { useState } from "react";
import {
  ChevronRight,
  ChevronDown,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Menu,
  X,
} from "lucide-react";

import LoginForm from "@/components/LoginForm";

const TopNavBar = () => {
  return (
    <div className="bg-blue-700 text-white text-sm py-2">
      <div className="max-w-7xl mx-auto px-4 flex flex-col lg:flex-row justify-between items-center space-y-2 lg:space-y-0">
        <div className="flex flex-wrap justify-center lg:justify-start space-x-4 lg:space-x-6">
          <a
            href="https://www.metisnation.org/about-the-mno/"
            className="hover:text-blue-200 cursor-pointer"
          >
            ABOUT
          </a>
          <a
            href="https://www.metisnation.org/culture-heritage/"
            className="hover:text-blue-200 cursor-pointer"
          >
            CULTURE
          </a>
          <a
            href="https://www.metisnation.org/about-the-mno/contact-us/"
            className="hover:text-blue-200 cursor-pointer"
          >
            CONTACT US
          </a>
          <a
            href="https://can232.dayforcehcm.com/CandidatePortal/en-US/metis"
            className="hover:text-blue-200 cursor-pointer"
          >
            CAREERS
          </a>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex space-x-2">
            <a
              href="https://www.facebook.com/ONMetis/"
              className="w-5 h-5 hover:opacity-80 cursor-pointer"
            >
              <Facebook className="w-full h-full" />
            </a>
            <a
              href="https://x.com/metisnationon"
              className="w-5 h-5 hover:opacity-80 cursor-pointer"
            >
              <Twitter className="w-full h-full" />
            </a>
            <a
              href="https://www.instagram.com/metisnationon/?hl=en"
              className="w-5 h-5 hover:opacity-80 cursor-pointer"
            >
              <Instagram className="w-full h-full" />
            </a>
            <a
              href="https://www.linkedin.com/company/m%C3%A9tis-nation-of-ontario/?originalSubdomain=ca"
              className="w-5 h-5 hover:opacity-80 cursor-pointer"
            >
              <Linkedin className="w-full h-full" />
            </a>
            <a
              href="https://www.youtube.com/channel/UCYt1gnqk88jHpRWiOXe0d_A"
              className="w-5 h-5 hover:opacity-80 cursor-pointer"
            >
              <Youtube className="w-full h-full" />
            </a>
          </div>
          <div className="hidden sm:flex">
            <input
              type="text"
              name="s"
              placeholder="Search..."
              className="px-3 py-1 text-black text-sm rounded-l border-0 bg-white"
            />
            <button
              onClick={() => window.open('https://www.metisnation.org/', '_blank')}
              className="bg-gray-600 px-3 py-1 text-sm rounded-r hover:bg-gray-700 cursor-pointer"
            >
              SEARCH
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const NavigationDropdown = ({ title, items, isOpen, onToggle }) => {
  return (
    <div className="relative group">
      <button
        className="text-blue-600 font-medium hover:text-blue-800 flex items-center cursor-pointer"
        onClick={onToggle}
      >
        {title} <ChevronDown className="w-4 h-4 ml-1" />
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-64 bg-white shadow-lg rounded border z-50">
          {items.map((item, index) => (
            <a
              key={index}
              href={item.href}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
            >
              {item.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

const MobileMenu = ({ isOpen, onToggle, openDropdown, toggleDropdown }) => {
  const menuItems = [
    {
      title: "PROGRAMS & SERVICES",
      key: "programs",
      items: [
        { label: "Healing & Wellness", href: "https://www.metisnation.org/programs-and-services/healing-wellness/" },
        { label: "Education & Training", href: "https://www.metisnation.org/programs-and-services/education-training/" },
        { label: "Housing & Infrastructure", href: "https://www.metisnation.org/programs-and-services/housing-infrastructure/" },
        { label: "Lands, Resources & Consultations", href: "https://www.metisnation.org/programs-and-services/lands-resources-consultations/" },
        { label: "Intergovernmental Relations", href: "https://www.metisnation.org/programs-and-services/intergovernmental-relations/" },
        { label: "Economic Development", href: "https://www.metisnation.org/programs-and-services/economic-development/" },
      ]
    },
    {
      title: "GOVERNANCE",
      key: "governance",
      items: [
        { label: "Self-Government", href: "https://www.metisnation.org/governance/self-government/" },
        { label: "Governing Structure", href: "https://www.metisnation.org/governance/governing-structure/" },
        { label: "AGA Business", href: "https://www.metisnation.org/governance/aga-business/" },
        { label: "Reference Documents", href: "https://www.metisnation.org/governance/reference-documents/" },
      ]
    },
    {
      title: "COMMUNITY COUNCILS",
      key: "councils",
      items: [
        { label: "Overview and Vacancy Notices", href: "https://www.metisnation.org/community-councils/" },
        { label: "Council Contacts", href: "https://www.metisnation.org/community-councils/council-contacts/" },
        { label: "Community Councils Map", href: "https://www.metisnation.org/community-councils/community-councils-map/" },
      ]
    },
    {
      title: "REGISTRY",
      key: "registry",
      items: [
        { label: "Registry Overview", href: "https://www.metisnation.org/registry/" },
        { label: "Citizenship", href: "https://www.metisnation.org/registry/citizenship/" },
        { label: "Harvesting", href: "https://www.metisnation.org/registry/harvesting/" },
        { label: "Rights", href: "https://www.metisnation.org/registry/rights/" },
        { label: "The Powley Case", href: "https://www.metisnation.org/registry/the-powley-case/" },
      ]
    },
    {
      title: "NEWS",
      key: "news",
      items: [
        { label: "News & Events", href: "https://www.metisnation.org/mno-news/" },
        { label: "PCMNO Recaps", href: "https://www.metisnation.org/mno-news/pcmno-recaps/" },
        { label: "COVID-19 Support Programs", href: "https://www.metisnation.org/covid-19-support-programs/" },
      ]
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="lg:hidden bg-white border-t shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4">
        {menuItems.map((menu) => (
          <div key={menu.key} className="mb-4">
            <button
              className="w-full text-left text-blue-600 font-medium py-2 flex items-center justify-between"
              onClick={() => toggleDropdown(menu.key)}
            >
              {menu.title}
              <ChevronDown className={`w-4 h-4 transform transition-transform ${openDropdown === menu.key ? 'rotate-180' : ''}`} />
            </button>
            {openDropdown === menu.key && (
              <div className="pl-4 mt-2 space-y-2">
                {menu.items.map((item, index) => (
                  <a
                    key={index}
                    href={item.href}
                    className="block text-sm text-gray-700 hover:text-blue-600 py-1"
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

const Header = ({ openDropdown, toggleDropdown }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigationItems = [
    {
      title: "PROGRAMS & SERVICES",
      key: "programs",
      items: [
        { label: "Healing & Wellness", href: "https://www.metisnation.org/programs-and-services/healing-wellness/" },
        { label: "Education & Training", href: "https://www.metisnation.org/programs-and-services/education-training/" },
        { label: "Housing & Infrastructure", href: "https://www.metisnation.org/programs-and-services/housing-infrastructure/" },
        { label: "Lands, Resources & Consultations", href: "https://www.metisnation.org/programs-and-services/lands-resources-consultations/" },
        { label: "Intergovernmental Relations", href: "https://www.metisnation.org/programs-and-services/intergovernmental-relations/" },
        { label: "Economic Development", href: "https://www.metisnation.org/programs-and-services/economic-development/" },
      ]
    },
    {
      title: "GOVERNANCE",
      key: "governance",
      items: [
        { label: "Self-Government", href: "https://www.metisnation.org/governance/self-government/" },
        { label: "Governing Structure", href: "https://www.metisnation.org/governance/governing-structure/" },
        { label: "AGA Business", href: "https://www.metisnation.org/governance/aga-business/" },
        { label: "Reference Documents", href: "https://www.metisnation.org/governance/reference-documents/" },
      ]
    },
    {
      title: "COMMUNITY COUNCILS",
      key: "councils",
      items: [
        { label: "Overview and Vacancy Notices", href: "https://www.metisnation.org/community-councils/" },
        { label: "Council Contacts", href: "https://www.metisnation.org/community-councils/council-contacts/" },
        { label: "Community Councils Map", href: "https://www.metisnation.org/community-councils/community-councils-map/" },
      ]
    },
    {
      title: "REGISTRY",
      key: "registry",
      items: [
        { label: "Registry Overview", href: "https://www.metisnation.org/registry/" },
        { label: "Citizenship", href: "https://www.metisnation.org/registry/citizenship/" },
        { label: "Harvesting", href: "https://www.metisnation.org/registry/harvesting/" },
        { label: "Rights", href: "https://www.metisnation.org/registry/rights/" },
        { label: "The Powley Case", href: "https://www.metisnation.org/registry/the-powley-case/" },
      ]
    },
    {
      title: "NEWS",
      key: "news",
      items: [
        { label: "News & Events", href: "https://www.metisnation.org/mno-news/" },
        { label: "PCMNO Recaps", href: "https://www.metisnation.org/mno-news/pcmno-recaps/" },
        { label: "COVID-19 Support Programs", href: "https://www.metisnation.org/covid-19-support-programs/" },
      ]
    }
  ];

  return (
    <>
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <a href="https://www.metisnation.org/" className="cursor-pointer">
              <img
                src="logo.png"
                alt="Métis Nation of Ontario"
                className="h-12 sm:h-16"
              />
            </a>
          </div>
          
          <button
            className="lg:hidden text-blue-600 hover:text-blue-800"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <nav className="hidden lg:flex space-x-8">
            {navigationItems.map((item) => (
              <NavigationDropdown
                key={item.key}
                title={item.title}
                items={item.items}
                isOpen={openDropdown === item.key}
                onToggle={() => toggleDropdown(item.key)}
              />
            ))}
          </nav>
        </div>
      </header>

      <MobileMenu
        isOpen={mobileMenuOpen}
        onToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
        openDropdown={openDropdown}
        toggleDropdown={toggleDropdown}
      />
    </>
  );
};

const HeroSection = ({ onLoginClick }) => {
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

const MainContent = ({ onLoginClick }) => {
  return (
    <div
      className="py-8 sm:py-16 min-h-96"
      style={{
        backgroundImage: "url('sash-birch.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="max-w-2xl">
          <div className="bg-black/50 backdrop-blur-xs p-6 sm:p-8 rounded-lg text-white">
            <p className="text-base sm:text-lg mb-6 leading-relaxed">
              On this page you can <strong>Update your Address</strong>,{" "}
              <strong>Apply for MNO Citizenship</strong>,{" "}
              <strong>Apply for a MNO Harvester Certificate</strong> and
              check the status of your applications — all online! To start
              an application process, you will need to create an account.
            </p>

            <p className="mb-8 leading-relaxed text-sm sm:text-base">
              If you require assistance or have any questions about the
              Application and Update process please email us at{" "}
              <strong>info@mnoregistry.ca</strong> or call Toll Free at{" "}
              <strong>1-855-798-1006</strong> or our local number{" "}
              <strong>613-798-1006</strong>.
            </p>

            <div className="space-y-3">
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 sm:px-6 rounded flex items-center justify-between font-medium transition-colors cursor-pointer text-sm sm:text-base">
                <span>Change Address / Renew Citizen Card</span>
                <ChevronRight className="w-5 h-5 flex-shrink-0" />
              </button>

              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 sm:px-6 rounded flex items-center justify-between font-medium transition-colors cursor-pointer text-sm sm:text-base">
                <span>Apply for Citizenship</span>
                <ChevronRight className="w-5 h-5 flex-shrink-0" />
              </button>

              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 sm:px-6 rounded flex items-center justify-between font-medium transition-colors cursor-pointer text-sm sm:text-base">
                <span>Apply for Harvester's Certificate</span>
                <ChevronRight className="w-5 h-5 flex-shrink-0" />
              </button>

              <button
                onClick={onLoginClick}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 sm:px-6 rounded flex items-center justify-between font-medium transition-colors cursor-pointer text-sm sm:text-base"
              >
                <span>Create an Account</span>
                <ChevronRight className="w-5 h-5 flex-shrink-0" />
              </button>

              <button
                onClick={onLoginClick}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 sm:px-6 rounded flex items-center justify-between font-medium transition-colors cursor-pointer text-sm sm:text-base"
              >
                <span>Login to your Account</span>
                <ChevronRight className="w-5 h-5 flex-shrink-0" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Footer = () => {
  return (
    <footer className="bg-gray-200 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-gray-900 mb-4">
              Métis Nation of Ontario
            </h3>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex items-center">
                <div>
                  <p>Suite 1100 - 66 Slater Street</p>
                  <p>Ottawa, ON K1P 5H1</p>
                  <a
                    href="mailto:info@metisnation.org"
                    className="text-gray-700 hover:text-gray-900"
                  >
                    Click Here to Email Us
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-1 text-sm text-gray-700">
              <div className="flex items-center">
                <div>
                  <p>Tel.: 613-798-1488</p>
                  <p>Toll Free: 1-800-263-4889</p>
                  <p>Registry Tel.: 613-798-1006</p>
                  <p>Registry Toll Free: 1-855-798-1006</p>
                  <a
                    href="mailto:info@mnoregistry.ca"
                    className="text-gray-700 hover:text-gray-900"
                  >
                    Click Here to Email Registry
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-4">
              Connect With Us
            </h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <Twitter className="w-4 h-4 mr-2 text-gray-600" />
                <a
                  href="https://x.com/metisnationon"
                  className="text-gray-700 hover:text-gray-900"
                >
                  Twitter
                </a>
              </div>
              <div className="flex items-center">
                <Facebook className="w-4 h-4 mr-2 text-gray-600" />
                <a
                  href="https://www.facebook.com/ONMetis/"
                  className="text-gray-700 hover:text-gray-900"
                >
                  Facebook
                </a>
              </div>
              <div className="flex items-center">
                <Instagram className="w-4 h-4 mr-2 text-gray-600" />
                <a
                  href="https://www.instagram.com/metisnationon/?hl=en"
                  className="text-gray-700 hover:text-gray-900"
                >
                  Instagram
                </a>
              </div>
              <div className="flex items-center">
                <Linkedin className="w-4 h-4 mr-2 text-gray-600" />
                <a
                  href="https://www.linkedin.com/company/m%C3%A9tis-nation-of-ontario/?originalSubdomain=ca"
                  className="text-gray-700 hover:text-gray-900"
                >
                  LinkedIn
                </a>
              </div>
              <div className="flex items-center">
                <Youtube className="w-4 h-4 mr-2 text-gray-600" />
                <a
                  href="https://www.youtube.com/channel/UCYt1gnqk88jHpRWiOXe0d_A"
                  className="text-gray-700 hover:text-gray-900"
                >
                  YouTube
                </a>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-4">Quick Links</h3>
            <div className="space-y-2 text-sm">
              <a
                href="#"
                className="text-gray-700 hover:text-gray-900 block"
              >
                Voyageur Newsletter
              </a>
              <a
                href="#"
                className="text-gray-700 hover:text-gray-900 block"
              >
                COVID-19 Support Programs
              </a>
              <a
                href="#"
                className="text-gray-700 hover:text-gray-900 block"
              >
                MNO Offices & Staff
              </a>
              <a
                href="#"
                className="text-gray-700 hover:text-gray-900 block"
              >
                Swag Store
              </a>
              <a
                href="#"
                className="text-gray-700 hover:text-gray-900 block"
              >
                Procurement Opportunities
              </a>
              <a
                href="#"
                className="text-gray-700 hover:text-gray-900 block"
              >
                Careers
              </a>
              <a
                href="#"
                className="text-gray-700 hover:text-gray-900 block"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

const BottomFooter = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <div className="bg-blue-700 text-white py-4">
      <div className="max-w-7xl mx-auto px-4 text-center text-sm">
        <p className="flex flex-col sm:flex-row sm:justify-center sm:items-center space-y-1 sm:space-y-0">
          <span>© {currentYear} Métis Nation of Ontario. All rights reserved.</span>
          <span className="hidden sm:inline mx-2">|</span>
          <a href="https://www.metisnation.org/privacy-policy/" className="hover:text-blue-200">
            Privacy Policy
          </a>
          <span className="hidden sm:inline mx-2">|</span>
          <a href="https://www.metisnation.org/accessibility-form/" className="hover:text-blue-200">
            Accessibility Feedback Form
          </a>
        </p>
      </div>
    </div>
  );
};

const LoginModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside modal content
      >
        <LoginForm onSuccess={onClose} />
      </div>
    </div>
  );
};

const Landing = () => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const toggleDropdown = (menuName) => {
    setOpenDropdown(openDropdown === menuName ? null : menuName);
  };

  const handleLoginClick = () => {
    setShowLoginModal(true);
  };

  const handleCloseLogin = () => {
    setShowLoginModal(false);
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100">
        <TopNavBar />
        <Header openDropdown={openDropdown} toggleDropdown={toggleDropdown} />
        <HeroSection onLoginClick={handleLoginClick} />
        <MainContent onLoginClick={handleLoginClick} />
        <Footer />
        <BottomFooter />
      </div>

      <LoginModal isOpen={showLoginModal} onClose={handleCloseLogin} />
    </>
  );
};

export default Landing;