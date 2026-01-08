import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  interpolate,
  SharedValue,
  useAnimatedReaction,
  runOnJS,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics'; // Importante instalar esto
import { colors } from '@/lib/ui/colors';

interface SwipeIndicatorsProps {
  translateX: SharedValue<number>;
  threshold: number;
}

export const SwipeIndicators = ({ translateX, threshold }: SwipeIndicatorsProps) => {
  
  // Función para vibrar (ejecutada en el hilo de JS)
  const triggerHaptic = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  // Reacción para vibrar cuando el usuario llega al límite
  useAnimatedReaction(
    () => translateX.value,
    (currentValue, previousValue) => {
      if (!previousValue) return;
      // Vibra cuando cruza el umbral hacia la derecha o izquierda
      if (Math.abs(currentValue) >= threshold && Math.abs(previousValue) < threshold) {
        runOnJS(triggerHaptic)();
      }
    }
  );

  const leftTextStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [-threshold * 0.5, -threshold * 0.2], [1, 0]),
    transform: [
      { rotate: '-15deg' },
      { scale: interpolate(translateX.value, [-threshold, 0], [1.2, 0.8], 'clamp') }
    ],
  }));

  const rightTextStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [threshold * 0.2, threshold * 0.5], [0, 1]),
    transform: [
      { rotate: '15deg' },
      { scale: interpolate(translateX.value, [0, threshold], [0.8, 1.2], 'clamp') }
    ],
  }));

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Animated.View style={[styles.textBadge, styles.leftBadge, leftTextStyle]}>
        <Animated.Text style={[styles.badgeText, { color: colors.red }]}>ELIMINAR</Animated.Text>
      </Animated.View>

      <Animated.View style={[styles.textBadge, styles.rightBadge, rightTextStyle]}>
        <Animated.Text style={[styles.badgeText, { color: colors.green }]}>GUARDAR</Animated.Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  textBadge: {
    position: 'absolute',
    top: 80, // Ajusta según prefieras
    borderWidth: 5,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 5,
    backgroundColor: 'rgba(0,0,0,0.05)', // Un toque de fondo para legibilidad
  },
  leftBadge: {
    right: 30,
    borderColor: colors.red,
  },
  rightBadge: {
    left: 30,
    borderColor: colors.green,
  },
  badgeText: {
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: 2,
  },
});