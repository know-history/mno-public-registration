'use client';

import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Navigation } from './Navigation';
import { UserMenu } from './UserMenu';
import { useAuth } from '@/hooks/useAuth';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <a href="https://www.metisnation.org/" className="cursor-pointer">
            <img
              src="/logo.png"
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

        <div className="hidden lg:flex items-center space-x-8">
          <Navigation />
          {user && <UserMenu />}
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t shadow-lg">
          <div className="px-4 py-4 space-y-4">
            <Navigation isMobile />
            {user && (
              <div className="pt-4 border-t border-gray-200">
                <UserMenu isMobile />
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};