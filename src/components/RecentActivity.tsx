import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme } from '../theme';

export function RecentActivity({ activities = [] }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Recent Activity</Text>
        <TouchableOpacity>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {activities.map((activity) => (
          <TouchableOpacity
            key={activity.id}
            style={styles.activityCard}
            activeOpacity={0.8}
          >
            <View style={styles.iconContainer}>
              <Feather name={activity.icon} size={20} color={theme.colors.primary} />
            </View>
            <View style={styles.content}>
              <Text style={styles.activityTitle} numberOfLines={1}>
                {activity.title}
              </Text>
              <Text style={styles.activityLocation} numberOfLines={1}>
                {activity.location}
              </Text>
              <Text style={styles.activityTime}>{activity.time}</Text>
            </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  title: {
    fontFamily: theme.typography.bold,
    fontSize: 22,
    color: theme.colors.textPrimary,
    letterSpacing: -0.5,
  },
  seeAll: {
    fontFamily: theme.typography.semibold,
    fontSize: 15,
    color: theme.colors.primary,
    letterSpacing: 0.2,
  },
  scrollContent: {
    paddingRight: theme.spacing.lg,
  },
  activityCard: {
    width: 220,
    backgroundColor: theme.colors.card,
    borderRadius: theme.shapes.cardRadius,
    padding: theme.spacing.lg,
    marginRight: theme.spacing.md,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    flexDirection: 'row',
    ...theme.shadow.card,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: theme.colors.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  activityTitle: {
    fontFamily: theme.typography.bold,
    fontSize: 17,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs / 2,
    letterSpacing: -0.2,
  },
  activityLocation: {
    fontFamily: theme.typography.regular,
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
    lineHeight: 20,
  },
  activityTime: {
    fontFamily: theme.typography.medium,
    fontSize: 12,
    color: theme.colors.textSecondary,
    letterSpacing: 0.1,
  },
});

