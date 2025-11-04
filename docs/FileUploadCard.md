# FileUploadCard Component Documentation

## Descripción
`FileUploadCard` es un componente avanzado para subida y vista previa de archivos que combina drag & drop, selección de archivos y visualización instantánea en una interfaz profesional.

## Características Principales

### 📁 **Subida de Archivos**
- **Drag & Drop**: Arrastra archivos directamente a la zona de drop
- **Click to Select**: Haz clic para abrir el selector de archivos
- **Validación**: Validación automática de tipo y tamaño
- **Feedback Visual**: Efectos visuales durante el arrastre

### 👁️ **Vista Previa Instantánea**
- **Imágenes**: Vista previa completa (JPG, PNG, GIF, WEBP)
- **Videos**: Reproductor integrado con controles (MP4, WebM, OGV)
- **PDFs**: Visualizador PDF embebido
- **Otros archivos**: Información detallada con iconos

### 🎨 **Interfaz Profesional**
- **Header con Gradiente**: Título y subtítulo personalizables
- **Grid Responsive**: Layout de 2 columnas adaptable
- **Animaciones**: Transiciones suaves y efectos hover
- **Estados de Error**: Mensajes de error claros

## Props Interface

```typescript
interface FileUploadCardProps {
  title?: string;              // Título principal
  subtitle?: string;           // Subtítulo descriptivo
  onFileSelect?: (file: File) => void;  // Callback al seleccionar archivo
  maxFileSize?: number;        // Tamaño máximo en MB
  acceptedTypes?: string[];    // Tipos MIME permitidos
  className?: string;          // Clases CSS adicionales
}
```

## Ejemplos de Uso

### 1. **Uso Básico**
```tsx
import { FileUploadCard } from '@/components/ui';

<FileUploadCard
  title="Gestor de Archivos"
  subtitle="Sube tus archivos aquí"
  onFileSelect={(file) => {
    console.log('Archivo seleccionado:', file.name);
  }}
/>
```

### 2. **Configuración Personalizada**
```tsx
<FileUploadCard
  title="Files App - Subida Avanzada"
  subtitle="Compatible con imágenes, videos, PDFs y documentos"
  maxFileSize={50}  // 50MB máximo
  acceptedTypes={[
    'image/*',
    'video/*',
    'application/pdf'
  ]}
  onFileSelect={(file) => {
    // Lógica personalizada
    uploadToServer(file);
  }}
/>
```

### 3. **Integración con Estado**
```tsx
import { useState } from 'react';
import { FileUploadCard, ProgressBar } from '@/components/ui';

function FileUploader() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileSelect = async (file: File) => {
    setSelectedFile(file);
    
    // Simular subida con progreso
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      
      if (response.ok) {
        console.log('Archivo subido exitosamente');
      }
    } catch (error) {
      console.error('Error al subir archivo:', error);
    }
  };

  return (
    <div className="space-y-4">
      <FileUploadCard
        title="Subida de Archivos"
        subtitle="Arrastra o selecciona tu archivo"
        onFileSelect={handleFileSelect}
      />
      
      {selectedFile && (
        <ProgressBar
          progress={uploadProgress}
          status="uploading"
          showPercentage={true}
        />
      )}
    </div>
  );
}
```

## Tipos de Archivo Soportados

### 📷 **Imágenes**
- **Formatos**: JPG, JPEG, PNG, GIF, WEBP, SVG
- **Vista Previa**: Imagen completa con zoom automático
- **Información**: Nombre, tamaño, dimensiones

```tsx
// Ejemplo para solo imágenes
<FileUploadCard
  acceptedTypes={['image/*']}
  maxFileSize={10} // 10MB
/>
```

### 🎥 **Videos**
- **Formatos**: MP4, WebM, OGV, AVI (dependiendo del navegador)
- **Vista Previa**: Reproductor HTML5 con controles
- **Funciones**: Play, pausa, volumen, pantalla completa

```tsx
// Ejemplo para solo videos
<FileUploadCard
  acceptedTypes={['video/*']}
  maxFileSize={100} // 100MB para videos
/>
```

### 📄 **PDFs**
- **Vista Previa**: Visor PDF embebido
- **Funciones**: Zoom, navegación de páginas (según navegador)
- **Compatibilidad**: Todos los navegadores modernos

```tsx
// Ejemplo para solo PDFs
<FileUploadCard
  acceptedTypes={['application/pdf']}
  maxFileSize={25} // 25MB
/>
```

### 📝 **Documentos**
- **Formatos**: DOC, DOCX, TXT, MD, JSON
- **Vista Previa**: Información detallada del archivo
- **Iconos**: Iconos representativos por tipo

## Componentes Relacionados

### **FileInfo**
Muestra información detallada del archivo:

```tsx
import { FileInfo } from '@/components/ui';

<FileInfo
  file={selectedFile}
  onRemove={() => setSelectedFile(null)}
  showDetails={true}
/>
```

### **ProgressBar**
Barra de progreso para subidas:

```tsx
import { ProgressBar } from '@/components/ui';

<ProgressBar
  progress={75}
  status="uploading"
  size="md"
  showPercentage={true}
/>
```

## Validaciones y Restricciones

### **Tamaño de Archivo**
```tsx
<FileUploadCard
  maxFileSize={50} // 50MB máximo
  onFileSelect={(file) => {
    if (file.size > 50 * 1024 * 1024) {
      alert('Archivo muy grande');
      return;
    }
    // Procesar archivo
  }}
/>
```

### **Tipos de Archivo**
```tsx
<FileUploadCard
  acceptedTypes={[
    'image/jpeg',
    'image/png',
    'application/pdf',
    'video/mp4'
  ]}
/>
```

### **Validación Personalizada**
```tsx
const validateFile = (file: File): boolean => {
  // Validaciones personalizadas
  if (file.name.includes('temp')) {
    return false;
  }
  
  if (file.lastModified < Date.now() - 30 * 24 * 60 * 60 * 1000) {
    return false; // Archivo muy antiguo
  }
  
  return true;
};

<FileUploadCard
  onFileSelect={(file) => {
    if (!validateFile(file)) {
      alert('Archivo no válido');
      return;
    }
    // Procesar archivo válido
  }}
/>
```

## Eventos y Callbacks

### **onFileSelect**
Se ejecuta cuando se selecciona un archivo válido:

```tsx
<FileUploadCard
  onFileSelect={(file: File) => {
    console.log({
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: new Date(file.lastModified)
    });
    
    // Enviar a servidor
    uploadFile(file);
  }}
/>
```

## Estados Visuales

### **Estado Normal**
- Zona de drop con borde punteado
- Icono de carpeta y texto instructivo
- Hover effects suaves

### **Estado de Drag**
- Borde azul sólido
- Fondo azul claro
- Escala aumentada (105%)
- Animación de pulso

### **Estado de Error**
- Mensaje de error en rojo
- Icono de advertencia
- Descripción del problema

### **Con Archivo Seleccionado**
- Vista previa activa
- Botón de limpiar
- Información del archivo

## Personalización de Estilos

### **Clases CSS Personalizadas**
```tsx
<FileUploadCard
  className="border-2 border-blue-300 bg-blue-50"
  title="Zona Personalizada"
/>
```

### **Colores del Header**
El header usa gradientes predefinidos que pueden personalizarse:

```css
/* En tu CSS global */
.custom-upload-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

## Integración con APIs

### **Subida a Servidor**
```tsx
const uploadToServer = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', 'uploads');
  
  try {
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('Upload successful:', result.fileUrl);
    }
  } catch (error) {
    console.error('Upload failed:', error);
  }
};
```

### **Progreso de Subida**
```tsx
const uploadWithProgress = async (file: File, onProgress: (progress: number) => void) => {
  const xhr = new XMLHttpRequest();
  
  xhr.upload.addEventListener('progress', (e) => {
    if (e.lengthComputable) {
      const progress = (e.loaded / e.total) * 100;
      onProgress(progress);
    }
  });
  
  const formData = new FormData();
  formData.append('file', file);
  
  xhr.open('POST', '/api/upload');
  xhr.send(formData);
};
```

## Mejores Prácticas

### **Performance**
- Usa `URL.revokeObjectURL()` para limpiar memoria
- Implementa lazy loading para archivos grandes
- Valida archivos en el frontend antes de subir

### **UX/UI**
- Muestra progreso de subida para archivos grandes
- Proporciona feedback inmediato para errores
- Permite cancelar subidas en progreso

### **Seguridad**
- Valida tipos de archivo en servidor también
- Escanea archivos por malware
- Limita tamaños de archivo apropiadamente

### **Accesibilidad**
- Incluye labels apropiados
- Soporta navegación por teclado
- Proporciona texto alternativo para iconos

El componente `FileUploadCard` proporciona una solución completa y profesional para la gestión de archivos en aplicaciones React, combinando facilidad de uso con funcionalidades avanzadas.