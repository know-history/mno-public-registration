'use client';

import React from 'react';
import { TopBar } from './TopBar';
import { Header } from './Header';
import { Footer } from './Footer';
import { Sidebar } from './Sidebar';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { useAuth } from '@/hooks/useAuth';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface DashboardLayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
  sidebarContent?: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  showSidebar = false,
  sidebarContent,
}) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    // Redirect will be handled by the auth state
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <TopBar />
      <Header />

      <div className="flex-1 flex">
        {showSidebar && (
          <aside className="w-64 bg-white shadow-sm border-r border-gray-200 hidden lg:block">
            {sidebarContent || <Sidebar />}
          </aside>
        )}

        <main className="flex-1 overflow-auto">
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </main>
      </div>

      <Footer />
    </div>
  );
};