"use client";

import React from "react";
import { Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react";

export const TopBar: React.FC = () => {
  return (
    <div className="bg-blue-700 text-white text-sm py-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row justify-between items-center space-y-2 lg:space-y-0">
          <div className="flex flex-wrap justify-center lg:justify-start space-x-4 lg:space-x-6">
            <a
              href="https://www.metisnation.org/about-the-mno/"
              className="hover:text-blue-200 transition-colors focus:outline-none focus:underline"
            >
              ABOUT
            </a>
            <a
              href="https://www.metisnation.org/culture-heritage/"
              className="hover:text-blue-200 transition-colors focus:outline-none focus:underline"
            >
              CULTURE
            </a>
            <a
              href="https://www.metisnation.org/about-the-mno/contact-us/"
              className="hover:text-blue-200 transition-colors focus:outline-none focus:underline"
            >
              CONTACT US
            </a>
            <a
              href="https://can232.dayforcehcm.com/CandidatePortal/en-US/metis"
              className="hover:text-blue-200 transition-colors focus:outline-none focus:underline"
            >
              CAREERS
            </a>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex space-x-2">
              <a
                href="https://www.facebook.com/ONMetis/"
                className="w-5 h-5 hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-blue-300 rounded"
                aria-label="Facebook"
              >
                <Facebook className="w-full h-full" />
              </a>
              <a
                href="https://x.com/metisnationon"
                className="w-5 h-5 hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-blue-300 rounded"
                aria-label="Twitter"
              >
                <Twitter className="w-full h-full" />
              </a>
              <a
                href="https://www.instagram.com/metisnationon/?hl=en"
                className="w-5 h-5 hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-blue-300 rounded"
                aria-label="Instagram"
              >
                <Instagram className="w-full h-full" />
              </a>
              <a
                href="https://www.linkedin.com/company/m%C3%A9tis-nation-of-ontario/?originalSubdomain=ca"
                className="w-5 h-5 hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-blue-300 rounded"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-full h-full" />
              </a>
              <a
                href="https://www.youtube.com/channel/UCYt1gnqk88jHpRWiOXe0d_A"
                className="w-5 h-5 hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-blue-300 rounded"
                aria-label="YouTube"
              >
                <Youtube className="w-full h-full" />
              </a>
            </div>

            <div className="hidden sm:flex">
              <form
                method="get"
                action="https://www.metisnation.org/"
                role="search"
                className="flex"
              >
                <label htmlFor="search-input" className="sr-only">
                  Search
                </label>
                <input
                  id="search-input"
                  type="text"
                  name="s"
                  placeholder="Search..."
                  className="px-3 py-1 text-black text-sm rounded-l border-0 bg-white w-24 sm:w-auto focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                <button
                  type="submit"
                  className="bg-gray-600 px-3 py-1 text-sm rounded-r hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors"
                >
                  SEARCH
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
