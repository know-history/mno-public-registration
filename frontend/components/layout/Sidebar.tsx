'use client';

import React from 'react';
import { 
  Home, 
  FileText, 
  User, 
  Settings, 
  Users, 
  BarChart3,
  Briefcase,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { USER_ROLES } from '@/lib/constants';
import { clsx } from 'clsx';

interface SidebarItem {
  label: string;
  href: string;
  icon: React.ElementType;
  roles?: string[];
}

const sidebarItems: SidebarItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: Home,
  },
  {
    label: 'My Applications',
    href: '/dashboard/applications',
    icon: FileText,
  },
  {
    label: 'Profile',
    href: '/dashboard/profile',
    icon: User,
  },
  {
    label: 'All Applications',
    href: '/dashboard/admin/applications',
    icon: Briefcase,
    roles: [USER_ROLES.ADMIN, USER_ROLES.RESEARCHER],
  },
  {
    label: 'User Management',
    href: '/dashboard/admin/users',
    icon: Users,
    roles: [USER_ROLES.ADMIN],
  },
  {
    label: 'Analytics',
    href: '/dashboard/admin/analytics',
    icon: BarChart3,
    roles: [USER_ROLES.ADMIN, USER_ROLES.RESEARCHER],
  },
  {
    label: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
  },
];

export const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';

  const hasAccess = (item: SidebarItem): boolean => {
    if (!item.roles) return true;
    if (!user?.user_role) return false;
    
    if (user.user_role === USER_ROLES.ADMIN) return true;
    
    return item.roles.includes(user.user_role);
  };

  const filteredItems = sidebarItems.filter(hasAccess);

  return (
    <nav className="h-full flex flex-col py-6">
      <div className="px-3 mb-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Registry Portal
        </h2>
      </div>

      <div className="flex-1 px-3">
        <ul className="space-y-1">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.href;

            return (
              <li key={item.href}>
                <a
                  href={item.href}
                  className={clsx(
                    'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500',
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:text-blue-700 hover:bg-gray-100'
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon
                    className={clsx(
                      'mr-3 h-5 w-5 flex-shrink-0',
                      isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-blue-500'
                    )}
                    aria-hidden="true"
                  />
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};