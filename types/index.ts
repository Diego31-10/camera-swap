/**
 * Tipos globales de la aplicación
 */

// Tipo para las imágenes capturadas
export interface CapturedImage {
    id: string;
    uri: string;
    timestamp: number;
  }
  
  // Tipo para el estado de la cámara
  export type CameraState = 'idle' | 'capturing' | 'preview';
  
  // Tipo para las direcciones de swipe
  export type SwipeDirection = 'left' | 'right' | 'none';