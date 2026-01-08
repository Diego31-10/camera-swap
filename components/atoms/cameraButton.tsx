import { Pressable, StyleSheet, View } from 'react-native';
import { colors } from '@/lib/ui/colors';

interface CameraButtonProps {
  onPress: () => void;
  disabled?: boolean;
}

/**
 * Botón de captura de cámara
 * Componente reutilizable con el diseño característico de botón de cámara
 */
export const CameraButton = ({ onPress, disabled = false }: CameraButtonProps) => {
  return (
    <Pressable 
      style={({ pressed }) => [
        styles.button,
        pressed && styles.buttonPressed,
        disabled && styles.buttonDisabled,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <View style={styles.buttonInner} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: colors.foreground,
  },
  buttonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.foreground,
  },
  buttonPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.95 }],
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});