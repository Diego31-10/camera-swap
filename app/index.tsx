import { View, Text, StyleSheet, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Camera, Images } from 'lucide-react-native';

/**
 * Pantalla inicial de la aplicación
 * Muestra opciones para navegar a Cámara o Galería
 */
export default function Index() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>SwapCamera</Text>
        <Text style={styles.subtitle}>Snap & Swipe</Text>
        <Text style={styles.description}>
          Captura fotos y decide con un gesto{'\n'}si guardarlas o descartarlas
        </Text>
      </View>

      {/* Navigation Buttons */}
      <View style={styles.buttonsContainer}>
        <Pressable 
          style={({ pressed }) => [
            styles.button,
            styles.cameraButton,
            pressed && styles.buttonPressed
          ]}
          onPress={() => router.push('/camera')}
        >
          <Camera color="#282a36" size={32} strokeWidth={2.5} />
          <Text style={styles.buttonText}>Abrir Cámara</Text>
        </Pressable>

        <Pressable 
          style={({ pressed }) => [
            styles.button,
            styles.galleryButton,
            pressed && styles.buttonPressed
          ]}
          onPress={() => router.push('/gallery')}
        >
          <Images color="#282a36" size={32} strokeWidth={2.5} />
          <Text style={styles.buttonText}>Ver Galería</Text>
        </Pressable>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>v1.0.0 - Fase 1</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#282a36',
    padding: 20,
    justifyContent: 'space-between',
  },
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#50fa7b',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 24,
    color: '#8be9fd',
    marginBottom: 20,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#f8f8f2',
    textAlign: 'center',
    lineHeight: 24,
    opacity: 0.8,
  },
  buttonsContainer: {
    gap: 16,
    marginBottom: 40,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderRadius: 16,
    gap: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  cameraButton: {
    backgroundColor: '#50fa7b',
  },
  galleryButton: {
    backgroundColor: '#8be9fd',
  },
  buttonPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#282a36',
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#6272a4',
  },
});