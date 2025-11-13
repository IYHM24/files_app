import React, { useState, useEffect } from 'react';
import { cn } from '../../utils';
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
            <p className="text-xs text-gray-400 mt-4">
              Debug: activeTab = "{activeTab}"
            </p>
          </div>
        );
    }
  };

  return (
    <div className={cn('w-full', className)}>
      {/* Tabs Header */}
      <div className="border-b border-gray-200 bg-white">
        <nav className="flex space-x-8 px-6" aria-label="Tabs">
          {/* Tab de carga */}
          <button
            onClick={() => setActiveTab('upload')}
            className={cn(
              'py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap',
              activeTab === 'upload'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            )}
          >
            <span className="inline-flex items-center space-x-2">
              <span>📤</span>
              <span>Cargar Archivos</span>
            </span>
          </button>

          {/* Tabs dinámicas */}
          {availableTabs.map((fileType) => {
            const tabKey = getTabKey(fileType);
            return (
              <button
                key={tabKey}
                onClick={() => setActiveTab(tabKey)}
                className={cn(
                  'py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap',
                  activeTab === tabKey
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                )}
              >
                <span className="inline-flex items-center space-x-2">
                  <span>{fileType.icon}</span>
                  <span>{fileType.name}</span>
                  <span className="inline-flex items-center justify-center w-5 h-5 ml-1 text-xs font-bold text-white bg-blue-500 rounded-full">
                    {fileType.count}
                  </span>
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-gray-50 min-h-screen">
        {renderTabContent()}
      </div>

      {/* Stats Bar */}
      <div className="border-t border-gray-200 bg-white px-6 py-3">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <span>Total de archivos:</span>
            <div className="flex space-x-3">
              {Object.entries(fileCounts).map(([type, count]) => (
                <span key={type} className="inline-flex items-center space-x-1">
                  <span>{fileTypes[type]?.icon}</span>
                  <span className="font-medium">{count}</span>
                </span>
              ))}
            </div>
          </div>
          <button
            onClick={loadFileCounts}
            className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-700"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Actualizar</span>
          </button>
        </div>
      </div>
    </div>
  );
};