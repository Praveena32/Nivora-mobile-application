import NightSkyBackground from '@/components/NightSkyBackground';
import SanctuaryLock from '@/components/SanctuaryLock';
import { useAuth } from '@/constants/AuthContext';
import { BACKEND_URL } from '@/constants/Backend';
import Colors from '@/constants/Colors';
import { useLanguage } from '@/constants/LanguageContext';
import { useTheme } from '@/constants/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export type JournalEntry = {
  id: string;
  title: string;
  content: string;
  gratitude?: string;
  date: string;
  timestamp: number;
  mood: { label: string; emoji: string; color: string };
  mode?: 'standard' | 'gratitude' | 'somatic' | 'future' | 'burn';
  bodyArea?: string;
  unlockDate?: string;
  voyaReflection?: string;
};

const DIARY_STORAGE_KEY = '@safe_space_journal';

const MINDFUL_LAUNCHERS = [
  { id: 'standard', label: 'Reflection', emoji: '✍️', desc: 'Mindful Thoughts', color: '#B0A4F1' },
  { id: 'burn', label: 'Burn & Let Go', emoji: '🔥', desc: 'Cathartic Release', color: '#EF4444' },
  { id: 'gratitude', label: 'Gratitude Garden', emoji: '🌸', desc: '3 Micro-Blossoms', color: '#FBBF24' },
  { id: 'somatic', label: 'Body Scan', emoji: '🫀', desc: 'Somatic Tension', color: '#38BDF8' },
  { id: 'future', label: 'Future Letter', emoji: '💌', desc: 'Time Capsule', color: '#EC4899' },
];

export default function DiaryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme: themeName, isDark } = useTheme();
  const { isGuest } = useAuth();
  const { t } = useLanguage();
  const theme = Colors[themeName];

  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [journalInsight, setJournalInsight] = useState<any>(null);
  const [isGeneratingInsight, setIsGeneratingInsight] = useState(false);

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

  const fetchJournalInsight = async () => {
    setIsGeneratingInsight(true);
    try {
      const snippets = entries.map(e => `${e.title}: ${e.content}`);
      const res = await fetch(`${BACKEND_URL}/genai-journal-insight`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ journalEntries: snippets })
      });
      if (res.ok) {
        const data = await res.json();
        if (data && (data.insight || data.reflectionQuestion)) {
          setJournalInsight(data);
          return;
        }
      }
      throw new Error('Fallback insight');
    } catch {
      // Fallback local compassionate synthesis if offline
      setJournalInsight({
        insight: `You have authored ${entries.length} reflections in your sanctuary. Your journey reflects continuous growth, self-compassion, and emotional awareness.`,
        reflectionQuestion: "What is one strength you discovered in yourself recently?"
      });
    } finally {
      setIsGeneratingInsight(false);
    }
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

  // Filter entries
  const filteredEntries = entries.filter(entry => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'gratitude') return entry.mode === 'gratitude' || !!entry.gratitude;
    if (selectedFilter === 'somatic') return entry.mode === 'somatic';
    if (selectedFilter === 'future') return entry.mode === 'future';
    if (selectedFilter === 'standard') return !entry.mode || entry.mode === 'standard';
    return true;
  });

  const gratitudeCount = entries.filter(e => e.mode === 'gratitude' || !!e.gratitude).length;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <NightSkyBackground />
      <View style={{ height: insets.top, backgroundColor: theme.background, width: '100%', position: 'absolute', top: 0, zIndex: 10 }} />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <View style={styles.headerTopRow}>
          <View>
            <Text style={[styles.title, { color: theme.text }]}>{t('mindfulJournal')}</Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>SafeHaven Emotional Sanctuary</Text>
          </View>

          {/* Gratitude Garden Stats Badge */}
          {gratitudeCount > 0 && (
            <View style={[styles.gardenPill, { backgroundColor: isDark ? 'rgba(251, 191, 36, 0.15)' : 'rgba(251, 191, 36, 0.12)' }]}>
              <Text style={styles.gardenPillText}>🌸 {gratitudeCount} Blossoms</Text>
            </View>
          )}
        </View>

        {/* Mindful Journal Mode Quick Launchers */}
        <View style={styles.launcherSection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.launcherScroll}
          >
            {MINDFUL_LAUNCHERS.map((mode) => (
              <TouchableOpacity
                key={mode.id}
                activeOpacity={0.8}
                onPress={() => router.push(`/new-journal?mode=${mode.id}` as any)}
                style={[
                  styles.launcherCard,
                  {
                    backgroundColor: isDark ? 'rgba(18, 12, 38, 0.85)' : 'rgba(255, 255, 255, 0.90)',
                    borderColor: isDark ? (mode.color + '40') : (mode.color + '30'),
                  }
                ]}
              >
                <View style={[styles.launcherIconCircle, { backgroundColor: mode.color + '20' }]}>
                  <Text style={styles.launcherEmoji}>{mode.emoji}</Text>
                </View>
                <Text style={[styles.launcherLabel, { color: isDark ? '#FFFFFF' : '#14121E' }]}>
                  {mode.label}
                </Text>
                <Text style={[styles.launcherDesc, { color: isDark ? '#A09CB8' : '#6A658E' }]}>
                  {mode.desc}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* AI Reflection Analyzer Action Button */}
        <TouchableOpacity
          style={[styles.insightGenBtn, { backgroundColor: isDark ? 'rgba(176, 164, 241, 0.15)' : 'rgba(120, 104, 230, 0.12)', borderColor: isDark ? '#B0A4F1' : '#7868E6' }]}
          onPress={fetchJournalInsight}
          disabled={isGeneratingInsight}
          activeOpacity={0.8}
        >
          <Ionicons name="sparkles" size={15} color={isDark ? "#B0A4F1" : "#6E5EC7"} style={{ marginRight: 6 }} />
          <Text style={[styles.insightGenBtnText, { color: isDark ? '#B0A4F1' : '#6E5EC7' }]}>
            {isGeneratingInsight ? 'Synthesizing Sanctuary Growth...' : '✨ Gen AI Reflection Summary'}
          </Text>
        </TouchableOpacity>

        {/* Gen AI Insight Display Card */}
        {journalInsight && (
          <View style={[styles.insightCard, { backgroundColor: isDark ? 'rgba(18, 12, 38, 0.90)' : 'rgba(255, 255, 255, 0.95)', borderColor: isDark ? 'rgba(176, 164, 241, 0.35)' : 'rgba(120, 104, 230, 0.25)' }]}>
            <View style={styles.insightHeaderRow}>
              <Ionicons name="sparkles" size={16} color={theme.primary} style={{ marginRight: 6 }} />
              <Text style={[styles.insightCardTitle, { color: theme.primary }]}>AI Sanctuary Reflection</Text>
            </View>
            <Text style={[styles.insightCardText, { color: theme.text }]}>{journalInsight.insight}</Text>
            {journalInsight.reflectionQuestion && (
              <Text style={[styles.insightQuestion, { color: isDark ? '#D8D4F8' : '#5A567D' }]}>
                ❓ {journalInsight.reflectionQuestion}
              </Text>
            )}
          </View>
        )}

        {/* Filter Tabs Bar */}
        <View style={styles.filterBar}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
            {[
              { id: 'all', label: 'All Entries' },
              { id: 'gratitude', label: '🌸 Gratitude' },
              { id: 'somatic', label: '🫀 Body Scan' },
              { id: 'future', label: '💌 Future Letters' },
              { id: 'standard', label: '✍️ Reflections' },
            ].map((f) => {
              const isSelected = selectedFilter === f.id;
              return (
                <TouchableOpacity
                  key={f.id}
                  activeOpacity={0.75}
                  onPress={() => setSelectedFilter(f.id)}
                  style={[
                    styles.filterChip,
                    {
                      backgroundColor: isSelected
                        ? (isDark ? 'rgba(176, 164, 241, 0.25)' : 'rgba(110, 94, 199, 0.15)')
                        : (isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)'),
                      borderColor: isSelected ? theme.primary : 'transparent',
                    }
                  ]}
                >
                  <Text style={[
                    styles.filterChipText,
                    { color: isSelected ? (isDark ? '#FFF' : theme.primary) : (isDark ? '#A09CB8' : '#6A658E') }
                  ]}>
                    {f.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </View>

      {/* Journal List */}
      <FlatList
        data={filteredEntries}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.listContent, { paddingBottom: 24 }]}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const modeInfo = MINDFUL_LAUNCHERS.find(m => m.id === item.mode) || MINDFUL_LAUNCHERS[0];
          return (
            <TouchableOpacity
              style={[
                styles.entryCard,
                {
                  backgroundColor: isDark ? 'rgba(18, 12, 38, 0.78)' : 'rgba(255, 255, 255, 0.90)',
                  borderColor: isDark ? 'rgba(255, 255, 255, 0.10)' : 'rgba(120, 104, 230, 0.18)',
                }
              ]}
              activeOpacity={0.85}
              onPress={() => router.push({
                pathname: '/diary-detail',
                params: { id: item.id }
              })}
            >
              <View style={styles.entryHeader}>
                <View style={styles.entryMetaBadges}>
                  <View style={[styles.moodBadge, { backgroundColor: item.mood.color + '20', borderColor: item.mood.color + '40' }]}>
                    <Text style={styles.moodEmoji}>{item.mood.emoji}</Text>
                    <Text style={[styles.moodLabel, { color: item.mood.color }]}>{item.mood.label}</Text>
                  </View>

                  {item.mode && item.mode !== 'standard' && (
                    <View style={[styles.modeBadge, { backgroundColor: modeInfo.color + '18', borderColor: modeInfo.color + '35' }]}>
                      <Text style={[styles.modeBadgeText, { color: modeInfo.color }]}>
                        {modeInfo.emoji} {modeInfo.label}
                      </Text>
                    </View>
                  )}
                </View>

                <View style={styles.entryRightHeader}>
                  <Text style={[styles.entryDate, { color: isDark ? '#A09CB8' : '#716B99' }]}>{item.date}</Text>
                  <TouchableOpacity onPress={() => deleteEntry(item.id)} style={styles.deleteBtn} activeOpacity={0.7}>
                    <Ionicons name="trash-outline" size={15} color={isDark ? '#A09CB8' : '#8E88B8'} />
                  </TouchableOpacity>
                </View>
              </View>

              <Text style={[styles.entryTitle, { color: isDark ? '#FFFFFF' : '#14121E' }]}>{item.title}</Text>
              <Text style={[styles.entrySnippet, { color: isDark ? '#C5C1E8' : '#5A567D' }]} numberOfLines={2}>
                {item.content}
              </Text>

              {/* Voya Reflection Indicator */}
              {item.voyaReflection && (
                <View style={[styles.entryVoyaBadge, { backgroundColor: isDark ? 'rgba(176, 164, 241, 0.12)' : 'rgba(110, 94, 199, 0.08)' }]}>
                  <Ionicons name="sparkles" size={12} color="#B0A4F1" style={{ marginRight: 5 }} />
                  <Text style={[styles.entryVoyaBadgeText, { color: isDark ? '#D8D4F8' : '#5A48D4' }]} numberOfLines={1}>
                    Voya Reflected: {item.voyaReflection}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={!isLoading ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="book-outline" size={56} color={theme.border} />
            <Text style={[styles.emptyText, { color: theme.text }]}>{t('journalWaiting')}</Text>
            <Text style={[styles.emptySub, { color: theme.textSecondary }]}>{t('captureMoment')}</Text>
            <TouchableOpacity
              style={[styles.startBtn, { backgroundColor: theme.primary }]}
              onPress={() => router.push('/new-journal')}
              activeOpacity={0.85}
            >
              <Text style={[styles.startBtnText, { color: isDark ? '#000' : '#FFF' }]}>Start Mindful Journal</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        style={[styles.fab, { bottom: 20 + insets.bottom, backgroundColor: theme.primary }]}
        onPress={() => router.push('/new-journal')}
        activeOpacity={0.88}
      >
        <Ionicons name="add" size={30} color={isDark ? "#000" : "#FFF"} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 18,
    marginBottom: 10,
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
    fontWeight: '500',
  },
  gardenPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.3)',
  },
  gardenPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FBBF24',
  },
  launcherSection: {
    marginHorizontal: -18,
    marginBottom: 14,
  },
  launcherScroll: {
    paddingHorizontal: 18,
    gap: 10,
  },
  launcherCard: {
    width: 128,
    padding: 12,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  launcherIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  launcherEmoji: {
    fontSize: 18,
  },
  launcherLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 2,
  },
  launcherDesc: {
    fontSize: 10,
    fontWeight: '500',
    textAlign: 'center',
  },
  insightGenBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 12,
  },
  insightGenBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  insightCard: {
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    marginBottom: 12,
  },
  insightHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  insightCardTitle: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  insightCardText: {
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 6,
  },
  insightQuestion: {
    fontSize: 12,
    fontWeight: '600',
    fontStyle: 'italic',
  },
  filterBar: {
    marginHorizontal: -18,
  },
  filterScroll: {
    paddingHorizontal: 18,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: 18,
    paddingTop: 8,
    gap: 12,
  },
  entryCard: {
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  entryMetaBadges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  moodBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
  },
  moodEmoji: {
    fontSize: 12,
    marginRight: 4,
  },
  moodLabel: {
    fontSize: 11,
    fontWeight: '700',
  },
  modeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
  },
  modeBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  entryRightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  entryDate: {
    fontSize: 11,
    fontWeight: '600',
  },
  deleteBtn: {
    padding: 4,
  },
  entryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  entrySnippet: {
    fontSize: 13,
    lineHeight: 18,
  },
  entryVoyaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    marginTop: 10,
  },
  entryVoyaBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    flex: 1,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 14,
    marginBottom: 6,
  },
  emptySub: {
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 18,
  },
  startBtn: {
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 14,
  },
  startBtnText: {
    fontWeight: 'bold',
    fontSize: 13,
  },
  fab: {
    position: 'absolute',
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
    zIndex: 99,
  },
});
