import { StyleSheet, View, Image, Dimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  interpolate,
} from 'react-native-reanimated';
import { colors } from '@/lib/ui/colors';
import { SwipeIndicators } from '@/components/molecules/SwipeIndicators';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3;

interface SwipeablePhotoProps {
  photoUri: string;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  disabled?: boolean;
}

/**
 * Componente que permite hacer swipe sobre una foto
 * Implementa gestos con PanGesture y animaciones con Reanimated
 */
export const SwipeablePhoto = ({
  photoUri,
  onSwipeLeft,
  onSwipeRight,
  disabled = false,
}: SwipeablePhotoProps) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  /**
   * Gesto de Pan (arrastre)
   */
  const panGesture = Gesture.Pan()
    .enabled(!disabled)
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY * 0.3;
    })
    .onEnd((event) => {
      const { translationX, velocityX } = event;

      // Swipe a la derecha (guardar)
      if (translationX > SWIPE_THRESHOLD || velocityX > 500) {
        translateX.value = withTiming(SCREEN_WIDTH + 100, { duration: 300 }, () => {
          runOnJS(onSwipeRight)();
        });
        translateY.value = withTiming(0, { duration: 300 });
      }
      // Swipe a la izquierda (descartar)
      else if (translationX < -SWIPE_THRESHOLD || velocityX < -500) {
        translateX.value = withTiming(-SCREEN_WIDTH - 100, { duration: 300 }, () => {
          runOnJS(onSwipeLeft)();
        });
        translateY.value = withTiming(0, { duration: 300 });
      }
      // No alcanzó el threshold, regresar a posición original
      else {
        translateX.value = withSpring(0, { damping: 20, stiffness: 200 });
        translateY.value = withSpring(0, { damping: 20, stiffness: 200 });
      }
    });

  /**
   * Estilo animado de la imagen
   */
  const animatedStyle = useAnimatedStyle(() => {
    const rotation = interpolate(
      translateX.value,
      [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      [-15, 0, 15]
    );

    const opacity = interpolate(
      Math.abs(translateX.value),
      [0, SWIPE_THRESHOLD],
      [1, 0.5]
    );

    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotation}deg` },
      ],
      opacity,
    };
  });

  return (
    <View style={styles.container}>
      <SwipeIndicators translateX={translateX} threshold={SWIPE_THRESHOLD} />

      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.photoContainer, animatedStyle]}>
          <Image source={{ uri: photoUri }} style={styles.photo} />
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoContainer: {
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_HEIGHT * 0.7,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  photo: {
    width: '100%',
    height: '100%',
    resizeMode:'cover',
},
});