import { create } from 'zustand';
import { UserService, User, CreateUserDto, UpdateUserDto, UpdateUserRoleDto, GetUsersQueryDto, BulkDeleteUsersDto } from '@/services/userService';

interface UserState {
  // State
  users: User[];
  currentUser: User | null;
  selectedUser: User | null;
  loading: boolean;
  error: string | null;

  // Actions
  getAllUsers: (query?: GetUsersQueryDto) => Promise<void>;
  getUserById: (id: string) => Promise<void>;
  getCurrentUser: () => Promise<void>;
  createUser: (data: CreateUserDto) => Promise<void>;
  updateUser: (id: string, data: UpdateUserDto) => Promise<void>;
  updateProfile: (data: UpdateUserDto) => Promise<void>;
  updateUserRole: (id: string, data: UpdateUserRoleDto) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  bulkDeleteUsers: (data: BulkDeleteUsersDto) => Promise<void>;
  clearError: () => void;
  clearSelectedUser: () => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  // Initial state
  users: [],
  currentUser: null,
  selectedUser: null,
  loading: false,
  error: null,

  // Actions
  getAllUsers: async (query?: GetUsersQueryDto) => {
    set({ loading: true, error: null });
    try {
      const users = await UserService.getAllUsers(query);
      set({ users, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch users', loading: false });
    }
  },

  getUserById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const selectedUser = await UserService.getUserById(id);
      set({ selectedUser, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch user', loading: false });
    }
  },

  getCurrentUser: async () => {
    set({ loading: true, error: null });
    try {
      const currentUser = await UserService.getCurrentUser();
      set({ currentUser, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch current user', loading: false });
    }
  },

  createUser: async (data: CreateUserDto) => {
    set({ loading: true, error: null });
    try {
      const newUser = await UserService.createUser(data);
      set((state) => ({ 
        users: [newUser, ...state.users], 
        loading: false 
      }));
    } catch (error) {
      set({ error: 'Failed to create user', loading: false });
    }
  },

  updateUser: async (id: string, data: UpdateUserDto) => {
    set({ loading: true, error: null });
    try {
      const updatedUser = await UserService.updateUser(id, data);
      set((state) => ({
        users: state.users.map(user => 
          user.id === id ? updatedUser : user
        ),
        selectedUser: state.selectedUser?.id === id ? updatedUser : state.selectedUser,
        loading: false
      }));
    } catch (error) {
      set({ error: 'Failed to update user', loading: false });
    }
  },

  updateProfile: async (data: UpdateUserDto) => {
    set({ loading: true, error: null });
    try {
      const updatedUser = await UserService.updateProfile(data);
      set({ currentUser: updatedUser, loading: false });
    } catch (error) {
      set({ error: 'Failed to update profile', loading: false });
    }
  },

  updateUserRole: async (id: string, data: UpdateUserRoleDto) => {
    set({ loading: true, error: null });
    try {
      const updatedUser = await UserService.updateUserRole(id, data);
      set((state) => ({
        users: state.users.map(user => 
          user.id === id ? updatedUser : user
        ),
        selectedUser: state.selectedUser?.id === id ? updatedUser : state.selectedUser,
        loading: false
      }));
    } catch (error) {
      set({ error: 'Failed to update user role', loading: false });
    }
  },

  deleteUser: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await UserService.deleteUser(id);
      set((state) => ({
        users: state.users.filter(user => user.id !== id),
        selectedUser: state.selectedUser?.id === id ? null : state.selectedUser,
        loading: false
      }));
    } catch (error) {
      set({ error: 'Failed to delete user', loading: false });
    }
  },

  bulkDeleteUsers: async (data: BulkDeleteUsersDto) => {
    set({ loading: true, error: null });
    try {
      await UserService.bulkDeleteUsers(data);
      set((state) => ({
        users: state.users.filter(user => !data.userIds.includes(user.id)),
        loading: false
      }));
    } catch (error) {
      set({ error: 'Failed to delete users', loading: false });
    }
  },

  clearError: () => set({ error: null }),
  clearSelectedUser: () => set({ selectedUser: null }),
}));