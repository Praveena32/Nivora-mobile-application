import NightSkyBackground from '@/components/NightSkyBackground';
import { BACKEND_URL } from '@/constants/Backend';
import Colors from '@/constants/Colors';
import { useLanguage } from '@/constants/LanguageContext';
import { useTheme } from '@/constants/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const BUDDIES = [
    { id: '1', name: '@GentleSoul', bio: 'Mindful listener & nature lover', avatar: 'https://i.pravatar.cc/150?u=1' },
    { id: '2', name: '@SereneHaze', bio: 'Art enthusiast & late night reader', avatar: 'https://i.pravatar.cc/150?u=2' },
    { id: '3', name: '@CalmRiver', bio: 'Music lover & compassionate listener', avatar: 'https://i.pravatar.cc/150?u=3' },
];

const FALLBACK_LONELY_AUDIO = [
    {
        id: '1',
        title: 'Warm Hearth & Soft Piano',
        duration: '12 mins',
        description: 'Cozy crackling fireplace with gentle piano chords for soothing warmth.',
        url: 'https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f792cb.mp3?filename=meditation-soundscape-124707.mp3'
    },
    {
        id: '2',
        title: 'Starlight Acoustic Solace',
        duration: '10 mins',
        description: 'Ambient acoustic harmonies to accompany quiet evening reflections.',
        url: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=forest-with-small-river-birds-and-nature-field-recording-6735.mp3'
    }
];

export default function LonelyScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { theme: themeName, isDark } = useTheme();
    const theme = Colors[themeName];
    const { t } = useLanguage();

    // Audio State
    const [media, setMedia] = useState<any[]>(FALLBACK_LONELY_AUDIO);
    const [currentIndex, setCurrentIndex] = useState(0);

    const player = useAudioPlayer(media[currentIndex]?.url || FALLBACK_LONELY_AUDIO[0].url);
    const status = useAudioPlayerStatus(player);

    useEffect(() => {
        fetchMedia();
    }, []);

    useEffect(() => {
        if (media[currentIndex]?.url) {
            player.replace({ uri: media[currentIndex].url });
        }
    }, [currentIndex, media]);

    const fetchMedia = async () => {
        try {
            const response = await fetch(`${BACKEND_URL}/media?category=lonely`);
            const data = await response.json();
            if (Array.isArray(data) && data.length > 0) {
                setMedia(data);
            }
        } catch {
            setMedia(FALLBACK_LONELY_AUDIO);
        }
    };

    const togglePlay = () => {
        if (status.playing) player.pause();
        else player.play();
    };

    const currentMedia = media[currentIndex] || FALLBACK_LONELY_AUDIO[0];

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <NightSkyBackground />
            <View style={{ height: insets.top, backgroundColor: theme.background, width: '100%', position: 'absolute', top: 0, zIndex: 10 }} />

            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top + 12, borderBottomColor: theme.border, backgroundColor: isDark ? 'rgba(7, 6, 20, 0.75)' : 'rgba(255, 255, 255, 0.85)' }]}>
                <TouchableOpacity onPress={() => router.back()} style={[styles.backButton, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)', borderColor: theme.border }]}>
                    <Ionicons name="chevron-back" size={24} color={isDark ? "#B0A4F1" : "#7868E6"} />
                </TouchableOpacity>

                <View style={styles.headerTitleGroup}>
                    <Ionicons name="heart-circle" size={18} color={isDark ? "#B0A4F1" : "#7868E6"} style={{ marginRight: 6 }} />
                    <Text style={[styles.title, { color: theme.text }]}>{t('buddyConnection')}</Text>
                </View>

                <TouchableOpacity
                    style={[styles.historyButton, { backgroundColor: isDark ? 'rgba(176, 164, 241, 0.15)' : 'rgba(120, 104, 230, 0.10)', borderColor: theme.border }]}
                    onPress={() => router.push('/moods/chat-history' as any)}
                >
                    <Ionicons name="chatbubbles-outline" size={18} color={isDark ? "#B0A4F1" : "#7868E6"} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={[styles.content, { paddingBottom: 24 }]} showsVerticalScrollIndicator={false}>
                {/* 1. Hero Sanctuary Card */}
                <View style={[styles.heroCard, { backgroundColor: isDark ? 'rgba(176, 164, 241, 0.10)' : 'rgba(120, 104, 230, 0.06)', borderColor: isDark ? 'rgba(176, 164, 241, 0.28)' : 'rgba(120, 104, 230, 0.22)' }]}>
                    <Text style={[styles.heroTitle, { color: theme.text }]}>{t('youAreNotAlone')}</Text>
                    <Text style={[styles.heroDesc, { color: theme.textSecondary }]}>{t('lonelyHeroDesc')}</Text>

                    {media.length > 0 && (
                        <TouchableOpacity style={[styles.playerBar, { backgroundColor: isDark ? theme.surface : '#FFFFFF', borderColor: theme.border }]} onPress={togglePlay} activeOpacity={0.85}>
                            <Ionicons name={status.playing ? "pause" : "play"} size={22} color={isDark ? "#B0A4F1" : "#7868E6"} />
                            <Text style={[styles.playerText, { color: theme.text }]} numberOfLines={1}>{currentMedia.title}</Text>
                            <View style={styles.liveIndicator}>
                                <View style={[styles.liveDot, status.playing && styles.dotPulsing]} />
                            </View>
                        </TouchableOpacity>
                    )}
                </View>

                {/* 2. Available Peer Buddies */}
                <View style={styles.section}>
                    <View style={styles.sectionHeaderRow}>
                        <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('availableBuddies')}</Text>
                        <Text style={[styles.sectionSubtitle, { color: isDark ? '#B0A4F1' : '#7868E6' }]}>Online Now</Text>
                    </View>

                    <View style={styles.buddyList}>
                        {BUDDIES.map(buddy => (
                            <View key={buddy.id} style={[styles.buddyCard, { backgroundColor: isDark ? theme.card : '#FFFFFF', borderColor: theme.border }]}>
                                <View style={styles.avatarWrapper}>
                                    <Image source={{ uri: buddy.avatar }} style={[styles.avatar, { borderColor: isDark ? '#B0A4F1' : '#7868E6', borderWidth: 1.5 }]} />
                                    <View style={styles.onlineStatusDot} />
                                </View>
                                <View style={styles.buddyInfo}>
                                    <Text style={[styles.buddyName, { color: theme.text }]}>{buddy.name}</Text>
                                    <Text style={[styles.buddyBio, { color: theme.textSecondary }]}>{buddy.bio}</Text>
                                </View>
                                <TouchableOpacity
                                    style={[styles.connectButton, { backgroundColor: isDark ? '#B0A4F1' : '#7868E6' }]}
                                    onPress={() => router.push({
                                        pathname: '/moods/buddy-chat',
                                        params: { name: buddy.name, avatar: buddy.avatar }
                                    } as any)}
                                    activeOpacity={0.85}
                                >
                                    <Ionicons name="chatbubble" size={14} color={isDark ? "#000" : "#FFF"} style={{ marginRight: 4 }} />
                                    <Text style={[styles.connectButtonText, { color: isDark ? '#000' : '#FFF' }]}>{t('sayHi')}</Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                </View>

                {/* 3. Live Shared Activities */}
                <View style={[styles.activityBox, { backgroundColor: isDark ? theme.card : '#FFFFFF', borderColor: theme.border }]}>
                    <Text style={[styles.activityTitle, { color: theme.text }]}>{t('sharedActivities')}</Text>

                    <TouchableOpacity
                        style={[styles.activityItem, { backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#F9FAFB', borderColor: theme.border }]}
                        onPress={() => router.push('/moods/group-meditation' as any)}
                        activeOpacity={0.8}
                    >
                        <View style={[styles.activityIcon, { backgroundColor: isDark ? '#B0A4F1' : '#7868E6' }]}>
                            <Ionicons name="people" size={20} color={isDark ? "#000" : "#FFF"} />
                        </View>
                        <View style={styles.activityText}>
                            <Text style={[styles.activityLabel, { color: theme.text }]}>Together in Silence Meditation</Text>
                            <Text style={[styles.activityTime, { color: theme.textSecondary }]}>Breathing halo & live peer counter</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color={theme.textSecondary} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.activityItem, { backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#F9FAFB', borderColor: theme.border }]}
                        onPress={() => router.push('/moods/collaborative-art' as any)}
                        activeOpacity={0.8}
                    >
                        <View style={[styles.activityIcon, { backgroundColor: '#38BDF8' }]}>
                            <Ionicons name="sparkles" size={20} color={isDark ? "#000" : "#FFF"} />
                        </View>
                        <View style={styles.activityText}>
                            <Text style={[styles.activityLabel, { color: theme.text }]}>Celestial Starlight Canvas</Text>
                            <Text style={[styles.activityTime, { color: theme.textSecondary }]}>Collaborative emotion star painting</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color={theme.textSecondary} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.activityItem, { backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#F9FAFB', borderColor: theme.border }]}
                        onPress={() => router.push('/moods/support-circle' as any)}
                        activeOpacity={0.8}
                    >
                        <View style={[styles.activityIcon, { backgroundColor: '#10B981' }]}>
                            <Ionicons name="shield-checkmark" size={20} color={isDark ? "#000" : "#FFF"} />
                        </View>
                        <View style={styles.activityText}>
                            <Text style={[styles.activityLabel, { color: theme.text }]}>Safe Support Pods</Text>
                            <Text style={[styles.activityTime, { color: theme.textSecondary }]}>Thematic peer support rooms</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color={theme.textSecondary} />
                    </TouchableOpacity>
                </View>
            </ScrollView>
            <View style={{ height: insets.bottom, backgroundColor: theme.background, width: '100%', zIndex: 10 }} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 18,
        paddingBottom: 12,
        borderBottomWidth: 1,
        zIndex: 10,
    },
    backButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
    },
    headerTitleGroup: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    historyButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
    },
    content: {
        paddingHorizontal: 18,
        paddingTop: 18,
    },
    heroCard: {
        borderRadius: 22,
        padding: 20,
        borderWidth: 1,
        marginBottom: 16,
    },
    heroTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 6,
    },
    heroDesc: {
        fontSize: 13,
        lineHeight: 19,
        marginBottom: 14,
    },
    playerBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 12,
        borderRadius: 14,
        borderWidth: 1,
    },
    playerText: {
        flex: 1,
        fontSize: 13,
        fontWeight: '600',
        marginLeft: 10,
    },
    liveIndicator: {
        marginLeft: 8,
    },
    liveDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#B0A4F1',
    },
    dotPulsing: {
        opacity: 0.8,
    },
    section: {
        marginBottom: 16,
    },
    sectionHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    sectionSubtitle: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    buddyList: {
        gap: 10,
    },
    buddyCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        borderRadius: 18,
        borderWidth: 1,
    },
    avatarWrapper: {
        position: 'relative',
        marginRight: 12,
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
    },
    onlineStatusDot: {
        position: 'absolute',
        bottom: 2,
        right: 2,
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#10B981',
        borderWidth: 1.5,
        borderColor: '#FFF',
    },
    buddyInfo: {
        flex: 1,
        marginRight: 8,
    },
    buddyName: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    buddyBio: {
        fontSize: 11,
        marginTop: 2,
    },
    connectButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 12,
    },
    connectButtonText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    activityBox: {
        borderRadius: 20,
        padding: 18,
        borderWidth: 1,
    },
    activityTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        marginBottom: 14,
    },
    activityItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 16,
        borderWidth: 1,
        marginBottom: 10,
    },
    activityIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    activityText: {
        flex: 1,
    },
    activityLabel: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    activityTime: {
        fontSize: 11,
        marginTop: 2,
    }
});
