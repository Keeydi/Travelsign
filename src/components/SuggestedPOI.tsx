import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme } from '../theme';

export function SuggestedPOI({ onNavigate, pois = [] }) {
  const handlePOIClick = (poiId) => {
    onNavigate?.(`/poi-details?id=${poiId}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Suggested Places</Text>
        <TouchableOpacity>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {pois.map((poi) => (
          <TouchableOpacity
            key={poi.id}
            style={styles.poiCard}
            onPress={() => handlePOIClick(poi.id)}
            activeOpacity={0.8}
          >
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: poi.image }}
                style={styles.image}
                resizeMode="cover"
              />
              <View style={styles.imageOverlay} />
            </View>
            <View style={styles.content}>
              <Text style={styles.poiName} numberOfLines={1}>
                {poi.name}
              </Text>
              <Text style={styles.poiCategory} numberOfLines={1}>
                {poi.category}
              </Text>
              <View style={styles.footer}>
                <View style={styles.ratingContainer}>
                  <Feather name="star" size={14} color={theme.colors.accent} />
                  <Text style={styles.rating}>{poi.rating}</Text>
                </View>
                <Text style={styles.distance}>{poi.distance}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.xl + theme.spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  title: {
    fontFamily: theme.typography.bold,
    fontSize: 22,
    color: theme.colors.textPrimary,
    letterSpacing: -0.5,
  },
  seeAll: {
    fontFamily: theme.typography.semibold,
    fontSize: 15,
    color: theme.colors.primary,
    letterSpacing: 0.2,
  },
  scrollContent: {
    paddingRight: theme.spacing.lg,
  },
  poiCard: {
    width: 260,
    backgroundColor: theme.colors.card,
    borderRadius: theme.shapes.cardRadius,
    overflow: 'hidden',
    marginRight: theme.spacing.md,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    ...theme.shadow.card,
  },
  imageContainer: {
    width: '100%',
    height: 140,
    position: 'relative',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  content: {
    padding: theme.spacing.lg,
  },
  poiName: {
    fontFamily: theme.typography.bold,
    fontSize: 19,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs / 2,
    letterSpacing: -0.3,
  },
  poiCategory: {
    fontFamily: theme.typography.medium,
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
    letterSpacing: 0.1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs / 2,
    backgroundColor: theme.colors.backgroundLight,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs / 2,
    borderRadius: 12,
  },
  rating: {
    fontFamily: theme.typography.bold,
    fontSize: 14,
    color: theme.colors.textPrimary,
  },
  distance: {
    fontFamily: theme.typography.medium,
    fontSize: 13,
    color: theme.colors.textSecondary,
    letterSpacing: 0.1,
  },
});

