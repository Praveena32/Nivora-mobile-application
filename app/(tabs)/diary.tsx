import NightSkyBackground from '@/components/NightSkyBackground';
import SanctuaryLock from '@/components/SanctuaryLock';
import { useAuth } from '@/constants/AuthContext';
import Colors from '@/constants/Colors';
import { useLanguage } from '@/constants/LanguageContext';
import { useTheme } from '@/constants/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type JournalEntry = {
  id: string;
  title: string;
  content: string;
  gratitude?: string;
  date: string;
  timestamp: number;
  mood: { label: string; emoji: string; color: string };
};

const DIARY_STORAGE_KEY = '@safe_space_journal';

export default function DiaryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme: themeName, isDark } = useTheme();
  const { isGuest } = useAuth();
  const { t } = useLanguage();
  const theme = Colors[themeName];

  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load entries whenever the screen focuses
  useFocusEffect(
    useCallback(() => {
      loadEntries();
    }, [])
  );

  const loadEntries = async () => {
    try {
      const stored = await AsyncStorage.getItem(DIARY_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Sort by newest first
        const sorted = parsed.sort((a: any, b: any) => b.timestamp - a.timestamp);
        setEntries(sorted);
      }
    } catch (error) {
      console.error('Failed to load journal entries:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteEntry = (id: string) => {
    Alert.alert(
      "Delete Entry",
      "Are you sure you want to remove this memory from your sanctuary?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const updated = entries.filter(e => e.id !== id);
              await AsyncStorage.setItem(DIARY_STORAGE_KEY, JSON.stringify(updated));
              setEntries(updated);
            } catch (error) {
              Alert.alert("Error", "Could not delete entry.");
            }
          }
        }
      ]
    );
  };

  if (isGuest) {
    return (
      <SanctuaryLock
        featureName={t('mindfulJournal')}
        description={t('diaryLockDesc')}
        icon="book-outline"
      />
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: '#050510' }]}>
      <NightSkyBackground />
      <View style={{ height: insets.top, backgroundColor: '#050510', width: '100%', position: 'absolute', top: 0, zIndex: 10 }} />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <Text style={[styles.title, { color: '#FFF' }]}>{t('mindfulJournal')}</Text>
        <View style={[styles.promptBox, { backgroundColor: isDark ? '#111' : '#EEE', borderColor: isDark ? '#222' : '#DDD' }]}>
          <Ionicons name="sparkles" size={16} color="#B0A4F1" />
          <Text style={styles.promptText}>{t('gratefulTodayPrompt')}</Text>
        </View>
      </View>

      {/* Journal List */}
      <FlatList
        data={entries}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.entryCard, { backgroundColor: isDark ? '#111' : '#FFF', borderColor: isDark ? '#222' : '#EEE' }]}
            activeOpacity={0.8}
            onPress={() => router.push({
              pathname: '/diary-detail',
              params: { id: item.id }
            })}
          >
            <View style={styles.entryHeader}>
              <View style={[styles.moodBadge, { backgroundColor: item.mood.color + '20' }]}>
                <Text style={styles.moodEmoji}>{item.mood.emoji}</Text>
                <Text style={[styles.moodLabel, { color: item.mood.color }]}>{item.mood.label}</Text>
              </View>
              <View style={styles.entryRightHeader}>
                <Text style={styles.entryDate}>{item.date}</Text>
                <TouchableOpacity onPress={() => deleteEntry(item.id)} style={styles.deleteBtn}>
                  <Ionicons name="trash-outline" size={16} color="rgba(255,255,255,0.3)" />
                </TouchableOpacity>
              </View>
            </View>
            <Text style={[styles.entryTitle, { color: '#FFF' }]}>{item.title}</Text>
            <Text style={[styles.entrySnippet, { color: 'rgba(255,255,255,0.6)' }]} numberOfLines={2}>{item.content}</Text>
          </TouchableOpacity>
        )}
        ListFooterComponent={<View style={{ height: 100 }} />}
        ListEmptyComponent={!isLoading ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="book-outline" size={64} color="rgba(255,255,255,0.1)" />
            <Text style={[styles.emptyText, { color: '#FFF' }]}>{t('journalWaiting')}</Text>
            <Text style={styles.emptySub}>{t('captureMoment')}</Text>
            <TouchableOpacity
              style={styles.startBtn}
              onPress={() => router.push('/new-journal')}
            >
              <Text style={styles.startBtnText}>Start Journaling</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        style={[styles.fab, { bottom: 20 + insets.bottom, backgroundColor: '#B0A4F1' }]}
        onPress={() => router.push('/new-journal')}
        activeOpacity={0.9}
      >
        <Ionicons name="add" size={32} color="#000" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  promptBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 16,
    borderWidth: 1,
  },
  promptText: {
    color: '#B0A4F1',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  entryCard: {
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  entryRightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteBtn: {
    marginLeft: 12,
    padding: 4,
  },
  moodBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  moodEmoji: {
    fontSize: 14,
    marginRight: 6,
  },
  moodLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  entryDate: {
    color: '#666',
    fontSize: 12,
  },
  entryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  entrySnippet: {
    fontSize: 14,
    lineHeight: 20,
  },
  fab: {
    position: 'absolute',
    right: 20,
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#B0A4F1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 80,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
  },
  emptySub: {
    color: '#666',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  startBtn: {
    marginTop: 30,
    backgroundColor: 'rgba(176, 164, 241, 0.1)',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#B0A4F1',
  },
  startBtnText: {
    color: '#B0A4F1',
    fontWeight: 'bold',
  }
});
