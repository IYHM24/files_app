import React from 'react';
import { DEBUG } from '../../config/debug';

interface DebugInfoProps {
  title?: string;
  info: Array<{
    label: string;
    value: string | number;
  }>;
  onReload?: () => void;
  reloadLabel?: string;
}

export const DebugInfo: React.FC<DebugInfoProps> = ({
  title = "Debug Info",
  info,
  onReload,
  reloadLabel = "Recargar"
}) => {
  if (!DEBUG) {
    return null;
  }

  return (
    <div className="mt-8 p-4 bg-gray-800 border border-gray-700 rounded-lg">
      <h4 className="font-medium text-gray-200 mb-2">{title}:</h4>
      <div className="text-sm text-gray-300 space-y-1">
        {info.map((item, index) => (
          <p key={index}>• {item.label}: {item.value}</p>
        ))}
      </div>
      {onReload && (
        <button
          onClick={onReload}
          className="mt-2 px-3 py-1 text-xs bg-gray-700 text-gray-200 rounded hover:bg-gray-600 transition-colors"
        >
          {reloadLabel}
        </button>
      )}
    </div>
  );
};