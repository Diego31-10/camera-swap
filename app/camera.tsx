import { View, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Camera } from 'lucide-react-native';

/**
 * Pantalla de Cámara
 * En la Fase 2 se implementará la funcionalidad completa
 */
export default function CameraScreen() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.content}>
        <Camera color="#50fa7b" size={80} strokeWidth={1.5} />
        <Text style={styles.title}>Cámara</Text>
        <Text style={styles.message}>
          La funcionalidad de la cámara{'\n'}
          se implementará en la Fase 2
        </Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>Próximamente:</Text>
        <Text style={styles.infoItem}>• Vista previa de cámara</Text>
        <Text style={styles.infoItem}>• Captura de fotografías</Text>
        <Text style={styles.infoItem}>• Cambio entre cámaras</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#282a36',
    padding: 20,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#50fa7b',
    marginTop: 20,
  },
  message: {
    fontSize: 16,
    color: '#f8f8f2',
    textAlign: 'center',
    lineHeight: 24,
    opacity: 0.7,
  },
  infoBox: {
    backgroundColor: '#44475a',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#bd93f9',
    marginBottom: 12,
  },
  infoItem: {
    fontSize: 14,
    color: '#f8f8f2',
    marginBottom: 8,
    opacity: 0.8,
  },
});