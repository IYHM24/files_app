import { BaseService } from './BaseService';
import { ApiResponse, File } from '../types';

export class FileService extends BaseService {
  constructor() {
    super('/api/files');
  }

  async uploadFile(file: File, metadata?: Record<string, any>): Promise<ApiResponse<File>> {
    const formData = new FormData();
    formData.append('file', file as any);
    
    if (metadata) {
      formData.append('metadata', JSON.stringify(metadata));
    }

    return this.handleRequest<File>(this.buildUrl('/upload'), {
      method: 'POST',
      body: formData,
      headers: {}, // Remove Content-Type to let browser set it for FormData
    });
  }

  async getFiles(): Promise<ApiResponse<File[]>> {
    return this.handleRequest<File[]>(this.buildUrl('/'));
  }

  async getFileById(id: string): Promise<ApiResponse<File>> {
    return this.handleRequest<File>(this.buildUrl(`/${id}`));
  }

  async deleteFile(id: string): Promise<ApiResponse<void>> {
    return this.handleRequest<void>(this.buildUrl(`/${id}`), {
      method: 'DELETE',
    });
  }

  async downloadFile(id: string): Promise<Blob> {
    const response = await fetch(this.buildUrl(`/${id}/download`));
    return response.blob();
  }

  getFileUrl(id: string): string {
    return this.buildUrl(`/${id}/download`);
  }
}