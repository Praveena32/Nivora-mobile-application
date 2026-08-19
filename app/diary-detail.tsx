import NightSkyBackground from '@/components/NightSkyBackground';
import Colors from '@/constants/Colors';
import { useTheme } from '@/constants/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { JournalEntry } from './(tabs)/diary';

const DIARY_STORAGE_KEY = '@safe_space_journal';

export default function DiaryDetailScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { id } = useLocalSearchParams();
    const { theme: themeName, isDark } = useTheme();
    const theme = Colors[themeName];

    const [entry, setEntry] = useState<JournalEntry | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadEntry();
    }, [id]);

    const loadEntry = async () => {
        try {
            const stored = await AsyncStorage.getItem(DIARY_STORAGE_KEY);
            if (stored) {
                const entries = JSON.parse(stored);
                const found = entries.find((e: JournalEntry) => e.id === id);
                if (found) {
                    setEntry(found);
                } else {
                    Alert.alert("Error", "Entry not found in the sanctuary.");
                    router.back();
                }
            }
        } catch (error) {
            console.error("Failed to load entry detail:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const deleteEntry = () => {
        Alert.alert(
            "Delete Entry",
            "Are you sure you want to remove this memory?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            const stored = await AsyncStorage.getItem(DIARY_STORAGE_KEY);
                            if (stored) {
                                const entries = JSON.parse(stored);
                                const updated = entries.filter((e: any) => e.id !== id);
                                await AsyncStorage.setItem(DIARY_STORAGE_KEY, JSON.stringify(updated));
                                router.back();
                            }
                        } catch (error) {
                            Alert.alert("Error", "Could not delete entry.");
                        }
                    }
                }
            ]
        );
    };

    if (isLoading) {
        return (
            <View style={[styles.container, { backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }]}>
                <NightSkyBackground />
                <ActivityIndicator size="large" color={theme.primary} />
            </View>
        );
    }

    if (!entry) return null;

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <NightSkyBackground />
            <View style={{ height: insets.top, backgroundColor: theme.background, width: '100%', position: 'absolute', top: 0, zIndex: 10 }} />

            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={[styles.backButton, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)', borderColor: theme.border }]}
                    activeOpacity={0.75}
                >
                    <Ionicons name="chevron-back" size={24} color={theme.text} />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={deleteEntry}
                    style={[styles.trashBtn, { backgroundColor: isDark ? 'rgba(239, 68, 68, 0.15)' : 'rgba(239, 68, 68, 0.10)', borderColor: 'rgba(239, 68, 68, 0.3)' }]}
                    activeOpacity={0.75}
                >
                    <Ionicons name="trash-outline" size={20} color="#EF4444" />
                </TouchableOpacity>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 60 }]}
            >
                {/* Mood & Mode Badges */}
                <View style={styles.badgeRow}>
                    <View style={[styles.moodBadge, { backgroundColor: entry.mood.color + '20', borderColor: entry.mood.color + '40' }]}>
                        <Text style={styles.moodEmoji}>{entry.mood.emoji}</Text>
                        <Text style={[styles.moodLabel, { color: entry.mood.color }]}>{entry.mood.label}</Text>
                    </View>

                    {entry.mode && entry.mode !== 'standard' && (
                        <View style={[styles.modeBadge, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(120, 104, 230, 0.10)', borderColor: isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(120, 104, 230, 0.20)' }]}>
                            <Text style={[styles.modeBadgeText, { color: isDark ? '#FFF' : theme.primary }]}>
                                {entry.mode === 'gratitude' ? '🌸 Gratitude Garden' : entry.mode === 'somatic' ? '🫀 Somatic Scan' : entry.mode === 'future' ? '💌 Future Letter' : '🔥 Cathartic Release'}
                            </Text>
                        </View>
                    )}
                </View>

                {/* Title and Date */}
                <Text style={[styles.dateText, { color: theme.textSecondary }]}>{entry.date}</Text>
                <Text style={[styles.titleText, { color: theme.text }]}>{entry.title}</Text>

                {/* Content Section */}
                <View style={[styles.contentCard, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.03)' : '#FFFFFF', borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(120, 104, 230, 0.15)' }]}>
                    <Text style={[styles.contentText, { color: theme.text }]}>{entry.content}</Text>
                </View>

                {/* Voya Reflection Section */}
                {entry.voyaReflection && (
                    <View style={[styles.voyaSection, { backgroundColor: isDark ? 'rgba(176, 164, 241, 0.10)' : 'rgba(120, 104, 230, 0.08)', borderColor: isDark ? 'rgba(176, 164, 241, 0.25)' : 'rgba(120, 104, 230, 0.22)' }]}>
                        <View style={styles.voyaHeader}>
                            <Ionicons name="sparkles" size={16} color={theme.primary} style={{ marginRight: 6 }} />
                            <Text style={[styles.voyaTitle, { color: theme.primary }]}>Voya's Compassionate Reflection</Text>
                        </View>
                        <Text style={[styles.voyaText, { color: theme.text }]}>{entry.voyaReflection}</Text>
                    </View>
                )}

                {/* Gratitude Section */}
                {entry.gratitude && (
                    <View style={[styles.gratitudeSection, { backgroundColor: isDark ? 'rgba(251, 191, 36, 0.08)' : 'rgba(245, 158, 11, 0.08)', borderColor: isDark ? 'rgba(251, 191, 36, 0.20)' : 'rgba(245, 158, 11, 0.22)' }]}>
                        <View style={styles.gratitudeHeader}>
                            <Ionicons name="heart" size={16} color={isDark ? "#FBBF24" : "#D97706"} style={{ marginRight: 6 }} />
                            <Text style={[styles.gratitudeTitle, { color: isDark ? '#FBBF24' : '#B45309' }]}>Grateful for...</Text>
                        </View>
                        <Text style={[styles.gratitudeText, { color: theme.text }]}>{entry.gratitude}</Text>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 18,
        paddingBottom: 10,
        zIndex: 20,
    },
    backButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
    },
    trashBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
    },
    scrollContent: {
        paddingHorizontal: 18,
        paddingTop: 10,
    },
    badgeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 14,
    },
    moodBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 16,
        borderWidth: 1,
    },
    moodEmoji: {
        fontSize: 14,
        marginRight: 5,
    },
    moodLabel: {
        fontSize: 12,
        fontWeight: '700',
    },
    modeBadge: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 16,
        borderWidth: 1,
    },
    modeBadgeText: {
        fontSize: 11,
        fontWeight: '700',
    },
    dateText: {
        fontSize: 13,
        fontWeight: '600',
        marginBottom: 6,
    },
    titleText: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    contentCard: {
        borderRadius: 20,
        padding: 18,
        borderWidth: 1,
        marginBottom: 20,
    },
    contentText: {
        fontSize: 16,
        lineHeight: 26,
    },
    voyaSection: {
        padding: 16,
        borderRadius: 20,
        borderWidth: 1,
        marginBottom: 20,
    },
    voyaHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    voyaTitle: {
        fontSize: 13,
        fontWeight: 'bold',
    },
    voyaText: {
        fontSize: 14,
        lineHeight: 22,
    },
    gratitudeSection: {
        padding: 16,
        borderRadius: 20,
        borderWidth: 1,
        marginBottom: 20,
    },
    gratitudeHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    gratitudeTitle: {
        fontSize: 13,
        fontWeight: 'bold',
    },
    gratitudeText: {
        fontSize: 14,
        lineHeight: 22,
        fontStyle: 'italic',
    },
});
