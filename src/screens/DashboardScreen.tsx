import { View, StyleSheet, ScrollView } from 'react-native';
import { Header } from '../components/Header';
import { QuickActions } from '../components/QuickActions';
import { RecentActivity } from '../components/RecentActivity';
import { SuggestedPOI } from '../components/SuggestedPOI';
import { theme } from '../theme';

export function DashboardScreen({ onNavigate }) {
  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Header userName="Traveler" />
        <QuickActions onNavigate={onNavigate} />
        <RecentActivity />
        <SuggestedPOI onNavigate={onNavigate} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.xxl,
  },
});

