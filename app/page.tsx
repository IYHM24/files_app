'use client';

import { FileManager } from '../src/components/ui/FileManager';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Sistema de Gestión de Archivos
            </h1>
            <p className="text-lg text-gray-600">
              Carga y gestiona tus archivos de forma segura y eficiente
            </p>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="container mx-auto">
        <div className="max-w-7xl mx-auto">
          <FileManager />
        </div>
      </div>
    </div>
  );
}
