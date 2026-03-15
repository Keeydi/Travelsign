import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme } from '../theme';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import type { TranslationLanguageCode } from '../services/preferences';

const LANGUAGE_KEYS: { code: TranslationLanguageCode; nameKey: 'langEnglish' | 'langJapanese' | 'langChinese' | 'langKorean' | 'langSpanish' }[] = [
  { code: 'en', nameKey: 'langEnglish' },
  { code: 'ja', nameKey: 'langJapanese' },
  { code: 'zh', nameKey: 'langChinese' },
  { code: 'ko', nameKey: 'langKorean' },
  { code: 'es', nameKey: 'langSpanish' },
];

export function LanguageSelector({ selectedLanguage = 'en', onSelect }) {
  const { t } = useLanguage();
  const { theme: activeTheme } = useTheme();
  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: activeTheme.colors.textPrimary }]}>{t.translationLanguage}</Text>
      <View style={[styles.languagesContainer, { backgroundColor: activeTheme.colors.card, borderColor: activeTheme.colors.border }]}>
        {LANGUAGE_KEYS.map((lang) => (
          <TouchableOpacity
            key={lang.code}
            style={[
              styles.languageItem,
              { borderBottomColor: activeTheme.colors.border },
              selectedLanguage === lang.code && { backgroundColor: activeTheme.colors.backgroundLight },
            ]}
            onPress={() => onSelect?.(lang.code)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.languageText,
                { color: activeTheme.colors.textPrimary },
                selectedLanguage === lang.code && { color: activeTheme.colors.primary },
              ]}
            >
              {t[lang.nameKey]}
            </Text>
            {selectedLanguage === lang.code && (
              <Feather name="check" size={20} color={activeTheme.colors.primary} />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.xl,
  },
  title: {
    fontFamily: theme.typography.bold,
    fontSize: 20,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
    letterSpacing: -0.3,
  },
  languagesContainer: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.shapes.cardRadius,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  languageItemSelected: {
    backgroundColor: theme.colors.backgroundLight,
  },
  languageText: {
    fontFamily: theme.typography.regular,
    fontSize: 16,
    color: theme.colors.textPrimary,
  },
  languageTextSelected: {
    fontFamily: theme.typography.semibold,
    color: theme.colors.primary,
  },
});

