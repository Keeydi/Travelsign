import { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { LanguageSelector } from '../components/LanguageSelector';
import { OfflinePacksManager } from '../components/OfflinePacksManager';
import { ToggleAROverlay } from '../components/ToggleAROverlay';
import { ThemeSwitch } from '../components/ThemeSwitch';
import { PrivacyPolicy } from '../components/PrivacyPolicy';
import { AboutApp } from '../components/AboutApp';
import { theme } from '../theme';
import { Toast } from '../components/Toast';

export function SettingsScreen({ onNavigate }) {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [arOverlayEnabled, setArOverlayEnabled] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleLanguageChange = (langCode) => {
    setSelectedLanguage(langCode);
    // Action: refreshAppLocale
    Toast.show({
      type: 'success',
      text1: 'Language Changed',
      text2: 'App language updated',
    });
  };

  const handleAROverlayToggle = (enabled) => {
    setArOverlayEnabled(enabled);
    // Action: enableFeatureFlag
    console.log('Text Detection Overlay:', enabled);
  };

  const handleThemeToggle = (isDark) => {
    setIsDarkMode(isDark);
    // In production, this would change the theme
    console.log('Theme:', isDark ? 'Dark' : 'Light');
  };

  const handleDownloadOfflinePack = () => {
    // Action: savePackLocally
    Toast.show({
      type: 'info',
      text1: 'Download Started',
      text2: 'Offline map pack downloading...',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
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
        <LanguageSelector
          selectedLanguage={selectedLanguage}
          onSelect={handleLanguageChange}
        />
        <OfflinePacksManager onDownload={handleDownloadOfflinePack} />
        <ToggleAROverlay
          enabled={arOverlayEnabled}
          onToggle={handleAROverlayToggle}
        />
        <ThemeSwitch isDark={isDarkMode} onToggle={handleThemeToggle} />
        <PrivacyPolicy />
        <AboutApp />
      </ScrollView>
    </SafeAreaView>
  );
}

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
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
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
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
});

