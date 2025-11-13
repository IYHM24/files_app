// Servicio para manejar operaciones relacionadas con videos
export interface Video {
  name: string;
  size: number;
  modified: string;
  path: string;
  publicUrl: string;
  serveUrl?: string;
  blobUrl?: string;
  thumbnail?: string;
}

export class VideoService {
  private static blobCache: Map<string, string> = new Map();
  
  static async getVideoList(): Promise<Video[]> {
    try {
      const response = await fetch('/api/files/list');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        console.warn('API returned error:', result.error);
        return [];
      }

      // Filtrar solo archivos de video
      const videos: Video[] = [];
      
      for (const dir of result.files || []) {
        if (dir.name === 'video' && dir.files) {
          for (const file of dir.files) {
            const serveUrl = `/api/files/serve/video/${encodeURIComponent(file.name)}`;
            
            const video: Video = {
              name: file.name,
              size: file.size,
              modified: file.modified,
              path: file.path,
              publicUrl: file.publicUrl,
              serveUrl: serveUrl,
              // No crear blobUrl inmediatamente, se hará bajo demanda
              blobUrl: undefined
            };
            
            videos.push(video);
          }
        }
      }
      
      // Ordenar por fecha de modificación (más recientes primero)
      return videos.sort((a, b) => new Date(b.modified).getTime() - new Date(a.modified).getTime());
      
    } catch (error) {
      console.error('Error loading video list:', error);
      return [];
    }
  }
  
  static async createBlobUrl(serveUrl: string, filename: string): Promise<string> {
    // Verificar si ya tenemos la URL blob en caché
    if (this.blobCache.has(filename)) {
      return this.blobCache.get(filename)!;
    }
    
    try {
      // Obtener el archivo como bytes desde la API
      const response = await fetch(serveUrl);
      
      if (!response.ok) {
        console.warn(`Failed to fetch video: ${response.statusText}, using serveUrl as fallback`);
        return serveUrl;
      }
      
      // Convertir a blob
      const blob = await response.blob();
      
      // Crear URL blob
      const blobUrl = URL.createObjectURL(blob);
      
      // Guardar en caché
      this.blobCache.set(filename, blobUrl);
      
      return blobUrl;
    } catch (error) {
      console.warn(`Error creating blob URL for ${filename}, using serveUrl as fallback:`, error);
      // Fallback a serveUrl si falla la creación del blob
      return serveUrl;
    }
  }
  
  static revokeBlobUrl(filename: string): void {
    const blobUrl = this.blobCache.get(filename);
    if (blobUrl && blobUrl.startsWith('blob:')) {
      URL.revokeObjectURL(blobUrl);
      this.blobCache.delete(filename);
    }
  }
  
  static clearBlobCache(): void {
    for (const [filename, blobUrl] of this.blobCache.entries()) {
      if (blobUrl.startsWith('blob:')) {
        URL.revokeObjectURL(blobUrl);
      }
    }
    this.blobCache.clear();
  }
  
  // Método para obtener o crear blobUrl bajo demanda
  static async getBlobUrl(video: Video): Promise<string> {
    if (video.blobUrl) {
      return video.blobUrl;
    }
    
    if (!video.serveUrl) {
      return video.publicUrl;
    }
    
    try {
      const blobUrl = await this.createBlobUrl(video.serveUrl, video.name);
      // Actualizar el objeto video con la nueva blobUrl
      video.blobUrl = blobUrl;
      return blobUrl;
    } catch (error) {
      console.warn(`Failed to create blob URL for ${video.name}, using fallback`);
      return video.serveUrl || video.publicUrl;
    }
  }

  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  static formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    } else {
      return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }
  }

  static getThumbnailUrl(videoUrl: string): string {
    // Por ahora retornamos un placeholder
    // En el futuro se puede implementar generación de thumbnails
    return '/api/placeholder-thumbnail';
  }

  static getVideoTypeIcon(filename: string): string {
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'mp4': return '🎥';
      case 'avi': return '🎬';
      case 'mov': return '📹';
      case 'wmv': return '🎞️';
      case 'webm': return '📺';
      default: return '🎦';
    }
  }
}