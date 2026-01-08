import { useSharedValue } from 'react-native-reanimated';
import { Dimensions } from 'react-native';
import { SwipeDirection } from '@/types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

/**
 * Hook para manejar la lógica de gestos swipe
 * Centraliza valores compartidos y umbrales
 */
export const useSwipeGesture = () => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3;
  const VELOCITY_THRESHOLD = 500;

  /**
   * Determina la dirección del swipe basado en posición y velocidad
   */
  const getSwipeDirection = (
    translationX: number,
    velocityX: number
  ): SwipeDirection => {
    // Swipe a la derecha
    if (translationX > SWIPE_THRESHOLD || velocityX > VELOCITY_THRESHOLD) {
      return 'right';
    }
    // Swipe a la izquierda
    if (translationX < -SWIPE_THRESHOLD || velocityX < -VELOCITY_THRESHOLD) {
      return 'left';
    }
    // No alcanzó el threshold
    return 'none';
  };

  /**
   * Verifica si el swipe es válido
   */
  const isValidSwipe = (translationX: number, velocityX: number): boolean => {
    return getSwipeDirection(translationX, velocityX) !== 'none';
  };

  return {
    translateX,
    translateY,
    SWIPE_THRESHOLD,
    VELOCITY_THRESHOLD,
    getSwipeDirection,
    isValidSwipe,
  };
};