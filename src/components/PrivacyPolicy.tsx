import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme } from '../theme';
import { Linking } from 'react-native';

export function PrivacyPolicy() {
  const handleOpen = () => {
    const url = 'https://example.com/privacy-policy';
    Linking.openURL(url).catch((err) => console.error('Failed to open URL:', err));
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handleOpen}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <Feather name="shield" size={20} color={theme.colors.primary} />
        <Text style={styles.text}>Privacy Policy</Text>
      </View>
      <Feather name="chevron-right" size={20} color={theme.colors.textSecondary} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.card,
    borderRadius: theme.shapes.cardRadius,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  text: {
    fontFamily: theme.typography.medium,
    fontSize: 16,
    color: theme.colors.textPrimary,
  },
});

