"use client";

import React, { useState } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { HeroSection } from "@/components/layout/HeroSection";
import { MainContent } from "./MainContent";
import { AuthModal } from "@/components/auth/AuthModal";

export const LandingPage: React.FC = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [keepModalOpen, setKeepModalOpen] = useState(false);

  const handleLoginClick = () => {
    setAuthMode("login");
    setShowAuthModal(true);
    setKeepModalOpen(true);
  };

  const handleRegisterClick = () => {
    setAuthMode("register");
    setShowAuthModal(true);
    setKeepModalOpen(true);
  };

  const handleCloseAuth = () => {
    setShowAuthModal(false);
  };

  const breadcrumbItems = [
    { label: "REGISTRY", href: "https://www.metisnation.org/registry/" },
  ];

  return (
    <PageLayout showAuthButton={true} onAuthClick={handleLoginClick}>
      <HeroSection
        title="Registry Applications"
        subtitle="Apply for MNO citizenship and harvesting rights online"
        breadcrumbItems={breadcrumbItems}
        actionButton={{
          text: "LOGIN TO YOUR ACCOUNT",
          onClick: handleLoginClick,
        }}
      />

      <MainContent
        onLoginClick={handleLoginClick}
        onRegisterClick={handleRegisterClick}
      />

      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal && keepModalOpen}
          defaultMode={authMode}
          onClose={() => {
            setShowAuthModal(false);
            setKeepModalOpen(false);
          }}
          onSuccess={() => {
            setKeepModalOpen(false);
            setShowAuthModal(false);
          }}
        />
      )}
    </PageLayout>
  );
};
