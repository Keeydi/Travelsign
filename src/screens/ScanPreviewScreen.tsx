import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
  GestureResponderEvent,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme } from '../theme';
import { extractTextFromImage } from '../services/ocr';
import { translateText } from '../services/translate';
import { getCurrentLocation } from '../services/location';

type ScanPreviewScreenProps = {
  onNavigate: (route: string, params?: Record<string, any>) => void;
  previewImageUri?: string;
  previewImageBase64?: string;
};

export const ScanPreviewScreen: React.FC<ScanPreviewScreenProps> = ({
  onNavigate,
  previewImageUri,
  previewImageBase64,
}) => {
  // cropRect values are relative (0–1) inside the preview card
  const [cropRect, setCropRect] = useState({
    x: 0.1,
    y: 0.25,
    width: 0.8,
    height: 0.5,
  });
  const [cardSize, setCardSize] = useState({ width: 1, height: 1 });

  const handleSetCropCenter = (e: GestureResponderEvent) => {
    if (!cardSize.width || !cardSize.height) return;
    const { locationX, locationY } = e.nativeEvent;

    // Convert tap position to normalized center (0–1)
    const centerX = locationX / cardSize.width;
    const centerY = locationY / cardSize.height;

    const halfW = cropRect.width / 2;
    const halfH = cropRect.height / 2;

    // Convert center to top-left, clamped
    let x = centerX - halfW;
    let y = centerY - halfH;

    x = Math.max(0, Math.min(1 - cropRect.width, x));
    y = Math.max(0, Math.min(1 - cropRect.height, y));

    setCropRect(prev => ({ ...prev, x, y }));
  };

  const [isProcessing, setIsProcessing] = useState(false);

  const handleTranslate = async () => {
    if (!previewImageBase64) {
      // fallback if for some reason we don't have the image data
      onNavigate('/translation-result', {
        originalText: '',
        translatedText: '',
      });
      return;
    }

    try {
      setIsProcessing(true);

      // 1) Capture approximate location at the moment of translation
      const location = await getCurrentLocation();

      // 2) OCR: get text from selected region
      const detectedText = await extractTextFromImage(
        previewImageBase64,
        cropRect
      );

      // 3) Translate detected text (default to English UI language)
      const translated = await translateText(detectedText, 'en');

      onNavigate('/translation-result', {
        originalText: detectedText,
        translatedText: translated,
        cropRect,
        location,
      });
    } catch (err) {
      console.warn('OCR/translate failed', err);
      onNavigate('/translation-result', {
        originalText: '',
        translatedText: '',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => onNavigate('/scan')}
        >
          <Feather name="arrow-left" size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Preview</Text>
        <View style={styles.headerRight} />
      </View>

      <View style={styles.content}>
        <TouchableWithoutFeedback onPress={handleSetCropCenter}>
          <View
            style={styles.previewCard}
            onLayout={e => {
              const { width, height } = e.nativeEvent.layout;
              setCardSize({ width, height });
            }}
          >
            {previewImageUri ? (
              <Image
                source={{ uri: previewImageUri }}
                style={styles.previewImage}
                resizeMode="cover"
              />
            ) : (
              <>
                <Feather name="image" size={40} color={theme.colors.muted} />
                <Text style={styles.previewText}>
                  Captured image preview will appear here
                </Text>
              </>
            )}

            {/* Tap-to-position crop box overlay */}
            {previewImageUri && (
              <View
                style={[
                  styles.cropBox,
                  {
                    left: `${cropRect.x * 100}%`,
                    top: `${cropRect.y * 100}%`,
                    width: `${cropRect.width * 100}%`,
                    height: `${cropRect.height * 100}%`,
                  },
                ]}
              >
                <Text style={styles.cropLabel}>Tap to move this box over text</Text>
              </View>
            )}
          </View>
        </TouchableWithoutFeedback>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleTranslate}
          disabled={isProcessing}
        >
          <Feather name="globe" size={20} color="#FFFFFF" />
          <Text style={styles.primaryButtonText}>
            {isProcessing ? 'Analyzing…' : 'Translate text'}
          </Text>
        </TouchableOpacity>
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
  previewCard: {
    flex: 1,
    borderRadius: theme.shapes.cardRadius,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  cropBox: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    borderStyle: 'dashed',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 4,
    backgroundColor: 'transparent',
  },
  cropLabel: {
    fontSize: 10,
    color: '#FFFFFF',
    textShadowColor: '#00000080',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  previewText: {
    marginTop: theme.spacing.sm,
    fontFamily: theme.typography.regular,
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
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


