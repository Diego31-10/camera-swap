import { useCameraPermissions } from 'expo-camera';
import { Alert, Linking } from 'react-native';

/**
 * Utilidades para manejar permisos de cámara
 */

/**
 * Verifica si los permisos de cámara están concedidos
 */
export const checkCameraPermissions = async (
  permission: ReturnType<typeof useCameraPermissions>[0]
): Promise<boolean> => {
  if (!permission) return false;
  return permission.granted;
};

/**
 * Muestra un mensaje cuando los permisos son denegados permanentemente
 */
export const showPermissionDeniedAlert = () => {
  Alert.alert(
    'Permiso Denegado',
    'SwapCamera necesita acceso a la cámara. Por favor, habilita el permiso en la configuración de tu dispositivo.',
    [
      { text: 'Cancelar', style: 'cancel' },
      { 
        text: 'Abrir Configuración', 
        onPress: () => Linking.openSettings() 
      },
    ]
  );
};

/**
 * Solicita permisos de cámara con manejo de errores
 */
export const requestCameraPermissionSafely = async (
  requestPermission: ReturnType<typeof useCameraPermissions>[1]
): Promise<boolean> => {
  try {
    const result = await requestPermission();
    
    if (!result.granted) {
      if (result.canAskAgain === false) {
        showPermissionDeniedAlert();
      }
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error al solicitar permisos:', error);
    Alert.alert('Error', 'No se pudieron solicitar los permisos de cámara');
    return false;
  }
};
