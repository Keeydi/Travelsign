import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { theme } from '../theme';

export function StartButton({ onPress, loading = false }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={loading}
      activeOpacity={0.8}
      style={[styles.button, loading && styles.buttonDisabled]}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={styles.buttonText}>Get Started</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md + 4,
    paddingHorizontal: theme.spacing.xl * 2,
    borderRadius: theme.shapes.buttonRadius,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    maxWidth: 320,
    ...theme.shadow.button,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    fontFamily: theme.typography.semibold,
    fontSize: 18,
    color: '#fff',
    letterSpacing: 0.5,
  },
});

