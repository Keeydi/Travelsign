import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import MapView, { Marker, UrlTile, PROVIDER_DEFAULT } from 'react-native-maps';
import { Feather } from '@expo/vector-icons';
import { theme } from '../theme';
import { getCurrentLocation } from '../services/location';
import { fetchNearbyPlaces } from '../services/nearby';

type POI = {
  id: string;
  name: string;
  category?: string;
  distanceMeters?: number;
  lat?: number;
  lng?: number;
};

type POIListScreenProps = {
  onNavigate: (route: string, params?: Record<string, any>) => void;
  pois: POI[];
  searchQuery?: string;
  captureLocation?: { lat: number; lng: number };
};

const CATEGORY_ICONS: Record<string, string> = {
  restaurant: 'coffee',
  cafe: 'coffee',
  hotel: 'home',
  hostel: 'home',
  supermarket: 'shopping-cart',
  mall: 'shopping-bag',
  convenience: 'shopping-bag',
  shop: 'shopping-bag',
  museum: 'book',
  gallery: 'image',
  park: 'sun',
  playground: 'sun',
  stadium: 'flag',
  hospital: 'activity',
  pharmacy: 'activity',
  bank: 'credit-card',
  monument: 'award',
  castle: 'award',
  attraction: 'star',
  viewpoint: 'eye',
  place_of_worship: 'heart',
  default: 'map-pin',
};

function getCategoryIcon(category?: string): string {
  if (!category) return CATEGORY_ICONS.default;
  const lower = category.toLowerCase();
  for (const key of Object.keys(CATEGORY_ICONS)) {
    if (lower.includes(key)) return CATEGORY_ICONS[key];
  }
  return CATEGORY_ICONS.default;
}

export const POIListScreen: React.FC<POIListScreenProps> = ({
  onNavigate,
  pois,
  searchQuery,
  captureLocation,
}) => {
  const [effectiveLocation, setEffectiveLocation] = useState(captureLocation ?? null);
  const [nearbyPois, setNearbyPois] = useState<POI[]>(pois?.length ? pois : []);
  const [loadingNearby, setLoadingNearby] = useState(false);
  const [locating, setLocating] = useState(!captureLocation);

  // Fallback: get current location if not passed in
  useEffect(() => {
    if (captureLocation || effectiveLocation) return;
    (async () => {
      setLocating(true);
      const loc = await getCurrentLocation();
      if (loc) setEffectiveLocation(loc);
      setLocating(false);
    })();
  }, [captureLocation, effectiveLocation]);

  // Fetch real nearby places from Overpass/backend when we have location
  useEffect(() => {
    if (!effectiveLocation) return;
    (async () => {
      try {
        setLoadingNearby(true);
        const places = await fetchNearbyPlaces(
          effectiveLocation.lat,
          effectiveLocation.lng,
          5000
        );
        const mapped: POI[] = places.map((p, idx) => ({
          id: p.id || String(idx),
          name: p.name,
          category: p.category || 'Place',
          lat: p.lat,
          lng: p.lng,
        }));
        if (mapped.length > 0) setNearbyPois(mapped);
      } catch (err) {
        console.warn('Failed to load nearby places', err);
      } finally {
        setLoadingNearby(false);
      }
    })();
  }, [effectiveLocation]);

  const displayData =
    nearbyPois.length > 0
      ? nearbyPois
      : [{ id: 'empty', name: 'No nearby places found', category: 'Info' }];

  const handlePressPOI = (poi: POI) => onNavigate('/poi-details', { poi });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => onNavigate('/translation-result')}
        >
          <Feather name="arrow-left" size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nearby places</Text>
        <View style={styles.headerRight} />
      </View>

      {/* OSM Map */}
      {locating ? (
        <View style={styles.mapPlaceholder}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.mapPlaceholderText}>Getting your location…</Text>
        </View>
      ) : effectiveLocation ? (
        <View style={styles.mapContainer}>
          <MapView
            provider={PROVIDER_DEFAULT}
            style={styles.map}
            mapType="none"
            initialRegion={{
              latitude: effectiveLocation.lat,
              longitude: effectiveLocation.lng,
              latitudeDelta: 0.02,
              longitudeDelta: 0.02,
            }}
            showsUserLocation
            showsMyLocationButton
            zoomEnabled
            scrollEnabled
            rotateEnabled
          >
            {/* OpenStreetMap tiles */}
            <UrlTile
              urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
              maximumZ={19}
              flipY={false}
              tileSize={256}
            />

            {/* User location pin */}
            <Marker
              coordinate={{
                latitude: effectiveLocation.lat,
                longitude: effectiveLocation.lng,
              }}
              title="You are here"
              description="Your current location"
              pinColor={theme.colors.primary}
            />

            {/* Nearby place pins */}
            {nearbyPois
              .filter((p) => typeof p.lat === 'number' && typeof p.lng === 'number')
              .map((p) => (
                <Marker
                  key={p.id}
                  coordinate={{ latitude: p.lat!, longitude: p.lng! }}
                  title={p.name}
                  description={p.category || 'Place'}
                  onCalloutPress={() => handlePressPOI(p)}
                />
              ))}
          </MapView>

          {/* OSM attribution (required by OSM usage policy) */}
          <View style={styles.osmAttribution}>
            <Text style={styles.osmAttributionText}>© OpenStreetMap contributors</Text>
          </View>

          {/* Location badge */}
          <View style={styles.locationBadge}>
            <Feather name="navigation" size={12} color={theme.colors.primary} />
            <Text style={styles.locationBadgeText}>
              {effectiveLocation.lat.toFixed(4)}, {effectiveLocation.lng.toFixed(4)}
            </Text>
          </View>
        </View>
      ) : (
        <View style={styles.mapPlaceholder}>
          <Feather name="map-off" size={32} color={theme.colors.muted} />
          <Text style={styles.mapPlaceholderText}>Location unavailable</Text>
        </View>
      )}

      {/* Search context */}
      {searchQuery ? (
        <Text style={styles.subtitle}>Results for "{searchQuery}"</Text>
      ) : null}

      {/* Section header */}
      <View style={styles.listHeader}>
        <Text style={styles.listHeaderText}>
          {loadingNearby ? 'Searching nearby…' : `${nearbyPois.length} places found`}
        </Text>
        {loadingNearby && <ActivityIndicator size="small" color={theme.colors.primary} />}
      </View>

      {/* List */}
      <FlatList
        data={displayData}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => item.id !== 'empty' && handlePressPOI(item)}
            activeOpacity={item.id === 'empty' ? 1 : 0.7}
          >
            <View style={styles.itemIcon}>
              <Feather
                name={getCategoryIcon(item.category) as any}
                size={18}
                color={item.id === 'empty' ? theme.colors.muted : theme.colors.primary}
              />
            </View>
            <View style={styles.itemTextContainer}>
              <Text
                style={[
                  styles.itemTitle,
                  item.id === 'empty' && { color: theme.colors.textSecondary },
                ]}
              >
                {item.name}
              </Text>
              <Text style={styles.itemSubtitle}>
                {item.category || 'Point of interest'}
                {item.distanceMeters
                  ? ` · ${(item.distanceMeters / 1000).toFixed(1)} km`
                  : ''}
              </Text>
            </View>
            {item.id !== 'empty' && (
              <Feather name="chevron-right" size={18} color={theme.colors.muted} />
            )}
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
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
    width: 40,
  },
  mapContainer: {
    height: 220,
    marginHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderRadius: theme.shapes.cardRadius,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.border,
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  mapPlaceholder: {
    height: 200,
    marginHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderRadius: theme.shapes.cardRadius,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  mapPlaceholderText: {
    fontFamily: theme.typography.regular,
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  osmAttribution: {
    position: 'absolute',
    bottom: 4,
    right: 6,
    backgroundColor: 'rgba(255,255,255,0.75)',
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  osmAttributionText: {
    fontFamily: theme.typography.regular,
    fontSize: 9,
    color: '#444',
  },
  locationBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  locationBadgeText: {
    fontFamily: theme.typography.medium,
    fontSize: 11,
    color: theme.colors.textSecondary,
  },
  subtitle: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xs,
    fontFamily: theme.typography.regular,
    fontSize: 13,
    color: theme.colors.textSecondary,
  },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.backgroundLight,
  },
  listHeaderText: {
    fontFamily: theme.typography.medium,
    fontSize: 12,
    color: theme.colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  listContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
  },
  separator: {
    height: 1,
    backgroundColor: theme.colors.border,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  itemIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  itemTextContainer: {
    flex: 1,
  },
  itemTitle: {
    fontFamily: theme.typography.semibold,
    fontSize: 15,
    color: theme.colors.textPrimary,
  },
  itemSubtitle: {
    marginTop: 2,
    fontFamily: theme.typography.regular,
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  loadingText: {
    fontFamily: theme.typography.regular,
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
});
