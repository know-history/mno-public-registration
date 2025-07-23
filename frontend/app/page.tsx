"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import Dashboard from "@/components/Dashboard";
import Landing from "@/components/Landing";

export default function Home() {
  const { user, loading } = useAuth();
  const [showDashboard, setShowDashboard] = useState(false);

  const handleDashboardClick = () => {
    console.log('handleDashboardClick called in page.tsx'); // Debug log
    setShowDashboard(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (showDashboard && user) {
    console.log('Showing dashboard');
    return (
      <main className="min-h-screen">
        <Dashboard onBackToLanding={() => setShowDashboard(false)} />
      </main>
    );
  }

  console.log('Showing landing page, passing onDashboardClick:', !!handleDashboardClick); // Debug log
  return (
    <main className="min-h-screen">
      <Landing onDashboardClick={handleDashboardClick} />
    </main>
  );
}