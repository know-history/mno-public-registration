'use client';

import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6 text-center">
        <div className="mb-4">
          <svg 
            className="h-16 w-16 text-gray-400 mx-auto" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1} 
              d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.008-5.824-2.563M8.343 3.343a8 8 0 109.314 0M12 3v9" 
            />
          </svg>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Page Not Found
        </h2>
        
        <p className="text-gray-600 mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <div className="space-y-3">
          <Button 
            onClick={() => window.location.href = '/'} 
            variant="primary"
            className="w-full"
          >
            Go to Home
          </Button>
          <Button 
            onClick={() => window.history.back()} 
            variant="ghost"
            className="w-full"
          >
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}