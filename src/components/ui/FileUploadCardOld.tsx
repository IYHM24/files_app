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
      console.log('Iniciando upload de:', selectedFile.name);
      
      const result = await FileUploadService.uploadFile(selectedFile);
      
      console.log('Resultado del upload:', result);

      if (result.success) {
        setMessage(`✅ Archivo "${result.filename}" subido exitosamente!`);
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        // Llamar callback para notificar upload exitoso
        if (onFileUploaded) {
          onFileUploaded();
        }
      } else {
        setError(`❌ Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error en upload:', error);
      setError(`❌ Error inesperado: ${error instanceof Error ? error.message : 'Unknown'}`);
    } finally {
      setIsUploading(false);
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setMessage('');
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={cn(
      'bg-white rounded-xl shadow-lg border border-gray-200 p-6',
      className
    )}>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-600">{subtitle}</p>
      </div>

      {/* Messages */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {message && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
          {message}
        </div>
      )}

      {/* File Input */}
      <div className="mb-4">
        <label htmlFor="fileInput" className="block text-sm font-medium text-gray-700 mb-2">
          Seleccionar archivo
        </label>
        <input
          ref={fileInputRef}
          type="file"
          id="fileInput"
          onChange={handleFileSelect}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>

      {/* Selected File Info */}
      {selectedFile && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-1">Archivo seleccionado:</h4>
          <p className="text-sm text-gray-600">Nombre: {selectedFile.name}</p>
          <p className="text-sm text-gray-600">
            Tamaño: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
          </p>
          <p className="text-sm text-gray-600">Tipo: {selectedFile.type}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleUpload}
          disabled={!selectedFile || isUploading}
          className={cn(
            'px-4 py-2 rounded-lg font-medium transition-colors',
            selectedFile && !isUploading
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          )}
        >
          {isUploading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Subiendo...
            </span>
          ) : (
            'Subir Archivo'
          )}
        </button>

        {selectedFile && (
          <button
            onClick={clearSelection}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
        )}
      </div>

      {/* Debug info */}
      <div className="mt-4 text-xs text-gray-400 border-t pt-4">
        <p>Debug: Servidor en puerto 3001</p>
        <p>Upload endpoint: /api/files/upload</p>
        <p>Max file size: {maxFileSize}MB</p>
      </div>
    </div>
  );
};