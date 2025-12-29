import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme } from '../theme';

type PermissionsScreenProps = {
  onNavigate: (route: string, params?: Record<string, any>) => void;
};

export const PermissionsScreen: React.FC<PermissionsScreenProps> = ({ onNavigate }) => {
  const handleContinue = () => {
    onNavigate('/dashboard');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => onNavigate('/onboarding')}
      >
        <Feather name="arrow-left" size={24} color={theme.colors.textPrimary} />
      </TouchableOpacity>

      <Text style={styles.title}>Permissions</Text>
      <Text style={styles.description}>
        LinguaJourney needs camera access to scan signs around you. We only use your camera
        while you are actively scanning.
      </Text>

      <View style={styles.permissionCard}>
        <Feather name="camera" size={28} color={theme.colors.primary} />
        <View style={styles.permissionTextContainer}>
          <Text style={styles.permissionTitle}>Camera access</Text>
          <Text style={styles.permissionSubtitle}>
            Required to scan signs and translate them in real time.
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.primaryButton} onPress={handleContinue}>
        <Text style={styles.primaryButtonText}>Allow & Continue</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => onNavigate('/dashboard')}
      >
        <Text style={styles.secondaryButtonText}>Maybe later</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  title: {
    fontFamily: theme.typography.bold,
    fontSize: 30,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  description: {
    fontFamily: theme.typography.regular,
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xl,
  },
  permissionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.cardLight,
    borderRadius: theme.shapes.cardRadius,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  permissionTextContainer: {
    marginLeft: theme.spacing.md,
    flex: 1,
  },
  permissionTitle: {
    fontFamily: theme.typography.semibold,
    fontSize: 16,
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  permissionSubtitle: {
    fontFamily: theme.typography.regular,
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.shapes.buttonRadius,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  primaryButtonText: {
    fontFamily: theme.typography.semibold,
    fontSize: 16,
    color: '#FFFFFF',
  },
  secondaryButton: {
    paddingVertical: theme.spacing.sm,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontFamily: theme.typography.medium,
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
});





