// Global type definitions
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface User extends BaseEntity {
  email: string;
  name: string;
  role: 'admin' | 'user';
  avatar?: string;
}

export interface File extends BaseEntity {
  name: string;
  originalName: string;
  mimeType: string;
  size: number;
  path: string;
  uploadedBy: string; // User ID
}