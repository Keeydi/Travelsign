import { BACKEND_CONFIG } from '../config/backend';

const BASE_URL = BACKEND_CONFIG.BASE_URL;

export type NearbyPlace = {
  id: string;
  name: string;
  category?: string;
  lat?: number;
  lng?: number;
};

export async function fetchNearbyPlaces(
  lat: number,
  lng: number,
  radiusMeters: number = 5000
): Promise<NearbyPlace[]> {
  const url = `${BASE_URL}/nearby?lat=${encodeURIComponent(
    lat
  )}&lng=${encodeURIComponent(lng)}&radius_m=${encodeURIComponent(
    radiusMeters
  )}`;

  const res = await fetch(url);
  const json = await res.json();

  if (!res.ok) {
    console.warn('Failed to fetch nearby places', json?.error);
    return [];
  }

  return Array.isArray(json.places) ? json.places : [];
}


