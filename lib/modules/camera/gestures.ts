import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

/**
 * Constantes y utilidades para gestos de swipe
 */

// Umbrales de swipe
export const GESTURE_CONSTANTS = {
  SWIPE_THRESHOLD: SCREEN_WIDTH * 0.3, // 30% del ancho
  VELOCITY_THRESHOLD: 500, // píxeles por segundo
  ROTATION_MAX: 15, // grados máximos de rotación
  VERTICAL_DAMPING: 0.3, // factor de reducción vertical
  ANIMATION_DURATION: 300, // ms
  SPRING_CONFIG: {
    damping: 20,
    stiffness: 200,
  },
} as const;

/**
 * Calcula el ángulo de rotación basado en el desplazamiento X
 */
export const calculateRotation = (translateX: number): number => {
  const maxRotation = GESTURE_CONSTANTS.ROTATION_MAX;
  const maxTranslation = SCREEN_WIDTH / 2;
  
  return (translateX / maxTranslation) * maxRotation;
};

/**
 * Calcula la opacidad basada en el desplazamiento
 */
export const calculateOpacity = (translateX: number): number => {
  const threshold = GESTURE_CONSTANTS.SWIPE_THRESHOLD;
  const progress = Math.abs(translateX) / threshold;
  
  return Math.max(0.5, 1 - progress * 0.5);
};

/**
 * Determina si el gesto debe completarse
 */
export const shouldCompleteSwipe = (
  translationX: number,
  velocityX: number
): boolean => {
  const { SWIPE_THRESHOLD, VELOCITY_THRESHOLD } = GESTURE_CONSTANTS;
  
  return (
    Math.abs(translationX) > SWIPE_THRESHOLD ||
    Math.abs(velocityX) > VELOCITY_THRESHOLD
  );
};
