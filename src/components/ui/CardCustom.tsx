import React from 'react';
import { cn } from '../../utils';

interface CardCustomProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  iconBg?: 'blue' | 'green' | 'purple' | 'red' | 'yellow' | 'indigo' | 'pink' | 'gray';
  trend?: {
    value: number;
    isPositive: boolean;
    label?: string;
  };
  loading?: boolean;
  onClick?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'gradient' | 'outlined' | 'glass';
}

const iconBgColors = {
  blue: 'bg-blue-500 shadow-blue-500/25',
  green: 'bg-green-500 shadow-green-500/25',
  purple: 'bg-purple-500 shadow-purple-500/25',
  red: 'bg-red-500 shadow-red-500/25',
  yellow: 'bg-yellow-500 shadow-yellow-500/25',
  indigo: 'bg-indigo-500 shadow-indigo-500/25',
  pink: 'bg-pink-500 shadow-pink-500/25',
  gray: 'bg-gray-500 shadow-gray-500/25',
};

const cardVariants = {
  default: 'bg-white border border-gray-200 shadow-sm hover:shadow-md',
  gradient: 'bg-gradient-to-br from-white via-blue-50 to-indigo-100 border border-blue-200 shadow-sm hover:shadow-lg',
  outlined: 'bg-white border-2 border-gray-300 hover:border-blue-400 shadow-none hover:shadow-sm',
  glass: 'bg-white/70 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl',
};

const cardSizes = {
  sm: 'p-4',
  md: 'p-5',
  lg: 'p-6',
};

export const CardCustom: React.FC<CardCustomProps> = ({
  title,
  value,
  subtitle,
  icon,
  iconBg = 'blue',
  trend,
  loading = false,
  onClick,
  className,
  size = 'md',
  variant = 'default',
}) => {
  const isClickable = !!onClick;

  return (
    <div
      className={cn(
        'group overflow-hidden rounded-xl transition-all duration-300 ease-out transform',
        cardVariants[variant],
        cardSizes[size],
        isClickable && 'cursor-pointer hover:scale-[1.02] active:scale-[0.98]',
        loading && 'animate-pulse',
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          {/* Icon Container */}
          <div className="relative">
            <div
              className={cn(
                'w-12 h-12 rounded-xl flex items-center justify-center text-white font-semibold text-lg shadow-lg transition-all duration-300',
                iconBgColors[iconBg],
                'group-hover:shadow-xl group-hover:scale-110'
              )}
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : icon ? (
                icon
              ) : (
                <span className="text-base font-bold">
                  {title.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            {/* Glow effect */}
            <div
              className={cn(
                'absolute inset-0 w-12 h-12 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-md',
                iconBgColors[iconBg].split(' ')[0] // Take only the background color
              )}
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-medium text-gray-600 truncate group-hover:text-gray-800 transition-colors">
                {title}
              </h3>
              {trend && (
                <div
                  className={cn(
                    'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
                    trend.isPositive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  )}
                >
                  <span
                    className={cn(
                      'mr-1',
                      trend.isPositive ? 'text-green-600' : 'text-red-600'
                    )}
                  >
                    {trend.isPositive ? '↗' : '↘'}
                  </span>
                  {Math.abs(trend.value)}%
                </div>
              )}
            </div>

            <div className="mt-1">
              <div className="text-2xl font-bold text-gray-900 group-hover:text-gray-800 transition-colors">
                {loading ? (
                  <div className="h-8 bg-gray-200 rounded animate-pulse w-20" />
                ) : (
                  <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text">
                    {typeof value === 'number' ? value.toLocaleString() : value}
                  </span>
                )}
              </div>
              
              {subtitle && (
                <p className="text-xs text-gray-500 mt-1 group-hover:text-gray-600 transition-colors">
                  {subtitle}
                </p>
              )}
              
              {trend?.label && (
                <p className="text-xs text-gray-400 mt-1">
                  {trend.label}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Action indicator for clickable cards */}
        {isClickable && (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="w-5 h-5 text-gray-400 group-hover:text-gray-600">
              <svg
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Bottom gradient line for visual appeal */}
      <div
        className={cn(
          'absolute bottom-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300',
          `bg-gradient-to-r from-${iconBg}-500 to-${iconBg}-600`
        )}
      />
    </div>
  );
};

