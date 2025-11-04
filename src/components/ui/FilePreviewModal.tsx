import React from 'react';
import { Modal } from './Modal';

interface FilePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  file: File | null;
  fileUrl: string | null;
}

export const FilePreviewModal: React.FC<FilePreviewModalProps> = ({
  isOpen,
  onClose,
  file,
  fileUrl
}) => {
  if (!file || !fileUrl) return null;

  const fileType = file.type;
  const fileName = file.name;
  const fileExtension = fileName.split('.').pop()?.toLowerCase();

  const renderPreviewContent = () => {
    // Imágenes
    if (fileType.startsWith('image/')) {
      return (
        <div className="flex items-center justify-center min-h-[60vh] bg-gray-900 p-4">
          <img
            src={fileUrl}
            alt={fileName}
            className="max-w-full max-h-full object-contain rounded-lg"
            style={{ maxHeight: '80vh' }}
          />
        </div>
      );
    }

    // Videos
    if (fileType.startsWith('video/')) {
      return (
        <div className="flex items-center justify-center min-h-[60vh] bg-gray-900 p-4">
          <video
            src={fileUrl}
            controls
            className="max-w-full max-h-full rounded-lg"
            style={{ maxHeight: '80vh' }}
            autoPlay={false}
          >
            Tu navegador no soporta la reproducción de video.
          </video>
        </div>
      );
    }

    // PDFs
    if (fileType === 'application/pdf') {
      return (
        <div className="w-full h-[80vh]">
          <iframe
            src={fileUrl}
            className="w-full h-full border-0 rounded-lg"
            title={`Vista previa de ${fileName}`}
          />
        </div>
      );
    }

    // Audio
    if (fileType.startsWith('audio/')) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[40vh] bg-linear-to-br from-purple-50 to-blue-50 p-8">
          <div className="text-8xl mb-6">🎵</div>
          <audio
            src={fileUrl}
            controls
            className="w-full max-w-md mb-6"
          >
            Tu navegador no soporta la reproducción de audio.
          </audio>
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{fileName}</h3>
            <p className="text-sm text-gray-600">
              Tamaño: {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        </div>
      );
    }

    // Otros tipos de archivo
    const getFileIcon = () => {
      if (fileType.startsWith('text/')) return '📄';
      if (['doc', 'docx'].includes(fileExtension || '')) return '📝';
      if (['xls', 'xlsx', 'csv'].includes(fileExtension || '')) return '📊';
      if (['ppt', 'pptx'].includes(fileExtension || '')) return '📋';
      if (['zip', 'rar', '7z'].includes(fileExtension || '')) return '🗜️';
      return '📁';
    };

    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gray-50 p-8">
        <div className="text-8xl mb-6">{getFileIcon()}</div>
        <div className="text-center max-w-md">
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">{fileName}</h3>
          <div className="space-y-2 text-gray-600">
            <p><span className="font-medium">Tipo:</span> {fileType || 'Desconocido'}</p>
            <p><span className="font-medium">Tamaño:</span> {(file.size / 1024 / 1024).toFixed(2)} MB</p>
            <p><span className="font-medium">Extensión:</span> .{fileExtension}</p>
          </div>
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              ℹ️ Vista previa no disponible para este tipo de archivo
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Vista Previa - ${fileName}`}
      size="xl"
    >
      {renderPreviewContent()}
      
      {/* Info adicional en el footer */}
      <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Archivo: {fileName}</span>
          <span>Tamaño: {(file.size / 1024 / 1024).toFixed(2)} MB</span>
        </div>
      </div>
    </Modal>
  );
};