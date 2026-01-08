import { View, StyleSheet, Pressable, Alert, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Trash2, Heart } from 'lucide-react-native';
import { colors } from '@/lib/ui/colors';
import { usePhotoStore } from '@/lib/store/PhotoStore';
import { GallerySwipeNavigation } from '@/components/organisms/GallerySwipeNavigation';

const { width } = Dimensions.get('window');

export default function PhotoDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { photos, removePhoto, toggleFavorite } = usePhotoStore();

  const currentIndex = photos.findIndex(p => p.id === id);
  const photo = photos[currentIndex];

  if (!photo || currentIndex === -1) {
    return <View style={styles.container}><StatusBar style="light" /></View>;
  }

  // Navegar a la foto Siguiente (más antigua en tu array)
  const goToNext = () => {
    if (currentIndex < photos.length - 1) {
      router.setParams({ id: photos[currentIndex + 1].id });
    }
  };

  // Navegar a la foto Anterior (más reciente en tu array)
  const goToPrevious = () => {
    if (currentIndex > 0) {
      router.setParams({ id: photos[currentIndex - 1].id });
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Eliminar foto',
      '¿Estás seguro?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              const nextId = photos[currentIndex + 1]?.id || photos[currentIndex - 1]?.id;
              await removePhoto(photo.id);
              if (nextId) {
                router.setParams({ id: nextId });
              } else {
                router.back();
              }
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <GallerySwipeNavigation
        photoUri={photo.uri}
        onSwipeLeft={currentIndex < photos.length - 1 ? goToNext : undefined}
        onSwipeRight={currentIndex > 0 ? goToPrevious : undefined}
        currentIndex={currentIndex}
        totalPhotos={photos.length}
      />

      {/* Botones de acción inferiores */}
      <View style={styles.footer}>
        <Pressable 
          style={[styles.actionButton, styles.favoriteBtn]} 
          onPress={() => toggleFavorite(photo.id)}
        >
          <Heart 
            color={photo.isFavorite ? colors.red : colors.foreground} 
            fill={photo.isFavorite ? colors.red : 'transparent'} 
            size={28} 
            strokeWidth={2}
          />
        </Pressable>

        <Pressable 
          style={[styles.actionButton, styles.deleteBtn]} 
          onPress={handleDelete}
        >
          <Trash2 color={colors.foreground} size={28} strokeWidth={2} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  footer: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    zIndex: 20,
  },
  actionButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
  },
  favoriteBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  deleteBtn: {
    backgroundColor: colors.red,
  },
});