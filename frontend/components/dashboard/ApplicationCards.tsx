'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { 
  FileText, 
  Plus, 
  Clock, 
  CheckCircle, 
  XCircle,
  ArrowRight 
} from 'lucide-react';

interface ApplicationCard {
  title: string;
  description: string;
  href: string;
  icon: React.ElementType;
  available: boolean;
}

const applicationTypes: ApplicationCard[] = [
  {
    title: 'Citizenship Application',
    description: 'Apply for Métis Nation of Ontario citizenship',
    href: '/applications/citizenship',
    icon: FileText,
    available: true,
  },
  {
    title: 'Harvesting Rights',
    description: 'Apply for traditional harvesting rights',
    href: '/applications/harvesting',
    icon: FileText,
    available: true,
  },
  {
    title: 'Address Update',
    description: 'Update your contact information and renew your citizen card',
    href: '/applications/address-update',
    icon: FileText,
    available: true,
  },
];

// Mock data for existing applications
const mockApplications = [
  {
    id: '1',
    type: 'Citizenship',
    status: 'pending',
    submittedDate: '2024-01-15',
    lastUpdated: '2024-01-20',
  },
  {
    id: '2',
    type: 'Harvesting',
    status: 'approved',
    submittedDate: '2023-12-10',
    lastUpdated: '2024-01-05',
  },
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'pending':
      return <Clock className="w-5 h-5 text-yellow-500" />;
    case 'approved':
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    case 'rejected':
      return <XCircle className="w-5 h-5 text-red-500" />;
    default:
      return <Clock className="w-5 h-5 text-gray-500" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    case 'approved':
      return 'bg-green-50 text-green-700 border-green-200';
    case 'rejected':
      return 'bg-red-50 text-red-700 border-red-200';
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200';
  }
};

export const ApplicationCards: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Available Applications */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Available Applications
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {applicationTypes.map((app) => {
            const Icon = app.icon;
            
            return (
              <div
                key={app.title}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-md bg-blue-500 text-white">
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      {app.title}
                    </h3>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-6">
                  {app.description}
                </p>
                
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => window.location.href = app.href}
                  disabled={!app.available}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Start Application
                </Button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Existing Applications */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Your Applications
          </h2>
          <Button
            variant="ghost"
            onClick={() => window.location.href = '/dashboard/applications'}
          >
            View All
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {mockApplications.length > 0 ? (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <ul className="divide-y divide-gray-200">
              {mockApplications.map((application) => (
                <li key={application.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        {getStatusIcon(application.status)}
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">
                          {application.type} Application
                        </h3>
                        <p className="text-sm text-gray-500">
                          Submitted: {new Date(application.submittedDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(application.status)}`}>
                        {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                      </span>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.location.href = `/dashboard/applications/${application.id}`}
                      >
                        View Details
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No applications yet
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating your first application.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};