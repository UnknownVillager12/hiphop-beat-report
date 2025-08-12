import { apiClient } from '@/lib/api';

// Types for User API
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'editor';
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  role?: 'admin' | 'user' | 'editor';
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
  avatar?: string;
}

export interface UpdateUserRoleDto {
  role: 'admin' | 'user' | 'editor';
}

export interface GetUsersQueryDto {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
}

export interface BulkDeleteUsersDto {
  userIds: string[];
}

// User API Service
export class UserService {
  // GET /users - Get all users
  static async getAllUsers(query?: GetUsersQueryDto): Promise<User[]> {
    const params = new URLSearchParams();
    if (query?.page) params.append('page', query.page.toString());
    if (query?.limit) params.append('limit', query.limit.toString());
    if (query?.search) params.append('search', query.search);
    if (query?.role) params.append('role', query.role);
    
    const queryString = params.toString();
    return apiClient.get<User[]>(`/users${queryString ? `?${queryString}` : ''}`);
  }

  // GET /users/:id - Get user by ID
  static async getUserById(id: string): Promise<User> {
    return apiClient.get<User>(`/users/${id}`);
  }

  // POST /users - Create new user
  static async createUser(data: CreateUserDto): Promise<User> {
    return apiClient.post<User>('/users', data);
  }

  // PATCH /users/:id - Update user
  static async updateUser(id: string, data: UpdateUserDto): Promise<User> {
    return apiClient.patch<User>(`/users/${id}`, data);
  }

  // DELETE /users/:id - Delete user
  static async deleteUser(id: string): Promise<void> {
    return apiClient.delete<void>(`/users/${id}`);
  }

  // PATCH /users/:id/role - Update user role (Admin only)
  static async updateUserRole(id: string, data: UpdateUserRoleDto): Promise<User> {
    return apiClient.patch<User>(`/users/${id}/role`, data);
  }

  // POST /users/bulk-delete - Bulk delete users (Admin only)
  static async bulkDeleteUsers(data: BulkDeleteUsersDto): Promise<void> {
    return apiClient.post<void>('/users/bulk-delete', data);
  }

  // Additional utility methods
  static async getCurrentUser(): Promise<User> {
    return apiClient.get<User>('/users/me');
  }

  static async updateProfile(data: UpdateUserDto): Promise<User> {
    return apiClient.patch<User>('/users/me', data);
  }
}