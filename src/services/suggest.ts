import { BACKEND_CONFIG } from '../config/backend';

const BASE_URL = BACKEND_CONFIG.BASE_URL;

export type SuggestedPlace = {
  id: string;
  name: string;
  category: string;
  description: string;
  rating: string;
  distance: string;
  image: string;
  lat?: number | null;
  lng?: number | null;
};

export type SuggestResponse = {
  places: SuggestedPlace[];
  location: string;
};

export async function fetchSuggestedPlaces(
  lat: number,
  lng: number
): Promise<SuggestResponse> {
  const url = `${BASE_URL}/suggest?lat=${encodeURIComponent(lat)}&lng=${encodeURIComponent(lng)}`;
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
  });
  const json = await res.json();

  if (!res.ok) {
    console.warn('Failed to fetch suggested places', json?.error);
    return { places: [], location: '' };
  }

  return {
    places: Array.isArray(json.places) ? json.places : [],
    location: json.location || '',
  };
}
