import React from "react";
import { ChevronRight } from "lucide-react";

interface MainContentProps {
  onLoginClick: () => void;
  onCreateAccountClick: () => void;
  onDashboardClick: () => void;
  onLogout: () => void;
  isAuthenticated: boolean;
}

export const MainContent: React.FC<MainContentProps> = ({
  onLoginClick,
  onCreateAccountClick,
  onDashboardClick,
  onLogout,
  isAuthenticated,
}) => {
  return (
    <div className="py-12 sm:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                Registry Applications Portal
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                Welcome to the Métis Nation of Ontario Registry Applications Portal. 
                This secure platform allows eligible individuals to apply for citizenship 
                and harvesting rights within the Métis Nation of Ontario.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">
                Available Applications:
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>Citizenship Registration</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>Harvesting Rights Application</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>Registry Database Updates</span>
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">
                Important Notice
              </h4>
              <p className="text-blue-800 text-sm">
                All applications require supporting documentation and may take 
                several weeks to process. Please ensure you have all required 
                documents before beginning your application.
              </p>
            </div>
          </div>

          <div className="bg-gray-50 p-6 sm:p-8 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Get Started
            </h3>
            
            <div className="space-y-4">
              {isAuthenticated ? (
                <>
                  <button
                    onClick={onDashboardClick}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 sm:px-6 rounded flex items-center justify-between font-medium transition-colors cursor-pointer text-base"
                  >
                    <span>Access Dashboard</span>
                    <ChevronRight className="w-5 h-5 flex-shrink-0" />
                  </button>

                  <button
                    onClick={onLogout}
                    className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 sm:px-6 rounded flex items-center justify-between font-medium transition-colors cursor-pointer text-base"
                  >
                    <span>Sign Out</span>
                    <ChevronRight className="w-5 h-5 flex-shrink-0" />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={onCreateAccountClick}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 sm:px-6 rounded flex items-center justify-between font-medium transition-colors cursor-pointer text-base"
                  >
                    <span>Create an Account</span>
                    <ChevronRight className="w-5 h-5 flex-shrink-0" />
                  </button>

                  <button
                    onClick={onLoginClick}
                    className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 sm:px-6 rounded flex items-center justify-between font-medium transition-colors cursor-pointer text-base"
                  >
                    <span>Login to your Account</span>
                    <ChevronRight className="w-5 h-5 flex-shrink-0" />
                  </button>
                </>
              )}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 text-center">
                Need help? Contact our Registry team at{" "}
                <a 
                  href="mailto:registry@metisnation.org" 
                  className="text-blue-600 hover:text-blue-800"
                >
                  registry@metisnation.org
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};