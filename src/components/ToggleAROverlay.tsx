import { View, Text, StyleSheet, Switch } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme } from '../theme';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

export function ToggleAROverlay({ enabled = true, onToggle }) {
  const { t } = useLanguage();
  const { theme: activeTheme } = useTheme();
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Feather name="eye" size={20} color={activeTheme.colors.primary} />
        <Text style={[styles.title, { color: activeTheme.colors.textPrimary }]}>{t.textDetectionOverlay}</Text>
      </View>
      <View style={[styles.content, { backgroundColor: activeTheme.colors.card, borderColor: activeTheme.colors.border }]}>
        <View style={styles.textContainer}>
          <Text style={[styles.description, { color: activeTheme.colors.textSecondary }]}>{t.showTextDetectionBoxes}</Text>
        </View>
        <Switch
          value={enabled}
          onValueChange={onToggle}
          trackColor={{ false: activeTheme.colors.border, true: activeTheme.colors.primary }}
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
    lineHeight: 22,
  },
});

