import { View, StyleSheet, Image, Pressable, Alert, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Trash2 } from 'lucide-react-native';
import { colors } from '@/lib/ui/colors';
import { usePhotoStore } from '@/lib/store/PhotoStore';

const { width, height } = Dimensions.get('window');

/**
 * Pantalla de detalle de foto
 * Muestra una foto en pantalla completa con opción de eliminar
 */
export default function PhotoDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { photos, removePhoto } = usePhotoStore();

  const photo = photos.find(p => p.id === id);

  if (!photo) {
    return (
      <View style={styles.container}>
        <StatusBar style="light" />
      </View>
    );
  }

  /**
   * Confirma y elimina la foto
   */
  const handleDelete = () => {
    Alert.alert(
      'Eliminar foto',
      '¿Estás seguro de que quieres eliminar esta foto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await removePhoto(photo.id);
              router.back();
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar la foto');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Imagen en pantalla completa */}
      <Image 
        source={{ uri: photo.uri }} 
        style={styles.image}
        resizeMode="contain"
      />

      {/* Botón de eliminar */}
      <Pressable 
        style={styles.deleteButton}
        onPress={handleDelete}
      >
        <Trash2 color={colors.foreground} size={24} strokeWidth={2.5} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  image: {
    width,
    height,
  },
  deleteButton: {
    position: 'absolute',
    bottom: 40,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.red,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});