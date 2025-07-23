'use client';

import React from 'react';
import { TopBar } from './TopBar';
import { Header } from './Header';
import { Footer } from './Footer';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

interface PageLayoutProps {
  children: React.ReactNode;
  showTopBar?: boolean;
  showAuthButton?: boolean;
  onAuthClick?: () => void;
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  showTopBar = true,
  showAuthButton = false,
  onAuthClick,
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {showTopBar && <TopBar />}
      
      <Header 
        showAuthButton={showAuthButton}
        onAuthClick={onAuthClick}
      />

      <main className="flex-1">
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </main>

      <Footer />
    </div>
  );
};
