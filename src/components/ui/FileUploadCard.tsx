import React, { useState, useCallback, useRef, useEffect } from 'react';
import { cn } from '../../utils';
import { useDragDrop } from '../../hooks/useDragDrop';
import { FilePreviewModal } from './FilePreviewModal';

interface FileUploadCardProps {
  title?: string;
  subtitle?: string;
  onFileSelect?: (file: File) => void;
  maxFileSize?: number; // en MB
  acceptedTypes?: string[];
  selectedFile?: File | null;
  setSelectedFile?: (file: File | null) => void;
  className?: string;
}

interface FilePreviewProps {
  file: File;
  fileUrl: string;
}

const FilePreview: React.FC<FilePreviewProps> = ({ file, fileUrl }) => {
  const fileType = file.type;
  const fileName = file.name;
  const fileExtension = fileName.split('.').pop()?.toLowerCase();

  // Renderizar según el tipo de archivo
  if (fileType.startsWith('image/')) {
    return (
      <div className="w-full h-full flex flex-col">
        <div className="flex-1 flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden">
          <img
            src={fileUrl}
            alt={fileName}
            className="max-w-full max-h-full object-contain"
          />
        </div>
        <div className="mt-2 text-center">
          <p className="text-sm font-medium text-gray-900 truncate">{fileName}</p>
          <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
        </div>
      </div>
    );
  }

  if (fileType.startsWith('video/')) {
    return (
      <div className="w-full h-full flex flex-col">
        <div className="flex-1 bg-gray-900 rounded-lg overflow-hidden">
          <video
            src={fileUrl}
            controls
            className="w-full h-full object-contain"
            preload="metadata"
          >
            Tu navegador no soporta el elemento video.
          </video>
        </div>
        <div className="mt-2 text-center">
          <p className="text-sm font-medium text-gray-900 truncate">{fileName}</p>
          <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
        </div>
      </div>
    );
  }

  if (fileType === 'application/pdf' || fileExtension === 'pdf') {
    return (
      <div className="w-full h-full flex flex-col">
        <div className="flex-1 bg-gray-100 rounded-lg overflow-hidden">
          <embed
            src={fileUrl}
            type="application/pdf"
            className="w-full h-full min-h-[400px]"
          />
        </div>
        <div className="mt-2 text-center">
          <p className="text-sm font-medium text-gray-900 truncate">{fileName}</p>
          <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
        </div>
      </div>
    );
  }

  // Para otros tipos de archivo, mostrar información y un ícono
  const getFileIcon = () => {
    if (fileType.startsWith('text/') || ['txt', 'md', 'json'].includes(fileExtension || '')) {
      return '📄';
    }
    if (['doc', 'docx'].includes(fileExtension || '')) {
      return '📝';
    }
    if (['xls', 'xlsx', 'csv'].includes(fileExtension || '')) {
      return '📊';
    }
    if (['ppt', 'pptx'].includes(fileExtension || '')) {
      return '📋';
    }
    if (['zip', 'rar', '7z'].includes(fileExtension || '')) {
      return '🗜️';
    }
    if (fileType.startsWith('audio/')) {
      return '🎵';
    }
    return '📁';
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 rounded-lg p-6">
      <div className="text-6xl mb-4">
        {getFileIcon()}
      </div>
      <div className="text-center">
        <p className="text-lg font-medium text-gray-900 mb-2">{fileName}</p>
        <p className="text-sm text-gray-500 mb-1">
          Tipo: {fileType || 'Desconocido'}
        </p>
        <p className="text-sm text-gray-500">
          Tamaño: {(file.size / 1024 / 1024).toFixed(2)} MB
        </p>
      </div>
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-400">
          Vista previa no disponible para este tipo de archivo
        </p>
      </div>
    </div>
  );
};

const FileDropZone: React.FC<{
  onFileSelect: (file: File) => void;
  isDragActive: boolean;
  onDragEnter: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onClick: () => void;
}> = ({ isDragActive, onDragEnter, onDragLeave, onDragOver, onDrop, onClick }) => {
  return (
    <div
      className={cn(
        'relative w-full h-full min-h-[400px] border-2 border-dashed rounded-lg transition-all duration-300 cursor-pointer',
        'flex flex-col items-center justify-center p-6',
        isDragActive
          ? 'border-blue-500 bg-blue-50 scale-105 shadow-lg'
          : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
      )}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onClick={onClick}
    >
      <div className={cn(
        'text-6xl mb-4 transition-transform duration-300',
        isDragActive ? 'scale-110' : 'scale-100'
      )}>
        📁
      </div>
      
      <div className="text-center">
        <p className={cn(
          'text-lg font-medium mb-2 transition-colors',
          isDragActive ? 'text-blue-600' : 'text-gray-900'
        )}>
          {isDragActive ? 'Suelta el archivo aquí' : 'Arrastra tu archivo aquí'}
        </p>
        <p className="text-sm text-gray-500 mb-4">
          o haz clic para seleccionar
        </p>
        
        <div className="text-xs text-gray-400 space-y-1">
          <p>Formatos soportados:</p>
          <p>📷 Imágenes: JPG, PNG, GIF, WEBP</p>
          <p>🎥 Videos: MP4, WebM, OGV</p>
          <p>📄 PDF y documentos</p>
        </div>
      </div>

      {/* Efecto de pulso en el borde cuando está activo */}
      {isDragActive && (
        <div className="absolute inset-0 border-2 border-blue-400 rounded-lg animate-pulse opacity-50" />
      )}
    </div>
  );
};

export const FileUploadCard: React.FC<FileUploadCardProps> = ({
  title = "Files App - Gestor de Archivos",
  subtitle = "Arrastra y suelta tus archivos para una vista previa instantánea",
  onFileSelect,
  maxFileSize = 50, // 50MB por defecto
  acceptedTypes = [
    'image/*',
    'video/*',
    'application/pdf',
    'text/*',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ],
  selectedFile = null,
  setSelectedFile = () => {},
  className,
}) => {
  //const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sincronizar la URL del archivo cuando selectedFile cambie desde props externas
  useEffect(() => {
    if (selectedFile && !fileUrl) {
      // Si hay un archivo seleccionado pero no hay URL, crear una nueva
      const url = URL.createObjectURL(selectedFile);
      setFileUrl(url);
      setError('');
    } else if (!selectedFile && fileUrl) {
      // Si no hay archivo pero sí hay URL, limpiar la URL
      URL.revokeObjectURL(fileUrl);
      setFileUrl('');
    }

    // Cleanup: revocar URL al desmontar o cambiar archivo
    return () => {
      if (fileUrl) {
        URL.revokeObjectURL(fileUrl);
      }
    };
  }, [selectedFile]); // Solo depende de selectedFile

  // Usar el hook de drag & drop
  const { isDragActive, dragHandlers, handleFileSelection } = useDragDrop({
    onFileSelect: (file) => {
      // Limpiar URL anterior
      if (fileUrl) {
        URL.revokeObjectURL(fileUrl);
      }

      // Crear nueva URL para el archivo
      const url = URL.createObjectURL(file);
      setSelectedFile(file);
      setFileUrl(url);
      setError('');
      
      onFileSelect?.(file);
    },
    maxFileSize,
    acceptedTypes,
    onError: setError
  });

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelection(files[0]);
    }
  };

  const handleClearFile = () => {
    if (fileUrl) {
      URL.revokeObjectURL(fileUrl);
    }
    setSelectedFile(null);
    setFileUrl('');
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleOpenModal = () => {
    if (selectedFile && fileUrl) {
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Cleanup al desmontar el componente
  React.useEffect(() => {
    return () => {
      if (fileUrl) {
        URL.revokeObjectURL(fileUrl);
      }
    };
  }, [fileUrl]);

  return (
    <div 
      className={cn(
        'bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden',
        'transition-all duration-300 hover:shadow-2xl',
        isDragActive && 'ring-2 ring-blue-500 ring-offset-2 bg-blue-50',
        className
      )}
      {...dragHandlers}
    >
      {/* Header */}
      <div className="bg-linear-to-r from-blue-600 to-indigo-600 px-6 py-4 text-white">
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="text-blue-100 mt-1">{subtitle}</p>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Error Message */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 flex items-center">
            <span className="text-red-500 text-lg mr-2">⚠️</span>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Grid de 2 columnas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          {/* Zona de Drop */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                📤 Subir Archivo
              </h3>
              {selectedFile && (
                <button
                  onClick={handleClearFile}
                  className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
                >
                  🗑️ Limpiar
                </button>
              )}
            </div>
            
            <div className="min-h-[400px]">
              <FileDropZone
                onFileSelect={handleFileSelection}
                isDragActive={isDragActive}
                onDragEnter={dragHandlers.onDragEnter}
                onDragLeave={dragHandlers.onDragLeave}
                onDragOver={dragHandlers.onDragOver}
                onDrop={dragHandlers.onDrop}
                onClick={() => fileInputRef.current?.click()}
              />
            </div>
          </div>

          {/* Vista Previa */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              👁️ Vista Previa
            </h3>
            
            <div 
              className={cn(
                "w-full min-h-[400px] bg-gray-50 rounded-lg border-2 border-gray-200 overflow-hidden transition-all",
                selectedFile && fileUrl && "cursor-pointer hover:border-blue-300 hover:shadow-md"
              )}
              onClick={handleOpenModal}
            >
              {selectedFile && fileUrl ? (
                <div className="relative group h-full">
                  <FilePreview file={selectedFile} fileUrl={fileUrl} />
                  {/* Overlay de click */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-full p-3">
                      <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                      </svg>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full min-h-[400px] flex flex-col items-center justify-center p-6">
                  <div className="text-6xl mb-4 opacity-30">👁️</div>
                  <p className="text-gray-500 text-center">
                    Selecciona un archivo para ver la vista previa
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Input file oculto */}
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileInputChange}
          accept={acceptedTypes.join(',')}
          className="hidden"
        />

        {/* Modal de vista previa */}
        <FilePreviewModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          file={selectedFile}
          fileUrl={fileUrl}
        />
      </div>
    </div>
  );
};