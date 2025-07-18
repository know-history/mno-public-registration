"use client";

import React from "react";
import { Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react";

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-200">
      <div className="py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold text-gray-900 mb-4">
                Métis Nation of Ontario
              </h3>
              <div className="space-y-2 text-sm text-gray-700">
                <div>
                  <p>Suite 1100 - 66 Slater Street</p>
                  <p>Ottawa, ON K1P 5H1</p>
                  <a
                    href="mailto:info@metisnation.org"
                    className="text-blue-600 hover:text-blue-800 underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                  >
                    Click Here to Email Us
                  </a>
                </div>
              </div>

              <div className="mt-6 space-y-1 text-sm text-gray-700">
                <p>Tel.: 613-798-1488</p>
                <p>Toll Free: 1-800-263-4889</p>
                <p>Registry Tel.: 613-798-1006</p>
                <p>Registry Toll Free: 1-855-798-1006</p>
                <a
                  href="mailto:info@mnoregistry.ca"
                  className="text-blue-600 hover:text-blue-800 underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                >
                  Click Here to Email Registry
                </a>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-gray-900 mb-4">Connect With Us</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Twitter
                    className="w-4 h-4 mr-2 text-gray-600"
                    aria-hidden="true"
                  />
                  <a
                    href="https://x.com/metisnationon"
                    className="text-gray-700 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                  >
                    Twitter
                  </a>
                </div>
                <div className="flex items-center">
                  <Facebook
                    className="w-4 h-4 mr-2 text-gray-600"
                    aria-hidden="true"
                  />
                  <a
                    href="https://www.facebook.com/ONMetis/"
                    className="text-gray-700 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                  >
                    Facebook
                  </a>
                </div>
                <div className="flex items-center">
                  <Instagram
                    className="w-4 h-4 mr-2 text-gray-600"
                    aria-hidden="true"
                  />
                  <a
                    href="https://www.instagram.com/metisnationon/?hl=en"
                    className="text-gray-700 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                  >
                    Instagram
                  </a>
                </div>
                <div className="flex items-center">
                  <Linkedin
                    className="w-4 h-4 mr-2 text-gray-600"
                    aria-hidden="true"
                  />
                  <a
                    href="https://www.linkedin.com/company/m%C3%A9tis-nation-of-ontario/?originalSubdomain=ca"
                    className="text-gray-700 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                  >
                    LinkedIn
                  </a>
                </div>
                <div className="flex items-center">
                  <Youtube
                    className="w-4 h-4 mr-2 text-gray-600"
                    aria-hidden="true"
                  />
                  <a
                    href="https://www.youtube.com/channel/UCYt1gnqk88jHpRWiOXe0d_A"
                    className="text-gray-700 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
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
                  href="https://www.metisnation.org/voyageur-newsletter/"
                  className="text-gray-700 hover:text-blue-600 block focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                >
                  Voyageur Newsletter
                </a>
                <a
                  href="https://www.metisnation.org/covid-19-support-programs/"
                  className="text-gray-700 hover:text-blue-600 block focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                >
                  COVID-19 Support Programs
                </a>
                <a
                  href="https://www.metisnation.org/about-the-mno/mno-offices-staff/"
                  className="text-gray-700 hover:text-blue-600 block focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                >
                  MNO Offices & Staff
                </a>
                <a
                  href="https://www.metisnation.org/swag-store/"
                  className="text-gray-700 hover:text-blue-600 block focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                >
                  Swag Store
                </a>
                <a
                  href="https://www.metisnation.org/procurement-opportunities/"
                  className="text-gray-700 hover:text-blue-600 block focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                >
                  Procurement Opportunities
                </a>
                <a
                  href="https://can232.dayforcehcm.com/CandidatePortal/en-US/metis"
                  className="text-gray-700 hover:text-blue-600 block focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                >
                  Careers
                </a>
                <a
                  href="https://www.metisnation.org/about-the-mno/contact-us/"
                  className="text-gray-700 hover:text-blue-600 block focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                >
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-700 text-white py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm">
          <p className="flex flex-col sm:flex-row sm:justify-center sm:items-center space-y-1 sm:space-y-0">
            <span>
              © {currentYear} Métis Nation of Ontario. All rights reserved.
            </span>
            <span className="hidden sm:inline mx-2" aria-hidden="true">
              |
            </span>
            <a
              href="https://www.metisnation.org/privacy-policy/"
              className="hover:text-blue-200 underline focus:outline-none focus:ring-2 focus:ring-blue-300 rounded"
            >
              Privacy Policy
            </a>
            <span className="hidden sm:inline mx-2" aria-hidden="true">
              |
            </span>
            <a
              href="https://www.metisnation.org/accessibility-form/"
              className="hover:text-blue-200 underline focus:outline-none focus:ring-2 focus:ring-blue-300 rounded"
            >
              Accessibility Feedback Form
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};
