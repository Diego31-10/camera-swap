import { View, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Images } from 'lucide-react-native';

/**
 * Pantalla de Galería
 * En la Fase 4 se implementará la funcionalidad completa
 */
export default function GalleryScreen() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.content}>
        <Images color="#8be9fd" size={80} strokeWidth={1.5} />
        <Text style={styles.title}>Galería</Text>
        <Text style={styles.message}>
          La galería de imágenes guardadas{'\n'}
          se implementará en la Fase 4
        </Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>Próximamente:</Text>
        <Text style={styles.infoItem}>• Visualización de imágenes guardadas</Text>
        <Text style={styles.infoItem}>• Grid de fotos</Text>
        <Text style={styles.infoItem}>• Vista detallada de cada imagen</Text>
        <Text style={styles.infoItem}>• Eliminación de imágenes</Text>
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
    color: '#8be9fd',
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