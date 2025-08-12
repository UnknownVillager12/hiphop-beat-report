import { create } from 'zustand';
import { NewsService, NewsArticle, CreateNewsDto, UpdateNewsDto } from '@/services/newsService';

interface NewsState {
  // State
  news: NewsArticle[];
  currentNews: NewsArticle | null;
  loading: boolean;
  error: string | null;

  // Actions
  getAllNews: () => Promise<void>;
  getNewsById: (id: string) => Promise<void>;
  getNewsByCategory: (category: string) => Promise<void>;
  createNews: (data: CreateNewsDto) => Promise<void>;
  updateNews: (id: string, data: UpdateNewsDto) => Promise<void>;
  deleteNews: (id: string) => Promise<void>;
  searchNews: (query: string) => Promise<void>;
  clearError: () => void;
  clearCurrentNews: () => void;
}

export const useNewsStore = create<NewsState>((set, get) => ({
  // Initial state
  news: [],
  currentNews: null,
  loading: false,
  error: null,

  // Actions
  getAllNews: async () => {
    set({ loading: true, error: null });
    try {
      const news = await NewsService.getAllNews();
      set({ news, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch news', loading: false });
    }
  },

  getNewsById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const currentNews = await NewsService.getNewsById(id);
      set({ currentNews, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch news article', loading: false });
    }
  },

  getNewsByCategory: async (category: string) => {
    set({ loading: true, error: null });
    try {
      const news = await NewsService.getNewsByCategory(category);
      set({ news, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch news by category', loading: false });
    }
  },

  createNews: async (data: CreateNewsDto) => {
    set({ loading: true, error: null });
    try {
      const newArticle = await NewsService.createNews(data);
      set((state) => ({ 
        news: [newArticle, ...state.news], 
        loading: false 
      }));
    } catch (error) {
      set({ error: 'Failed to create news article', loading: false });
    }
  },

  updateNews: async (id: string, data: UpdateNewsDto) => {
    set({ loading: true, error: null });
    try {
      const updatedArticle = await NewsService.updateNews(id, data);
      set((state) => ({
        news: state.news.map(article => 
          article.id === id ? updatedArticle : article
        ),
        currentNews: state.currentNews?.id === id ? updatedArticle : state.currentNews,
        loading: false
      }));
    } catch (error) {
      set({ error: 'Failed to update news article', loading: false });
    }
  },

  deleteNews: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await NewsService.deleteNews(id);
      set((state) => ({
        news: state.news.filter(article => article.id !== id),
        currentNews: state.currentNews?.id === id ? null : state.currentNews,
        loading: false
      }));
    } catch (error) {
      set({ error: 'Failed to delete news article', loading: false });
    }
  },

  searchNews: async (query: string) => {
    set({ loading: true, error: null });
    try {
      const news = await NewsService.searchNews(query);
      set({ news, loading: false });
    } catch (error) {
      set({ error: 'Failed to search news', loading: false });
    }
  },

  clearError: () => set({ error: null }),
  clearCurrentNews: () => set({ currentNews: null }),
}));