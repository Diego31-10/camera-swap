import React, { createContext, useContext, useState, useEffect } from 'react';
import * as FileSystem from 'expo-file-system/legacy';
import * as Haptics from 'expo-haptics';
import { CapturedImage } from '@/types';

// Extendemos el tipo para incluir favoritos si no está en types
export interface Photo extends CapturedImage {
  isFavorite?: boolean;
}

interface PhotoStoreContextType {
  photos: Photo[];
  addPhoto: (uri: string) => Promise<void>;
  removePhoto: (id: string) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  loadPhotos: () => Promise<void>;
  isLoading: boolean;
}

const PhotoStoreContext = createContext<PhotoStoreContextType | undefined>(undefined);

export const PhotoStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const photosDirectory = `${FileSystem.documentDirectory ?? ''}photos/`;

  const ensureDirectoryExists = async () => {
    try {
      const dirInfo = await FileSystem.getInfoAsync(photosDirectory);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(photosDirectory, { intermediates: true });
      }
    } catch (error) {
      console.error('Error al crear directorio:', error);
    }
  };

  const loadPhotos = async () => {
    setIsLoading(true);
    try {
      await ensureDirectoryExists();
      const files = await FileSystem.readDirectoryAsync(photosDirectory);
      const imageFiles = files.filter(file => 
        file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png')
      );

      const loadedPhotos: Photo[] = imageFiles.map(file => {
        const id = file.replace(/\.(jpg|jpeg|png)$/, '');
        const timestamp = parseInt(id) || Date.now();
        return {
          id,
          uri: `${photosDirectory}${file}`,
          timestamp,
          isFavorite: false, // Por defecto falso al cargar
        };
      });

      loadedPhotos.sort((a, b) => b.timestamp - a.timestamp);
      setPhotos(loadedPhotos);
    } catch (error) {
      console.error('Error al cargar fotos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addPhoto = async (uri: string) => {
    try {
      await ensureDirectoryExists();
      const timestamp = Date.now();
      const fileName = `${timestamp}.jpg`;
      const newUri = `${photosDirectory}${fileName}`;

      await FileSystem.copyAsync({ from: uri, to: newUri });

      const newPhoto: Photo = {
        id: timestamp.toString(),
        uri: newUri,
        timestamp,
        isFavorite: false,
      };

      setPhotos(prev => [newPhoto, ...prev]);
    } catch (error) {
      console.error('Error al guardar foto:', error);
      throw error;
    }
  };

  const removePhoto = async (id: string) => {
    try {
      const photo = photos.find(p => p.id === id);
      if (!photo) return;
      await FileSystem.deleteAsync(photo.uri, { idempotent: true });
      setPhotos(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error al eliminar foto:', error);
      throw error;
    }
  };

  const toggleFavorite = async (id: string) => {
    setPhotos(prev => prev.map(p => {
      if (p.id === id) {
        const newState = !p.isFavorite;
        if (newState) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
        return { ...p, isFavorite: newState };
      }
      return p;
    }));
  };

  useEffect(() => {
    loadPhotos();
  }, []);

  return (
    <PhotoStoreContext.Provider
      value={{ photos, addPhoto, removePhoto, toggleFavorite, loadPhotos, isLoading }}
    >
      {children}
    </PhotoStoreContext.Provider>
  );
};

export const usePhotoStore = () => {
  const context = useContext(PhotoStoreContext);
  if (!context) throw new Error('usePhotoStore debe ser usado dentro de PhotoStoreProvider');
  return context;
};