import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  interpolate,
  SharedValue,
} from 'react-native-reanimated';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { colors } from '@/lib/ui/colors';

interface SwipeIndicatorsProps {
  translateX: SharedValue<number>;
  threshold: number;
}

/**
 * Indicadores visuales del gesto de swipe
 * Muestra flechas que se activan según la dirección del swipe
 */
export const SwipeIndicators = ({ translateX, threshold }: SwipeIndicatorsProps) => {
  /**
   * Estilo animado del indicador izquierdo (descartar)
   */
  const leftIndicatorStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateX.value,
      [-threshold, 0],
      [1, 0]
    );

    const scale = interpolate(
      translateX.value,
      [-threshold, 0],
      [1.2, 0.8]
    );

    return {
      opacity,
      transform: [{ scale }],
    };
  });

  /**
   * Estilo animado del indicador derecho (guardar)
   */
  const rightIndicatorStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateX.value,
      [0, threshold],
      [0, 1]
    );

    const scale = interpolate(
      translateX.value,
      [0, threshold],
      [0.8, 1.2]
    );

    return {
      opacity,
      transform: [{ scale }],
    };
  });

  return (
    <>
      {/* Indicador Izquierdo - Descartar */}
      <Animated.View style={[styles.indicator, styles.leftIndicator, leftIndicatorStyle]}>
        <View style={styles.discardCircle}>
          <ChevronLeft color={colors.foreground} size={60} strokeWidth={3} />
        </View>
      </Animated.View>

      {/* Indicador Derecho - Guardar */}
      <Animated.View style={[styles.indicator, styles.rightIndicator, rightIndicatorStyle]}>
        <View style={styles.saveCircle}>
          <ChevronRight color={colors.foreground} size={60} strokeWidth={3} />
        </View>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  indicator: {
    position: 'absolute',
    top: '50%',
    marginTop: -60,
    zIndex: -1,
  },
  leftIndicator: {
    left: 40,
  },
  rightIndicator: {
    right: 40,
  },
  discardCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.red,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.9,
  },
  saveCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.green,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.9,
  },
});