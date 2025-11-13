import React, { useState } from 'react';
import { cn } from '../../utils';

interface ImageThumbnailProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}

export const ImageThumbnail: React.FC<ImageThumbnailProps> = ({
  src,
  alt,
  className,
  width = 200,
  height = 200,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleImageLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  if (hasError) {
    return (
      <div 
        className={cn(
          "flex items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg",
          className
        )}
        style={{ width, height }}
      >
        <div className="text-center">
          <div className="text-2xl mb-2">🖼️</div>
          <div className="text-xs text-gray-500">Error al cargar</div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={cn("relative overflow-hidden rounded-lg", className)}
      style={{ width, height }}
    >
      {isLoading && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-gray-200 animate-pulse"
        >
          <div className="text-center">
            <div className="text-2xl mb-2">📷</div>
            <div className="text-xs text-gray-500">Cargando...</div>
          </div>
        </div>
      )}
      
      <img
        src={src}
        alt={alt}
        onLoad={handleImageLoad}
        onError={handleImageError}
        className={cn(
          "w-full h-full object-cover transition-opacity duration-200",
          isLoading ? "opacity-0" : "opacity-100"
        )}
        style={{ 
          width, 
          height,
          objectFit: 'cover',
          objectPosition: 'center'
        }}
        loading="lazy"
      />
    </div>
  );
};