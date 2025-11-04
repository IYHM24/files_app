import React from 'react';
import { cn } from '../../utils';

interface ProgressBarProps {
  progress: number;
  status?: 'uploading' | 'completed' | 'error';
  size?: 'sm' | 'md' | 'lg';
  showPercentage?: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  status = 'uploading',
  size = 'md',
  showPercentage = true,
  className
}) => {
  const sizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };

  const statusColors = {
    uploading: 'bg-blue-500',
    completed: 'bg-green-500',
    error: 'bg-red-500'
  };

  const statusBgColors = {
    uploading: 'bg-blue-100',
    completed: 'bg-green-100', 
    error: 'bg-red-100'
  };

  return (
    <div className={cn('w-full', className)}>
      {showPercentage && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-medium text-gray-700">
            {status === 'uploading' && 'Subiendo...'}
            {status === 'completed' && 'Completado'}
            {status === 'error' && 'Error'}
          </span>
          <span className="text-xs font-medium text-gray-700">
            {Math.round(progress)}%
          </span>
        </div>
      )}
      
      <div className={cn(
        'w-full rounded-full overflow-hidden',
        sizes[size],
        statusBgColors[status]
      )}>
        <div
          className={cn(
            'h-full rounded-full transition-all duration-300 ease-out',
            statusColors[status],
            status === 'uploading' && 'animate-pulse'
          )}
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
    </div>
  );
};