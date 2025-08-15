import { create } from 'zustand';
import { AlbumService, IAlbum, CreateAlbumDto, UpdateAlbumDto } from '@/services/albumService';

interface AlbumState {
  albums: IAlbum[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchAlbums: () => Promise<void>;
  fetchAlbumById: (id: string) => Promise<IAlbum | null>;
  createAlbum: (data: CreateAlbumDto) => Promise<IAlbum | null>;
  updateAlbum: (id: string, data: UpdateAlbumDto) => Promise<IAlbum | null>;
  deleteAlbum: (id: string) => Promise<boolean>;
  searchTrack: (query: string) => Promise<any>;
  getTrack: (id: string) => Promise<any>;
  clearError: () => void;
}

export const useAlbumStore = create<AlbumState>((set, get) => ({
  albums: [],
  isLoading: false,
  error: null,

  fetchAlbums: async () => {
    set({ isLoading: true, error: null });
    try {
      const albums = await AlbumService.getAllAlbums();
      set({ albums, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch albums',
        isLoading: false 
      });
    }
  },

  fetchAlbumById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const album = await AlbumService.getAlbumById(id);
      set({ isLoading: false });
      return album;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch album',
        isLoading: false 
      });
      return null;
    }
  },

  createAlbum: async (data: CreateAlbumDto) => {
    set({ isLoading: true, error: null });
    try {
      const newAlbum = await AlbumService.createAlbum(data);
      const { albums } = get();
      set({ 
        albums: [...albums, newAlbum],
        isLoading: false 
      });
      return newAlbum;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create album',
        isLoading: false 
      });
      return null;
    }
  },

  updateAlbum: async (id: string, data: UpdateAlbumDto) => {
    set({ isLoading: true, error: null });
    try {
      const updatedAlbum = await AlbumService.updateAlbum(id, data);
      const { albums } = get();
      set({ 
        albums: albums.map(album => 
          album._id === id ? updatedAlbum : album
        ),
        isLoading: false 
      });
      return updatedAlbum;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update album',
        isLoading: false 
      });
      return null;
    }
  },

  deleteAlbum: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await AlbumService.deleteAlbum(id);
      const { albums } = get();
      set({ 
        albums: albums.filter(album => album._id !== id),
        isLoading: false 
      });
      return true;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete album',
        isLoading: false 
      });
      return false;
    }
  },

  searchTrack: async (query: string) => {
    set({ isLoading: true, error: null });
    try {
      const result = await AlbumService.searchTrack(query);
      set({ isLoading: false });
      return result;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to search tracks',
        isLoading: false 
      });
      return null;
    }
  },

  getTrack: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const track = await AlbumService.getTrack(id);
      set({ isLoading: false });
      return track;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to get track',
        isLoading: false 
      });
      return null;
    }
  },

  clearError: () => set({ error: null }),
}));