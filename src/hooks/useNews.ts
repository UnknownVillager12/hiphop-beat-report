import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { NewsService, NewsArticle, CreateNewsDto, UpdateNewsDto } from '@/services/newsService';
import { useToast } from '@/hooks/use-toast';

// Query keys for React Query
export const newsKeys = {
  all: ['news'] as const,
  lists: () => [...newsKeys.all, 'list'] as const,
  list: (filters: string) => [...newsKeys.lists(), { filters }] as const,
  details: () => [...newsKeys.all, 'detail'] as const,
  detail: (id: string) => [...newsKeys.details(), id] as const,
};

// Hook to get all news articles
export const useNews = () => {
  return useQuery({
    queryKey: newsKeys.lists(),
    queryFn: NewsService.getAllNews,
  });
};

// Hook to get a single news article
export const useNewsDetail = (id: string) => {
  return useQuery({
    queryKey: newsKeys.detail(id),
    queryFn: () => NewsService.getNewsById(id),
    enabled: !!id,
  });
};

// Hook to get news by category
export const useNewsByCategory = (category: string) => {
  return useQuery({
    queryKey: newsKeys.list(category),
    queryFn: () => NewsService.getNewsByCategory(category),
    enabled: !!category,
  });
};

// Hook to create news article
export const useCreateNews = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateNewsDto) => NewsService.createNews(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: newsKeys.lists() });
      toast({
        title: "Success",
        description: "News article created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create news article",
        variant: "destructive",
      });
    },
  });
};

// Hook to update news article
export const useUpdateNews = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateNewsDto }) => 
      NewsService.updateNews(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: newsKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: newsKeys.lists() });
      toast({
        title: "Success",
        description: "News article updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update news article",
        variant: "destructive",
      });
    },
  });
};

// Hook to delete news article
export const useDeleteNews = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => NewsService.deleteNews(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: newsKeys.lists() });
      toast({
        title: "Success",
        description: "News article deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete news article",
        variant: "destructive",
      });
    },
  });
};