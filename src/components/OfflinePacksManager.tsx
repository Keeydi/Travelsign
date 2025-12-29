import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme } from '../theme';

export function OfflinePacksManager({ onDownload }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Feather name="download" size={20} color={theme.colors.primary} />
        <Text style={styles.title}>Offline Maps</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.description}>
          Download maps for offline use when traveling
        </Text>
        <TouchableOpacity
          style={styles.downloadButton}
          onPress={onDownload}
          activeOpacity={0.8}
        >
          <Feather name="download-cloud" size={18} color="#fff" />
          <Text style={styles.downloadButtonText}>Download Pack</Text>
        </TouchableOpacity>
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
    backgroundColor: theme.colors.card,
    borderRadius: theme.shapes.cardRadius,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  description: {
    fontFamily: theme.typography.regular,
    fontSize: 15,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
    lineHeight: 22,
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.shapes.buttonRadius,
    gap: theme.spacing.sm,
  },
  downloadButtonText: {
    fontFamily: theme.typography.semibold,
    fontSize: 15,
    color: '#fff',
  },
});

