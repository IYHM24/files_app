import { BaseService } from './BaseService';
import { ApiResponse, User } from '../types';

export class UserService extends BaseService {
  constructor() {
    super('/api/users');
  }

  async getUsers(): Promise<ApiResponse<User[]>> {
    return this.handleRequest<User[]>(this.buildUrl('/'));
  }

  async getUserById(id: string): Promise<ApiResponse<User>> {
    return this.handleRequest<User>(this.buildUrl(`/${id}`));
  }

  async createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<User>> {
    return this.handleRequest<User>(this.buildUrl('/'), {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUser(id: string, userData: Partial<User>): Promise<ApiResponse<User>> {
    return this.handleRequest<User>(this.buildUrl(`/${id}`), {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id: string): Promise<ApiResponse<void>> {
    return this.handleRequest<void>(this.buildUrl(`/${id}`), {
      method: 'DELETE',
    });
  }
}