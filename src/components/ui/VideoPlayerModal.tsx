import React, { useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
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

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm animate-in fade-in duration-300"
      onClick={onClose}
      style={{ margin: 0, padding: 0, width: '100vw', height: '100vh', top: 0, left: 0, position: 'fixed' }}
    >
      <div
        ref={modalRef}
        className={cn(
          'relative w-[98vw] h-[98vh] bg-gray-900 rounded-xl shadow-2xl flex flex-col overflow-hidden border border-gray-700 animate-in zoom-in-95 duration-300',
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header del modal */}
        <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-800 border-b border-gray-700 rounded-t-lg shrink-0">
          <div className="flex items-center space-x-3 min-w-0 flex-1">
            <span className="text-2xl">🎬</span>
            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-medium text-white truncate">
                {videoTitle}
              </h3>
              <p className="text-sm text-gray-400">Video</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-300 hover:text-white transition-colors p-2 hover:bg-gray-700 rounded-lg shrink-0 ml-2"
            aria-label="Cerrar modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Video player */}
        <div className="relative flex-1 min-h-0 bg-black flex items-center justify-center">
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

        {/* Footer del modal */}
        <div className="p-3 sm:p-4 bg-gray-800 border-t border-gray-700 rounded-b-lg shrink-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
            <div className="text-sm text-gray-400">
              <span className="inline-flex items-center space-x-1">
                <span>🎬</span>
                <span>Video en reproducción</span>
              </span>
            </div>
            <div className="text-sm text-gray-500">
              Presiona <kbd className="px-2 py-1 bg-gray-700 rounded text-white">ESC</kbd> o haz click fuera del video para cerrar
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};