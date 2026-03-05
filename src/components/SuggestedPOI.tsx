import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme } from '../theme';
import { getCurrentLocation } from '../services/location';
import { fetchSuggestedPlaces, type SuggestedPlace } from '../services/suggest';

// Fallback cards shown while loading or if API fails
const FALLBACK_PLACES: SuggestedPlace[] = [
  {
    id: 'f1',
    name: 'Asakusa Temple',
    category: 'Landmark',
    description: 'One of Tokyo\'s most famous temples, featuring the iconic Kaminarimon gate and a lively shopping street.',
    rating: '4.8',
    distance: '0.4 km',
    image: 'https://images.unsplash.com/photo-1570521462033-3015e76e7432?w=400&q=80',
  },
  {
    id: 'f2',
    name: 'Central Market',
    category: 'Market',
    description: 'A bustling local market offering fresh produce, street food, and handcrafted souvenirs.',
    rating: '4.5',
    distance: '0.8 km',
    image: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=400&q=80',
  },
  {
    id: 'f3',
    name: 'Riverside Walk',
    category: 'Park',
    description: 'A scenic waterfront promenade perfect for a leisurely stroll with great city views.',
    rating: '4.6',
    distance: '1.2 km',
    image: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=400&q=80',
  },
  {
    id: 'f4',
    name: 'Old Town Square',
    category: 'Historical',
    description: 'A charming historic plaza surrounded by colorful colonial buildings and local galleries.',
    rating: '4.7',
    distance: '1.6 km',
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&q=80',
  },
];

type SuggestedPOIProps = {
  onNavigate?: (route: string, params?: Record<string, any>) => void;
  pois?: SuggestedPlace[];
};

export function SuggestedPOI({ onNavigate, pois }: SuggestedPOIProps) {
  const [places, setPlaces] = useState<SuggestedPlace[]>(
    pois && pois.length > 0 ? pois : FALLBACK_PLACES
  );
  const [locationLabel, setLocationLabel] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (pois && pois.length > 0) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(false);
        const loc = await getCurrentLocation();
        if (!loc) throw new Error('Location unavailable');

        const result = await fetchSuggestedPlaces(loc.lat, loc.lng);
        if (!cancelled) {
          if (result.places.length > 0) {
            setPlaces(result.places);
          } else {
            setPlaces(FALLBACK_PLACES);
            setError(true);
          }
          setLocationLabel(result.location);
        }
      } catch (err) {
        if (!cancelled) {
          setPlaces(FALLBACK_PLACES);
          setError(true);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [pois]);

  const handlePOIClick = (poi: SuggestedPlace) => {
    onNavigate?.('/poi-details', { poi });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Suggested Places</Text>
          {loading && (
            <ActivityIndicator
              size="small"
              color={theme.colors.primary}
              style={styles.spinner}
            />
          )}
        </View>
        <TouchableOpacity onPress={() => onNavigate?.('/poi-list', { pois: places })}>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>

      {locationLabel ? (
        <View style={styles.locationRow}>
          <Feather name="map-pin" size={12} color={theme.colors.primary} />
          <Text style={styles.locationText}>Near {locationLabel}</Text>
          <View style={styles.aiBadge}>
            <Feather name="zap" size={10} color={theme.colors.primary} />
            <Text style={styles.aiBadgeText}>AI</Text>
          </View>
        </View>
      ) : null}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {places.map((poi) => (
          <TouchableOpacity
            key={poi.id}
            style={styles.poiCard}
            onPress={() => handlePOIClick(poi)}
            activeOpacity={0.85}
          >
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: poi.image }}
                style={styles.image}
                resizeMode="cover"
              />
              <View style={styles.imageDim} />
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryBadgeText}>{poi.category}</Text>
              </View>
            </View>

            <View style={styles.content}>
              <Text style={styles.poiName} numberOfLines={1}>
                {poi.name}
              </Text>
              <Text style={styles.poiDescription} numberOfLines={2}>
                {poi.description}
              </Text>
              <View style={styles.footer}>
                <View style={styles.ratingContainer}>
                  <Feather name="star" size={12} color="#D97706" />
                  <Text style={styles.rating}>{poi.rating}</Text>
                </View>
                <View style={styles.distanceContainer}>
                  <Feather name="map-pin" size={11} color={theme.colors.textSecondary} />
                  <Text style={styles.distance}>{poi.distance}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {error && (
        <Text style={styles.errorHint}>
          Showing sample places — connect to backend for personalized AI suggestions
        </Text>
      )}
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
    marginBottom: theme.spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  title: {
    fontFamily: theme.typography.bold,
    fontSize: 22,
    color: theme.colors.textPrimary,
    letterSpacing: -0.5,
  },
  spinner: {
    marginLeft: 4,
  },
  seeAll: {
    fontFamily: theme.typography.semibold,
    fontSize: 15,
    color: theme.colors.primary,
    letterSpacing: 0.2,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: theme.spacing.md,
  },
  locationText: {
    fontFamily: theme.typography.medium,
    fontSize: 12,
    color: theme.colors.textSecondary,
    flex: 1,
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#EFF6FF',
    borderRadius: 999,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: theme.colors.primary + '30',
  },
  aiBadgeText: {
    fontFamily: theme.typography.bold,
    fontSize: 10,
    color: theme.colors.primary,
  },
  scrollContent: {
    paddingRight: theme.spacing.lg,
  },
  poiCard: {
    width: 240,
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
    height: 130,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageDim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.08)',
  },
  categoryBadge: {
    position: 'absolute',
    bottom: theme.spacing.sm,
    left: theme.spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  categoryBadgeText: {
    fontFamily: theme.typography.medium,
    fontSize: 10,
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  content: {
    padding: theme.spacing.md,
  },
  poiName: {
    fontFamily: theme.typography.bold,
    fontSize: 16,
    color: theme.colors.textPrimary,
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  poiDescription: {
    fontFamily: theme.typography.regular,
    fontSize: 12,
    color: theme.colors.textSecondary,
    lineHeight: 17,
    marginBottom: theme.spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 10,
  },
  rating: {
    fontFamily: theme.typography.bold,
    fontSize: 11,
    color: '#92400E',
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  distance: {
    fontFamily: theme.typography.medium,
    fontSize: 11,
    color: theme.colors.textSecondary,
  },
  errorHint: {
    fontFamily: theme.typography.regular,
    fontSize: 11,
    color: theme.colors.muted,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
    fontStyle: 'italic',
  },
});
