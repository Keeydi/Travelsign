import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

export function Header({ userName = 'User' }) {
  const { t } = useLanguage();
  const { theme: activeTheme } = useTheme();
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={[styles.greeting, { color: activeTheme.colors.textSecondary }]}>{t.welcomeBack}</Text>
          <Text style={[styles.name, { color: activeTheme.colors.textPrimary }]}>{userName} 👋</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.xl,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  textContainer: {
    flex: 1,
  },
  greeting: {
    fontFamily: theme.typography.medium,
    fontSize: 15,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs / 2,
    letterSpacing: 0.2,
  },
  name: {
    fontFamily: theme.typography.bold,
    fontSize: 28,
    color: theme.colors.textPrimary,
    letterSpacing: -0.8,
    lineHeight: 34,
  },
});

