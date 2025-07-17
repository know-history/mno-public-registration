import React from "react";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
} from "lucide-react";

const TopNavigation: React.FC = () => {
  return (
    <div className="bg-blue-700 text-white text-sm py-2">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
        <div className="flex flex-wrap justify-center sm:justify-start space-x-4 sm:space-x-6">
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
          
          <form
            method="get"
            action="https://www.metisnation.org/"
            role="search"
            className="flex"
          >
            <input
              type="text"
              name="s"
              placeholder="Search..."
              className="px-3 py-1 text-black text-sm rounded-l border-0 bg-white w-24 sm:w-auto"
            />
            <button
              type="submit"
              className="bg-gray-600 px-3 py-1 text-sm rounded-r hover:bg-gray-700 cursor-pointer"
            >
              SEARCH
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TopNavigation;