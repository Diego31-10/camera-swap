import React, { createContext, useContext, useState, useEffect } from 'react';
import * as FileSystem from 'expo-file-system/legacy';
import { CapturedImage } from '@/types';

interface PhotoStoreContextType {
  photos: CapturedImage[];
  addPhoto: (uri: string) => Promise<void>;
  removePhoto: (id: string) => Promise<void>;
  loadPhotos: () => Promise<void>;
  isLoading: boolean;
}

const PhotoStoreContext = createContext<PhotoStoreContextType | undefined>(undefined);

/**
 * Provider del Store de Fotos
 * Maneja el estado global de las imágenes guardadas
 */
export const PhotoStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [photos, setPhotos] = useState<CapturedImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Directorio donde se guardarán las fotos
  const photosDirectory = `${FileSystem.documentDirectory ?? ''}photos/`;

  /**
   * Crea el directorio de fotos si no existe
   */
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

  /**
   * Carga las fotos guardadas al iniciar
   */
  const loadPhotos = async () => {
    setIsLoading(true);
    try {
      await ensureDirectoryExists();
      
      const files = await FileSystem.readDirectoryAsync(photosDirectory);
      const imageFiles = files.filter(file => 
        file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png')
      );

      const loadedPhotos: CapturedImage[] = imageFiles.map(file => {
        const id = file.replace(/\.(jpg|jpeg|png)$/, '');
        const timestamp = parseInt(id) || Date.now();
        
        return {
          id,
          uri: `${photosDirectory}${file}`,
          timestamp,
        };
      });

      // Ordenar por timestamp descendente (más recientes primero)
      loadedPhotos.sort((a, b) => b.timestamp - a.timestamp);
      
      setPhotos(loadedPhotos);
    } catch (error) {
      console.error('Error al cargar fotos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Agrega una nueva foto al store
   */
  const addPhoto = async (uri: string) => {
    try {
      await ensureDirectoryExists();

      const timestamp = Date.now();
      const fileName = `${timestamp}.jpg`;
      const newUri = `${photosDirectory}${fileName}`;

      // Copiar la foto al directorio permanente
      await FileSystem.copyAsync({
        from: uri,
        to: newUri,
      });

      const newPhoto: CapturedImage = {
        id: timestamp.toString(),
        uri: newUri,
        timestamp,
      };

      setPhotos(prev => [newPhoto, ...prev]);
    } catch (error) {
      console.error('Error al guardar foto:', error);
      throw error;
    }
  };

  /**
   * Elimina una foto del store
   */
  const removePhoto = async (id: string) => {
    try {
      const photo = photos.find(p => p.id === id);
      if (!photo) return;

      // Eliminar el archivo físico
      await FileSystem.deleteAsync(photo.uri, { idempotent: true });

      // Actualizar el estado
      setPhotos(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error al eliminar foto:', error);
      throw error;
    }
  };

  // Cargar fotos al montar el provider
  useEffect(() => {
    loadPhotos();
  }, []);

  return (
    <PhotoStoreContext.Provider
      value={{
        photos,
        addPhoto,
        removePhoto,
        loadPhotos,
        isLoading,
      }}
    >
      {children}
    </PhotoStoreContext.Provider>
  );
};

/**
 * Hook para usar el Photo Store
 */
export const usePhotoStore = () => {
  const context = useContext(PhotoStoreContext);
  if (!context) {
    throw new Error('usePhotoStore debe ser usado dentro de PhotoStoreProvider');
  }
  return context;
};