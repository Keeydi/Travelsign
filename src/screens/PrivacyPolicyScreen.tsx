import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme } from '../theme';
import { useTheme } from '../contexts/ThemeContext';

type PrivacyPolicyScreenProps = {
  onNavigate: (route: string, params?: Record<string, unknown>) => void;
};

export function PrivacyPolicyScreen({ onNavigate }: PrivacyPolicyScreenProps) {
  const { theme: activeTheme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: activeTheme.colors.background }]}>
      <View style={[styles.header, { borderBottomColor: activeTheme.colors.border }]}>
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: activeTheme.colors.backgroundLight }]}
          onPress={() => onNavigate('/settings')}
        >
          <Feather name="arrow-left" size={24} color={activeTheme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: activeTheme.colors.textPrimary }]}>
          Privacy Policy
        </Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.lastUpdated, { color: activeTheme.colors.textSecondary }]}>
          Last updated: March 2025
        </Text>

        <Text style={[styles.paragraph, { color: activeTheme.colors.textPrimary }]}>
          LinguaJourney / Travelsign (“we”, “our”, or “the app”) is committed to protecting your
          privacy. This policy explains how we collect, use, and safeguard your information when
          you use this application.
        </Text>

        <Text style={[styles.sectionTitle, { color: activeTheme.colors.textPrimary }]}>
          1. Information We Collect
        </Text>
        <Text style={[styles.paragraph, { color: activeTheme.colors.textSecondary }]}>
          The app may collect and store the following data on your device:
        </Text>
        <Text style={[styles.bullet, { color: activeTheme.colors.textSecondary }]}>
          • Translation history (original and translated text you scan)
        </Text>
        <Text style={[styles.bullet, { color: activeTheme.colors.textSecondary }]}>
          • Saved translations and bookmarks
        </Text>
        <Text style={[styles.bullet, { color: activeTheme.colors.textSecondary }]}>
          • Location data when you capture a sign (used for nearby places and map features)
        </Text>
        <Text style={[styles.bullet, { color: activeTheme.colors.textSecondary }]}>
          • App preferences (e.g. language, theme)
        </Text>

        <Text style={[styles.sectionTitle, { color: activeTheme.colors.textPrimary }]}>
          2. How We Use Your Information
        </Text>
        <Text style={[styles.paragraph, { color: activeTheme.colors.textSecondary }]}>
          Your data is used to provide translation services, show history and saved items, suggest
          nearby places based on where you scanned, and to remember your settings. We do not sell
          your personal information to third parties.
        </Text>

        <Text style={[styles.sectionTitle, { color: activeTheme.colors.textPrimary }]}>
          3. Data Storage & Security
        </Text>
        <Text style={[styles.paragraph, { color: activeTheme.colors.textSecondary }]}>
          Data is stored locally on your device. When you use cloud-based translation or map
          services, only the minimum necessary data (e.g. text to translate, coordinates) may be
          sent to those services in accordance with their terms. We encourage you to keep your
          device secure and to clear app data if you share the device with others.
        </Text>

        <Text style={[styles.sectionTitle, { color: activeTheme.colors.textPrimary }]}>
          4. Your Rights
        </Text>
        <Text style={[styles.paragraph, { color: activeTheme.colors.textSecondary }]}>
          You can clear your history and saved items from within the app. You may also revoke
          location or camera permissions in your device settings. Uninstalling the app will remove
          local data associated with it.
        </Text>

        <Text style={[styles.sectionTitle, { color: activeTheme.colors.textPrimary }]}>
          5. Changes to This Policy
        </Text>
        <Text style={[styles.paragraph, { color: activeTheme.colors.textSecondary }]}>
          We may update this Privacy Policy from time to time. The “Last updated” date at the top
          will reflect the latest version. Continued use of the app after changes constitutes
          acceptance of the updated policy.
        </Text>

        <Text style={[styles.sectionTitle, { color: activeTheme.colors.textPrimary }]}>
          6. Contact
        </Text>
        <Text style={[styles.paragraph, { color: activeTheme.colors.textSecondary }]}>
          If you have questions about this Privacy Policy or your data, please contact the app
          provider or the developer listed below.
        </Text>

        <View style={[styles.creditBlock, { backgroundColor: activeTheme.colors.card, borderColor: activeTheme.colors.border }]}>
          <Feather name="code" size={20} color={activeTheme.colors.primary} />
          <Text style={[styles.creditText, { color: activeTheme.colors.textPrimary }]}>
            This system is created by CoreDev Studio.
          </Text>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: theme.typography.bold,
    fontSize: 20,
    letterSpacing: -0.3,
  },
  headerRight: {
    width: 40,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
  },
  lastUpdated: {
    fontFamily: theme.typography.regular,
    fontSize: 13,
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontFamily: theme.typography.bold,
    fontSize: 18,
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.sm,
  },
  paragraph: {
    fontFamily: theme.typography.regular,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: theme.spacing.sm,
  },
  bullet: {
    fontFamily: theme.typography.regular,
    fontSize: 14,
    lineHeight: 22,
    marginLeft: theme.spacing.sm,
    marginBottom: 2,
  },
  creditBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.xxl,
    padding: theme.spacing.lg,
    borderRadius: theme.shapes.cardRadius,
    borderWidth: 1,
  },
  creditText: {
    fontFamily: theme.typography.semibold,
    fontSize: 15,
  },
  bottomSpacing: {
    height: theme.spacing.xl,
  },
});
