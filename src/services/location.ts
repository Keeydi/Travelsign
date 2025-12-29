import * as Location from 'expo-location';

export type LocationCoords = {
  lat: number;
  lng: number;
};

/**
 * Get the user's current location (best-effort).
 * Returns null if permission is denied or location is unavailable.
 */
export async function getCurrentLocation(): Promise<LocationCoords | null> {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.warn('Location permission not granted');
      return null;
    }

    const pos = await Location.getCurrentPositionAsync({});
    if (!pos || !pos.coords) return null;

    return {
      lat: pos.coords.latitude,
      lng: pos.coords.longitude,
    };
  } catch (err) {
    console.warn('Failed to get current location', err);
    return null;
  }
}


