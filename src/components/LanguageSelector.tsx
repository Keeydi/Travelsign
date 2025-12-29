import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme } from '../theme';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'ja', name: 'Japanese' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ko', name: 'Korean' },
  { code: 'es', name: 'Spanish' },
];

export function LanguageSelector({ selectedLanguage = 'en', onSelect }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Translation Language</Text>
      <View style={styles.languagesContainer}>
        {languages.map((lang) => (
          <TouchableOpacity
            key={lang.code}
            style={[
              styles.languageItem,
              selectedLanguage === lang.code && styles.languageItemSelected,
            ]}
            onPress={() => onSelect?.(lang.code)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.languageText,
                selectedLanguage === lang.code && styles.languageTextSelected,
              ]}
            >
              {lang.name}
            </Text>
            {selectedLanguage === lang.code && (
              <Feather name="check" size={20} color={theme.colors.primary} />
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

