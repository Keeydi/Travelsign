import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme } from '../theme';

export function AboutApp() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Feather name="info" size={20} color={theme.colors.primary} />
        <View style={styles.textContainer}>
          <Text style={styles.appName}>LinguaJourney</Text>
          <Text style={styles.version}>Version 1.0.0</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.shapes.cardRadius,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  textContainer: {
    flex: 1,
  },
  appName: {
    fontFamily: theme.typography.bold,
    fontSize: 16,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs / 2,
  },
  version: {
    fontFamily: theme.typography.regular,
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
});

