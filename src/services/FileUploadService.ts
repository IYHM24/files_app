// Servicio para manejar uploads de archivos del lado del cliente
export class FileUploadService {
  static async uploadFile(file: File): Promise<{
    success: boolean;
    message?: string;
    filename?: string;
    originalName?: string;
    size?: number;
    type?: string;
    path?: string;
    publicUrl?: string;
    error?: string;
  }> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/files/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Upload failed');
      }

      return result;
    } catch (error) {
      console.error('Error uploading file:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  static async uploadMultipleFiles(files: File[]): Promise<Array<{
    success: boolean;
    filename?: string;
    error?: string;
  }>> {
    const results = await Promise.allSettled(
      files.map(file => this.uploadFile(file))
    );

    return results.map((result, index) => {
      if (result.status === 'fulfilled') {
        return {
          success: result.value.success,
          filename: files[index].name,
          error: result.value.error
        };
      } else {
        return {
          success: false,
          filename: files[index].name,
          error: result.reason?.message || 'Upload failed'
        };
      }
    });
  }

  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  static validateFile(file: File, options: {
    maxSize?: number; // en bytes
    allowedTypes?: string[];
    allowedExtensions?: string[];
  } = {}): { isValid: boolean; error?: string } {
    const {
      maxSize = 10 * 1024 * 1024, // 10MB por defecto
      allowedTypes = [],
      allowedExtensions = []
    } = options;

    // Validar tamaño
    if (file.size > maxSize) {
      return {
        isValid: false,
        error: `File size exceeds ${this.formatFileSize(maxSize)}`
      };
    }

    // Validar tipo MIME
    if (allowedTypes.length > 0) {
      const isTypeAllowed = allowedTypes.some(allowedType => {
        if (allowedType.includes('*')) {
          // Manejar wildcards como 'image/*', 'video/*', etc.
          const baseType = allowedType.split('/')[0];
          return file.type.startsWith(baseType + '/');
        } else {
          // Manejar tipos específicos como 'application/pdf'
          return file.type === allowedType;
        }
      });

      if (!isTypeAllowed) {
        // Crear mensaje más amigable
        const friendlyTypes = allowedTypes.map(type => {
          if (type === 'image/*') return 'imágenes';
          if (type === 'video/*') return 'videos';
          if (type === 'application/pdf') return 'PDF';
          if (type === 'text/*') return 'archivos de texto';
          if (type.includes('word')) return 'documentos Word';
          if (type.includes('excel') || type.includes('spreadsheet')) return 'hojas de Excel';
          return type;
        }).join(', ');

        return {
          isValid: false,
          error: `Tipo de archivo no permitido. Solo se aceptan: ${friendlyTypes}`
        };
      }
    }

    // Validar extensión
    if (allowedExtensions.length > 0) {
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
        return {
          isValid: false,
          error: `File extension .${fileExtension} is not allowed`
        };
      }
    }

    return { isValid: true };
  }

  static getSupportedTypes(): string[] {
    return [
      'image/*',           // Todas las imágenes
      'video/*',           // Todos los videos  
      'application/pdf',   // PDF
      'text/*',            // Archivos de texto
      'application/msword', // Word .doc
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // Word .docx
      'application/vnd.ms-excel', // Excel .xls
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // Excel .xlsx
    ];
  }

  static getFriendlyTypeNames(): string {
    return 'Imágenes, Videos, PDF, Documentos de texto, Word, Excel';
  }
}