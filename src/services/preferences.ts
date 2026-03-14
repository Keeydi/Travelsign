import AsyncStorage from '@react-native-async-storage/async-storage';

const TRANSLATION_LANGUAGE_KEY = '@linguajourney/translation_language';

export type TranslationLanguageCode = 'en' | 'ja' | 'zh' | 'es' | 'ko';

const VALID_CODES: TranslationLanguageCode[] = ['en', 'ja', 'zh', 'es', 'ko'];

export async function getTranslationLanguage(): Promise<TranslationLanguageCode> {
  try {
    const raw = await AsyncStorage.getItem(TRANSLATION_LANGUAGE_KEY);
    if (raw && VALID_CODES.includes(raw as TranslationLanguageCode)) {
      return raw as TranslationLanguageCode;
    }
  } catch {
    // ignore
  }
  return 'en';
}

export async function setTranslationLanguage(code: TranslationLanguageCode): Promise<void> {
  await AsyncStorage.setItem(TRANSLATION_LANGUAGE_KEY, code);
}
