import { View, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';

/**
 * Pantalla inicial temporal
 * Será reemplazada en la Fase 1
 */
export default function Index() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Text style={styles.title}>SwapCamera</Text>
      <Text style={styles.subtitle}>Snap & Swipe</Text>
      <Text style={styles.version}>v1.0.0 - Setup completo ✓</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#282a36',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#50fa7b',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 24,
    color: '#8be9fd',
    marginBottom: 40,
  },
  version: {
    fontSize: 14,
    color: '#6272a4',
    marginTop: 20,
  },
});