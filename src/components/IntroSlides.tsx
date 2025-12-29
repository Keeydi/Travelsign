import { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { theme } from '../theme';

const { width } = Dimensions.get('window');

const slides = [
  {
    title: 'Smart Sign Recognition',
    description: 'Instantly translate and understand travel signs in any language',
  },
  {
    title: 'Real-Time Translation',
    description: 'Get instant translations of signs, menus, and travel information',
  },
  {
    title: 'Seamless Travel',
    description: 'Navigate confidently with smart language translation at your fingertips',
  },
];

export function IntroSlides() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    // Auto-slide every 5 seconds
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % slides.length;
        
        // Scroll to next slide
        if (scrollViewRef.current) {
          scrollViewRef.current.scrollTo({
            x: nextIndex * (width - 48),
            animated: true,
          });
        }
        
        return nextIndex;
      });
    }, 5000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / (width - 48));
    setCurrentIndex(index);
  };

  return (
    <View style={styles.wrapper}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {slides.map((slide, index) => (
          <View key={index} style={styles.slide}>
            <Text style={styles.slideTitle}>{slide.title}</Text>
            <Text style={styles.slideDescription}>{slide.description}</Text>
          </View>
        ))}
      </ScrollView>
      
      {/* Slide Indicators */}
      <View style={styles.indicators}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              index === currentIndex && styles.indicatorActive,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    alignItems: 'center',
  },
  slide: {
    width: width - 48,
    paddingHorizontal: theme.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slideTitle: {
    fontFamily: theme.typography.bold,
    fontSize: 24,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  slideDescription: {
    fontFamily: theme.typography.regular,
    fontSize: 15,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: theme.spacing.sm,
  },
  indicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.border,
  },
  indicatorActive: {
    width: 24,
    backgroundColor: theme.colors.primary,
  },
});

