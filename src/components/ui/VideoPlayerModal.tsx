import React, { useRef, useEffect } from 'react';
import { cn } from '../../utils';

interface VideoPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  videoTitle: string;
  className?: string;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({
  isOpen,
  onClose,
  videoUrl,
  videoTitle,
  className
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Cerrar modal con ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Pausar video cuando se cierre el modal
  useEffect(() => {
    if (!isOpen && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className={cn(
          'relative max-w-4xl w-full mx-4 bg-black rounded-lg shadow-2xl overflow-hidden',
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header del modal */}
        <div className="flex items-center justify-between p-4 bg-gray-900 border-b border-gray-700">
          <h3 className="text-lg font-medium text-white truncate">
            {videoTitle}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1"
            aria-label="Cerrar modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Video player */}
        <div className="relative aspect-video bg-black">
          <video
            ref={videoRef}
            src={videoUrl}
            controls
            autoPlay
            preload="metadata"
            className="w-full h-full object-contain"
            onLoadedData={() => {
              // Video cargado, se puede reproducir
              console.log('Video cargado:', videoTitle);
            }}
            onError={(e) => {
              console.error('Error cargando video:', e);
            }}
            onLoadStart={() => {
              console.log('Iniciando carga del video:', videoTitle);
            }}
          >
            Tu navegador no soporta la reproducción de video.
          </video>
        </div>

        {/* Footer del modal (opcional) */}
        <div className="p-4 bg-gray-900 border-t border-gray-700 text-center">
          <p className="text-sm text-gray-400">
            Presiona <kbd className="px-2 py-1 bg-gray-700 rounded text-white">ESC</kbd> o haz click fuera del video para cerrar
          </p>
        </div>
      </div>
    </div>
  );
};