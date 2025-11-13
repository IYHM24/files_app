import React, { useState, useRef } from 'react';

interface ImagePreviewProps {
  src: string;
  alt: string;
  className?: string;
  fallbackText?: string;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({
  src,
  alt,
  className = "",
  fallbackText = "Vista previa"
}) => {
  const [loadMethod, setLoadMethod] = useState<'img' | 'iframe' | 'link'>('img');
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleImageError = () => {
    console.log('Imagen falló, intentando con iframe...');
    setHasError(true);
    setLoadMethod('iframe');
  };

  const handleImageLoad = () => {
    console.log('Imagen cargó exitosamente');
    setIsLoaded(true);
    setHasError(false);
  };

  const handleIframeError = () => {
    console.log('Iframe falló, usando enlace directo...');
    setLoadMethod('link');
  };

  if (loadMethod === 'img') {
    return (
      <div className={`relative ${className}`}>
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-green-50 to-green-100">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin mb-2"></div>
              <p className="text-xs text-gray-600">Cargando...</p>
            </div>
          </div>
        )}
        
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={handleImageLoad}
          onError={handleImageError}
          loading="lazy"
        />
      </div>
    );
  }

  if (loadMethod === 'iframe') {
    return (
      <div className={`relative ${className}`}>
        <iframe
          src={src}
          className="w-full h-full border-0"
          onLoad={() => console.log('Iframe cargado')}
          onError={handleIframeError}
          title={alt}
          sandbox="allow-same-origin"
        />
        <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
          Vista previa
        </div>
      </div>
    );
  }

  // Fallback: enlace directo
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-blue-50 to-blue-100">
        <div className="text-center p-4">
          <div className="text-4xl mb-3">🖼️</div>
          <p className="text-sm font-medium text-gray-700 mb-3">{fallbackText}</p>
          <a
            href={src}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            Ver imagen completa
          </a>
          <p className="text-xs text-gray-500 mt-2">{alt}</p>
        </div>
      </div>
    </div>
  );
};