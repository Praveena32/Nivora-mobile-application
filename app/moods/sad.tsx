import NightSkyBackground from '@/components/NightSkyBackground';
import { BACKEND_URL } from '@/constants/Backend';
import Colors from '@/constants/Colors';
import { useLanguage } from '@/constants/LanguageContext';
import { useTheme } from '@/constants/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
    Alert,
    Animated,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const FALLBACK_SAD_AUDIO = [
    {
        id: '1',
        title: 'Twilight Soft Rain',
        duration: '10 mins',
        description: 'Gentle raindrops & soft ambient soundscapes for emotional warmth.',
        url: 'https://cdn.pixabay.com/download/audio/2021/09/06/audio_823126f582.mp3?filename=rain-and-thunder-nature-sounds-7803.mp3'
    },
    {
        id: '2',
        title: 'Deep Ocean Embrace',
        duration: '12 mins',
        description: 'Rhythmic underwater wave frequencies to calm heavy feelings.',
        url: 'https://cdn.pixabay.com/download/audio/2022/05/16/audio_c9769854ef.mp3?filename=ocean-waves-ambient-110825.mp3'
    }
];

export default function SafeHavenScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { theme: themeName, isDark } = useTheme();
    const theme = Colors[themeName];
    const { t } = useLanguage();

    const [ventText, setVentText] = useState('');
    const [isVentingReleased, setIsVentingReleased] = useState(false);
    const fadeAnim = useRef(new Animated.Value(1)).current;

    const handleReleaseVent = () => {
        if (!ventText.trim()) return;
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
        }).start(() => {
            setVentText('');
            setIsVentingReleased(true);
            fadeAnim.setValue(1);
            setTimeout(() => setIsVentingReleased(false), 4000);
        });
    };

    // Audio State
    const [media, setMedia] = useState<any[]>(FALLBACK_SAD_AUDIO);
    const [currentIndex, setCurrentIndex] = useState(0);

    const player = useAudioPlayer(media[currentIndex]?.url || FALLBACK_SAD_AUDIO[0].url);
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
            const response = await fetch(`${BACKEND_URL}/media?category=sad`);
            const data = await response.json();
            if (Array.isArray(data) && data.length > 0) {
                setMedia(data);
            }
        } catch {
            setMedia(FALLBACK_SAD_AUDIO);
        }
    };

    const togglePlay = () => {
        if (status.playing) player.pause();
        else player.play();
    };

    const SUPPORT_CARDS = [
        {
            title: t('messageSupportCircle'),
            icon: 'people-outline',
            color: '#B0A4F1',
            route: '/(tabs)/community'
        },
        {
            title: t('talkToVolunteer'),
            icon: 'heart-outline',
            color: '#FF8A8A',
            route: '/moods/counselor-chat'
        },
        {
            title: t('bookCounselor'),
            icon: 'calendar-outline',
            color: '#82E9FF',
            route: '/moods/book-counselor'
        },
        {
            title: t('guidedCalming'),
            icon: 'leaf-outline',
            color: '#A7FF82',
            route: '/moods/calming-exercises'
        }
    ];

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <NightSkyBackground />
            <View style={{ height: insets.top, backgroundColor: theme.background, width: '100%', position: 'absolute', top: 0, zIndex: 10 }} />

            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top + 12, borderBottomColor: theme.border, backgroundColor: isDark ? 'rgba(7, 6, 20, 0.75)' : 'rgba(255, 255, 255, 0.85)' }]}>
                <TouchableOpacity onPress={() => router.back()} style={[styles.backButton, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)', borderColor: theme.border }]}>
                    <Ionicons name="chevron-back" size={24} color="#38BDF8" />
                </TouchableOpacity>
                <View style={styles.headerTitleGroup}>
                    <Ionicons name="heart" size={18} color="#38BDF8" style={{ marginRight: 6 }} />
                    <Text style={[styles.title, { color: theme.text }]}>{t('safeHavenTitle')}</Text>
                </View>
                <View style={{ width: 36 }} />
            </View>

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top + 45 : 0}
            >
                <ScrollView contentContainerStyle={[styles.content, { paddingBottom: 24 }]} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                    {/* 1. Hero Comfort & Audio Player */}
                    <View style={[styles.heroCard, { backgroundColor: isDark ? 'rgba(56, 189, 248, 0.10)' : 'rgba(56, 189, 248, 0.06)', borderColor: isDark ? 'rgba(56, 189, 248, 0.28)' : 'rgba(56, 189, 248, 0.22)' }]}>
                        <Text style={[styles.heroTitle, { color: theme.text }]}>{t('emotionalSafety')}</Text>
                        <Text style={[styles.heroDesc, { color: theme.textSecondary }]}>{t('safeHavenHeroDesc')}</Text>

                        {media.length > 0 && (
                            <TouchableOpacity style={[styles.playerBar, { backgroundColor: isDark ? theme.surface : '#FFFFFF', borderColor: theme.border }]} onPress={togglePlay} activeOpacity={0.85}>
                                <Ionicons name={status.playing ? "pause" : "play"} size={22} color="#38BDF8" />
                                <Text style={[styles.playerText, { color: theme.text }]} numberOfLines={1}>{media[currentIndex].title}</Text>
                                <View style={styles.liveIndicator}>
                                    <View style={[styles.liveDot, status.playing && styles.dotPulsing]} />
                                </View>
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* 2. Emotional Vent Vault */}
                    <View style={[styles.ventCard, { backgroundColor: isDark ? theme.card : '#FFFFFF', borderColor: theme.border }]}>
                        <View style={styles.ventHeader}>
                            <Ionicons name="sparkles-outline" size={18} color="#38BDF8" style={{ marginRight: 6 }} />
                            <Text style={[styles.ventTitle, { color: theme.text }]}>Safe Vent Vault (100% Private)</Text>
                        </View>
                        <Text style={[styles.ventSub, { color: theme.textSecondary }]}>Write whatever is heavy in your chest. When ready, release it into stardust.</Text>

                        <Animated.View style={{ opacity: fadeAnim }}>
                            <TextInput
                                style={[styles.ventInput, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : '#F8FAF9', color: theme.text, borderColor: theme.border }]}
                                placeholder="Express your feelings freely here..."
                                placeholderTextColor={theme.placeholder}
                                value={ventText}
                                onChangeText={setVentText}
                                multiline
                            />
                        </Animated.View>

                        {isVentingReleased ? (
                            <View style={[styles.releasedToast, { backgroundColor: 'rgba(56, 189, 248, 0.15)' }]}>
                                <Ionicons name="cloud-done-outline" size={18} color="#38BDF8" style={{ marginRight: 6 }} />
                                <Text style={[styles.releasedText, { color: isDark ? '#BAE6FD' : '#0284C7' }]}>Your thoughts have been safely released to the stars ✨</Text>
                            </View>
                        ) : (
                            <TouchableOpacity
                                style={[styles.releaseBtn, { backgroundColor: '#38BDF8' }, !ventText.trim() && { opacity: 0.5 }]}
                                onPress={handleReleaseVent}
                                disabled={!ventText.trim()}
                                activeOpacity={0.85}
                            >
                                <Ionicons name="sparkles" size={16} color={isDark ? "#000" : "#FFF"} style={{ marginRight: 6 }} />
                                <Text style={[styles.releaseBtnText, { color: isDark ? '#000' : '#FFF' }]}>Release to the Stars ✨</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* 3. Support Grid */}
                    <View style={styles.supportGrid}>
                        {SUPPORT_CARDS.map((card, idx) => (
                            <TouchableOpacity
                                key={idx}
                                style={[styles.supportCard, { backgroundColor: isDark ? theme.card : '#FFFFFF', borderColor: theme.border }]}
                                onPress={() => router.push(card.route as any)}
                                activeOpacity={0.8}
                            >
                                <View style={[styles.iconCircle, { backgroundColor: `${card.color}18` }]}>
                                    <Ionicons name={card.icon as any} size={22} color={card.color} />
                                </View>
                                <Text style={[styles.cardLabel, { color: theme.text }]}>{card.title}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* 4. Instant Voya AI Counselor Banner */}
                    <TouchableOpacity
                        style={[styles.voyaCard, { backgroundColor: theme.primary }]}
                        onPress={() => router.push('/voya-chat')}
                        activeOpacity={0.88}
                    >
                        <View style={styles.voyaCardInner}>
                            <Ionicons name="sparkles" size={26} color={isDark ? "#000" : "#FFF"} />
                            <View style={styles.voyaTextContainer}>
                                <Text style={[styles.voyaLabel, { color: isDark ? '#000' : '#FFF' }]}>{t('instantAiSupport')}</Text>
                                <Text style={[styles.voyaSub, { color: isDark ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.85)' }]}>{t('voyaRedirect')}</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color={isDark ? "#000" : "#FFF"} />
                        </View>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
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
        backgroundColor: '#38BDF8',
    },
    dotPulsing: {
        opacity: 0.8,
    },
    ventCard: {
        borderRadius: 20,
        padding: 18,
        borderWidth: 1,
        marginBottom: 16,
    },
    ventHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    ventTitle: {
        fontSize: 15,
        fontWeight: 'bold',
    },
    ventSub: {
        fontSize: 12,
        lineHeight: 17,
        marginBottom: 12,
    },
    ventInput: {
        borderRadius: 14,
        padding: 14,
        fontSize: 14,
        minHeight: 90,
        borderWidth: 1,
        textAlignVertical: 'top',
        marginBottom: 12,
    },
    releaseBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 14,
    },
    releaseBtnText: {
        fontSize: 13,
        fontWeight: 'bold',
    },
    releasedToast: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 14,
    },
    releasedText: {
        fontSize: 13,
        fontWeight: 'bold',
    },
    supportGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 16,
    },
    supportCard: {
        width: (width - 48) / 2,
        borderRadius: 18,
        padding: 16,
        borderWidth: 1,
        alignItems: 'center',
    },
    iconCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    cardLabel: {
        fontSize: 13,
        fontWeight: '600',
        textAlign: 'center',
    },
    voyaCard: {
        borderRadius: 20,
        padding: 16,
    },
    voyaCardInner: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    voyaTextContainer: {
        flex: 1,
        marginLeft: 12,
    },
    voyaLabel: {
        fontSize: 15,
        fontWeight: 'bold',
    },
    voyaSub: {
        fontSize: 12,
        marginTop: 2,
    }
});
