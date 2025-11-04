import React from 'react';
import { CardCustom } from './CardCustom';
import { cn } from '../../utils';

interface StatsGridProps {
  stats: Array<{
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
    onClick?: () => void;
    loading?: boolean;
  }>;
  columns?: 1 | 2 | 3 | 4 | 5 | 6;
  gap?: 'sm' | 'md' | 'lg';
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'gradient' | 'outlined' | 'glass';
  className?: string;
}

const gridColumns = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  5: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5',
  6: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6',
};

const gridGaps = {
  sm: 'gap-3',
  md: 'gap-4',
  lg: 'gap-6',
};

export const StatsGrid: React.FC<StatsGridProps> = ({
  stats,
  columns = 4,
  gap = 'md',
  size = 'md',
  variant = 'default',
  className,
}) => {
  return (
    <div className={cn('grid', gridColumns[columns], gridGaps[gap], className)}>
      {stats.map((stat, index) => (
        <CardCustom
          key={index}
          title={stat.title}
          value={stat.value}
          subtitle={stat.subtitle}
          icon={stat.icon}
          iconBg={stat.iconBg}
          trend={stat.trend}
          onClick={stat.onClick}
          loading={stat.loading}
          size={size}
          variant={variant}
        />
      ))}
    </div>
  );
};