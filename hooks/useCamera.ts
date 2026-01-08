import { useState, useRef } from 'react';
import { CameraView, CameraType } from 'expo-camera';
import { Alert } from 'react-native';

/**
 * Hook personalizado para manejar la lógica de la cámara
 * Separa la lógica de negocio de la UI
 */
export const useCamera = () => {
  const [facing, setFacing] = useState<CameraType>('back');
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  /**
   * Alterna entre cámara frontal y trasera
   */
  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  /**
   * Captura una fotografía
   */
  const takePicture = async (): Promise<string | null> => {
    if (!cameraRef.current || isCapturing) return null;

    setIsCapturing(true);

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
      });

      if (photo?.uri) {
        setCapturedPhoto(photo.uri);
        return photo.uri;
      }

      return null;
    } catch (error) {
      console.error('Error al capturar foto:', error);
      Alert.alert('Error', 'No se pudo capturar la fotografía');
      return null;
    } finally {
      setIsCapturing(false);
    }
  };

  /**
   * Descarta la foto actual
   */
  const discardPhoto = () => {
    setCapturedPhoto(null);
  };

  /**
   * Guarda la foto (preparado para Fase 4)
   */
  const savePhoto = async (uri: string): Promise<boolean> => {
    // Esta funcionalidad se implementará en la Fase 4
    console.log('Guardar foto:', uri);
    return true;
  };

  return {
    facing,
    capturedPhoto,
    isCapturing,
    cameraRef,
    toggleCameraFacing,
    takePicture,
    discardPhoto,
    savePhoto,
  };
};