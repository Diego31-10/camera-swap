import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { PhotoStoreProvider } from '@/lib/store/PhotoStore';

/**
 * Layout principal de la aplicación
 * Configura el Stack Navigator, GestureHandler y el Store global
 */
export default function RootLayout() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <PhotoStoreProvider>
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: '#282a36',
            },
            headerTintColor: '#f8f8f2',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            contentStyle: {
              backgroundColor: '#282a36',
            },
          }}
        >
          <Stack.Screen 
            name="index" 
            options={{ 
              title: 'SwapCamera',
              headerShown: true,
            }} 
          />
          <Stack.Screen 
            name="camera" 
            options={{ 
              title: 'Cámara',
              headerShown: true,
            }} 
          />
          <Stack.Screen 
            name="gallery" 
            options={{ 
              title: 'Galería',
              headerShown: true,
            }} 
          />
          <Stack.Screen 
            name="photo/[id]" 
            options={{ 
              title: 'Foto',
              headerShown: true,
              presentation: 'modal',
            }} 
          />
        </Stack>
      </PhotoStoreProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});