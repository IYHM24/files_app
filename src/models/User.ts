import { BaseEntity } from '../types';

export class UserModel {
  public id: string;
  public email: string;
  public name: string;
  public role: 'admin' | 'user';
  public avatar?: string;
  public createdAt: Date;
  public updatedAt: Date;

  constructor(data: Partial<UserModel>) {
    this.id = data.id || '';
    this.email = data.email || '';
    this.name = data.name || '';
    this.role = data.role || 'user';
    this.avatar = data.avatar;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  public toJSON() {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
      role: this.role,
      avatar: this.avatar,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  public static fromJSON(data: any): UserModel {
    return new UserModel({
      ...data,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    });
  }
}