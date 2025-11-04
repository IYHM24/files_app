import { useState, useCallback, useRef } from 'react';

interface UseDragDropOptions {
  onFileSelect: (file: File) => void;
  maxFileSize?: number; // en MB
  acceptedTypes?: string[];
  onError?: (error: string) => void;
}

export const useDragDrop = ({
  onFileSelect,
  maxFileSize = 50,
  acceptedTypes = ['*/*'],
  onError
}: UseDragDropOptions) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const dragCounterRef = useRef(0);

  const validateFile = useCallback((file: File): boolean => {
    // Verificar tamaño
    if (file.size > maxFileSize * 1024 * 1024) {
      const error = `El archivo es muy grande. Tamaño máximo: ${maxFileSize}MB`;
      onError?.(error);
      return false;
    }

    // Verificar tipo (básico)
    if (acceptedTypes[0] !== '*/*') {
      const isValidType = acceptedTypes.some(type => {
        if (type.endsWith('/*')) {
          return file.type.startsWith(type.replace('*', ''));
        }
        return file.type === type;
      });

      if (!isValidType) {
        const error = 'Tipo de archivo no soportado';
        onError?.(error);
        return false;
      }
    }

    return true;
  }, [maxFileSize, acceptedTypes, onError]);

  const handleFileSelection = useCallback((file: File) => {
    if (validateFile(file)) {
      onFileSelect(file);
    }
  }, [validateFile, onFileSelect]);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    dragCounterRef.current++;
    
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragActive(true);
    }
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    dragCounterRef.current--;
    
    if (dragCounterRef.current === 0) {
      setIsDragActive(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'copy';
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsDragActive(false);
    dragCounterRef.current = 0;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleFileSelection(file);
    }
  }, [handleFileSelection]);

  return {
    isDragActive,
    dragHandlers: {
      onDragEnter: handleDragEnter,
      onDragLeave: handleDragLeave,
      onDragOver: handleDragOver,
      onDrop: handleDrop
    },
    handleFileSelection
  };
};