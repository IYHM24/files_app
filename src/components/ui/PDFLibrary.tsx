import React, { useState, useEffect } from 'react';
import { cn } from '../../utils';
import { DEBUG } from '../../config/debug';
import { PDFModal } from './PDFModal';
import { DebugInfo } from './DebugInfo';

interface PDFFile {
  name: string;
  size: number;
  modified: string;
  path: string;
  publicUrl: string;
  serveUrl?: string;
}

interface PDFLibraryProps {
  className?: string;
}

export const PDFLibrary: React.FC<PDFLibraryProps> = ({ className }) => {
  const [pdfs, setPdfs] = useState<PDFFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPDF, setSelectedPDF] = useState<{ name: string; url: string; } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadPDFs();
  }, []);

  // Filtrar PDFs
  const filteredPDFs = pdfs.filter(pdf =>
    pdf.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePDFClick = (pdf: PDFFile) => {
    setSelectedPDF({
      name: pdf.name,
      url: pdf.publicUrl
    });
  };

  const closeModal = () => {
    setSelectedPDF(null);
  };

  const loadPDFs = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Cargando PDFs...');
      
      const response = await fetch('/api/files/list');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('Respuesta de la API:', result);
      
      if (!result.success) {
        console.warn('API retornó error:', result.error);
        setPdfs([]);
        return;
      }

      // Filtrar solo archivos PDF
      const pdfList: PDFFile[] = [];
      
      for (const dir of result.files || []) {
        if (dir.files && dir.files.length > 0) {
          for (const file of dir.files) {
            const extension = file.name.split('.').pop()?.toLowerCase();
            if (extension === 'pdf') {
              pdfList.push({
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
      console.log('PDFs encontrados:', pdfList.length);
      console.log('PDFs:', pdfList);
      setPdfs(pdfList);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError('No se pudo cargar la biblioteca de PDFs: ' + errorMessage);
      console.warn('Error cargando PDFs:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={cn('p-6 text-center', className)}>
        <div className="inline-flex items-center space-x-2">
          <div className="w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-600">Cargando biblioteca de PDFs...</span>
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
          <p className="text-sm mt-2 text-gray-500">Esto es normal si no has subido PDFs aún</p>
        </div>
        <button
          onClick={loadPDFs}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
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
          <h2 className="text-2xl font-bold text-white">Biblioteca de PDFs</h2>
          <p className="text-gray-300 mt-1">
            {filteredPDFs.length} {filteredPDFs.length === 1 ? 'PDF' : 'PDFs'} encontrados
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Búsqueda */}
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar PDFs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-gray-700 text-white placeholder-gray-400"
            />
            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Refresh */}
          <button
            onClick={loadPDFs}
            className="p-2 border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors"
            title="Actualizar biblioteca"
          >
            <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      {/* Grid de PDFs */}
      {filteredPDFs.length === 0 ? (
        <div className="text-center py-12">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-lg font-medium text-white mb-2">No se encontraron PDFs</h3>
          <p className="text-gray-400 mb-6">
            {searchTerm ? 'Prueba con otros términos de búsqueda' : 'Sube algunos PDFs desde el tab "Cargar Archivos" para comenzar'}
          </p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-red-600 hover:text-red-700 font-medium"
            >
              Limpiar búsqueda
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPDFs.map((pdf) => (
            <PDFCard
              key={pdf.path}
              pdf={pdf}
              onClick={() => handlePDFClick(pdf)}
            />
          ))}
        </div>
      )}

      {/* Modal de PDF */}
      {selectedPDF && (
        <PDFModal
          isOpen={!!selectedPDF}
          onClose={closeModal}
          pdfUrl={selectedPDF.url}
          pdfName={selectedPDF.name}
        />
      )}

      {/* Debug info */}
      <DebugInfo
        info={[
          { label: 'Estado', value: loading ? 'Cargando' : error ? 'Error' : 'Cargado' },
          { label: 'PDFs encontrados', value: pdfs.length },
          { label: 'PDFs filtrados', value: filteredPDFs.length },
          { label: 'Término de búsqueda', value: `"${searchTerm}"` },
          { label: 'API endpoint', value: '/api/files/list' },
          { label: 'Última actualización', value: new Date().toLocaleTimeString() }
        ]}
        onReload={loadPDFs}
        reloadLabel="Recargar Debug"
      />
    </div>
  );
};

// Componente PDFCard
interface PDFCardProps {
  pdf: PDFFile;
  onClick: () => void;
}

const PDFCard: React.FC<PDFCardProps> = ({ pdf, onClick }) => {
  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer bg-gray-900 rounded-lg border border-gray-700 hover:border-red-500 hover:shadow-lg transition-all duration-200"
    >
      {/* Ícono PDF */}
      <div className="relative aspect-3/4 bg-gradient-to-br from-gray-800 to-gray-700 rounded-t-lg overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-3">📄</div>
            <div className="w-16 h-16 bg-red-500 bg-opacity-10 rounded-full flex items-center justify-center group-hover:bg-red-500 group-hover:bg-opacity-20 transition-all duration-200">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
          </div>
        </div>
        
        {/* Overlay de hover */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-5 transition-all duration-200" />
      </div>

      {/* Información del PDF */}
      <div className="p-4">
        <h3 className="font-medium text-white truncate group-hover:text-red-400 transition-colors mb-2">
          {pdf.name}
        </h3>
        <div className="space-y-1 text-xs text-gray-400">
          <div className="flex items-center justify-between">
            <span>Tamaño:</span>
            <span className="font-medium">{formatFileSize(pdf.size)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Modificado:</span>
            <span className="font-medium">{new Date(pdf.modified).toLocaleDateString()}</span>
          </div>
        </div>
        
        {/* Botón de ver */}
        <div className="mt-3 pt-3 border-t border-gray-700">
          <div className="flex items-center justify-center text-red-400 group-hover:text-red-300 transition-colors">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span className="text-sm font-medium">Ver PDF</span>
          </div>
        </div>
      </div>
    </div>
  );
};