import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LanguageSelector } from '../components/LanguageSelector';
import { ToggleAROverlay } from '../components/ToggleAROverlay';
import { ThemeSwitch } from '../components/ThemeSwitch';
import { theme } from '../theme';
import { Toast } from '../components/Toast';
import { getTranslationLanguage, type TranslationLanguageCode } from '../services/preferences';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

type SettingsScreenProps = {
  onNavigate: (route: string, params?: Record<string, any>) => void;
};

function SectionHeader({ title }: { title: string }) {
  const { theme: activeTheme } = useTheme();
  return <Text style={[sectionStyles.header, { color: activeTheme.colors.textSecondary }]}>{title}</Text>;
}

function SettingsRow({
  icon,
  iconColor,
  label,
  sublabel,
  onPress,
  rightElement,
  destructive,
}: {
  icon: string;
  iconColor?: string;
  label: string;
  sublabel?: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
  destructive?: boolean;
}) {
  const { theme: activeTheme } = useTheme();
  return (
    <TouchableOpacity
      style={[sectionStyles.row, { backgroundColor: activeTheme.colors.card, borderBottomColor: activeTheme.colors.border }]}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      disabled={!onPress && !rightElement}
    >
      <View
        style={[
          sectionStyles.rowIcon,
          { backgroundColor: (iconColor ?? activeTheme.colors.primary) + '18' },
        ]}
      >
        <Feather
          name={icon as any}
          size={18}
          color={iconColor ?? activeTheme.colors.primary}
        />
      </View>
      <View style={sectionStyles.rowText}>
        <Text
          style={[
            sectionStyles.rowLabel,
            { color: activeTheme.colors.textPrimary },
            destructive && { color: activeTheme.colors.danger },
          ]}
        >
          {label}
        </Text>
        {sublabel ? (
          <Text style={[sectionStyles.rowSublabel, { color: activeTheme.colors.textSecondary }]}>{sublabel}</Text>
        ) : null}
      </View>
      {rightElement ?? (
        onPress ? (
          <Feather
            name="chevron-right"
            size={18}
            color={activeTheme.colors.muted}
          />
        ) : null
      )}
    </TouchableOpacity>
  );
}

const sectionStyles = StyleSheet.create({
  header: {
    fontFamily: theme.typography.semibold,
    fontSize: 12,
    color: theme.colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: theme.spacing.sm,
    marginTop: theme.spacing.lg,
    paddingHorizontal: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  rowIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  rowText: {
    flex: 1,
  },
  rowLabel: {
    fontFamily: theme.typography.medium,
    fontSize: 15,
    color: theme.colors.textPrimary,
  },
  rowSublabel: {
    fontFamily: theme.typography.regular,
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
});

export function SettingsScreen({ onNavigate }: SettingsScreenProps) {
  const { theme: activeTheme, isDark: isDarkMode, setDark: setThemePreference } = useTheme();
  const { language: contextLanguage, setLanguage: setContextLanguage, t } = useLanguage();
  const [selectedLanguage, setSelectedLanguage] = useState<TranslationLanguageCode | null>(null);
  const [arOverlayEnabled, setArOverlayEnabled] = useState(true);

  // Load persisted language on mount; keep in sync with context when context updates (e.g. from another tab)
  useEffect(() => {
    let cancelled = false;
    getTranslationLanguage().then((lang) => {
      if (!cancelled) setSelectedLanguage(lang);
    });
    return () => { cancelled = true; };
  }, []);
  useEffect(() => {
    setSelectedLanguage(contextLanguage);
  }, [contextLanguage]);

  const handleLanguageChange = (langCode: string) => {
    const code = langCode as TranslationLanguageCode;
    setSelectedLanguage(code);
    setContextLanguage(code);
    Toast.show({
      type: 'success',
      text1: t.languageUpdated,
      text2: t.languageUpdatedMessage,
    });
  };

  const handleAROverlayToggle = (enabled: boolean) => {
    setArOverlayEnabled(enabled);
  };

  const handleThemeToggle = (isDark: boolean) => {
    setThemePreference(isDark);
  };

  const handlePrivacyPolicy = () => {
    onNavigate?.('/privacy-policy');
  };

  return (
    <View style={[styles.container, { backgroundColor: activeTheme.colors.backgroundLight }]}>
      <View style={[styles.header, { backgroundColor: activeTheme.colors.background, borderBottomColor: activeTheme.colors.border }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => onNavigate?.('/dashboard')}
        >
          <Feather name="arrow-left" size={24} color={activeTheme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: activeTheme.colors.textPrimary }]}>{t.settings}</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Translation */}
        <SectionHeader title={t.translation} />
        <View style={[styles.settingsCard, { backgroundColor: activeTheme.colors.background, borderColor: activeTheme.colors.border }]}>
          {selectedLanguage === null ? (
            <View style={styles.loadingRow}>
              <Text style={[styles.loadingText, { color: activeTheme.colors.textSecondary }]}>{t.loadingLanguage}</Text>
            </View>
          ) : (
            <LanguageSelector
              selectedLanguage={selectedLanguage}
              onSelect={handleLanguageChange}
            />
          )}
        </View>

        {/* Display */}
        <SectionHeader title={t.display} />
        <View style={[styles.settingsCard, { backgroundColor: activeTheme.colors.background, borderColor: activeTheme.colors.border }]}>
          <ToggleAROverlay
            enabled={arOverlayEnabled}
            onToggle={handleAROverlayToggle}
          />
          <ThemeSwitch isDark={isDarkMode} onToggle={handleThemeToggle} />
        </View>

        {/* About */}
        <SectionHeader title={t.about} />
        <View style={[styles.settingsCard, styles.rowsCard, { backgroundColor: activeTheme.colors.background, borderColor: activeTheme.colors.border }]}>
          <SettingsRow
            icon="shield"
            label={t.privacyPolicy}
            sublabel={t.privacyPolicySublabel}
            onPress={handlePrivacyPolicy}
          />
          <SettingsRow
            icon="info"
            iconColor={theme.colors.textSecondary}
            label={t.appVersion}
            sublabel={t.appVersionSublabel}
          />
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundLight,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: theme.typography.bold,
    fontSize: 20,
    color: theme.colors.textPrimary,
    letterSpacing: -0.3,
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xs,
    paddingBottom: theme.spacing.xxl,
  },
  settingsCard: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.shapes.cardRadius,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
    padding: theme.spacing.md,
    marginBottom: theme.spacing.xs,
  },
  rowsCard: {
    padding: 0,
  },
  bottomSpacing: {
    height: theme.spacing.xl,
  },
  loadingRow: {
    paddingVertical: theme.spacing.sm,
  },
  loadingText: {
    fontFamily: theme.typography.regular,
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
});
