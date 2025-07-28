import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

export interface LandingState {
  openDropdown: string | null;
  toggleDropdown: (menuName: string) => void;

  showAuthModal: boolean;
  startWithSignup: boolean;
  isInConfirmation: boolean;

  handleLoginClick: () => void;
  handleCreateAccountClick: () => void;
  handleCloseAuthModal: () => void;
  handleModalStateChange: (state: { needsConfirmation: boolean }) => void;

  handleLogout: () => Promise<void>;

  user: any;
  isAuthenticated: boolean;
}

export const useLandingState = (
  onDashboardClick?: () => void
): LandingState => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [startWithSignup, setStartWithSignup] = useState<boolean>(false);
  const [isInConfirmation, setIsInConfirmation] = useState<boolean>(false);

  const { user, signOut } = useAuth();

  const toggleDropdown = (menuName: string) => {
    setOpenDropdown(openDropdown === menuName ? null : menuName);
  };

  const handleLoginClick = () => {
    setStartWithSignup(false);
    setShowAuthModal(true);
  };

  const handleCreateAccountClick = () => {
    setStartWithSignup(true);
    setShowAuthModal(true);
  };

  const handleCloseAuthModal = () => {
    setShowAuthModal(false);
    setStartWithSignup(false);
    setIsInConfirmation(false);
  };

  const handleModalStateChange = (state: { needsConfirmation: boolean }) => {
    setIsInConfirmation(state.needsConfirmation);
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return {
    openDropdown,
    toggleDropdown,
    showAuthModal,
    startWithSignup,
    isInConfirmation,
    handleLoginClick,
    handleCreateAccountClick,
    handleCloseAuthModal,
    handleModalStateChange,
    handleLogout,
    user,
    isAuthenticated: !!user,
  };
};
