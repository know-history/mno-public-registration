'use client';

import React, { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { HeroSection } from '@/components/layout/HeroSection';
import { MainContent } from './MainContent';
import { AuthModal } from '@/components/auth/AuthModal';

export const LandingPage: React.FC = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleAuthClick = () => {
    setShowAuthModal(true);
  };

  const handleCloseAuth = () => {
    setShowAuthModal(false);
  };

  const breadcrumbItems = [
    { label: 'REGISTRY', href: 'https://www.metisnation.org/registry/' },
  ];

  return (
    <PageLayout 
      showAuthButton={true} 
      onAuthClick={handleAuthClick}
    >
      <HeroSection
        title="Registry Applications"
        subtitle="Apply for MNO citizenship and harvesting rights online"
        breadcrumbItems={breadcrumbItems}
        actionButton={{
          text: 'LOGIN TO YOUR ACCOUNT',
          onClick: handleAuthClick,
        }}
      />

      <MainContent onAuthClick={handleAuthClick} />

      <AuthModal 
        isOpen={showAuthModal}
        onClose={handleCloseAuth}
        onSuccess={handleCloseAuth}
      />
    </PageLayout>
  );
};