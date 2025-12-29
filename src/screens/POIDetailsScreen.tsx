import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme } from '../theme';

type POI = {
  id: string;
  name: string;
  category?: string;
  description?: string;
  address?: string;
  distanceMeters?: number;
};

type POIDetailsScreenProps = {
  onNavigate: (route: string, params?: Record<string, any>) => void;
  poi: POI;
};

export const POIDetailsScreen: React.FC<POIDetailsScreenProps> = ({ onNavigate, poi }) => {
  if (!poi) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => onNavigate('/poi-list')}
          >
            <Feather name="arrow-left" size={24} color={theme.colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Place details</Text>
          <View style={styles.headerRight} />
        </View>
        <View style={styles.content}>
          <Text style={styles.errorText}>No place data provided.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => onNavigate('/poi-list')}
        >
          <Feather name="arrow-left" size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{poi.name}</Text>
        <View style={styles.headerRight} />
      </View>

      <View style={styles.content}>
        <View style={styles.badgeRow}>
          {poi.category && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{poi.category}</Text>
            </View>
          )}
          {poi.distanceMeters != null && (
            <View style={styles.badge}>
              <Feather name="map-pin" size={14} color="#FFFFFF" />
              <Text style={[styles.badgeText, styles.badgeTextWithIcon]}>
                {(poi.distanceMeters / 1000).toFixed(1)} km away
              </Text>
            </View>
          )}
        </View>

        {poi.address && (
          <View style={styles.row}>
            <Feather name="map" size={18} color={theme.colors.textSecondary} />
            <Text style={styles.rowText}>{poi.address}</Text>
          </View>
        )}

        <Text style={styles.sectionTitle}>Overview</Text>
        <Text style={styles.description}>
          {poi.description ||
            'Detailed information about this place will appear here once connected to a live places API.'}
        </Text>

        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => onNavigate('/translation-result')}
          >
            <Feather name="message-circle" size={18} color={theme.colors.textPrimary} />
            <Text style={styles.secondaryButtonText}>Back to translation</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => {}}
          >
            <Feather name="navigation" size={18} color="#FFFFFF" />
            <Text style={styles.primaryButtonText}>Navigate</Text>
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
  },
  errorText: {
    fontFamily: theme.typography.regular,
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: theme.colors.primary,
  },
  badgeText: {
    fontFamily: theme.typography.medium,
    fontSize: 12,
    color: '#FFFFFF',
  },
  badgeTextWithIcon: {
    marginLeft: theme.spacing.xs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  rowText: {
    marginLeft: theme.spacing.sm,
    fontFamily: theme.typography.regular,
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  sectionTitle: {
    fontFamily: theme.typography.semibold,
    fontSize: 16,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  description: {
    fontFamily: theme.typography.regular,
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 20,
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





