import React, { useState, useEffect } from 'react';
import { cn } from '../../utils';
import { DEBUG } from '../../config/debug';
import { VideoPlayerModal } from './VideoPlayerModal';
import { VideoThumbnail } from './VideoThumbnail';
import { DebugInfo } from './DebugInfo';

interface Video {
  name: string;
  size: number;
  modified: string;
  path: string;
  publicUrl: string;
  serveUrl?: string;
}

interface VideoLibraryProps {
  className?: string;
}

export const VideoLibrary: React.FC<VideoLibraryProps> = ({ className }) => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadVideos();
  }, []);

  // Filtrar videos
  const filteredVideos = videos.filter(video =>
    video.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleVideoClick = (video: Video) => {
    setSelectedVideo(video);
  };

  const closeModal = () => {
    setSelectedVideo(null);
  };

  const loadVideos = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Cargando videos...');
      
      const response = await fetch('/api/files/list');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('Respuesta de la API:', result);
      
      if (!result.success) {
        console.warn('API retornó error:', result.error);
        setVideos([]);
        return;
      }

      // Filtrar solo archivos de video
      const videoList: Video[] = [];
      const videoExtensions = ['mp4', 'avi', 'mov', 'wmv', 'mkv', 'flv', 'webm'];
      
      for (const dir of result.files || []) {
        if (dir.files && dir.files.length > 0) {
          for (const file of dir.files) {
            const extension = file.name.split('.').pop()?.toLowerCase();
            if (extension && videoExtensions.includes(extension)) {
              videoList.push({
                name: file.name,
                size: file.size,
                modified: file.modified,
                path: file.path,
                publicUrl: file.publicUrl,
                serveUrl: `/api/files/serve/${dir.name}/${encodeURIComponent(file.name)}`
              });
            }
          }
        }
      }
      
      console.log('Directorios encontrados:', result.files?.map((d: any) => d.name));
      console.log('Videos encontrados:', videoList.length);
      setVideos(videoList);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError('No se pudo cargar la biblioteca de videos: ' + errorMessage);
      console.warn('Error cargando videos:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={cn('p-6 text-center', className)}>
        <div className="inline-flex items-center space-x-2">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-600">Cargando biblioteca de videos...</span>
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
          <p className="text-sm mt-2 text-gray-500">Esto es normal si no has subido videos aún</p>
        </div>
        <button
          onClick={loadVideos}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className={cn('p-6', className)}>
      {/* Header con controles */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-white">Biblioteca de Videos</h2>
          <p className="text-gray-300 mt-1">
            {filteredVideos.length} {filteredVideos.length === 1 ? 'video' : 'videos'} encontrados
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Búsqueda */}
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar videos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-700 text-white placeholder-gray-400"
            />
            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Refresh */}
          <button
            onClick={loadVideos}
            className="p-2 border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors"
            title="Actualizar biblioteca"
          >
            <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      {/* Grid de videos */}
      {filteredVideos.length === 0 ? (
        <div className="text-center py-12">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <h3 className="text-lg font-medium text-white mb-2">No se encontraron videos</h3>
          <p className="text-gray-400 mb-6">
            {searchTerm ? 'Prueba con otros términos de búsqueda' : 'Sube algunos videos desde el tab "Cargar Archivos" para comenzar'}
          </p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Limpiar búsqueda
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredVideos.map((video) => (
            <VideoCard
              key={video.path}
              video={video}
              onClick={() => handleVideoClick(video)}
            />
          ))}
        </div>
      )}

      {/* Modal de video */}
      {selectedVideo && (
        <VideoPlayerModal
          isOpen={!!selectedVideo}
          onClose={closeModal}
          videoUrl={selectedVideo.publicUrl}
          videoTitle={selectedVideo.name}
        />
      )}

      {/* Debug info */}
      <DebugInfo
        info={[
          { label: 'Estado', value: loading ? 'Cargando' : error ? 'Error' : 'Cargado' },
          { label: 'Videos encontrados', value: videos.length },
          { label: 'Videos filtrados', value: filteredVideos.length },
          { label: 'Término de búsqueda', value: `"${searchTerm}"` },
          { label: 'API endpoint', value: '/api/files/list' },
          { label: 'Última actualización', value: new Date().toLocaleTimeString() }
        ]}
        onReload={loadVideos}
        reloadLabel="Recargar Debug"
      />
    </div>
  );
};

// Componente VideoCard
interface VideoCardProps {
  video: Video;
  onClick: () => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, onClick }) => {
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

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer bg-gray-900 rounded-lg border border-gray-700 hover:border-blue-500 hover:shadow-lg transition-all duration-200"
    >
      {/* Thumbnail dinámico */}
      <VideoThumbnail 
        videoUrl={video.publicUrl}
        videoName={video.name}
        className=""
      />

      {/* Información del video */}
      <div className="p-4">
        <h3 className="font-medium text-white truncate group-hover:text-blue-400 transition-colors mb-2">
          {video.name}
        </h3>
        <div className="space-y-1 text-xs text-gray-400">
          <div className="flex items-center justify-between">
            <span>Tamaño:</span>
            <span className="font-medium">{formatFileSize(video.size)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Modificado:</span>
            <span className="font-medium">{new Date(video.modified).toLocaleDateString()}</span>
          </div>
        </div>
        
        {/* Botón de reproducir */}
        <div className="mt-3 pt-3 border-t border-gray-700">
          <div className="flex items-center justify-center text-blue-400 group-hover:text-blue-300 transition-colors">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
            <span className="text-sm font-medium">Reproducir</span>
          </div>
        </div>
      </div>
    </div>
  );
};