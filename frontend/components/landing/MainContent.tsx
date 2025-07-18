'use client';

import React from 'react';
import { ChevronRight } from 'lucide-react';

interface MainContentProps {
  onAuthClick: () => void;
}

export const MainContent: React.FC<MainContentProps> = ({ onAuthClick }) => {
  return (
    <div
      className="py-8 sm:py-16 min-h-96"
      style={{
        backgroundImage: "url('sash-birch.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="max-w-2xl">
          <div className="bg-black/50 backdrop-blur-xs p-6 sm:p-8 rounded-lg text-white">
            <p className="text-base sm:text-lg mb-6 leading-relaxed">
              On this page you can <strong>Update your Address</strong>,{' '}
              <strong>Apply for MNO Citizenship</strong>,{' '}
              <strong>Apply for a MNO Harvester Certificate</strong> and
              check the status of your applications — all online! To start
              an application process, you will need to create an account.
            </p>

            <p className="mb-8 leading-relaxed text-sm sm:text-base">
              If you require assistance or have any questions about the
              Application and Update process please email us at{' '}
              <strong>info@mnoregistry.ca</strong> or call Toll Free at{' '}
              <strong>1-855-798-1006</strong> or our local number{' '}
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
                onClick={onAuthClick}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 sm:px-6 rounded flex items-center justify-between font-medium transition-colors cursor-pointer text-sm sm:text-base"
              >
                <span>Create an Account</span>
                <ChevronRight className="w-5 h-5 flex-shrink-0" />
              </button>

              <button
                onClick={onAuthClick}
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