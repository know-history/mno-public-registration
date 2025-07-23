"use client";

import React from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { HeroSection } from "@/components/layout/HeroSection";
import { MainContent } from "./MainContent";
import { useModal } from "@/contexts/ModalContext";

export const LandingPage: React.FC = () => {
  const { openAuthModal } = useModal();

  const handleLoginClick = () => {
    openAuthModal("login");
  };

  const handleRegisterClick = () => {
    openAuthModal("register");
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
    </PageLayout>
  );
};