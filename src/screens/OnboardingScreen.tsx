import { View, StyleSheet, ScrollView } from 'react-native';
import { AppLogo } from '../components/AppLogo';
import { IntroSlides } from '../components/IntroSlides';
import { StartButton } from '../components/StartButton';
import { theme } from '../theme';

export function OnboardingScreen({ onNavigate }) {
  const handleStart = () => {
    onNavigate?.('/dashboard');
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <AppLogo />
          <IntroSlides />
          <View style={styles.buttonContainer}>
            <StartButton onPress={handleStart} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: theme.spacing.lg,
    paddingTop: theme.spacing.xxl,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100%',
  },
  buttonContainer: {
    marginTop: theme.spacing.xl,
    width: '100%',
    alignItems: 'center',
    paddingBottom: theme.spacing.xl,
  },
});

