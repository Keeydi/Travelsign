import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme } from '../theme';
import { translateText } from '../services/translate';

type TranslationResultScreenProps = {
  onNavigate: (route: string, params?: Record<string, any>) => void;
  originalText?: string;
  translatedText?: string;
  captureLocation?: {
    lat: number;
    lng: number;
  };
  cropRect?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
};

export const TranslationResultScreen: React.FC<TranslationResultScreenProps> = ({
  onNavigate,
  originalText,
  translatedText,
  captureLocation,
}) => {
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'ja' | 'zh' | 'es' | 'ko'>('en');
  const [currentTranslation, setCurrentTranslation] = useState<string>(translatedText ?? '');
  const [isTranslating, setIsTranslating] = useState(false);

  const handleChangeLanguage = async (lang: 'en' | 'ja' | 'zh' | 'es' | 'ko') => {
    if (!originalText || isTranslating) return;
    try {
      setIsTranslating(true);
      setCurrentLanguage(lang);
      const next = await translateText(originalText, lang);
      setCurrentTranslation(next);
    } catch (err) {
      console.warn('Language re-translate failed', err);
    } finally {
      setIsTranslating(false);
    }
  };

  const renderLanguageButton = (
    label: string,
    lang: 'en' | 'ja' | 'zh' | 'es' | 'ko'
  ) => {
    const selected = currentLanguage === lang;
    return (
      <TouchableOpacity
        key={lang}
        style={[
          styles.languageChip,
          selected && styles.languageChipSelected,
        ]}
        onPress={() => handleChangeLanguage(lang)}
        disabled={isTranslating || !originalText}
      >
        <Text
          style={[
            styles.languageChipText,
            selected && styles.languageChipTextSelected,
          ]}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => onNavigate('/scan-preview')}
        >
          <Feather name="arrow-left" size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Translation</Text>
        <View style={styles.headerRight} />
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.label}>Original</Text>
          <Text style={styles.originalText}>
            {originalText || 'Detected text will appear here'}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Translated</Text>

          <View style={styles.languageRow}>
            {renderLanguageButton('EN', 'en')}
            {renderLanguageButton('Japanese', 'ja')}
            {renderLanguageButton('Chinese', 'zh')}
            {renderLanguageButton('Spanish', 'es')}
            {renderLanguageButton('Korean', 'ko')}
          </View>

          <Text style={styles.translatedText}>
            {isTranslating
              ? 'Translating…'
              : currentTranslation || translatedText || 'Translation will appear here'}
          </Text>
        </View>

        {captureLocation && (
          <View style={styles.locationRow}>
            <Feather name="map-pin" size={16} color={theme.colors.textSecondary} />
            <Text style={styles.locationText}>
              {captureLocation.lat.toFixed(4)}, {captureLocation.lng.toFixed(4)}
            </Text>
          </View>
        )}

        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => onNavigate('/scan')}
          >
            <Feather name="aperture" size={18} color={theme.colors.textPrimary} />
            <Text style={styles.secondaryButtonText}>Scan again</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => onNavigate('/poi-list', { pois: [], location: captureLocation })}
          >
            <Feather name="map" size={18} color="#FFFFFF" />
            <Text style={styles.primaryButtonText}>Nearby places</Text>
          </TouchableOpacity>
        </View>
      </View>
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
  content: {
    flex: 1,
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  card: {
    borderRadius: theme.shapes.cardRadius,
    backgroundColor: theme.colors.cardLight,
    padding: theme.spacing.md,
  },
  label: {
    fontFamily: theme.typography.medium,
    fontSize: 12,
    color: theme.colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: theme.spacing.xs,
  },
  originalText: {
    fontFamily: theme.typography.regular,
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  translatedText: {
    fontFamily: theme.typography.semibold,
    fontSize: 20,
    color: theme.colors.textPrimary,
  },
  languageRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.sm,
  },
  languageChip: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.backgroundLight,
  },
  languageChipSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  languageChipText: {
    fontFamily: theme.typography.medium,
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  languageChipTextSelected: {
    color: '#FFFFFF',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.sm,
  },
  locationText: {
    marginLeft: theme.spacing.xs,
    fontFamily: theme.typography.regular,
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 'auto',
    gap: theme.spacing.sm,
  },
  primaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.shapes.buttonRadius,
    paddingVertical: theme.spacing.md,
  },
  primaryButtonText: {
    marginLeft: theme.spacing.xs,
    fontFamily: theme.typography.semibold,
    fontSize: 16,
    color: '#FFFFFF',
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.shapes.buttonRadius,
    paddingVertical: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.backgroundLight,
  },
  secondaryButtonText: {
    marginLeft: theme.spacing.xs,
    fontFamily: theme.typography.medium,
    fontSize: 16,
    color: theme.colors.textPrimary,
  },
});


