import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme } from '../theme';

type HistoryItem = {
  id: string;
  originalText: string;
  translatedText: string;
  timestamp: string;
};

type HistoryScreenProps = {
  onNavigate: (route: string, params?: Record<string, any>) => void;
};

export const HistoryScreen: React.FC<HistoryScreenProps> = ({ onNavigate }) => {
  const data: HistoryItem[] = [
    {
      id: '1',
      originalText: 'Sortie de secours',
      translatedText: 'Emergency exit',
      timestamp: '2 min ago',
    },
    {
      id: '2',
      originalText: 'Accès interdit',
      translatedText: 'No entry',
      timestamp: '15 min ago',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => onNavigate('/dashboard')}
        >
          <Feather name="arrow-left" size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>History</Text>
        <View style={styles.headerRight} />
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() =>
              onNavigate('/translation-result', {
                originalText: item.originalText,
                translatedText: item.translatedText,
              })
            }
          >
            <View style={styles.iconContainer}>
              <Feather name="clock" size={18} color={theme.colors.primary} />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.primaryText} numberOfLines={1}>
                {item.translatedText}
              </Text>
              <Text style={styles.secondaryText} numberOfLines={1}>
                {item.originalText}
              </Text>
            </View>
            <Text style={styles.timeText}>{item.timestamp}</Text>
          </TouchableOpacity>
        )}
      />
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
  listContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
  },
  separator: {
    height: 1,
    backgroundColor: theme.colors.border,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundLight,
    marginRight: theme.spacing.md,
  },
  textContainer: {
    flex: 1,
  },
  primaryText: {
    fontFamily: theme.typography.semibold,
    fontSize: 16,
    color: theme.colors.textPrimary,
  },
  secondaryText: {
    marginTop: 2,
    fontFamily: theme.typography.regular,
    fontSize: 13,
    color: theme.colors.textSecondary,
  },
  timeText: {
    marginLeft: theme.spacing.sm,
    fontFamily: theme.typography.regular,
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
});





