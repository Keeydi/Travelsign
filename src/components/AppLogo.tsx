import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme } from '../theme';

export function AppLogo() {
  return (
    <View style={styles.container}>
      <View style={styles.logoCircle}>
        <Feather name="map" size={48} color={theme.colors.primary} />
      </View>
      <Text style={styles.title}>LinguaJourney</Text>
      <Text style={styles.subtitle}>Smart Travel Sign Translation</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 24,
    backgroundColor: theme.colors.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadow.logo,
  },
  title: {
    fontFamily: theme.typography.bold,
    fontSize: 32,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontFamily: theme.typography.regular,
    fontSize: 15,
    color: theme.colors.textSecondary,
    letterSpacing: 0.2,
  },
});

