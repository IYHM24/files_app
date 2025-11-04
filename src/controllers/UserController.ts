import { NextRequest, NextResponse } from 'next/server';
import { BaseController } from './BaseController';
import { UserModel } from '../models';

export class UserController extends BaseController {
  private users: UserModel[] = []; // In real app, this would be a database

  async getUsers(request: NextRequest): Promise<NextResponse> {
    return this.handleRequest(request, async () => {
      return this.users.map(user => user.toJSON());
    });
  }

  async getUserById(request: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
    return this.handleRequest(request, async () => {
      const user = this.users.find(u => u.id === params.id);
      if (!user) {
        throw new Error('User not found');
      }
      return user.toJSON();
    });
  }

  async createUser(request: NextRequest): Promise<NextResponse> {
    return this.handleRequest(request, async () => {
      const userData = await this.parseBody<Omit<UserModel, 'id' | 'createdAt' | 'updatedAt'>>(request);
      
      const newUser = new UserModel({
        ...userData,
        id: Date.now().toString(), // In real app, use proper ID generation
      });

      this.users.push(newUser);
      return newUser.toJSON();
    });
  }

  async updateUser(request: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
    return this.handleRequest(request, async () => {
      const userIndex = this.users.findIndex(u => u.id === params.id);
      if (userIndex === -1) {
        throw new Error('User not found');
      }

      const updateData = await this.parseBody<Partial<UserModel>>(request);
      
      this.users[userIndex] = new UserModel({
        ...this.users[userIndex],
        ...updateData,
        updatedAt: new Date(),
      });

      return this.users[userIndex].toJSON();
    });
  }

  async deleteUser(request: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
    return this.handleRequest(request, async () => {
      const userIndex = this.users.findIndex(u => u.id === params.id);
      if (userIndex === -1) {
        throw new Error('User not found');
      }

      this.users.splice(userIndex, 1);
      return { message: 'User deleted successfully' };
    });
  }
}