import { BACKEND_CONFIG } from '../config/backend';

const { BASE_URL, TIMEOUT_MS } = BACKEND_CONFIG;

// Map UI language choices to friendly labels for Gemini.
const langMap: Record<'en' | 'ja' | 'zh' | 'es' | 'ko', string> = {
  en: 'English',
  ja: 'Japanese',
  zh: 'Chinese',
  es: 'Spanish',
  ko: 'Korean',
};

export async function translateText(
  text: string,
  targetLanguage: 'en' | 'ja' | 'zh' | 'es' | 'ko'
): Promise<string> {
  if (!text) return '';
  const target = langMap[targetLanguage] ?? 'English';

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const res = await fetch(`${BASE_URL}/translate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        targetLang: target,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    const json = await res.json();
    if (!res.ok) {
      console.warn('Backend translate error', json?.error);
      return text;
    }

    const translated = json?.translatedText;
    if (typeof translated === 'string' && translated.trim()) {
      return translated.trim();
    }
  } catch (err: any) {
    if (err.name === 'AbortError') {
      console.warn('Translation request timed out. Please check your connection.');
    } else {
      console.warn('Translation request to backend failed', err);
    }
  }

  // Fallback: return original text if translation fails
  return text;
}




