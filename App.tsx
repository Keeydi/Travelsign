import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Toast, ToastContainer } from './src/components/Toast';
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import { Feather } from '@expo/vector-icons';
import { theme } from './src/theme';
import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { PermissionsScreen } from './src/screens/PermissionsScreen';
import { DashboardScreen } from './src/screens/DashboardScreen';
import { ScanScreen } from './src/screens/ScanScreen';
import { ScanPreviewScreen } from './src/screens/ScanPreviewScreen';
import { TranslationResultScreen } from './src/screens/TranslationResultScreen';
import { POIListScreen } from './src/screens/POIListScreen';
import { POIDetailsScreen } from './src/screens/POIDetailsScreen';
import { HistoryScreen } from './src/screens/HistoryScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';

function PlaceholderScreen({ title, onNavigate }) {
  return (
    <View style={placeholderStyles.container}>
      <TouchableOpacity 
        style={placeholderStyles.backButton}
        onPress={() => onNavigate('/dashboard')}
      >
        <Feather name="arrow-left" size={24} color={theme.colors.textPrimary} />
      </TouchableOpacity>
      <Text style={placeholderStyles.title}>{title}</Text>
      <Text style={placeholderStyles.description}>
        {title} screen coming soon
      </Text>
    </View>
  );
}

const placeholderStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  title: {
    fontFamily: theme.typography.bold,
    fontSize: 32,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
    letterSpacing: -0.5,
  },
  description: {
    fontFamily: theme.typography.regular,
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
});

export default function App() {
  const [route, setRoute] = useState('/onboarding');
  const [routeParams, setRouteParams] = useState({});
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  const handleNavigate = (newRoute, params = {}) => {
    setRoute(newRoute);
    setRouteParams(params);
  };

  if (!fontsLoaded) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.loading}>
          <ActivityIndicator color={theme.colors.primary} />
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  const renderScreen = () => {
    switch (route) {
      case '/dashboard':
        return <DashboardScreen onNavigate={handleNavigate} />;
      case '/scan':
        return <ScanScreen onNavigate={handleNavigate} />;
      case '/scan-preview':
        return (
          <ScanPreviewScreen
            onNavigate={handleNavigate}
            previewImageUri={routeParams.previewImageUri}
            previewImageBase64={routeParams.previewImageBase64}
          />
        );
      case '/translation-result':
        return (
          <TranslationResultScreen
            onNavigate={handleNavigate}
            originalText={routeParams.originalText}
            translatedText={routeParams.translatedText}
            captureLocation={routeParams.location}
          />
        );
      case '/poi-list':
        return (
          <POIListScreen
            onNavigate={handleNavigate}
            pois={routeParams.pois || []}
            searchQuery={routeParams.searchQuery || ''}
            captureLocation={routeParams.location}
          />
        );
      case '/poi-details':
        return <POIDetailsScreen onNavigate={handleNavigate} poi={routeParams.poi} />;
      case '/history':
        return <HistoryScreen onNavigate={handleNavigate} />;
      case '/saved':
        return <PlaceholderScreen title="Saved" route={route} onNavigate={handleNavigate} />;
      case '/settings':
        return <SettingsScreen onNavigate={handleNavigate} />;
      case '/permissions':
        return <PermissionsScreen onNavigate={handleNavigate} />;
      case '/onboarding':
      default:
        return <OnboardingScreen onNavigate={handleNavigate} />;
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="dark" />
        {renderScreen()}
        <ToastContainer />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
});
