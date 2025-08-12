import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UserService, User, CreateUserDto, UpdateUserDto, UpdateUserRoleDto, GetUsersQueryDto, BulkDeleteUsersDto } from '@/services/userService';
import { useToast } from '@/hooks/use-toast';

// Query keys for React Query
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters: GetUsersQueryDto) => [...userKeys.lists(), { filters }] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
  current: () => [...userKeys.all, 'current'] as const,
};

// Hook to get all users
export const useUsers = (query?: GetUsersQueryDto) => {
  return useQuery({
    queryKey: userKeys.list(query || {}),
    queryFn: () => UserService.getAllUsers(query),
  });
};

// Hook to get a single user
export const useUserDetail = (id: string) => {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => UserService.getUserById(id),
    enabled: !!id,
  });
};

// Hook to get current user
export const useCurrentUser = () => {
  return useQuery({
    queryKey: userKeys.current(),
    queryFn: UserService.getCurrentUser,
  });
};

// Hook to create user
export const useCreateUser = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateUserDto) => UserService.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      toast({
        title: "Success",
        description: "User created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create user",
        variant: "destructive",
      });
    },
  });
};

// Hook to update user
export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserDto }) => 
      UserService.updateUser(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: userKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      toast({
        title: "Success",
        description: "User updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update user",
        variant: "destructive",
      });
    },
  });
};

// Hook to update user profile
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: UpdateUserDto) => UserService.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.current() });
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    },
  });
};

// Hook to update user role (Admin only)
export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserRoleDto }) => 
      UserService.updateUserRole(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: userKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      toast({
        title: "Success",
        description: "User role updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive",
      });
    },
  });
};

// Hook to delete user
export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => UserService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      });
    },
  });
};

// Hook to bulk delete users (Admin only)
export const useBulkDeleteUsers = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: BulkDeleteUsersDto) => UserService.bulkDeleteUsers(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      toast({
        title: "Success",
        description: "Users deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete users",
        variant: "destructive",
      });
    },
  });
};