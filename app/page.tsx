'use client';

import { MainLayout, Sidebar } from '../src/components/layout';
import { Button, CardCustom, FileUploadCard } from '../src/components/ui';
import { useUsers } from '../src/hooks';

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

const UserIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
  </svg>
);

const StorageIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
  </svg>
);

const DownloadIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
  </svg>
);

export default function Home() {
  const { users, loading, error } = useUsers();

  return (
    
      <div className="space-y-8">

        {/* File Upload and Preview Section */}
        <FileUploadCard
          title="Files App - Gestor de Archivos Profesional"
          subtitle="Arrastra archivos para vista previa instantánea: PDF, imágenes, videos y más"
          onFileSelect={(file) => {
            console.log('Archivo seleccionado:', file.name, file.type, file.size);
            // Aquí puedes agregar lógica adicional como subir a un servidor
          }}
          maxFileSize={100} // 100MB
        />

      </div>
  );
}
