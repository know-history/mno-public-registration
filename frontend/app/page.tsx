"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import Dashboard from "@/components/Dashboard";
import Landing from "@/components/Landing";

export default function Home() {
  const { user, loading } = useAuth();
  const [showDashboard, setShowDashboard] = useState(false);

  const handleDashboardClick = () => {
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
    return (
      <main className="min-h-screen">
        <Dashboard onBackToLanding={() => setShowDashboard(false)} />
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <Landing onDashboardClick={handleDashboardClick} />
    </main>
  );
}
