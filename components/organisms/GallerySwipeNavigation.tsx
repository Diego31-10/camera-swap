import { StyleSheet, View, Image, Dimensions, Text } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  interpolate,
  useAnimatedReaction,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics'; // Asegúrate de instalar expo-haptics
import { colors } from '@/lib/ui/colors';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;

interface GallerySwipeNavigationProps {
  photoUri: string;
  onSwipeLeft?: () => void;  // Siguiente
  onSwipeRight?: () => void; // Anterior
  currentIndex: number;
  totalPhotos: number;
}

export const GallerySwipeNavigation = ({
  photoUri,
  onSwipeLeft,
  onSwipeRight,
  currentIndex,
  totalPhotos,
}: GallerySwipeNavigationProps) => {
  const translateX = useSharedValue(0);
  const scale = useSharedValue(1);

  // Función para vibrar
  const triggerHaptic = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  // Vibra cuando el usuario desliza lo suficiente para cambiar de foto
  useAnimatedReaction(
    () => translateX.value,
    (val, prev) => {
      if (prev && Math.abs(val) >= SWIPE_THRESHOLD && Math.abs(prev) < SWIPE_THRESHOLD) {
        runOnJS(triggerHaptic)();
      }
    }
  );

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
      scale.value = interpolate(Math.abs(event.translationX), [0, SCREEN_WIDTH], [1, 0.9]);
    })
    .onEnd((event) => {
      const { translationX, velocityX } = event;

      // LÓGICA CORREGIDA: 
      // Deslizar hacia la IZQUIERDA (x negativo) -> Siguiente foto
      if ((translationX < -SWIPE_THRESHOLD || velocityX < -500) && onSwipeLeft) {
        translateX.value = withTiming(-SCREEN_WIDTH, { duration: 200 }, () => {
          runOnJS(onSwipeLeft)();
          translateX.value = SCREEN_WIDTH; // Aparece desde el otro lado
          translateX.value = withSpring(0);
        });
      } 
      // Deslizar hacia la DERECHA (x positivo) -> Foto anterior
      else if ((translationX > SWIPE_THRESHOLD || velocityX > 500) && onSwipeRight) {
        translateX.value = withTiming(SCREEN_WIDTH, { duration: 200 }, () => {
          runOnJS(onSwipeRight)();
          translateX.value = -SCREEN_WIDTH;
          translateX.value = withSpring(0);
        });
      } else {
        translateX.value = withSpring(0);
        scale.value = withSpring(1);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }, { scale: scale.value }],
  }));

  return (
    <View style={styles.container}>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.imageContainer, animatedStyle]}>
          <Image source={{ uri: photoUri }} style={styles.image} resizeMode="contain" />
        </Animated.View>
      </GestureDetector>

      <View style={styles.counter}>
        <Text style={styles.counterText}>{currentIndex + 1} / {totalPhotos}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, justifyContent: 'center' },
  imageContainer: { width: SCREEN_WIDTH, height: SCREEN_HEIGHT },
  image: { width: '100%', height: '100%' },
  counter: {
    position: 'absolute',
    bottom: 100, // Subido para dejar espacio a los botones de abajo
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  counterText: { color: colors.foreground, fontSize: 12, fontWeight: '700' },
});