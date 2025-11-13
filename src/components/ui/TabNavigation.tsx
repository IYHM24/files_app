import React from 'react';
import { cn } from '../../utils';

type Tab = {
  id: string;
  label: string;
  icon?: React.ReactNode;
};

interface TabNavigationProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
  tabs,
  activeTab,
  onTabChange,
  className
}) => {
  return (
    <div className={cn('border-b border-gray-200 bg-white', className)}>
      <nav className="flex space-x-8 px-6" aria-label="Tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              'flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors',
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            )}
          >
            {tab.icon && (
              <span className="w-5 h-5">
                {tab.icon}
              </span>
            )}
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};