import React, { useState, useEffect } from 'react';
import { cn } from '../../utils';
import { ImageModal } from './ImageModal';
import { ImageThumbnail } from './ImageThumbnail';

interface ImageFile {
  name: string;
  size: number;
  modified: string;
  path: string;
  publicUrl: string;
  serveUrl?: string;
}

interface SimpleImageLibraryProps {
  className?: string;
}

export const SimpleImageLibrary: React.FC<SimpleImageLibraryProps> = ({ className }) => {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<{ name: string; url: string; } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadImages();
  }, []);

  const filteredImages = images.filter(image =>
    image.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleImageClick = (image: ImageFile) => {
    setSelectedImage({
      name: image.name,
      url: image.publicUrl
    });
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const loadImages = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/files/list');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        console.warn('API retornó error:', result.error);
        setImages([]);
        return;
      }

      const imageList: ImageFile[] = [];
      const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'];
      
      for (const dir of result.files || []) {
        if (dir.files && dir.files.length > 0) {
          for (const file of dir.files) {
            const extension = file.name.split('.').pop()?.toLowerCase();
            if (extension && imageExtensions.includes(extension)) {
              imageList.push({
                name: file.name,
                size: file.size,
                modified: file.modified,
                path: file.path,
                publicUrl: `/storage/image/${file.name}`,
                serveUrl: `/storage/image/${file.name}`
              });
            }
          }
        }
      }
      
      console.log('Imágenes encontradas:', imageList.length);
      setImages(imageList);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError('No se pudo cargar la biblioteca de imágenes: ' + errorMessage);
      console.warn('Error cargando imágenes:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={cn('p-6 text-center', className)}>
        <div className="inline-flex items-center space-x-2">
          <div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-600">Cargando biblioteca de imágenes...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn('p-6 text-center', className)}>
        <div className="text-amber-600 mb-4">
          <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <p className="font-medium text-sm">{error}</p>
        </div>
        <button
          onClick={loadImages}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className={cn('p-6', className)}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Biblioteca de Imágenes</h2>
          <p className="text-gray-600 mt-1">
            {filteredImages.length} {filteredImages.length === 1 ? 'imagen' : 'imágenes'} encontradas
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar imágenes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <button
            onClick={loadImages}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      {filteredImages.length === 0 ? (
        <div className="text-center py-12">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron imágenes</h3>
          <p className="text-gray-500 mb-6">
            {searchTerm ? 'Prueba con otros términos de búsqueda' : 'Sube algunas imágenes desde el tab "Cargar Archivos" para comenzar'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredImages.map((image) => (
            <SimpleImageCard
              key={image.path}
              image={image}
              onClick={() => handleImageClick(image)}
            />
          ))}
        </div>
      )}

      {selectedImage && (
        <ImageModal
          isOpen={!!selectedImage}
          onClose={closeModal}
          imageUrl={selectedImage.url}
          imageName={selectedImage.name}
        />
      )}

      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-700 mb-2">URLs de prueba:</h4>
        <div className="space-y-2">
          {images.slice(0, 3).map((img, index) => (
            <div key={index} className="text-sm">
              <a href={img.publicUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                {img.name} → {img.publicUrl}
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

interface SimpleImageCardProps {
  image: ImageFile;
  onClick: () => void;
}

const SimpleImageCard: React.FC<SimpleImageCardProps> = ({ image, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="group cursor-pointer bg-white rounded-lg border border-gray-200 hover:border-green-300 hover:shadow-lg transition-all duration-200"
    >
      {/* Thumbnail real de la imagen */}
      <div className="relative aspect-square overflow-hidden rounded-t-lg">
        <ImageThumbnail
          src={image.publicUrl}
          alt={image.name}
          width={200}
          height={200}
          className="w-full h-full"
        />
        
        {/* Overlay al hacer hover */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="bg-white rounded-full p-2 shadow-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="p-3">
        <h3 className="font-medium text-gray-900 truncate text-sm">{image.name}</h3>
        <div className="mt-1 text-xs text-gray-500">
          <p>{(image.size / 1024).toFixed(1)} KB</p>
          <p>{new Date(image.modified).toLocaleDateString()}</p>
        </div>
        
        {/* Botón secundario para enlace directo */}
        <div className="mt-2">
          <a
            href={image.publicUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 text-xs rounded hover:bg-green-200 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Abrir
          </a>
        </div>
      </div>
    </div>
  );
};