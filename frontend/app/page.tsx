'use client';

import { useAuth } from '@/hooks/useAuth';
import { DashboardPage } from '@/components/dashboard/DashboardPage';
import { LandingPage } from '@/components/landing/LandingPage';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function HomePage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return user ? <DashboardPage /> : <LandingPage />;
}
