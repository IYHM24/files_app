import React from 'react';
import { cn } from '../../utils';

interface FileInfoProps {
  file: File;
  onRemove?: () => void;
  showDetails?: boolean;
}

export const FileInfo: React.FC<FileInfoProps> = ({
  file,
  onRemove,
  showDetails = true
}) => {
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileTypeDescription = (type: string): string => {
    if (type.startsWith('image/')) return 'Imagen';
    if (type.startsWith('video/')) return 'Video';
    if (type.startsWith('audio/')) return 'Audio';
    if (type === 'application/pdf') return 'Documento PDF';
    if (type.includes('word')) return 'Documento Word';
    if (type.includes('sheet') || type.includes('excel')) return 'Hoja de Cálculo';
    if (type.includes('presentation') || type.includes('powerpoint')) return 'Presentación';
    if (type.startsWith('text/')) return 'Documento de Texto';
    return 'Archivo';
  };

  return (
    <div className={cn(
      'bg-white border border-gray-200 rounded-lg p-4 shadow-sm',
      'transition-all duration-200 hover:shadow-md'
    )}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-lg">📄</span>
            <h4 className="text-sm font-medium text-gray-900 truncate">
              {file.name}
            </h4>
          </div>
          
          {showDetails && (
            <div className="space-y-1">
              <div className="flex items-center text-xs text-gray-500">
                <span className="w-16">Tipo:</span>
                <span>{getFileTypeDescription(file.type)}</span>
              </div>
              <div className="flex items-center text-xs text-gray-500">
                <span className="w-16">Tamaño:</span>
                <span>{formatFileSize(file.size)}</span>
              </div>
              <div className="flex items-center text-xs text-gray-500">
                <span className="w-16">MIME:</span>
                <span className="truncate">{file.type || 'Desconocido'}</span>
              </div>
            </div>
          )}
        </div>

        {onRemove && (
          <button
            onClick={onRemove}
            className={cn(
              'ml-2 p-1 text-gray-400 hover:text-red-500',
              'transition-colors duration-150 rounded',
              'hover:bg-red-50'
            )}
            title="Remover archivo"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};