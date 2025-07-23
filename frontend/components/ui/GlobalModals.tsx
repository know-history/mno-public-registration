"use client";

import React from 'react';
import { useModal } from '@/contexts/ModalContext';
import { AuthModal } from '@/components/auth/AuthModal';

export const GlobalModals: React.FC = () => {
  const { isAuthModalOpen, authMode, closeAuthModal } = useModal();

  return (
    <>
      <AuthModal
        isOpen={isAuthModalOpen}
        defaultMode={authMode}
        onClose={closeAuthModal}
        onSuccess={closeAuthModal}
      />
    </>
  );
};