import { useState, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Camera, FlipHorizontal, X } from 'lucide-react-native';
import { colors } from '@/lib/ui/colors';

/**
 * Pantalla de Cámara
 * Permite capturar fotografías y alternar entre cámaras frontal/trasera
 */
export default function CameraScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
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
   * Descarta la foto capturada y regresa a la cámara
   */
  const discardPhoto = () => {
    setCapturedPhoto(null);
  };

  // Si hay una foto capturada, mostrar preview
  if (capturedPhoto) {
    return (
      <View style={styles.container}>
        <StatusBar style="light" />
        
        {/* Preview de la foto */}
        <View style={styles.previewContainer}>
          <img 
            src={capturedPhoto} 
            style={styles.previewImage}
            alt="Foto capturada"
          />
        </View>

        {/* Botón para descartar y volver */}
        <Pressable 
          style={styles.closeButton}
          onPress={discardPhoto}
        >
          <X color={colors.foreground} size={24} strokeWidth={2.5} />
        </Pressable>

        {/* Indicador de siguiente fase */}
        <View style={styles.gestureHint}>
          <Text style={styles.gestureHintText}>
            En la Fase 3 podrás usar gestos para:
          </Text>
          <Text style={styles.gestureHintItem}>← Swipe izquierda = Descartar</Text>
          <Text style={styles.gestureHintItem}>→ Swipe derecha = Guardar</Text>
        </View>
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
        ref={cameraRef}
      >
        {/* Overlay con controles */}
        <View style={styles.cameraOverlay}>
          
          {/* Botón para cambiar cámara */}
          <View style={styles.topControls}>
            <Pressable 
              style={styles.flipButton}
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
    justifyContent: 'flex-end',
  },
  flipButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
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

  // Estilos de preview
  previewContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
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
  },
  gestureHint: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(68, 71, 90, 0.95)',
    padding: 20,
    borderRadius: 12,
    gap: 8,
  },
  gestureHintText: {
    color: colors.purple,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  gestureHintItem: {
    color: colors.foreground,
    fontSize: 13,
    opacity: 0.9,
  },
});