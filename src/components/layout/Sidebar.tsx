"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '../../utils';

interface NavigationItem {
  name: string;
  href: string;
  icon?: React.ReactNode;
}

interface SidebarProps {
  navigation: NavigationItem[];
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  navigation,
  className,
}) => {
  const pathname = usePathname();

  return (
    <aside className={cn('bg-gray-50 border-r border-gray-200', className)}>
      <nav className="mt-5 px-2">
        <div className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'group flex items-center px-2 py-2 text-sm font-medium rounded-md',
                  isActive
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                {item.icon && (
                  <span className="mr-3 shrink-0 h-6 w-6">
                    {item.icon}
                  </span>
                )}
                {item.name}
              </Link>
            );
          })}
        </div>
      </nav>
    </aside>
  );
};