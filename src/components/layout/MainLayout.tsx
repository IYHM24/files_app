"use client";

import React from 'react';
import { Header } from './Header';
import { cn } from '../../utils';

interface MainLayoutProps {
  children: React.ReactNode;
  title?: string;
  headerActions?: React.ReactNode;
  sidebar?: React.ReactNode;
  className?: string;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  title,
  headerActions,
  sidebar,
  className,
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Header */}
      <Header title={title}>
        {headerActions}
      </Header>
      
      {/* Sidebar */}
      <div className="flex">
        {sidebar && (
          <div className="w-64 min-h-screen">
            {sidebar}
          </div>
        )}
        
        {/* Cuerpo principal */}
        <main className={cn('flex-1 py-6', className)}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>

      </div>
    </div>
  );
};