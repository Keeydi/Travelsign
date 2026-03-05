import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Platform,
  Linking,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme } from '../theme';

type POI = {
  id: string;
  name: string;
  category?: string;
  description?: string;
  address?: string;
  distanceMeters?: number;
  lat?: number;
  lng?: number;
  image?: string;
  rating?: string;
};

type POIDetailsScreenProps = {
  onNavigate: (route: string, params?: Record<string, any>) => void;
  poi: POI;
};

const PLACEHOLDER_IMAGES: Record<string, string> = {
  market: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=600&q=80',
  temple: 'https://images.unsplash.com/photo-1570521462033-3015e76e7432?w=600&q=80',
  park: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=600&q=80',
  historical: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&q=80',
  viewpoint: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600&q=80',
  default: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&q=80',
};

function getPlaceholderImage(poi: POI): string {
  if (poi.image) return poi.image;
  const cat = (poi.category || '').toLowerCase();
  for (const key of Object.keys(PLACEHOLDER_IMAGES)) {
    if (cat.includes(key)) return PLACEHOLDER_IMAGES[key];
  }
  return PLACEHOLDER_IMAGES.default;
}

function openMapsNavigation(poi: POI) {
  let url: string;

  if (typeof poi.lat === 'number' && typeof poi.lng === 'number') {
    url = Platform.select({
      ios: `maps://app?daddr=${poi.lat},${poi.lng}&dirflg=d`,
      android: `google.navigation:q=${poi.lat},${poi.lng}`,
    }) ?? `https://www.google.com/maps/dir/?api=1&destination=${poi.lat},${poi.lng}`;
  } else if (poi.address) {
    const encoded = encodeURIComponent(poi.address);
    url = `https://www.google.com/maps/search/?api=1&query=${encoded}`;
  } else {
    const encoded = encodeURIComponent(poi.name);
    url = `https://www.google.com/maps/search/?api=1&query=${encoded}`;
  }

  Linking.openURL(url).catch(() => {
    const fallback = encodeURIComponent(poi.address || poi.name);
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${fallback}`);
  });
}

export const POIDetailsScreen: React.FC<POIDetailsScreenProps> = ({
  onNavigate,
  poi,
}) => {
  if (!poi) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => onNavigate('/poi-list')}
          >
            <Feather name="arrow-left" size={24} color={theme.colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Place details</Text>
          <View style={styles.headerRight} />
        </View>
        <View style={styles.errorContainer}>
          <Feather name="alert-circle" size={40} color={theme.colors.muted} />
          <Text style={styles.errorTitle}>Place not found</Text>
          <Text style={styles.errorText}>No place data was provided.</Text>
        </View>
      </View>
    );
  }

  const imageUrl = getPlaceholderImage(poi);

  return (
    <View style={styles.container}>
      {/* Header overlaid on image */}
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: imageUrl }}
          style={styles.heroImage}
          resizeMode="cover"
        />
        <View style={styles.imageDim} />
        <View style={styles.headerOverlay}>
          <TouchableOpacity
            style={styles.backButtonOverlay}
            onPress={() => onNavigate('/poi-list')}
          >
            <Feather name="arrow-left" size={22} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.headerRight} />
        </View>
        {/* Place name on image */}
        <View style={styles.imageCaption}>
          {poi.category && (
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryBadgeText}>{poi.category}</Text>
            </View>
          )}
          <Text style={styles.placeName}>{poi.name}</Text>
          {poi.distanceMeters != null && (
            <View style={styles.distanceRow}>
              <Feather name="map-pin" size={13} color="rgba(255,255,255,0.8)" />
              <Text style={styles.distanceText}>
                {(poi.distanceMeters / 1000).toFixed(1)} km away
              </Text>
            </View>
          )}
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Rating */}
        {poi.rating && (
          <View style={styles.ratingRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Feather
                key={star}
                name="star"
                size={16}
                color={
                  star <= Math.round(parseFloat(poi.rating!))
                    ? theme.colors.accent
                    : theme.colors.border
                }
              />
            ))}
            <Text style={styles.ratingValue}>{poi.rating}</Text>
          </View>
        )}

        {/* Address */}
        {poi.address && (
          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Feather name="map" size={16} color={theme.colors.primary} />
            </View>
            <Text style={styles.infoText}>{poi.address}</Text>
          </View>
        )}

        {/* Overview */}
        <Text style={styles.sectionTitle}>Overview</Text>
        <Text style={styles.description}>
          {poi.description ||
            `${poi.name} is a ${poi.category?.toLowerCase() || 'notable'} destination worth visiting. ` +
            `Explore the local area to discover what makes this place unique. ` +
            `Connect to a live places API for detailed information.`}
        </Text>

        {/* Coordinates */}
        {typeof poi.lat === 'number' && typeof poi.lng === 'number' && (
          <View style={styles.coordsRow}>
            <Feather name="navigation" size={13} color={theme.colors.muted} />
            <Text style={styles.coordsText}>
              {poi.lat.toFixed(5)}, {poi.lng.toFixed(5)}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Action buttons */}
      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => onNavigate('/translation-result')}
        >
          <Feather name="message-circle" size={18} color={theme.colors.textPrimary} />
          <Text style={styles.secondaryButtonText}>Translation</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => openMapsNavigation(poi)}
        >
          <Feather name="navigation" size={18} color="#FFFFFF" />
          <Text style={styles.primaryButtonText}>Navigate</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  imageWrapper: {
    height: 240,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  imageDim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
  },
  backButtonOverlay: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundLight,
  },
  headerTitle: {
    fontFamily: theme.typography.bold,
    fontSize: 20,
    color: theme.colors.textPrimary,
  },
  headerRight: {
    width: 38,
  },
  imageCaption: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  categoryBadgeText: {
    fontFamily: theme.typography.medium,
    fontSize: 11,
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  placeName: {
    fontFamily: theme.typography.bold,
    fontSize: 26,
    color: '#FFFFFF',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  distanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  distanceText: {
    fontFamily: theme.typography.medium,
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginBottom: theme.spacing.md,
  },
  ratingValue: {
    fontFamily: theme.typography.semibold,
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginLeft: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  infoIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoText: {
    flex: 1,
    fontFamily: theme.typography.regular,
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 20,
    paddingTop: 6,
  },
  sectionTitle: {
    fontFamily: theme.typography.semibold,
    fontSize: 17,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  description: {
    fontFamily: theme.typography.regular,
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 22,
    marginBottom: theme.spacing.md,
  },
  coordsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: theme.spacing.xs,
  },
  coordsText: {
    fontFamily: theme.typography.regular,
    fontSize: 11,
    color: theme.colors.muted,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  },
  primaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.shapes.buttonRadius,
    paddingVertical: theme.spacing.md,
    gap: theme.spacing.xs,
    ...theme.shadow.button,
  },
  primaryButtonText: {
    fontFamily: theme.typography.semibold,
    fontSize: 16,
    color: '#FFFFFF',
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.shapes.buttonRadius,
    paddingVertical: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.backgroundLight,
    gap: theme.spacing.xs,
  },
  secondaryButtonText: {
    fontFamily: theme.typography.medium,
    fontSize: 16,
    color: theme.colors.textPrimary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing.sm,
    padding: theme.spacing.xl,
  },
  errorTitle: {
    fontFamily: theme.typography.semibold,
    fontSize: 18,
    color: theme.colors.textPrimary,
  },
  errorText: {
    fontFamily: theme.typography.regular,
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
});
