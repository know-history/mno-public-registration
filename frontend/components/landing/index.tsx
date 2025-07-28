import React from "react";
import { TopNavBar } from "./TopNavBar";
import { Header } from "./Header";
import { HeroSection } from "./HeroSection";
import { MainContent } from "./MainContent";
import { Footer } from "./Footer";
import { AuthModalWrapper } from "../shared/authModal/AuthModalWrapper";
import { useLandingState } from "../../hooks/useLandingState";

interface LandingProps {
  onDashboardClick?: () => void;
}

const Landing: React.FC<LandingProps> = ({ onDashboardClick }) => {
  const {
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

    isAuthenticated,
  } = useLandingState(onDashboardClick);

  const handleDashboardClick = () => {
    if (onDashboardClick) {
      onDashboardClick();
    } else {
      console.error("onDashboardClick prop is required");
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100">
        <TopNavBar />

        <Header openDropdown={openDropdown} onToggleDropdown={toggleDropdown} />

        <HeroSection
          onLoginClick={handleLoginClick}
          onDashboardClick={handleDashboardClick}
          isAuthenticated={isAuthenticated}
        />

        <MainContent
          onLoginClick={handleLoginClick}
          onCreateAccountClick={handleCreateAccountClick}
          onDashboardClick={handleDashboardClick}
          onLogout={handleLogout}
          isAuthenticated={isAuthenticated}
        />

        <Footer />
      </div>

      <AuthModalWrapper
        isOpen={showAuthModal}
        onClose={handleCloseAuthModal}
        startWithSignup={startWithSignup}
        isInConfirmation={isInConfirmation}
        onStateChange={handleModalStateChange}
      />
    </>
  );
};

export default Landing;
