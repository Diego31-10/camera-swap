import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';

/**
 * Layout principal de la aplicación
 * Configura el Stack Navigator y el GestureHandler
 */
export default function RootLayout() {
  return (
    <GestureHandlerRootView style={styles.container}>
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
      </Stack>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});