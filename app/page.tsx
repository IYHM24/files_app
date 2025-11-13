'use client';

import { useEffect, useState } from 'react';
import { Button, FileUploadCard } from '../src/components/ui';
import { useUsers } from '../src/hooks';
import { FileUploadService } from '@/services/FileUploadService';

const navigation = [
  { name: 'Dashboard', href: '/' },
  { name: 'Files', href: '/files' },
  { name: 'Users', href: '/users' },
];

// Icons para las cards
const FileIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
  </svg>
);

export default function Home() {
  // 
  const { users, loading, error } = useUsers();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  
  //
  useEffect(() => {
    console.log('Archivo seleccionado en Home:', selectedFile);
  }, [selectedFile]);

  // Función para cargar la lista de archivos subidos
  const loadUploadedFiles = async () => {
    try {
      const response = await fetch('/api/files/list');
      const result = await response.json();
      
      if (result.success) {
        setUploadedFiles(result.files);
      }
    } catch (error) {
      console.error('Error cargando archivos:', error);
    }
  };

  // Cargar archivos al iniciar
  useEffect(() => {
    loadUploadedFiles();
  }, []);

  // Función para seleccionar archivo (sin subirlo inmediatamente)
  const handleFileSelect = (file: File) => {
    console.log('Archivo seleccionado para subir:', file);
    setSelectedFile(file);
  };

  // Función para subir el archivo seleccionado
  const handleUploadFile = async () => {
    if (!selectedFile) {
      alert('No hay archivo seleccionado');
      return;
    }

    setIsUploading(true);
    
    try {
      // Validar el archivo antes de subirlo
      const validation = FileUploadService.validateFile(selectedFile, {
        maxSize: 50 * 1024 * 1024, // 50MB
        allowedTypes: FileUploadService.getSupportedTypes(),
      });

      if (!validation.isValid) {
        alert(validation.error);
        return;
      }

      // Subir el archivo usando la API
      const result = await FileUploadService.uploadFile(selectedFile);

      if (result.success) {
        console.log('Archivo subido exitosamente:', result);
        alert(`Archivo "${result.filename}" subido exitosamente!\n\nURL: ${window.location.origin}${result.publicUrl}`);
        setSelectedFile(null); // Limpiar selección después del upload
        loadUploadedFiles(); // Recargar lista de archivos
      } else {
        console.error('Error subiendo archivo:', result.error);
        alert(`Error subiendo archivo: ${result.error}`);
      }
    } catch (error) {
      console.error('Error inesperado:', error);
      alert('Error inesperado subiendo el archivo');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    
      <div className="space-y-8">

        {/* File Upload and Preview Section */}
        <FileUploadCard
          title="📁 Gestión de Archivos"
          subtitle={`Sube y previsualiza tus archivos. Formatos soportados: ${FileUploadService.getFriendlyTypeNames()}`}
          onFileSelect={handleFileSelect}
          selectedFile={selectedFile}
          setSelectedFile={setSelectedFile}
          maxFileSize={100} // 100MB
        />

        {/* Información del archivo seleccionado */}
        {selectedFile && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">📄 Archivo Seleccionado</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-600">Nombre:</span>
                <p className="text-gray-900 truncate" title={selectedFile.name}>{selectedFile.name}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Tamaño:</span>
                <p className="text-gray-900">{FileUploadService.formatFileSize(selectedFile.size)}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Tipo:</span>
                <p className="text-gray-900">{selectedFile.type || 'Desconocido'}</p>
              </div>
            </div>
            <div className="mt-3 flex items-center text-sm text-blue-600">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Archivo listo para subir. Haz click en "Subir archivo" para continuar.
            </div>
          </div>
        )}

        <div className='flex justify-end gap-5'>
          <Button 
            onClick={selectedFile ? handleUploadFile : () => alert('Primero selecciona un archivo')}
            disabled={isUploading}
            className={`space-x-2 transition-all duration-200 ${
              selectedFile 
                ? 'bg-green-600 hover:bg-green-700 text-white' 
                : 'bg-gray-400 hover:bg-gray-500 text-white'
            }`}
          >
            <span>
              {isUploading 
                ? 'Subiendo...' 
                : selectedFile 
                  ? `Subir "${selectedFile.name}"` 
                  : 'Selecciona un archivo primero'
              }
            </span>
            <div>
              {isUploading ? (
                <svg className="animate-spin w-6 h-6" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <FileIcon />
              )}
            </div>
          </Button>
          
          {selectedFile && (
            <Button 
              onClick={() => setSelectedFile(null)}
              variant="outline"
              className='space-x-2 border-red-300 text-red-600 hover:bg-red-50'
            >
              <span>Cancelar</span>
              <div>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </div>
            </Button>
          )}
        </div>

        {/* Lista de archivos subidos */}
        {uploadedFiles.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">📂 Archivos Subidos</h3>
              <Button 
                onClick={loadUploadedFiles}
                variant="outline"
                className="text-sm"
              >
                🔄 Actualizar
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {uploadedFiles.map((dir, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">📁 {dir.name}</h4>
                  {dir.files && dir.files.map((file: any, fileIndex: number) => (
                    <div key={fileIndex} className="text-sm text-gray-600 mb-2 p-2 bg-gray-50 rounded">
                      <p className="font-medium truncate">{file.name}</p>
                      <p className="text-xs">
                        {FileUploadService.formatFileSize(file.size)} - 
                        {new Date(file.modified).toLocaleDateString()}
                      </p>
                      <a 
                        href={file.publicUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-xs"
                      >
                        🔗 Ver archivo
                      </a>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
  );
}
