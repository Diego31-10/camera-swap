import { useState, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { CameraView, CameraType, FlashMode, useCameraPermissions } from 'expo-camera';
import { Camera, FlipHorizontal, X, Zap, ZapOff } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/lib/ui/colors';
import { SwipeablePhoto } from '@/components/organisms/SwipeablePhoto';
import { usePhotoStore } from '@/lib/store/PhotoStore';

/**
 * Pantalla de Cámara
 * Permite capturar fotografías con control de flash y usar gestos para decidir qué hacer con ellas
 */
export default function CameraScreen() {
  const router = useRouter();
  const { addPhoto } = usePhotoStore();
  const [facing, setFacing] = useState<CameraType>('back');
  const [flash, setFlash] = useState<FlashMode>('off');
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  // Si los permisos aún están cargando
  if (!permission) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Cargando cámara...</Text>
      </View>
    );
  }

  // Si no hay permisos concedidos
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <View style={styles.permissionContainer}>
          <Camera color={colors.yellow} size={64} strokeWidth={1.5} />
          <Text style={styles.permissionTitle}>Permiso de Cámara</Text>
          <Text style={styles.permissionMessage}>
            SwapCamera necesita acceso a tu cámara{'\n'}
            para capturar fotografías
          </Text>
          <Pressable 
            style={styles.permissionButton}
            onPress={requestPermission}
          >
            <Text style={styles.permissionButtonText}>Conceder Permiso</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  /**
   * Alterna entre cámara frontal y trasera
   */
  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  /**
   * Cicla entre los modos de flash: off -> on -> auto -> off
   */
  const toggleFlash = () => {
    setFlash(current => {
      if (current === 'off') return 'on';
      if (current === 'on') return 'auto';
      return 'off';
    });
  };

  /**
   * Obtiene el ícono y color según el modo de flash
   */
  const getFlashIcon = () => {
    if (flash === 'off') {
      return { Icon: ZapOff, color: colors.comment };
    }
    if (flash === 'on') {
      return { Icon: Zap, color: colors.yellow };
    }
    return { Icon: Zap, color: colors.cyan }; // auto
  };

  /**
   * Captura una fotografía
   */
  const takePicture = async () => {
    if (!cameraRef.current) return;

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
      });

      if (photo?.uri) {
        setCapturedPhoto(photo.uri);
      }
    } catch (error) {
      console.error('Error al capturar foto:', error);
      Alert.alert('Error', 'No se pudo capturar la fotografía');
    }
  };

  /**
   * Maneja el guardado de la foto (swipe derecha)
   */
  const handleSave = async () => {
    if (!capturedPhoto || isSaving) return;

    setIsSaving(true);
    try {
      await addPhoto(capturedPhoto);
      Alert.alert(
        '¡Foto Guardada!',
        'La foto se ha guardado en tu galería',
        [
          { 
            text: 'Ver Galería', 
            onPress: () => {
              setCapturedPhoto(null);
              router.push('/gallery');
            }
          },
          { 
            text: 'Tomar Otra', 
            onPress: () => setCapturedPhoto(null)
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar la foto');
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Maneja el descarte de la foto (swipe izquierda)
   */
  const handleDiscard = () => {
    setCapturedPhoto(null);
  };

  /**
   * Cierra el preview sin hacer nada
   */
  const closePreview = () => {
    setCapturedPhoto(null);
  };

  const { Icon: FlashIcon, color: flashColor } = getFlashIcon();

  // Si hay una foto capturada, mostrar preview con gestos
  if (capturedPhoto) {
    return (
      <View style={styles.container}>
        <StatusBar style="light" />
        
        <SwipeablePhoto
          photoUri={capturedPhoto}
          onSwipeLeft={handleDiscard}
          onSwipeRight={handleSave}
          disabled={isSaving}
        />

        {/* Botón para cerrar */}
        <Pressable 
          style={styles.closeButton}
          onPress={closePreview}
          disabled={isSaving}
        >
          <X color={colors.foreground} size={24} strokeWidth={2.5} />
        </Pressable>

        {/* Indicador de guardado */}
        {isSaving && (
          <View style={styles.savingOverlay}>
            <Text style={styles.savingText}>Guardando...</Text>
          </View>
        )}
      </View>
    );
  }

  // Vista de cámara activa
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Vista previa de la cámara */}
      <CameraView 
        style={styles.camera}
        facing={facing}
        flash={flash}
        ref={cameraRef}
      >
        {/* Overlay con controles */}
        <View style={styles.cameraOverlay}>
          
          {/* Controles superiores */}
          <View style={styles.topControls}>
            {/* Botón de Flash */}
            <Pressable 
              style={styles.controlButton}
              onPress={toggleFlash}
            >
              <FlashIcon color={flashColor} size={28} strokeWidth={2.5} />
              {flash === 'auto' && (
                <Text style={styles.flashBadge}>A</Text>
              )}
            </Pressable>

            <View style={{ flex: 1 }} />

            {/* Botón para cambiar cámara */}
            <Pressable 
              style={styles.controlButton}
              onPress={toggleCameraFacing}
            >
              <FlipHorizontal color={colors.foreground} size={28} strokeWidth={2.5} />
            </Pressable>
          </View>

          {/* Controles inferiores */}
          <View style={styles.bottomControls}>
            <View style={styles.captureButtonContainer}>
              <Pressable 
                style={styles.captureButton}
                onPress={takePicture}
              >
                <View style={styles.captureButtonInner} />
              </Pressable>
            </View>
            
            <Text style={styles.instructionText}>
              Toca el botón para capturar
            </Text>
          </View>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  message: {
    flex: 1,
    textAlign: 'center',
    color: colors.foreground,
    fontSize: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Estilos de permisos
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    gap: 20,
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.foreground,
    textAlign: 'center',
  },
  permissionMessage: {
    fontSize: 16,
    color: colors.foreground,
    textAlign: 'center',
    opacity: 0.8,
    lineHeight: 24,
  },
  permissionButton: {
    backgroundColor: colors.green,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 20,
  },
  permissionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.background,
  },

  // Estilos de cámara
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
  },
  topControls: {
    paddingTop: 60,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  flashBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: colors.cyan,
    color: colors.background,
    fontSize: 10,
    fontWeight: 'bold',
    width: 16,
    height: 16,
    borderRadius: 8,
    textAlign: 'center',
    lineHeight: 16,
  },
  bottomControls: {
    paddingBottom: 50,
    alignItems: 'center',
    gap: 20,
  },
  captureButtonContainer: {
    alignItems: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: colors.foreground,
  },
  captureButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.foreground,
  },
  instructionText: {
    color: colors.foreground,
    fontSize: 14,
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },

  // Botón de cerrar en preview
  closeButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },

  // Overlay de guardado
  savingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5,
  },
  savingText: {
    color: colors.foreground,
    fontSize: 18,
    fontWeight: '600',
  },
});