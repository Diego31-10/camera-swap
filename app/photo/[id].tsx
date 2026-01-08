import { View, StyleSheet, Image, Pressable, Alert, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Trash2 } from 'lucide-react-native';
import { colors } from '@/lib/ui/colors';
import { usePhotoStore } from '@/lib/store/PhotoStore';
import { GallerySwipeNavigation } from '@/components/organisms/GallerySwipeNavigation';

const { width, height } = Dimensions.get('window');

/**
 * Pantalla de detalle de foto
 * Muestra una foto en pantalla completa con navegación por gestos
 */
export default function PhotoDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { photos, removePhoto } = usePhotoStore();

  const currentIndex = photos.findIndex(p => p.id === id);
  const photo = photos[currentIndex];

  if (!photo || currentIndex === -1) {
    return (
      <View style={styles.container}>
        <StatusBar style="light" />
      </View>
    );
  }

  /**
   * Navega a la foto anterior
   */
  const goToPrevious = () => {
    if (currentIndex < photos.length - 1) {
      const previousPhoto = photos[currentIndex + 1];
      router.setParams({ id: previousPhoto.id });
    }
  };

  /**
   * Navega a la foto siguiente
   */
  const goToNext = () => {
    if (currentIndex > 0) {
      const nextPhoto = photos[currentIndex - 1];
      router.setParams({ id: nextPhoto.id });
    }
  };

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
              
              // Si hay más fotos, navegar a la siguiente o anterior
              if (photos.length > 1) {
                if (currentIndex > 0) {
                  goToNext();
                } else if (currentIndex < photos.length - 1) {
                  goToPrevious();
                } else {
                  router.back();
                }
              } else {
                router.back();
              }
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar la foto');
            }
          },
        },
      ]
    );
  };

  const hasNext = currentIndex > 0;
  const hasPrevious = currentIndex < photos.length - 1;

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <GallerySwipeNavigation
        photoUri={photo.uri}
        onSwipeLeft={hasNext ? goToNext : undefined}
        onSwipeRight={hasPrevious ? goToPrevious : undefined}
        currentIndex={currentIndex}
        totalPhotos={photos.length}
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
    zIndex: 10,
  },
});