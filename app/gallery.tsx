import { View, Text, StyleSheet, FlatList, Pressable, Dimensions, RefreshControl } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Images, Camera, Heart } from 'lucide-react-native'; // Añadimos Heart
import { useRouter } from 'expo-router';
import { Image } from 'react-native';
import { colors } from '@/lib/ui/colors';
import { usePhotoStore } from '@/lib/store/PhotoStore';
import { useState } from 'react';

const { width } = Dimensions.get('window');
const ITEM_SIZE = (width - 48) / 3;

export default function GalleryScreen() {
  const router = useRouter();
  const { photos, isLoading, loadPhotos } = usePhotoStore();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPhotos();
    setRefreshing(false);
  };

  const openPhoto = (id: string) => {
    router.push(`/photo/${id}`);
  };

  if (!isLoading && photos.length === 0) {
    return (
      <View style={styles.container}>
        <StatusBar style="light" />
        <View style={styles.emptyContainer}>
          <Images color={colors.comment} size={80} strokeWidth={1.5} />
          <Text style={styles.emptyTitle}>No hay fotos guardadas</Text>
          <Text style={styles.emptyMessage}>
            Las fotos que guardes con swipe derecha{'\n'}
            aparecerán aquí
          </Text>
          <Pressable 
            style={styles.cameraButton}
            onPress={() => router.push('/camera')}
          >
            <Camera color={colors.background} size={24} strokeWidth={2.5} />
            <Text style={styles.cameraButtonText}>Abrir Cámara</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <Text style={styles.headerText}>
          {photos.length} {photos.length === 1 ? 'foto' : 'fotos'}
        </Text>
      </View>

      <FlatList
        data={photos}
        keyExtractor={(item) => item.id}
        numColumns={3}
        contentContainerStyle={styles.grid}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.green}
          />
        }
        renderItem={({ item }) => (
          <Pressable 
            style={({ pressed }) => [
              styles.gridItem,
              { opacity: pressed ? 0.8 : 1, transform: [{ scale: pressed ? 0.96 : 1 }] }
            ]}
            onPress={() => openPhoto(item.id)}
          >
            <Image 
              source={{ uri: item.uri }} 
              style={styles.thumbnail}
            />
            
            {/* Indicador de Favorito */}
            {item.isFavorite && (
              <View style={styles.favoriteBadge}>
                <Heart color={colors.red} fill={colors.red} size={12} />
              </View>
            )}
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    gap: 16,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.foreground,
    marginTop: 20,
  },
  emptyMessage: {
    fontSize: 16,
    color: colors.foreground,
    textAlign: 'center',
    opacity: 0.7,
    lineHeight: 24,
  },
  cameraButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.green,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 20,
  },
  cameraButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.background,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.selection,
  },
  headerText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.comment,
  },
  grid: {
    padding: 12,
  },
  gridItem: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    margin: 4,
    borderRadius: 12, // Un poco más redondeado se ve más moderno
    overflow: 'hidden',
    backgroundColor: colors.backgroundLight,
    position: 'relative', // Necesario para posicionar el corazón
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  favoriteBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    padding: 4,
    borderRadius: 10,
    backdropFilter: 'blur(4px)', // Si usas Expo, esto da un toque pro
  },
});