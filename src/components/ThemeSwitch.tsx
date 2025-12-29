import { View, Text, StyleSheet, Switch } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme } from '../theme';

export function ThemeSwitch({ isDark = false, onToggle }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Feather name="moon" size={20} color={theme.colors.primary} />
        <Text style={styles.title}>Theme</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={styles.description}>
            {isDark ? 'Dark Mode' : 'Light Mode'}
          </Text>
        </View>
        <Switch
          value={isDark}
          onValueChange={onToggle}
          trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
          thumbColor="#fff"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  title: {
    fontFamily: theme.typography.bold,
    fontSize: 20,
    color: theme.colors.textPrimary,
    letterSpacing: -0.3,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.card,
    borderRadius: theme.shapes.cardRadius,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  textContainer: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  description: {
    fontFamily: theme.typography.regular,
    fontSize: 15,
    color: theme.colors.textSecondary,
  },
});

