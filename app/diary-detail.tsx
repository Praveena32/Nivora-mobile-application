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
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <NightSkyBackground />
                <ActivityIndicator size="large" color="#B0A4F1" />
            </View>
        );
    }

    if (!entry) return null;

    return (
        <View style={[styles.container, { backgroundColor: '#050510' }]}>
            <NightSkyBackground />
            <View style={{ height: insets.top, backgroundColor: '#050510', width: '100%', position: 'absolute', top: 0, zIndex: 10 }} />

            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top + 15 }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={28} color="#FFF" />
                </TouchableOpacity>
                <TouchableOpacity onPress={deleteEntry} style={styles.trashBtn}>
                    <Ionicons name="trash-outline" size={24} color="rgba(255,255,255,0.4)" />
                </TouchableOpacity>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Mood Badge */}
                <View style={[styles.moodBadge, { backgroundColor: entry.mood.color + '20' }]}>
                    <Text style={styles.moodEmoji}>{entry.mood.emoji}</Text>
                    <Text style={[styles.moodLabel, { color: entry.mood.color }]}>{entry.mood.label}</Text>
                </View>

                {/* Title and Date */}
                <Text style={styles.dateText}>{entry.date}</Text>
                <Text style={styles.titleText}>{entry.title}</Text>

                {/* Content */}
                <View style={styles.contentSection}>
                    <Text style={styles.contentText}>{entry.content}</Text>
                </View>

                {/* Gratitude Section */}
                {entry.gratitude && (
                    <View style={styles.gratitudeSection}>
                        <View style={styles.gratitudeHeader}>
                            <Ionicons name="heart" size={18} color="#B0A4F1" />
                            <Text style={styles.gratitudeTitle}>Grateful for...</Text>
                        </View>
                        <Text style={styles.gratitudeText}>{entry.gratitude}</Text>
                    </View>
                )}

                <View style={{ height: 100 }} />
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
        paddingHorizontal: 20,
        paddingVertical: 15,
        zIndex: 20,
    },
    backButton: {
        padding: 4,
    },
    trashBtn: {
        padding: 4,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    moodBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        alignSelf: 'flex-start',
        marginBottom: 15,
    },
    moodEmoji: {
        fontSize: 16,
        marginRight: 8,
    },
    moodLabel: {
        fontSize: 12,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    dateText: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 14,
        marginBottom: 8,
    },
    titleText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 30,
    },
    contentSection: {
        marginBottom: 40,
    },
    contentText: {
        fontSize: 18,
        lineHeight: 30,
        color: 'rgba(255,255,255,0.85)',
    },
    gratitudeSection: {
        backgroundColor: 'rgba(255,255,255,0.03)',
        padding: 24,
        borderRadius: 28,
        borderWidth: 1,
        borderColor: 'rgba(176, 164, 241, 0.1)',
    },
    gratitudeHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    gratitudeTitle: {
        color: '#B0A4F1',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    gratitudeText: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.7)',
        lineHeight: 24,
        fontStyle: 'italic',
    },
});
