import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme } from '../theme';

const actions = [
  { id: 'scan', label: 'Scan', icon: 'camera', route: '/scan' },
  { id: 'history', label: 'History', icon: 'clock', route: '/history' },
  { id: 'saved', label: 'Saved', icon: 'bookmark', route: '/saved' },
  { id: 'settings', label: 'Settings', icon: 'settings', route: '/settings' },
];

export function QuickActions({ onNavigate }) {
  const handleAction = (route) => {
    onNavigate?.(route);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quick Actions</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {actions.map((action) => (
          <TouchableOpacity
            key={action.id}
            style={styles.actionCard}
            onPress={() => handleAction(action.route)}
            activeOpacity={0.8}
          >
            <View style={styles.iconContainer}>
              <Feather name={action.icon} size={24} color={theme.colors.primary} />
            </View>
            <Text style={styles.actionLabel}>{action.label}</Text>
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
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: theme.colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    ...theme.shadow.card,
  },
  actionLabel: {
    fontFamily: theme.typography.semibold,
    fontSize: 14,
    color: theme.colors.textPrimary,
    textAlign: 'center',
    letterSpacing: 0.1,
  },
});

