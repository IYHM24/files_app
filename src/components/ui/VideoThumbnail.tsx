import React, { useState, useRef, useEffect } from 'react';

interface VideoThumbnailProps {
  videoUrl: string;
  videoName: string;
  className?: string;
}

export const VideoThumbnail: React.FC<VideoThumbnailProps> = ({ 
  videoUrl, 
  videoName, 
  className = "" 
}) => {
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateThumbnail = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (!video || !canvas) return;

    try {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Establecer dimensiones del canvas
      canvas.width = 320;
      canvas.height = 180;

      // Dibujar el frame del video en el canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convertir canvas a blob URL
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          setThumbnailUrl(url);
        }
        setIsLoading(false);
      }, 'image/jpeg', 0.7);
    } catch (error) {
      console.warn('Error generando thumbnail:', error);
      setHasError(true);
      setIsLoading(false);
    }
  };

  const handleVideoLoad = () => {
    const video = videoRef.current;
    if (!video) return;

    // Buscar un frame a los 2 segundos o 10% del video
    const seekTime = Math.min(2, video.duration * 0.1);
    video.currentTime = seekTime;
  };

  const handleVideoSeeked = () => {
    generateThumbnail();
  };

  const handleVideoError = () => {
    console.warn('Error cargando video para thumbnail:', videoName);
    setHasError(true);
    setIsLoading(false);
  };

  useEffect(() => {
    return () => {
      // Limpiar blob URL cuando el componente se desmonta
      if (thumbnailUrl) {
        URL.revokeObjectURL(thumbnailUrl);
      }
    };
  }, [thumbnailUrl]);

  const getVideoTypeIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'mp4':
        return '🎬';
      case 'avi':
        return '🎞️';
      case 'mov':
        return '🎥';
      case 'wmv':
        return '📹';
      case 'mkv':
        return '🎦';
      default:
        return '🎬';
    }
  };

  if (hasError) {
    return (
      <div className={`relative aspect-video bg-gradient-to-br from-gray-800 to-gray-700 rounded-t-lg overflow-hidden ${className}`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-2">
              {getVideoTypeIcon(videoName)}
            </div>
            <div className="w-16 h-16 bg-gray-900 bg-opacity-90 rounded-full flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-all duration-200 shadow-lg">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative aspect-video bg-gradient-to-br from-gray-800 to-gray-700 rounded-t-lg overflow-hidden ${className}`}>
      {/* Video oculto para generar thumbnail */}
      <video
        ref={videoRef}
        src={videoUrl}
        onLoadedData={handleVideoLoad}
        onSeeked={handleVideoSeeked}
        onError={handleVideoError}
        preload="metadata"
        muted
        style={{ display: 'none' }}
        crossOrigin="anonymous"
      />
      
      {/* Canvas oculto para generar thumbnail */}
      <canvas
        ref={canvasRef}
        style={{ display: 'none' }}
      />

      {/* Thumbnail generado o loading */}
      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-2"></div>
            <p className="text-xs text-gray-300">Generando vista previa...</p>
          </div>
        </div>
      ) : thumbnailUrl ? (
        <div className="absolute inset-0">
          <img
            src={thumbnailUrl}
            alt={`Thumbnail de ${videoName}`}
            className="w-full h-full object-cover"
          />
          {/* Overlay con botón de play */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-black bg-opacity-50 rounded-full flex items-center justify-center group-hover:bg-blue-500 group-hover:bg-opacity-80 transition-all duration-200">
              <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </div>
        </div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-2">
              {getVideoTypeIcon(videoName)}
            </div>
            <div className="w-16 h-16 bg-gray-900 bg-opacity-90 rounded-full flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-all duration-200 shadow-lg">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};