"use client";

import { useAuth } from "@/hooks/useAuth";
import Dashboard from "@/components/Dashboard";
import Landing from "@/components/Landing";

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen">{user ? <Dashboard /> : <Landing />}</main>
  );
}