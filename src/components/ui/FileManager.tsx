import React, { useState, useEffect } from 'react';
import { cn } from '../../utils';
import { DEBUG } from '../../config/debug';
import { FileUploadCard } from './FileUploadCard';
import { VideoLibrary } from './VideoLibrary';
import { SimpleImageLibrary } from './SimpleImageLibrary';
import { PDFLibrary } from './PDFLibrary';

interface FileType {
  name: string;
  icon: string;
  count: number;
  extensions: string[];
}

interface FileManagerProps {
  className?: string;
}

export const FileManager: React.FC<FileManagerProps> = ({ className }) => {
  const [activeTab, setActiveTab] = useState<string>('upload');
  const [fileCounts, setFileCounts] = useState<Record<string, number>>({});
  const [availableTabs, setAvailableTabs] = useState<FileType[]>([]);

  // Definir tipos de archivo soportados
  const fileTypes: Record<string, FileType> = {
    video: {
      name: 'Videos',
      icon: '🎬',
      count: 0,
      extensions: ['mp4', 'avi', 'mov', 'wmv', 'mkv', 'flv', 'webm']
    },
    image: {
      name: 'Imágenes',
      icon: '🖼️',
      count: 0,
      extensions: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg']
    },
    pdf: {
      name: 'PDFs',
      icon: '📄',
      count: 0,
      extensions: ['pdf']
    },
    document: {
      name: 'Documentos',
      icon: '📝',
      count: 0,
      extensions: ['doc', 'docx', 'txt', 'rtf']
    },
    audio: {
      name: 'Audio',
      icon: '🎵',
      count: 0,
      extensions: ['mp3', 'wav', 'flac', 'aac', 'ogg']
    }
  };

  useEffect(() => {
    loadFileCounts();
  }, []);

  const loadFileCounts = async () => {
    try {
      const response = await fetch('/api/files/list');
      if (!response.ok) return;
      
      const result = await response.json();
      if (!result.success) return;

      const counts: Record<string, number> = {};
      const tabs: FileType[] = [];

      // Contar archivos por tipo
      for (const dir of result.files || []) {
        if (dir.files && dir.files.length > 0) {
          for (const file of dir.files) {
            const extension = file.name.split('.').pop()?.toLowerCase() || '';
            
            // Encontrar el tipo de archivo
            for (const [typeKey, typeInfo] of Object.entries(fileTypes)) {
              if (typeInfo.extensions.includes(extension)) {
                counts[typeKey] = (counts[typeKey] || 0) + 1;
                break;
              }
            }
          }
        }
      }

      // Crear pestañas solo para tipos que tienen archivos
      Object.entries(counts).forEach(([typeKey, count]) => {
        if (count > 0) {
          tabs.push({
            ...fileTypes[typeKey],
            count
          });
        }
      });

      setFileCounts(counts);
      setAvailableTabs(tabs);

      // Si no hay pestaña activa válida, seleccionar la primera disponible o upload
      if (activeTab !== 'upload' && !tabs.some(tab => getTabKey(tab) === activeTab)) {
        setActiveTab(tabs.length > 0 ? getTabKey(tabs[0]) : 'upload');
      }

    } catch (error) {
      console.warn('Error loading file counts:', error);
    }
  };

  const getTabKey = (fileType: FileType) => {
    return fileType.name.toLowerCase().replace(/[^a-z0-9]/g, '');
  };

  const handleFileUploaded = () => {
    // Recargar conteos después de subir archivo
    loadFileCounts();
  };

  const renderTabContent = () => {
    console.log('Active tab:', activeTab);
    console.log('Available tabs:', availableTabs.map(t => ({ name: t.name, key: getTabKey(t) })));
    
    switch (activeTab) {
      case 'upload':
        return <FileUploadCard onFileUploaded={handleFileUploaded} />;
      case 'videos':
        return <VideoLibrary />;
      case 'imgenes': // 'Imágenes' sin tilde después de getTabKey
        return <SimpleImageLibrary />;
      case 'pdfs':
        return <PDFLibrary />;
      default:
        // Si el tab no coincide exactamente, intentar con los nombres de archivo
        const currentTabType = availableTabs.find(tab => getTabKey(tab) === activeTab);
        if (currentTabType) {
          const typeName = currentTabType.name.toLowerCase();
          if (typeName.includes('video')) {
            return <VideoLibrary />;
          } else if (typeName.includes('imagen')) {
            return <SimpleImageLibrary />;
          } else if (typeName.includes('pdf')) {
            return <PDFLibrary />;
          }
        }
        return (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📁</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Biblioteca en desarrollo
            </h3>
            <p className="text-gray-500">
              Esta funcionalidad estará disponible pronto
            </p>
            {DEBUG && (
              <p className="text-xs text-gray-400 mt-4">
                Debug: activeTab = "{activeTab}"
              </p>
            )}
          </div>
        );
    }
  };

  return (
    <div className={cn('w-full min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900', className)}>
      {/* Header moderno */}
      <div className="bg-gray-800/90 backdrop-blur-xl border-b border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="py-6">
            <h1 className="text-3xl font-bold bg-linear-to-r from-white via-gray-100 to-white bg-clip-text text-transparent">
              Sistema de Gestión de Archivos
            </h1>
            <p className="text-gray-300 mt-2">Carga y gestiona tus archivos de forma segura y eficiente</p>
          </div>
          
          {/* Tabs modernos */}
          <nav className="flex space-x-1" aria-label="Tabs">
            {/* Tab de carga */}
            <button
              onClick={() => setActiveTab('upload')}
              className={cn(
                'group relative px-6 py-3 rounded-t-xl font-medium text-sm transition-all duration-200',
                'hover:bg-gray-700/80',
                activeTab === 'upload'
                  ? 'bg-gray-700 border-t-2 border-blue-400 text-blue-400 shadow-sm'
                  : 'text-gray-300 hover:text-white'
              )}
            >
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 rounded-lg bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <span className="text-white text-xs">📤</span>
                </div>
                <span>Cargar Archivos</span>
              </div>
              {activeTab === 'upload' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r from-blue-500 to-blue-600"></div>
              )}
            </button>

            {/* Tabs dinámicas modernas */}
            {availableTabs.map((fileType) => {
              const tabKey = getTabKey(fileType);
              const isActive = activeTab === tabKey;
              
              const iconColors: Record<string, string> = {
                'videos': 'from-purple-500 to-purple-600',
                'imgenes': 'from-green-500 to-green-600', 
                'pdfs': 'from-red-500 to-red-600',
                'documentos': 'from-orange-500 to-orange-600',
                'audio': 'from-pink-500 to-pink-600'
              };

              return (
                <button
                  key={tabKey}
                  onClick={() => setActiveTab(tabKey)}
                  className={cn(
                    'group relative px-6 py-3 rounded-t-xl font-medium text-sm transition-all duration-200',
                    'hover:bg-gray-700/80',
                    isActive
                      ? 'bg-gray-700 border-t-2 border-blue-400 text-blue-400 shadow-sm'
                      : 'text-gray-300 hover:text-white'
                  )}
                >
                  <div className="flex items-center space-x-2">
                    <div className={cn(
                      'w-5 h-5 rounded-lg bg-linear-to-br flex items-center justify-center',
                      iconColors[tabKey] || 'from-gray-500 to-gray-600'
                    )}>
                      <span className="text-white text-xs">{fileType.icon}</span>
                    </div>
                    <span>{fileType.name}</span>
                    <div className="ml-2 px-2 py-0.5 text-xs font-bold text-white bg-linear-to-r from-blue-500 to-blue-600 rounded-full">
                      {fileType.count}
                    </div>
                  </div>
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r from-blue-500 to-blue-600"></div>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-gray-800/60 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-600/50">
          {renderTabContent()}
        </div>
      </div>

      {/* Stats Bar moderno */}
      <div className="sticky bottom-0 bg-gray-800/90 backdrop-blur-xl border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <span className="text-sm font-medium text-gray-200">Total de archivos:</span>
              <div className="flex space-x-4">
                {Object.entries(fileCounts).map(([type, count]) => (
                  <div key={type} className="flex items-center space-x-2 px-3 py-1 bg-gray-700 rounded-lg border border-gray-600">
                    <div className="w-4 h-4 rounded bg-linear-to-br from-gray-500 to-gray-600 flex items-center justify-center">
                      <span className="text-white text-xs">{fileTypes[type]?.icon}</span>
                    </div>
                    <span className="font-medium text-gray-200">{count}</span>
                    <span className="text-xs text-gray-400">{fileTypes[type]?.name}</span>
                  </div>
                ))}
              </div>
            </div>
            <button
              onClick={loadFileCounts}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-linear-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Actualizar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};