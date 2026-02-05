import NightSkyBackground from '@/components/NightSkyBackground';
import Colors from '@/constants/Colors';
import { useTheme } from '@/constants/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const MOOD_VIBES = [
    { label: 'Peaceful', emoji: '🧘', color: '#B0A4F1' },
    { label: 'Reflective', emoji: '✨', color: '#4CAF50' },
    { label: 'Growing', emoji: '🌱', color: '#2196F3' },
    { label: 'Grateful', emoji: '🙏', color: '#FF9800' },
    { label: 'Healing', emoji: '💖', color: '#9C27B0' },
];

const DIARY_STORAGE_KEY = '@safe_space_journal';

export default function NewJournalScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { theme: themeName, isDark } = useTheme();
    const theme = Colors[themeName];

    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [selectedVibe, setSelectedVibe] = useState(0);
    const [gratitude, setGratitude] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        if (!text.trim()) {
            Alert.alert("Empty Sanctuary", "Please share a few thoughts before saving your sanctuary.");
            return;
        }

        setIsSaving(true);
        try {
            const newEntry = {
                id: Date.now().toString(),
                title: title.trim() || "Untitled Note",
                content: text.trim(),
                gratitude: gratitude.trim(),
                date: new Date().toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                }),
                timestamp: Date.now(),
                mood: MOOD_VIBES[selectedVibe]
            };

            const existing = await AsyncStorage.getItem(DIARY_STORAGE_KEY);
            const entries = existing ? JSON.parse(existing) : [];
            const updated = [newEntry, ...entries];

            await AsyncStorage.setItem(DIARY_STORAGE_KEY, JSON.stringify(updated));
            router.back();
        } catch (error) {
            Alert.alert("Error", "Could not save your thoughts to the sanctuary.");
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: '#050510' }]}>
            <NightSkyBackground />
            <View style={{ height: insets.top, backgroundColor: '#050510', width: '100%', position: 'absolute', top: 0, zIndex: 10 }} />

            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top + 15 }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="close-outline" size={28} color="#FFF" />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: '#FFF' }]}>Journal Sanctuary</Text>
                <TouchableOpacity
                    onPress={handleSave}
                    style={[styles.saveButton, isSaving && { opacity: 0.5 }]}
                    disabled={isSaving}
                >
                    {isSaving ? (
                        <ActivityIndicator size="small" color="#000" />
                    ) : (
                        <Text style={styles.saveText}>Save</Text>
                    )}
                </TouchableOpacity>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Title Input */}
                <View style={styles.titleSection}>
                    <TextInput
                        style={[styles.titleInput, { color: '#B0A4F1' }]}
                        placeholder="Title of your thought..."
                        placeholderTextColor="rgba(176, 164, 241, 0.3)"
                        value={title}
                        onChangeText={setTitle}
                        maxLength={50}
                    />
                </View>

                {/* Mood/Vibe Selector */}
                <View style={styles.section}>
                    <Text style={[styles.sectionLabel, { color: 'rgba(255,255,255,0.5)' }]}>How's your vibe?</Text>
                    <View style={styles.vibeGrid}>
                        {MOOD_VIBES.map((vibe, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.vibeItem,
                                    { backgroundColor: isDark ? '#111' : '#FFF', borderColor: isDark ? '#222' : '#EEE' },
                                    selectedVibe === index && { backgroundColor: vibe.color + '30', borderColor: vibe.color }
                                ]}
                                onPress={() => setSelectedVibe(index)}
                            >
                                <Text style={styles.vibeEmoji}>{vibe.emoji}</Text>
                                <Text style={[styles.vibeLabel, { color: isDark ? '#666' : '#999' }, selectedVibe === index && { color: vibe.color }]}>
                                    {vibe.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Writing Area */}
                <View style={styles.writingArea}>
                    <TextInput
                        style={[styles.journalInput, { color: '#FFF' }]}
                        placeholder="Let your thoughts flow freely here..."
                        placeholderTextColor="rgba(255,255,255,0.2)"
                        multiline
                        value={text}
                        onChangeText={setText}
                        autoFocus={false}
                    />
                </View>

                {/* Gratitude Section */}
                <View style={[styles.gratitudeSection, { backgroundColor: isDark ? '#111' : '#FFF', borderColor: isDark ? '#222' : '#EEE' }]}>
                    <View style={styles.gratitudeHeader}>
                        <Ionicons name="heart" size={18} color="#B0A4F1" />
                        <Text style={styles.gratitudeTitle}>One thing I'm grateful for...</Text>
                    </View>
                    <TextInput
                        style={[styles.gratitudeInput, { color: '#FFF', borderBottomColor: 'rgba(255,255,255,0.1)' }]}
                        placeholder="Today, I am grateful for..."
                        placeholderTextColor="rgba(255,255,255,0.2)"
                        value={gratitude}
                        onChangeText={setGratitude}
                    />
                </View>
            </ScrollView>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            />
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
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    saveButton: {
        backgroundColor: '#B0A4F1',
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 12,
        minWidth: 70,
        alignItems: 'center',
    },
    saveText: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 14,
    },
    scrollContent: {
        padding: 20,
    },
    titleSection: {
        marginBottom: 20,
    },
    titleInput: {
        fontSize: 24,
        fontWeight: 'bold',
        paddingVertical: 10,
    },
    section: {
        marginBottom: 30,
    },
    sectionLabel: {
        fontSize: 11,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        marginBottom: 15,
    },
    vibeGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    vibeItem: {
        alignItems: 'center',
        padding: 10,
        borderRadius: 16,
        borderWidth: 1,
        width: '18%',
    },
    vibeEmoji: {
        fontSize: 22,
        marginBottom: 4,
    },
    vibeLabel: {
        fontSize: 8,
        fontWeight: 'bold',
    },
    writingArea: {
        minHeight: 250,
        marginBottom: 30,
    },
    journalInput: {
        fontSize: 17,
        lineHeight: 26,
        textAlignVertical: 'top',
    },
    gratitudeSection: {
        padding: 20,
        borderRadius: 24,
        borderWidth: 1,
        marginBottom: 80,
    },
    gratitudeHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    gratitudeTitle: {
        color: '#B0A4F1',
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 8,
    },
    gratitudeInput: {
        fontSize: 16,
        paddingVertical: 10,
        borderBottomWidth: 1,
    },
});
