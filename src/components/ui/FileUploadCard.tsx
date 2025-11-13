import React, { useState, useRef } from 'react';
import { cn } from '../../utils';
import { FileUploadService } from '../../services/FileUploadService';

interface FileUploadCardProps {
  title?: string;
  subtitle?: string;
  maxFileSize?: number;
  className?: string;
  onFileUploaded?: () => void;
}

export const FileUploadCard: React.FC<FileUploadCardProps> = ({
  title = "Cargar Archivos",
  subtitle = "Arrastra y suelta tus archivos aquí o haz click para seleccionar",
  maxFileSize = 50,
  className,
  onFileUploaded,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setMessage('');
    setError('');
    
    // Validar tamaño
    if (file.size > maxFileSize * 1024 * 1024) {
      setError(`Archivo muy grande. Máximo ${maxFileSize}MB`);
      return;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Selecciona un archivo primero');
      return;
    }

    setIsUploading(true);
    setMessage('');
    setError('');

    try {
      // Usar la API directamente en lugar del servicio
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch('/api/files/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setMessage(`Archivo "${selectedFile.name}" subido exitosamente`);
        setSelectedFile(null);
        
        // Llamar callback si existe
        if (onFileUploaded) {
          onFileUploaded();
        }
      } else {
        setError(result.message || 'Error subiendo archivo');
      }
    } catch (error: any) {
      console.error('Error durante la subida:', error);
      setError(error?.message || 'Error interno del servidor');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={cn('p-8', className)}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">{title}</h1>
          <p className="text-gray-300">{subtitle}</p>
        </div>

        {/* Upload Area */}
        <div 
          className={cn(
            'relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300',
            'hover:border-blue-400 hover:bg-blue-900/20',
            isDragOver ? 'border-blue-400 bg-blue-900/30 scale-[1.02]' : 'border-gray-600',
            'cursor-pointer group'
          )}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          {/* Upload Icon */}
          <div className="mb-6">
            <div className={cn(
              'w-20 h-20 mx-auto rounded-full bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center',
              'group-hover:scale-110 transition-transform duration-300',
              isDragOver && 'scale-110'
            )}>
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
          </div>

          {/* Text */}
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-white mb-2">
              {isDragOver ? '¡Suelta el archivo aquí!' : 'Arrastra tu archivo aquí'}
            </h3>
            <p className="text-gray-300">
              o <span className="text-blue-400 font-medium">haz click para seleccionar</span>
            </p>
          </div>

          {/* File types */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {['PDF', 'Imágenes', 'Videos', 'Documentos', 'Audio'].map((type) => (
              <span 
                key={type}
                className="px-3 py-1 bg-gray-700 text-gray-200 text-sm rounded-full border border-gray-600"
              >
                {type}
              </span>
            ))}
          </div>

          <p className="text-sm text-gray-400">
            Tamaño máximo: {maxFileSize}MB
          </p>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleInputChange}
            className="hidden"
            accept="*/*"
          />
        </div>

        {/* Selected File */}
        {selectedFile && (
          <div className="mt-6 p-6 bg-gray-700 rounded-xl border border-gray-600 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-lg bg-linear-to-br from-green-500 to-green-600 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-white">{selectedFile.name}</h4>
                  <p className="text-sm text-gray-300">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFile(null);
                    setError('');
                    setMessage('');
                  }}
                  className="p-2 text-gray-400 hover:text-gray-200 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Upload Button */}
        {selectedFile && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleUpload();
              }}
              disabled={isUploading}
              className={cn(
                'px-8 py-3 rounded-xl font-medium text-white transition-all duration-200',
                'bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
                'shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed',
                'disabled:hover:from-blue-500 disabled:hover:to-blue-600'
              )}
            >
              {isUploading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Subiendo...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <span>Subir Archivo</span>
                </div>
              )}
            </button>
          </div>
        )}

        {/* Messages */}
        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          </div>
        )}

        {message && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-green-700 font-medium">{message}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};