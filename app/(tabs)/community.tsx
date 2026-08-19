import NightSkyBackground from '@/components/NightSkyBackground';
import Colors from '@/constants/Colors';
import { useLanguage } from '@/constants/LanguageContext';
import { useTheme } from '@/constants/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const COMMUNITY_KINDNESS_KEY = '@nivora_community_kindness_notes';

type KindnessNote = {
    id: string;
    text: string;
    alias: string;
    avatarEmoji: string;
    time: string;
    warmthCount: number;
    color: string;
    userSentWarmth?: boolean;
};

const INITIAL_KINDNESS_NOTES: KindnessNote[] = [
    {
        id: '1',
        text: "To whoever is studying late or feeling burnt out tonight: your worth is not defined by a score or a bad day. Take a gentle breath. You're doing enough.",
        alias: "Gentle Soul",
        avatarEmoji: "🌸",
        time: "14m ago",
        warmthCount: 38,
        color: '#7868E6',
    },
    {
        id: '2',
        text: "If you feel heavy or tearful, it's okay to put everything down and rest. Healing is not a race, and tomorrow is a fresh, quiet beginning.",
        alias: "Quiet Fighter",
        avatarEmoji: "🕊️",
        time: "42m ago",
        warmthCount: 56,
        color: '#EC4899',
    },
    {
        id: '3',
        text: "Sending love to anyone dealing with social anxiety today. Taking just one small step outside or speaking up was huge. Proud of you.",
        alias: "Calm Breeze",
        avatarEmoji: "🌿",
        time: "1h ago",
        warmthCount: 47,
        color: '#10B981',
    },
    {
        id: '4',
        text: "You survived 100% of your hardest days so far. Don't forget how resilient you truly are when the sky feels dark.",
        alias: "Starlight Friend",
        avatarEmoji: "✨",
        time: "2h ago",
        warmthCount: 82,
        color: '#F59E0B',
    },
];

const THEMATIC_PODS = [
    {
        id: 'academic',
        title: 'Academic Burnout & Pressure',
        desc: 'Exam stress, late nights & study solidarity',
        icon: 'school-outline',
        emoji: '🎓',
        color: '#7868E6',
        darkColor: '#B0A4F1',
        activeMembers: 34,
    },
    {
        id: 'grief',
        title: 'Grief & Heartbreak Sanctuary',
        desc: 'Gentle support for loss, separation & hurt',
        icon: 'heart-dislike-outline',
        emoji: '💔',
        color: '#EC4899',
        darkColor: '#F472B6',
        activeMembers: 19,
    },
    {
        id: 'anxiety',
        title: 'Social Anxiety & Introvert Hub',
        desc: 'Low-pressure sharing at your own pace',
        icon: 'leaf-outline',
        emoji: '🌿',
        color: '#10B981',
        darkColor: '#34D399',
        activeMembers: 42,
    },
    {
        id: 'cyber',
        title: 'Cyber-Safety & Healing',
        desc: 'Safe space to talk about online harassment',
        icon: 'shield-checkmark-outline',
        emoji: '🕊️',
        color: '#0EA5E9',
        darkColor: '#38BDF8',
        activeMembers: 21,
    },
    {
        id: 'purpose',
        title: 'Life Transitions & Career Path',
        desc: 'Navigating uncertainty, jobs & life choices',
        icon: 'compass-outline',
        emoji: '🧭',
        color: '#F59E0B',
        darkColor: '#FBBF24',
        activeMembers: 28,
    },
];

export default function CommunityScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { theme: themeName, isDark } = useTheme();
    const theme = Colors[themeName];
    const { t } = useLanguage();

    // Kindness notes state
    const [notes, setNotes] = useState<KindnessNote[]>(INITIAL_KINDNESS_NOTES);
    const [totalWarmthSent, setTotalWarmthSent] = useState(4820);
    const [isNoteModalVisible, setIsNoteModalVisible] = useState(false);
    const [newNoteText, setNewNoteText] = useState('');
    const [newNoteAlias, setNewNoteAlias] = useState('Kind Soul');
    const [isPostingNote, setIsPostingNote] = useState(false);

    // Live Sync Breathers count
    const [liveBreathersCount, setLiveBreathersCount] = useState(128);

    useEffect(() => {
        loadCommunityNotes();
        const interval = setInterval(() => {
            setLiveBreathersCount(prev => prev + (Math.random() > 0.5 ? 1 : -1));
        }, 6000);
        return () => clearInterval(interval);
    }, []);

    const loadCommunityNotes = async () => {
        try {
            const stored = await AsyncStorage.getItem(COMMUNITY_KINDNESS_KEY);
            if (stored) {
                const userNotes = JSON.parse(stored);
                setNotes([...userNotes, ...INITIAL_KINDNESS_NOTES]);
            }
        } catch (e) {
            console.error('Failed to load kindness notes:', e);
        }
    };

    const handleSendWarmth = (noteId: string) => {
        setNotes(prev =>
            prev.map(note => {
                if (note.id === noteId) {
                    const alreadySent = note.userSentWarmth;
                    return {
                        ...note,
                        warmthCount: alreadySent ? note.warmthCount - 1 : note.warmthCount + 1,
                        userSentWarmth: !alreadySent,
                    };
                }
                return note;
            })
        );
        setTotalWarmthSent(prev => prev + 1);
    };

    const handlePostKindNote = async () => {
        if (!newNoteText.trim()) {
            Alert.alert("Empty Note", "Please write a gentle thought of encouragement for your peers.");
            return;
        }

        setIsPostingNote(true);

        const newNote: KindnessNote = {
            id: Date.now().toString(),
            text: newNoteText.trim(),
            alias: newNoteAlias.trim() || 'Kind Soul',
            avatarEmoji: ['🌸', '✨', '🕊️', '🌿', '🌙', '💖'][Math.floor(Math.random() * 6)],
            time: 'Just now',
            warmthCount: 1,
            color: isDark ? '#B0A4F1' : '#7868E6',
            userSentWarmth: true,
        };

        try {
            const stored = await AsyncStorage.getItem(COMMUNITY_KINDNESS_KEY);
            const existing = stored ? JSON.parse(stored) : [];
            const updated = [newNote, ...existing];
            await AsyncStorage.setItem(COMMUNITY_KINDNESS_KEY, JSON.stringify(updated));

            setNotes([newNote, ...notes]);
            setNewNoteText('');
            setIsNoteModalVisible(false);
            Alert.alert("Heartfelt Thanks 🌸", "Your note has been posted anonymously to the Kindness Waves wall.");
        } catch (e) {
            Alert.alert("Error", "Could not post your note right now.");
        } finally {
            setIsPostingNote(false);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <NightSkyBackground />
            <View style={{ height: insets.top, backgroundColor: theme.background, width: '100%', position: 'absolute', top: 0, zIndex: 10 }} />

            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
                <View style={styles.headerTitleRow}>
                    <View>
                        <Text style={[styles.title, { color: theme.text }]}>{t('communityHub')}</Text>
                        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Safe, anonymous solidarity & peer support</Text>
                    </View>

                    <TouchableOpacity
                        style={[styles.postNoteHeaderBtn, { backgroundColor: isDark ? 'rgba(176, 164, 241, 0.18)' : 'rgba(120, 104, 230, 0.12)', borderColor: theme.primary }]}
                        onPress={() => setIsNoteModalVisible(true)}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="sparkles" size={14} color={theme.primary} style={{ marginRight: 4 }} />
                        <Text style={[styles.postNoteHeaderBtnText, { color: theme.primary }]}>+ Send Note</Text>
                    </TouchableOpacity>
                </View>

                {/* Live Empathy Metric Pill Bar */}
                <View style={styles.metricRow}>
                    <View style={[styles.metricPill, { backgroundColor: isDark ? 'rgba(236, 72, 153, 0.15)' : 'rgba(236, 72, 153, 0.10)', borderColor: 'rgba(236, 72, 153, 0.3)' }]}>
                        <Text style={[styles.metricPillText, { color: isDark ? '#F472B6' : '#DB2777' }]}>
                            🕯️ {totalWarmthSent.toLocaleString()} Warmth Hugs Sent
                        </Text>
                    </View>

                    <View style={[styles.metricPill, { backgroundColor: isDark ? 'rgba(56, 189, 248, 0.15)' : 'rgba(14, 165, 233, 0.10)', borderColor: 'rgba(56, 189, 248, 0.3)' }]}>
                        <View style={styles.livePulseDot} />
                        <Text style={[styles.metricPillText, { color: isDark ? '#38BDF8' : '#0284C7' }]}>
                            {liveBreathersCount} Breathing in Sync
                        </Text>
                    </View>
                </View>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[styles.content, { paddingBottom: 24 }]}
            >
                {/* ================================================= */}
                {/* 1. KINDNESS WAVES & EMPATHY WALL */}
                {/* ================================================= */}
                <View style={styles.section}>
                    <View style={styles.sectionHeaderRow}>
                        <View style={styles.sectionTitleWithIcon}>
                            <Text style={styles.sectionEmoji}>🕯️</Text>
                            <Text style={[styles.sectionTitle, { color: theme.text }]}>Kindness Waves</Text>
                        </View>
                        <TouchableOpacity onPress={() => setIsNoteModalVisible(true)} activeOpacity={0.75}>
                            <Text style={[styles.sectionActionText, { color: theme.primary }]}>Post Encouragement →</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.kindnessScroll}
                    >
                        {notes.map((note) => (
                            <View
                                key={note.id}
                                style={[
                                    styles.kindnessCard,
                                    {
                                        backgroundColor: isDark ? 'rgba(18, 12, 38, 0.85)' : 'rgba(255, 255, 255, 0.95)',
                                        borderColor: isDark ? 'rgba(255, 255, 255, 0.10)' : 'rgba(120, 104, 230, 0.18)',
                                    }
                                ]}
                            >
                                <View style={styles.kindnessCardHeader}>
                                    <View style={styles.kindnessAuthorBox}>
                                        <Text style={styles.kindnessAvatarEmoji}>{note.avatarEmoji}</Text>
                                        <View>
                                            <Text style={[styles.kindnessAuthorName, { color: isDark ? '#FFF' : '#14121E' }]}>
                                                {note.alias}
                                            </Text>
                                            <Text style={[styles.kindnessTime, { color: isDark ? '#A09CB8' : '#716F8E' }]}>
                                                {note.time}
                                            </Text>
                                        </View>
                                    </View>

                                    <TouchableOpacity
                                        onPress={() => handleSendWarmth(note.id)}
                                        style={[
                                            styles.warmthBtn,
                                            {
                                                backgroundColor: note.userSentWarmth
                                                    ? (isDark ? 'rgba(236, 72, 153, 0.25)' : 'rgba(236, 72, 153, 0.15)')
                                                    : (isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.04)'),
                                                borderColor: note.userSentWarmth ? '#EC4899' : 'transparent',
                                            }
                                        ]}
                                        activeOpacity={0.8}
                                    >
                                        <Text style={{ fontSize: 13 }}>{note.userSentWarmth ? '💖' : '🕯️'}</Text>
                                        <Text style={[
                                            styles.warmthCountText,
                                            { color: note.userSentWarmth ? (isDark ? '#F472B6' : '#DB2777') : (isDark ? '#A09CB8' : '#716F8E') }
                                        ]}>
                                            {note.warmthCount}
                                        </Text>
                                    </TouchableOpacity>
                                </View>

                                <Text style={[styles.kindnessText, { color: isDark ? '#E2DEF8' : '#2D284D' }]}>
                                    "{note.text}"
                                </Text>
                            </View>
                        ))}
                    </ScrollView>
                </View>

                {/* ================================================= */}
                {/* 2. TOGETHER IN SILENCE (LIVE CO-BREATHE) BANNER */}
                {/* ================================================= */}
                <TouchableOpacity
                    style={[
                        styles.syncMeditationBanner,
                        {
                            backgroundColor: isDark ? 'rgba(18, 12, 38, 0.90)' : 'rgba(255, 255, 255, 0.95)',
                            borderColor: isDark ? 'rgba(176, 164, 241, 0.35)' : 'rgba(120, 104, 230, 0.25)',
                        }
                    ]}
                    onPress={() => router.push('/moods/group-meditation' as any)}
                    activeOpacity={0.85}
                >
                    <View style={styles.syncBannerLeft}>
                        <View style={[styles.syncIconHalo, { backgroundColor: isDark ? 'rgba(176, 164, 241, 0.20)' : 'rgba(120, 104, 230, 0.15)' }]}>
                            <Ionicons name="people" size={26} color={theme.primary} />
                        </View>
                        <View style={styles.syncBannerInfo}>
                            <View style={styles.syncTitleRow}>
                                <Text style={[styles.syncTitle, { color: isDark ? '#FFF' : '#14121E' }]}>Together in Silence</Text>
                                <View style={styles.liveBadge}>
                                    <View style={styles.liveDotRed} />
                                    <Text style={styles.liveBadgeText}>LIVE</Text>
                                </View>
                            </View>
                            <Text style={[styles.syncSubtitle, { color: isDark ? '#C5C1E8' : '#5A567D' }]}>
                                {liveBreathersCount} souls breathing together in peace without cameras or talking
                            </Text>
                        </View>
                    </View>

                    <View style={[styles.joinSyncBtn, { backgroundColor: theme.primary }]}>
                        <Text style={[styles.joinSyncBtnText, { color: isDark ? '#000' : '#FFF' }]}>Join Sync →</Text>
                    </View>
                </TouchableOpacity>

                {/* ================================================= */}
                {/* 3. THEMATIC ANONYMOUS SAFE PODS */}
                {/* ================================================= */}
                <View style={styles.section}>
                    <View style={styles.sectionHeaderRow}>
                        <View style={styles.sectionTitleWithIcon}>
                            <Text style={styles.sectionEmoji}>🛡️</Text>
                            <Text style={[styles.sectionTitle, { color: theme.text }]}>Anonymous Support Pods</Text>
                        </View>
                        <Text style={[styles.sectionSubBadge, { color: theme.textSecondary }]}>Voya Safe Guarded</Text>
                    </View>

                    <View style={styles.podsGrid}>
                        {THEMATIC_PODS.map((pod) => {
                            const podColor = isDark ? pod.darkColor : pod.color;
                            return (
                                <TouchableOpacity
                                    key={pod.id}
                                    style={[
                                        styles.podCard,
                                        {
                                            backgroundColor: isDark ? 'rgba(18, 12, 38, 0.85)' : 'rgba(255, 255, 255, 0.95)',
                                            borderColor: isDark ? (podColor + '35') : (podColor + '30'),
                                        }
                                    ]}
                                    onPress={() => router.push('/moods/support-circle' as any)}
                                    activeOpacity={0.8}
                                >
                                    <View style={styles.podTopRow}>
                                        <View style={[styles.podEmojiCircle, { backgroundColor: podColor + '18' }]}>
                                            <Text style={styles.podEmojiText}>{pod.emoji}</Text>
                                        </View>
                                        <View style={[styles.podMemberCount, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.04)' }]}>
                                            <Ionicons name="chatbubbles-outline" size={11} color={podColor} style={{ marginRight: 3 }} />
                                            <Text style={[styles.podMemberCountText, { color: podColor }]}>{pod.activeMembers} online</Text>
                                        </View>
                                    </View>

                                    <Text style={[styles.podTitle, { color: isDark ? '#FFF' : '#14121E' }]}>{pod.title}</Text>
                                    <Text style={[styles.podDesc, { color: isDark ? '#A09CB8' : '#6A658E' }]} numberOfLines={2}>
                                        {pod.desc}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>

                {/* ================================================= */}
                {/* 4. COLLECTIVE COMMUNITY HEALING QUEST */}
                {/* ================================================= */}
                <View style={styles.section}>
                    <View style={[
                        styles.questCard,
                        {
                            backgroundColor: isDark ? 'rgba(18, 12, 38, 0.90)' : 'rgba(255, 255, 255, 0.95)',
                            borderColor: isDark ? 'rgba(245, 158, 11, 0.35)' : 'rgba(245, 158, 11, 0.30)',
                        }
                    ]}>
                        <View style={styles.questHeader}>
                            <View style={[styles.questIconBox, { backgroundColor: 'rgba(245, 158, 11, 0.15)' }]}>
                                <Text style={{ fontSize: 20 }}>🌍</Text>
                            </View>
                            <View style={{ flex: 1, marginLeft: 12 }}>
                                <Text style={[styles.questTitle, { color: isDark ? '#FBBF24' : '#D97706' }]}>
                                    Weekly Healing Milestone
                                </Text>
                                <Text style={[styles.questSub, { color: isDark ? '#E2DEF8' : '#5A567D' }]}>
                                    10,000 Collective Mindful Breaths
                                </Text>
                            </View>
                            <Text style={[styles.questPercent, { color: isDark ? '#FBBF24' : '#D97706' }]}>78%</Text>
                        </View>

                        {/* Progress Bar */}
                        <View style={[styles.progressBarTrack, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)' }]}>
                            <View style={[styles.progressBarFill, { width: '78%', backgroundColor: isDark ? '#FBBF24' : '#D97706' }]} />
                        </View>

                        <View style={styles.questFooterRow}>
                            <Text style={[styles.questFootText, { color: isDark ? '#A09CB8' : '#716F8E' }]}>
                                7,840 / 10,000 Breaths completed together
                            </Text>
                            <Text style={[styles.questRewardText, { color: isDark ? '#FBBF24' : '#B45309' }]}>
                                🎁 Unlocks "Bioluminescent Forest"
                            </Text>
                        </View>
                    </View>
                </View>

                {/* ================================================= */}
                {/* 5. LIVING COSMIC CONSTELLATION & VOLUNTEERS */}
                {/* ================================================= */}
                <View style={styles.twoColumnGrid}>
                    <TouchableOpacity
                        style={[
                            styles.subFeatureCard,
                            {
                                backgroundColor: isDark ? 'rgba(18, 12, 38, 0.85)' : 'rgba(255, 255, 255, 0.95)',
                                borderColor: isDark ? 'rgba(255, 176, 176, 0.3)' : 'rgba(239, 68, 68, 0.2)',
                            }
                        ]}
                        onPress={() => router.push('/moods/collaborative-art' as any)}
                        activeOpacity={0.8}
                    >
                        <View style={[styles.subFeatureIcon, { backgroundColor: 'rgba(255, 176, 176, 0.2)' }]}>
                            <Ionicons name="brush" size={22} color="#FF8E8E" />
                        </View>
                        <Text style={[styles.subFeatureTitle, { color: isDark ? '#FFF' : '#14121E' }]}>Cosmic Constellation</Text>
                        <Text style={[styles.subFeatureDesc, { color: isDark ? '#A09CB8' : '#6A658E' }]}>
                            Add your glowing starlight to our shared emotional mural
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.subFeatureCard,
                            {
                                backgroundColor: isDark ? 'rgba(18, 12, 38, 0.85)' : 'rgba(255, 255, 255, 0.95)',
                                borderColor: isDark ? 'rgba(162, 217, 206, 0.3)' : 'rgba(16, 185, 129, 0.2)',
                            }
                        ]}
                        onPress={() => router.push('/moods/volunteer-directory' as any)}
                        activeOpacity={0.8}
                    >
                        <View style={[styles.subFeatureIcon, { backgroundColor: 'rgba(162, 217, 206, 0.2)' }]}>
                            <Ionicons name="heart" size={22} color="#10B981" />
                        </View>
                        <Text style={[styles.subFeatureTitle, { color: isDark ? '#FFF' : '#14121E' }]}>Peer Listeners</Text>
                        <Text style={[styles.subFeatureDesc, { color: isDark ? '#A09CB8' : '#6A658E' }]}>
                            Connect with verified empathetic volunteers for 1-on-1 talk
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* ================================================= */}
            {/* POST A KIND NOTE MODAL */}
            {/* ================================================= */}
            <Modal
                visible={isNoteModalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setIsNoteModalVisible(false)}
            >
                <View style={styles.modalBackdrop}>
                    <View style={[
                        styles.modalContainer,
                        {
                            backgroundColor: isDark ? '#120C26' : '#FFFFFF',
                            borderColor: isDark ? 'rgba(176, 164, 241, 0.3)' : 'rgba(120, 104, 230, 0.2)',
                        }
                    ]}>
                        <View style={styles.modalHeader}>
                            <View style={styles.modalTitleRow}>
                                <Text style={{ fontSize: 22, marginRight: 8 }}>🌸</Text>
                                <Text style={[styles.modalTitle, { color: isDark ? '#FFF' : '#14121E' }]}>
                                    Send a Kindness Wave
                                </Text>
                            </View>
                            <TouchableOpacity onPress={() => setIsNoteModalVisible(false)} style={styles.modalCloseBtn}>
                                <Ionicons name="close" size={24} color={theme.textSecondary} />
                            </TouchableOpacity>
                        </View>

                        <Text style={[styles.modalSub, { color: theme.textSecondary }]}>
                            Your note will be displayed anonymously to support anyone having a tough day.
                        </Text>

                        <TextInput
                            style={[
                                styles.modalTextInput,
                                {
                                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : '#F7F6FC',
                                    borderColor: isDark ? 'rgba(255, 255, 255, 0.10)' : 'rgba(120, 104, 230, 0.2)',
                                    color: theme.text,
                                }
                            ]}
                            placeholder="e.g., Take a deep breath. You are stronger than you feel right now..."
                            placeholderTextColor={theme.placeholder}
                            multiline
                            numberOfLines={4}
                            value={newNoteText}
                            onChangeText={setNewNoteText}
                        />

                        <Text style={[styles.modalAliasLabel, { color: theme.textSecondary }]}>Choose your anonymous pseudonym:</Text>
                        <TextInput
                            style={[
                                styles.modalAliasInput,
                                {
                                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : '#F7F6FC',
                                    borderColor: isDark ? 'rgba(255, 255, 255, 0.10)' : 'rgba(120, 104, 230, 0.2)',
                                    color: theme.text,
                                }
                            ]}
                            placeholder="e.g., Gentle Soul, Starlight Friend"
                            placeholderTextColor={theme.placeholder}
                            value={newNoteAlias}
                            onChangeText={setNewNoteAlias}
                            maxLength={24}
                        />

                        <TouchableOpacity
                            style={[styles.modalSubmitBtn, { backgroundColor: theme.primary }, isPostingNote && { opacity: 0.5 }]}
                            onPress={handlePostKindNote}
                            disabled={isPostingNote}
                            activeOpacity={0.85}
                        >
                            {isPostingNote ? (
                                <ActivityIndicator size="small" color={isDark ? "#000" : "#FFF"} />
                            ) : (
                                <>
                                    <Ionicons name="paper-plane" size={16} color={isDark ? "#000" : "#FFF"} style={{ marginRight: 6 }} />
                                    <Text style={[styles.modalSubmitBtnText, { color: isDark ? '#000' : '#FFF' }]}>
                                        Post Kindness Note
                                    </Text>
                                </>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 18,
        paddingBottom: 10,
    },
    headerTitleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    title: {
        fontSize: 26,
        fontWeight: '900',
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 12,
        marginTop: 2,
        fontWeight: '500',
    },
    postNoteHeaderBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 7,
        borderRadius: 14,
        borderWidth: 1,
    },
    postNoteHeaderBtnText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    metricRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    metricPill: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 14,
        borderWidth: 1,
    },
    metricPillText: {
        fontSize: 11,
        fontWeight: '700',
    },
    livePulseDot: {
        width: 7,
        height: 7,
        borderRadius: 3.5,
        backgroundColor: '#0EA5E9',
        marginRight: 6,
    },
    content: {
        paddingHorizontal: 18,
        paddingTop: 8,
    },
    section: {
        marginBottom: 22,
    },
    sectionHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    sectionTitleWithIcon: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    sectionEmoji: {
        fontSize: 16,
        marginRight: 6,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    sectionActionText: {
        fontSize: 12,
        fontWeight: '700',
    },
    sectionSubBadge: {
        fontSize: 11,
        fontWeight: '600',
    },
    kindnessScroll: {
        gap: 12,
        paddingRight: 10,
    },
    kindnessCard: {
        width: width * 0.76,
        padding: 16,
        borderRadius: 20,
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 6,
        elevation: 3,
    },
    kindnessCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    kindnessAuthorBox: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    kindnessAvatarEmoji: {
        fontSize: 22,
        marginRight: 8,
    },
    kindnessAuthorName: {
        fontSize: 13,
        fontWeight: 'bold',
    },
    kindnessTime: {
        fontSize: 10,
        fontWeight: '500',
    },
    warmthBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 9,
        paddingVertical: 5,
        borderRadius: 12,
        borderWidth: 1,
        gap: 4,
    },
    warmthCountText: {
        fontSize: 11,
        fontWeight: '700',
    },
    kindnessText: {
        fontSize: 13,
        lineHeight: 19,
        fontStyle: 'italic',
    },
    // Sync Banner
    syncMeditationBanner: {
        borderRadius: 22,
        padding: 16,
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 22,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
    },
    syncBannerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginRight: 10,
    },
    syncIconHalo: {
        width: 46,
        height: 46,
        borderRadius: 23,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    syncBannerInfo: {
        flex: 1,
    },
    syncTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 2,
    },
    syncTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        marginRight: 8,
    },
    liveBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(239, 68, 68, 0.15)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 8,
    },
    liveDotRed: {
        width: 5,
        height: 5,
        borderRadius: 2.5,
        backgroundColor: '#EF4444',
        marginRight: 4,
    },
    liveBadgeText: {
        color: '#EF4444',
        fontSize: 9,
        fontWeight: '900',
        letterSpacing: 0.5,
    },
    syncSubtitle: {
        fontSize: 11,
        lineHeight: 16,
    },
    joinSyncBtn: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 12,
    },
    joinSyncBtnText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    // Pods
    podsGrid: {
        gap: 10,
    },
    podCard: {
        padding: 14,
        borderRadius: 18,
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    podTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    podEmojiCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    podEmojiText: {
        fontSize: 16,
    },
    podMemberCount: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 10,
    },
    podMemberCountText: {
        fontSize: 10,
        fontWeight: '700',
    },
    podTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 3,
    },
    podDesc: {
        fontSize: 11,
        lineHeight: 16,
    },
    // Quest
    questCard: {
        padding: 16,
        borderRadius: 20,
        borderWidth: 1,
    },
    questHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    questIconBox: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    questTitle: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    questSub: {
        fontSize: 11,
        marginTop: 1,
        fontWeight: '500',
    },
    questPercent: {
        fontSize: 16,
        fontWeight: '900',
    },
    progressBarTrack: {
        height: 8,
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: 8,
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 4,
    },
    questFooterRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    questFootText: {
        fontSize: 10,
        fontWeight: '500',
    },
    questRewardText: {
        fontSize: 10,
        fontWeight: '700',
    },
    // 2 Column Grid
    twoColumnGrid: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 20,
    },
    subFeatureCard: {
        flex: 1,
        padding: 14,
        borderRadius: 18,
        borderWidth: 1,
        alignItems: 'center',
    },
    subFeatureIcon: {
        width: 42,
        height: 42,
        borderRadius: 21,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    subFeatureTitle: {
        fontSize: 13,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 4,
    },
    subFeatureDesc: {
        fontSize: 10,
        textAlign: 'center',
        lineHeight: 14,
    },
    // Modal
    modalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        padding: 22,
        borderTopWidth: 1,
        maxHeight: '85%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    modalTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    modalCloseBtn: {
        padding: 4,
    },
    modalSub: {
        fontSize: 12,
        lineHeight: 17,
        marginBottom: 14,
    },
    modalTextInput: {
        borderRadius: 16,
        padding: 14,
        borderWidth: 1,
        fontSize: 14,
        lineHeight: 20,
        textAlignVertical: 'top',
        minHeight: 100,
        marginBottom: 14,
    },
    modalAliasLabel: {
        fontSize: 11,
        fontWeight: '700',
        marginBottom: 6,
    },
    modalAliasInput: {
        borderRadius: 14,
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderWidth: 1,
        fontSize: 13,
        marginBottom: 18,
    },
    modalSubmitBtn: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 12,
        borderRadius: 14,
    },
    modalSubmitBtnText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
});
