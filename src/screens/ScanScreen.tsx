import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, Linking, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { theme } from '../theme';

type ScanScreenProps = {
  onNavigate: (route: string, params?: Record<string, any>) => void;
};

export const ScanScreen: React.FC<ScanScreenProps> = ({ onNavigate }) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [isRequesting, setIsRequesting] = useState(false);
  const cameraRef = useRef<CameraView | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [hasRequested, setHasRequested] = useState(false);

  // Request permission immediately when screen loads
  useEffect(() => {
    const requestCameraPermission = async () => {
      console.log('ScanScreen: Permission state:', {
        permission,
        hasRequested,
        isRequesting,
        granted: permission?.granted
      });

      // If permission is already granted, no need to request
      if (permission?.granted) {
        console.log('ScanScreen: Camera permission already granted');
        return;
      }

      // If we haven't requested yet and permission is not granted, request it
      if (!hasRequested && !isRequesting) {
        console.log('ScanScreen: Requesting camera permission...');
        setIsRequesting(true);
        setHasRequested(true);
        try {
          const result = await requestPermission();
          console.log('ScanScreen: Camera permission result:', result);
          if (!result.granted) {
            console.warn('ScanScreen: Camera permission denied');
          }
        } catch (error) {
          console.error('ScanScreen: Error requesting camera permission:', error);
          Alert.alert(
            'Permission Error',
            'Failed to request camera permission. Please enable it in your device settings.',
            [
              { text: 'OK', style: 'cancel' },
              {
                text: 'Open Settings',
                onPress: async () => {
                  try {
                    if (Platform.OS === 'android') {
                      await Linking.openSettings();
                    } else {
                      await Linking.openURL('app-settings:');
                    }
                  } catch (err) {
                    console.error('Error opening settings:', err);
                  }
                }
              }
            ]
          );
        } finally {
          setIsRequesting(false);
        }
      }
    };

    requestCameraPermission();
  }, [permission, hasRequested, isRequesting, requestPermission]);

  // Manual permission request handler
  const handleRequestPermission = async () => {
    setIsRequesting(true);
    try {
      const result = await requestPermission();
      console.log('Manual camera permission result:', result);
      if (!result.granted) {
        Alert.alert(
          'Camera Permission Required',
          'Camera access is required to scan signs. Please enable it in your device settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Open Settings', 
              onPress: async () => {
                try {
                  if (Platform.OS === 'android') {
                    await Linking.openSettings();
                  } else {
                    await Linking.openURL('app-settings:');
                  }
                } catch (error) {
                  console.error('Error opening settings:', error);
                }
              }
            }
          ]
        );
      }
    } catch (error) {
      console.error('Error requesting camera permission:', error);
      Alert.alert(
        'Permission Error',
        'Failed to request camera permission. Please enable it in your device settings.',
        [
          { text: 'OK', style: 'cancel' },
          {
            text: 'Open Settings',
            onPress: async () => {
              try {
                if (Platform.OS === 'android') {
                  await Linking.openSettings();
                } else {
                  await Linking.openURL('app-settings:');
                }
              } catch (err) {
                console.error('Error opening settings:', err);
              }
            }
          }
        ]
      );
    } finally {
      setIsRequesting(false);
    }
  };

  const handleCapturePress = async () => {
    if (!cameraRef.current || isCapturing) return;

    try {
      setIsCapturing(true);
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: true,
      } as any);

      if (!photo || !photo.uri) {
        throw new Error('No photo captured');
      }

      onNavigate('/scan-preview', {
        previewImageUri: photo.uri,
        previewImageBase64: photo.base64,
      });
    } catch (err) {
      console.error('Failed to capture image', err);
      Alert.alert('Capture failed', 'Could not take a picture. Please try again.');
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => onNavigate('/dashboard')}
        >
          <Feather name="arrow-left" size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Scan a sign</Text>
        <View style={styles.headerRight} />
      </View>

      <View style={styles.content}>
        {!permission || isRequesting ? (
          <View style={styles.cameraPlaceholder}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={styles.cameraText}>Requesting camera permission…</Text>
          </View>
        ) : !permission.granted ? (
          <View style={styles.cameraPlaceholder}>
            <Feather name="camera-off" size={40} color={theme.colors.danger} />
            <Text style={styles.cameraText}>
              Camera access is required to scan signs.
            </Text>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleRequestPermission}
              disabled={isRequesting}
            >
              <Text style={styles.primaryButtonText}>
                {isRequesting ? 'Requesting...' : 'Allow camera'}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={styles.cameraContainer}>
              <CameraView
                ref={cameraRef}
                style={StyleSheet.absoluteFill}
                facing="back"
              />
              <View style={styles.overlayFrame}>
                <View style={styles.overlayCorner} />
                <Text style={styles.overlayText}>Align the sign inside the frame</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleCapturePress}
              disabled={isCapturing}
            >
              <Feather name="aperture" size={20} color="#FFFFFF" />
              <Text style={styles.primaryButtonText}>
                {isCapturing ? 'Capturing…' : 'Scan'}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundLight,
  },
  headerTitle: {
    fontFamily: theme.typography.bold,
    fontSize: 20,
    color: theme.colors.textPrimary,
  },
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  cameraContainer: {
    flex: 1,
    borderRadius: theme.shapes.cardRadius,
    overflow: 'hidden',
    backgroundColor: '#000',
    marginBottom: theme.spacing.lg,
  },
  cameraPlaceholder: {
    flex: 1,
    borderRadius: theme.shapes.cardRadius,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  cameraText: {
    marginTop: theme.spacing.sm,
    fontFamily: theme.typography.regular,
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  overlayFrame: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: theme.spacing.lg,
  },
  overlayCorner: {
    position: 'absolute',
    top: '20%',
    left: '10%',
    right: '10%',
    bottom: '30%',
    borderWidth: 2,
    borderColor: '#FFFFFFAA',
    borderRadius: theme.shapes.cardRadius,
  },
  overlayText: {
    fontFamily: theme.typography.medium,
    fontSize: 14,
    color: '#FFFFFF',
    textShadowColor: '#00000080',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.shapes.buttonRadius,
    paddingVertical: theme.spacing.md,
  },
  primaryButtonText: {
    marginLeft: theme.spacing.sm,
    fontFamily: theme.typography.semibold,
    fontSize: 16,
    color: '#FFFFFF',
  },
});


