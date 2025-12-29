import { BACKEND_CONFIG } from '../config/backend';

const { BASE_URL, TIMEOUT_MS } = BACKEND_CONFIG;

type CropRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export async function extractTextFromImage(
  imageBase64: string,
  cropRect: CropRect
): Promise<string> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(`${BASE_URL}/ocr`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        imageBase64,
        cropRect,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json?.error || 'OCR failed');
    }

    return (json.text || '').trim();
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error('OCR request timed out. Please check your connection and try again.');
    }
    throw err;
  }
}


