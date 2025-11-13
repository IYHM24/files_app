import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../utils';

interface PDFModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string;
  pdfName: string;
}

export const PDFModal: React.FC<PDFModalProps> = ({
  isOpen,
  onClose,
  pdfUrl,
  pdfName,
}) => {
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
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const modalContent = (
    <div 
      className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[9999] animate-in fade-in duration-300"
      onClick={handleBackdropClick}
      style={{ margin: 0, padding: 0, width: '100vw', height: '100vh', top: 0, left: 0, position: 'fixed' }}
    >
      <div className="bg-gray-900 rounded-xl shadow-2xl w-[98vw] h-[98vh] flex flex-col overflow-hidden border border-gray-700 animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-700 bg-gray-800 rounded-t-lg flex-shrink-0">
          <div className="flex items-center space-x-3 min-w-0 flex-1">
            <span className="text-2xl">📄</span>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-semibold text-white truncate">
                {pdfName}
              </h2>
              <p className="text-sm text-gray-400">Documento PDF</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors flex-shrink-0 ml-2"
            title="Cerrar (ESC)"
          >
            <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* PDF Viewer */}
        <div className="relative bg-gray-800 flex-1 min-h-0">
          <iframe
            src={pdfUrl}
            title={pdfName}
            className="w-full h-full border-none rounded-none"
            onError={(e) => {
              const iframe = e.target as HTMLIFrameElement;
              iframe.style.display = 'none';
              const parent = iframe.parentElement;
              if (parent) {
                parent.innerHTML = `
                  <div class="flex items-center justify-center h-full text-center bg-gray-800">
                    <div>
                      <div class="text-6xl mb-4">📄</div>
                      <h3 class="text-lg font-medium text-white mb-2">Error al cargar PDF</h3>
                      <p class="text-gray-400 mb-4">${pdfName}</p>
                      <a href="${pdfUrl}" target="_blank" rel="noopener noreferrer" 
                         class="inline-block px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors">
                        Abrir en nueva pestaña
                      </a>
                    </div>
                  </div>
                `;
              }
            }}
          />
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 bg-gray-800 border-t border-gray-700 rounded-b-lg flex-shrink-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
            <div className="text-sm text-gray-400">
              <span className="inline-flex items-center space-x-1">
                <span>📄</span>
                <span>Documento PDF visualizado</span>
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 text-sm bg-gray-700 text-gray-200 rounded hover:bg-gray-600 transition-colors inline-flex items-center"
                title="Abrir en nueva pestaña"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Abrir
              </a>
              <a
                href={pdfUrl}
                download={pdfName}
                className="px-3 py-1.5 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors inline-flex items-center"
                title="Descargar PDF"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Descargar
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};