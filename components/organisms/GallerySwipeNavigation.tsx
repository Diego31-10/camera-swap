import { StyleSheet, View, Image, Dimensions, Text } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  interpolate,
} from 'react-native-reanimated';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { colors } from '@/lib/ui/colors';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25; // 25% para navegación

interface GallerySwipeNavigationProps {
  photoUri: string;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  currentIndex: number;
  totalPhotos: number;
}

/**
 * Componente de navegación con gestos para la galería
 * Permite navegar entre fotos con swipe horizontal
 */
export const GallerySwipeNavigation = ({
  photoUri,
  onSwipeLeft,
  onSwipeRight,
  currentIndex,
  totalPhotos,
}: GallerySwipeNavigationProps) => {
  const translateX = useSharedValue(0);
  const scale = useSharedValue(1);

  /**
   * Gesto de Pan para navegación
   */
  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
      // Efecto de escala sutil durante el gesto
      const scaleValue = 1 - Math.abs(event.translationX) / SCREEN_WIDTH * 0.1;
      scale.value = Math.max(0.9, scaleValue);
    })
    .onEnd((event) => {
      const { translationX, velocityX } = event;

      // Swipe a la izquierda (foto siguiente)
      if ((translationX < -SWIPE_THRESHOLD || velocityX < -500) && onSwipeLeft) {
        translateX.value = withTiming(-SCREEN_WIDTH, { duration: 250 }, () => {
          runOnJS(onSwipeLeft)();
          translateX.value = 0;
          scale.value = 1;
        });
      }
      // Swipe a la derecha (foto anterior)
      else if ((translationX > SWIPE_THRESHOLD || velocityX > 500) && onSwipeRight) {
        translateX.value = withTiming(SCREEN_WIDTH, { duration: 250 }, () => {
          runOnJS(onSwipeRight)();
          translateX.value = 0;
          scale.value = 1;
        });
      }
      // Regresar a posición original
      else {
        translateX.value = withSpring(0, { damping: 20, stiffness: 200 });
        scale.value = withSpring(1, { damping: 20, stiffness: 200 });
      }
    });

  /**
   * Estilo animado de la imagen
   */
  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      Math.abs(translateX.value),
      [0, SWIPE_THRESHOLD * 2],
      [1, 0.3]
    );

    return {
      transform: [
        { translateX: translateX.value },
        { scale: scale.value },
      ],
      opacity,
    };
  });

  /**
   * Indicador izquierdo (foto anterior)
   */
  const leftIndicatorStyle = useAnimatedStyle(() => {
    const opacity = onSwipeRight ? interpolate(
      translateX.value,
      [0, SWIPE_THRESHOLD],
      [0, 1]
    ) : 0;

    const scale = interpolate(
      translateX.value,
      [0, SWIPE_THRESHOLD],
      [0.8, 1.2]
    );

    return {
      opacity,
      transform: [{ scale }],
    };
  });

  /**
   * Indicador derecho (foto siguiente)
   */
  const rightIndicatorStyle = useAnimatedStyle(() => {
    const opacity = onSwipeLeft ? interpolate(
      translateX.value,
      [-SWIPE_THRESHOLD, 0],
      [1, 0]
    ) : 0;

    const scale = interpolate(
      translateX.value,
      [-SWIPE_THRESHOLD, 0],
      [1.2, 0.8]
    );

    return {
      opacity,
      transform: [{ scale }],
    };
  });

  return (
    <View style={styles.container}>
      {/* Indicador Izquierdo - Foto Anterior */}
      {onSwipeRight && (
        <Animated.View style={[styles.indicator, styles.leftIndicator, leftIndicatorStyle]}>
          <View style={styles.indicatorCircle}>
            <ChevronLeft color={colors.foreground} size={40} strokeWidth={3} />
          </View>
        </Animated.View>
      )}

      {/* Indicador Derecho - Foto Siguiente */}
      {onSwipeLeft && (
        <Animated.View style={[styles.indicator, styles.rightIndicator, rightIndicatorStyle]}>
          <View style={styles.indicatorCircle}>
            <ChevronRight color={colors.foreground} size={40} strokeWidth={3} />
          </View>
        </Animated.View>
      )}

      {/* Imagen con gesto */}
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.imageContainer, animatedStyle]}>
          <Image 
            source={{ uri: photoUri }} 
            style={styles.image}
            resizeMode="contain"
          />
        </Animated.View>
      </GestureDetector>

      {/* Contador de fotos */}
      <View style={styles.counter}>
        <Text style={styles.counterText}>
          {currentIndex + 1} / {totalPhotos}
        </Text>
      </View>
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
  imageContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  indicator: {
    position: 'absolute',
    top: '50%',
    marginTop: -40,
    zIndex: 1,
  },
  leftIndicator: {
    left: 30,
  },
  rightIndicator: {
    right: 30,
  },
  indicatorCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.cyan,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.9,
  },
  counter: {
    position: 'absolute',
    top: 20,
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  counterText: {
    color: colors.foreground,
    fontSize: 14,
    fontWeight: '600',
  },
});