import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme } from '../theme';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

const actions = [
  { id: 'scan', labelKey: 'scan' as const, icon: 'camera', route: '/scan' },
  { id: 'history', labelKey: 'history' as const, icon: 'clock', route: '/history' },
  { id: 'saved', labelKey: 'saved' as const, icon: 'bookmark', route: '/saved' },
  { id: 'settings', labelKey: 'settings' as const, icon: 'settings', route: '/settings' },
];

export function QuickActions({ onNavigate }) {
  const { t } = useLanguage();
  const { theme: activeTheme } = useTheme();
  const handleAction = (route) => {
    onNavigate?.(route);
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: activeTheme.colors.textPrimary }]}>{t.quickActions}</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {actions.map((action) => (
          <TouchableOpacity
            key={action.id}
            style={[
              styles.actionCard,
              {
                backgroundColor: activeTheme.colors.card,
                borderColor: activeTheme.colors.border,
                borderWidth: 1.5,
                borderRadius: activeTheme.shapes.cardRadius,
                ...activeTheme.shadow.card,
              },
            ]}
            onPress={() => handleAction(action.route)}
            activeOpacity={0.8}
          >
            <View
              style={[
                styles.iconContainer,
                {
                  backgroundColor: activeTheme.colors.cardLight,
                  borderColor: activeTheme.colors.border,
                  borderWidth: 1.5,
                  borderRadius: 24,
                },
              ]}
            >
              <Feather name={action.icon} size={24} color={activeTheme.colors.primary} />
            </View>
            <Text style={[styles.actionLabel, { color: activeTheme.colors.textPrimary }]}>{t[action.labelKey]}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.xl + theme.spacing.md,
  },
  title: {
    fontFamily: theme.typography.bold,
    fontSize: 22,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.lg,
    letterSpacing: -0.5,
  },
  scrollContent: {
    paddingRight: theme.spacing.lg,
  },
  actionCard: {
    width: 100,
    alignItems: 'center',
    marginRight: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
  },
  iconContainer: {
    width: 72,
    height: 72,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  actionLabel: {
    fontFamily: theme.typography.semibold,
    fontSize: 14,
    color: theme.colors.textPrimary,
    textAlign: 'center',
    letterSpacing: 0.1,
  },
});

