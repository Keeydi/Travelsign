import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
  Alert,
  Linking,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LanguageSelector } from '../components/LanguageSelector';
import { ToggleAROverlay } from '../components/ToggleAROverlay';
import { ThemeSwitch } from '../components/ThemeSwitch';
import { theme } from '../theme';
import { Toast } from '../components/Toast';
import { getTranslationLanguage, setTranslationLanguage, type TranslationLanguageCode } from '../services/preferences';

type SettingsScreenProps = {
  onNavigate: (route: string, params?: Record<string, any>) => void;
};

function SectionHeader({ title }: { title: string }) {
  return <Text style={sectionStyles.header}>{title}</Text>;
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
  return (
    <TouchableOpacity
      style={sectionStyles.row}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      disabled={!onPress && !rightElement}
    >
      <View
        style={[
          sectionStyles.rowIcon,
          { backgroundColor: (iconColor ?? theme.colors.primary) + '18' },
        ]}
      >
        <Feather
          name={icon as any}
          size={18}
          color={iconColor ?? theme.colors.primary}
        />
      </View>
      <View style={sectionStyles.rowText}>
        <Text
          style={[
            sectionStyles.rowLabel,
            destructive && { color: theme.colors.danger },
          ]}
        >
          {label}
        </Text>
        {sublabel ? (
          <Text style={sectionStyles.rowSublabel}>{sublabel}</Text>
        ) : null}
      </View>
      {rightElement ?? (
        onPress ? (
          <Feather
            name="chevron-right"
            size={18}
            color={theme.colors.muted}
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
  const [selectedLanguage, setSelectedLanguage] = useState<TranslationLanguageCode>('en');
  const [arOverlayEnabled, setArOverlayEnabled] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    getTranslationLanguage().then(setSelectedLanguage);
  }, []);

  const handleLanguageChange = (langCode: string) => {
    const code = langCode as TranslationLanguageCode;
    setSelectedLanguage(code);
    setTranslationLanguage(code).catch(() => {});
    Toast.show({
      type: 'success',
      text1: 'Language Updated',
      text2: 'Translation language has been changed.',
    });
  };

  const handleAROverlayToggle = (enabled: boolean) => {
    setArOverlayEnabled(enabled);
  };

  const handleThemeToggle = (isDark: boolean) => {
    setIsDarkMode(isDark);
  };

  const handleOfflineMaps = () => {
    Alert.alert(
      'Offline Maps',
      'Download map regions to use them without an internet connection. This feature requires additional storage space.\n\nOffline map downloads will be available in a future update.',
      [{ text: 'OK' }]
    );
  };

  const handlePrivacyPolicy = () => {
    Linking.openURL('https://example.com/privacy-policy').catch(() =>
      Alert.alert('Error', 'Could not open the privacy policy.')
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => onNavigate?.('/dashboard')}
        >
          <Feather name="arrow-left" size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Translation */}
        <SectionHeader title="Translation" />
        <View style={styles.settingsCard}>
          <LanguageSelector
            selectedLanguage={selectedLanguage}
            onSelect={handleLanguageChange}
          />
        </View>

        {/* Display */}
        <SectionHeader title="Display" />
        <View style={styles.settingsCard}>
          <ToggleAROverlay
            enabled={arOverlayEnabled}
            onToggle={handleAROverlayToggle}
          />
          <ThemeSwitch isDark={isDarkMode} onToggle={handleThemeToggle} />
        </View>

        {/* Maps */}
        <SectionHeader title="Maps & Navigation" />
        <View style={[styles.settingsCard, styles.rowsCard]}>
          <SettingsRow
            icon="download"
            label="Offline Maps"
            sublabel="Download maps for offline use"
            onPress={handleOfflineMaps}
          />
        </View>

        {/* About */}
        <SectionHeader title="About" />
        <View style={[styles.settingsCard, styles.rowsCard]}>
          <SettingsRow
            icon="shield"
            label="Privacy Policy"
            sublabel="How we handle your data"
            onPress={handlePrivacyPolicy}
          />
          <SettingsRow
            icon="info"
            iconColor={theme.colors.textSecondary}
            label="App Version"
            sublabel="LinguaJourney 1.0.0"
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
});
