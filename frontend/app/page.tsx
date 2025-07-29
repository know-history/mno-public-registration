"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import Dashboard from "@/components/Dashboard";
import Landing from "@/components/Landing";

export default function Home() {
  const { user, loading } = useAuth();
  const [showLanding, setShowLanding] = useState(false);

  const handleDashboardClick = () => {
    setShowLanding(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (user && !showLanding) {
    return (
      <main className="min-h-screen">
        <Dashboard onBackToLanding={() => setShowLanding(true)} />
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <Landing onDashboardClick={handleDashboardClick} />
    </main>
  );
}
