'use client';

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { 
  Users, 
  FileText, 
  FolderOpen, 
  BarChart3,
  Settings,
  ArrowRight 
} from 'lucide-react';
import { USER_ROLES } from '@/lib/constants';

interface AdminTool {
  title: string;
  description: string;
  href: string;
  icon: React.ElementType;
  roles: string[];
  color: string;
}

const adminTools: AdminTool[] = [
  {
    title: 'View All Applications',
    description: 'Review and manage submitted applications',
    href: '/dashboard/admin/applications',
    icon: FileText,
    roles: [USER_ROLES.ADMIN, USER_ROLES.RESEARCHER],
    color: 'purple',
  },
  {
    title: 'Document Library',
    description: 'Access and manage uploaded documents',
    href: '/dashboard/admin/documents',
    icon: FolderOpen,
    roles: [USER_ROLES.ADMIN, USER_ROLES.RESEARCHER],
    color: 'blue',
  },
  {
    title: 'User Management',
    description: 'Manage user roles and permissions',
    href: '/dashboard/admin/users',
    icon: Users,
    roles: [USER_ROLES.ADMIN],
    color: 'red',
  },
  {
    title: 'Analytics & Reports',
    description: 'View system analytics and generate reports',
    href: '/dashboard/admin/analytics',
    icon: BarChart3,
    roles: [USER_ROLES.ADMIN, USER_ROLES.RESEARCHER],
    color: 'green',
  },
  {
    title: 'System Settings',
    description: 'Configure system settings and preferences',
    href: '/dashboard/admin/settings',
    icon: Settings,
    roles: [USER_ROLES.ADMIN],
    color: 'gray',
  },
];

const getColorClasses = (color: string) => {
  const colorMap: Record<string, string> = {
    purple: 'bg-purple-50 border-purple-200 text-purple-700',
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    red: 'bg-red-50 border-red-200 text-red-700',
    green: 'bg-green-50 border-green-200 text-green-700',
    gray: 'bg-gray-50 border-gray-200 text-gray-700',
  };
  return colorMap[color] || colorMap.gray;
};

export const AdminTools: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  const hasAccess = (tool: AdminTool): boolean => {
    if (user.user_role === USER_ROLES.ADMIN) return true;
    return tool.roles.includes(user.user_role || '');
  };

  const availableTools = adminTools.filter(hasAccess);

  if (availableTools.length === 0) return null;

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Administrative Tools
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {availableTools.map((tool) => {
          const Icon = tool.icon;
          
          return (
            <div
              key={tool.title}
              className={`p-6 rounded-lg border transition-shadow hover:shadow-md ${getColorClasses(tool.color)}`}
            >
              <div className="flex items-center mb-4">
                <Icon className="h-8 w-8" />
                <h3 className="ml-3 text-lg font-medium">
                  {tool.title}
                </h3>
              </div>
              
              <p className="text-sm mb-4 opacity-90">
                {tool.description}
              </p>
              
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-between hover:bg-white/50"
                onClick={() => window.location.href = tool.href}
              >
                Access
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
};