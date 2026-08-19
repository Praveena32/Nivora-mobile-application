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
    Animated,
    Dimensions,
    Easing,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const FALLBACK_CALM_AUDIO = [
    {
        id: '1',
        title: '432Hz Cosmic Serenity',
        duration: '10 mins',
        description: 'Healing frequency tuned for deep mental calm & muscle relaxation.',
        url: 'https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f792cb.mp3?filename=meditation-soundscape-124707.mp3'
    },
    {
        id: '2',
        title: 'Sanctuary Forest Stream',
        duration: '15 mins',
        description: 'Gentle water ripples and forest birds to quiet an overactive mind.',
        url: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=forest-with-small-river-birds-and-nature-field-recording-6735.mp3'
    },
    {
        id: '3',
        title: 'Quiet Horizon Rain',
        duration: '12 mins',
        description: 'Soft raindrops on leaves for grounding peace and evening tranquility.',
        url: 'https://cdn.pixabay.com/download/audio/2021/09/06/audio_823126f582.mp3?filename=rain-and-thunder-nature-sounds-7803.mp3'
    }
];

export default function CalmScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { t } = useLanguage();
    const { theme: themeName, isDark } = useTheme();
    const theme = Colors[themeName];

    // 4-7-8 Breathing Cycle State
    const breatheAnim = useRef(new Animated.Value(0)).current;
    const [breathePhase, setBreathePhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');

    useEffect(() => {
        let isMounted = true;

        const cycle = () => {
            if (!isMounted) return;
            setBreathePhase('Inhale');
            Animated.timing(breatheAnim, {
                toValue: 1,
                duration: 4000,
                easing: Easing.inOut(Easing.sin),
                useNativeDriver: true,
            }).start(() => {
                if (!isMounted) return;
                setBreathePhase('Hold');
                setTimeout(() => {
                    if (!isMounted) return;
                    setBreathePhase('Exhale');
                    Animated.timing(breatheAnim, {
                        toValue: 0,
                        duration: 8000,
                        easing: Easing.inOut(Easing.sin),
                        useNativeDriver: true,
                    }).start(() => {
                        if (isMounted) cycle();
                    });
                }, 7000);
            });
        };

        cycle();
        return () => {
            isMounted = false;
        };
    }, []);

    const breatheScale = breatheAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 1.45],
    });

    const breatheOpacity = breatheAnim.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0.35, 0.75, 0.35],
    });

    // Audio Player State
    const [meditations, setMeditations] = useState<any[]>(FALLBACK_CALM_AUDIO);
    const [currentIndex, setCurrentIndex] = useState(0);

    const player = useAudioPlayer(meditations[currentIndex]?.url || FALLBACK_CALM_AUDIO[0].url);
    const status = useAudioPlayerStatus(player);

    useEffect(() => {
        fetchMeditations();
    }, []);

    useEffect(() => {
        const url = meditations[currentIndex]?.url;
        if (url) {
            player.replace({ uri: url });
        }
    }, [currentIndex, meditations]);

    const fetchMeditations = async () => {
        try {
            const response = await fetch(`${BACKEND_URL}/media?category=calm`);
            const data = await response.json();
            if (Array.isArray(data) && data.length > 0) {
                setMeditations(data);
            }
        } catch {
            setMeditations(FALLBACK_CALM_AUDIO);
        }
    };

    const togglePlay = () => {
        try {
            if (status.playing) {
                player.pause();
            } else {
                player.play();
            }
        } catch (err) {
            console.log('Playback Toggle Error:', err);
        }
    };

    const nextTrack = () => {
        if (meditations.length === 0) return;
        setCurrentIndex((currentIndex + 1) % meditations.length);
    };

    const prevTrack = () => {
        if (meditations.length === 0) return;
        setCurrentIndex((currentIndex - 1 + meditations.length) % meditations.length);
    };

    const currentMed = meditations[currentIndex] || FALLBACK_CALM_AUDIO[0];

    // Gen AI Script State
    const [genAiScript, setGenAiScript] = useState<any>(null);
    const [isGeneratingGenAi, setIsGeneratingGenAi] = useState(false);

    const generateAiMeditation = async () => {
        setIsGeneratingGenAi(true);
        try {
            const res = await fetch(`${BACKEND_URL}/genai-meditation`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mood: 'calm', userFocus: 'deep peacefulness & tension release' })
            });
            if (res.ok) {
                const data = await res.json();
                if (data && (data.title || data.steps || data.script)) {
                    setGenAiScript({
                        title: data.title || 'Personalized Calm Sanctuary Session',
                        steps: Array.isArray(data.steps) ? data.steps : (data.script ? [data.script] : [
                            'Close your eyes gently and let your shoulders drop away from your ears.',
                            'Inhale for 4 seconds, filling your lungs with quiet, restorative light.',
                            'Hold for 7 seconds, allowing stillness to settle into every cell.',
                            'Exhale slowly for 8 seconds, letting all tension melt away like sea foam.'
                        ]),
                        affirmation: data.affirmation || 'I am safe, anchored, and entirely at peace in this present moment.'
                    });
                    return;
                }
            }
            throw new Error('Fallback to local script generator');
        } catch {
            const SCRIPT_PRESETS = [
                {
                    title: '🌿 Ocean Breeze & Inner Stillness',
                    steps: [
                        'Find a comfortable seated posture. Soften your jaw and let your gaze rest naturally.',
                        'Inhale quiet ocean air for 4 seconds, feeling your chest expand with fresh vitality.',
                        'Hold your breath softly for 7 seconds, feeling your heartbeat steady and calm.',
                        'Release the air slowly through your lips for 8 seconds, letting any residual worry drift away.'
                    ],
                    affirmation: 'I release all that I cannot control, and welcome deep inner peace.'
                },
                {
                    title: '🌌 Celestial Stardust Relaxation',
                    steps: [
                        'Imagine a warm, gentle indigo light glowing above your head.',
                        'As you inhale, feel this soothing light travel slowly from your forehead down through your throat and shoulders.',
                        'Pause at your heart center, breathing in unconditional warmth and emotional ease.',
                        'Exhale completely, releasing all physical tightness out into the cosmic quiet.'
                    ],
                    affirmation: 'My body is relaxed, my mind is still, and my heart is light.'
                },
                {
                    title: '🌱 Sanctuary Mountain Grounding',
                    steps: [
                        'Feel the solid ground beneath your feet. You are entirely supported and secure.',
                        'Take a deep 4-second breath into your abdomen, grounding your mind in this exact moment.',
                        'Hold for 7 seconds, allowing your thoughts to settle like fresh autumn leaves.',
                        'Exhale deeply for 8 seconds, leaving only clarity and quiet strength.'
                    ],
                    affirmation: 'I am grounded like a mountain and peaceful like a calm sea.'
                }
            ];
            const randomScript = SCRIPT_PRESETS[Math.floor(Math.random() * SCRIPT_PRESETS.length)];
            setGenAiScript(randomScript);
        } finally {
            setIsGeneratingGenAi(false);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <NightSkyBackground />
            <View style={{ height: insets.top, backgroundColor: theme.background, width: '100%', position: 'absolute', top: 0, zIndex: 10 }} />

            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top + 12, borderBottomColor: theme.border, backgroundColor: isDark ? 'rgba(7, 6, 20, 0.75)' : 'rgba(255, 255, 255, 0.85)' }]}>
                <TouchableOpacity onPress={() => router.back()} style={[styles.backButton, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)', borderColor: theme.border }]}>
                    <Ionicons name="chevron-back" size={24} color="#10B981" />
                </TouchableOpacity>

                <View style={styles.headerTitleGroup}>
                    <Ionicons name="leaf" size={18} color="#10B981" style={{ marginRight: 6 }} />
                    <Text style={[styles.title, { color: theme.text }]}>Calm Sanctuary</Text>
                </View>

                <TouchableOpacity
                    style={[styles.historyButton, { backgroundColor: isDark ? 'rgba(16, 185, 129, 0.15)' : 'rgba(16, 185, 129, 0.10)', borderColor: 'rgba(16, 185, 129, 0.3)' }]}
                    onPress={() => router.push('/moods/calming-exercises' as any)}
                >
                    <Ionicons name="flower-outline" size={18} color="#10B981" />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.content, { paddingBottom: 24 }]}>
                {/* 1. Synchronized Breathing Halo */}
                <View style={[styles.breathingCard, { backgroundColor: isDark ? 'rgba(16, 185, 129, 0.08)' : 'rgba(16, 185, 129, 0.06)', borderColor: isDark ? 'rgba(16, 185, 129, 0.25)' : 'rgba(16, 185, 129, 0.20)' }]}>
                    <Text style={[styles.breathingBadge, { color: '#10B981' }]}>4-7-8 MINDFUL BREATHING</Text>

                    <View style={styles.breathingCircleContainer}>
                        <Animated.View
                            style={[
                                styles.breathingHalo,
                                {
                                    transform: [{ scale: breatheScale }],
                                    opacity: breatheOpacity,
                                    backgroundColor: '#10B981',
                                }
                            ]}
                        />
                        <View style={[styles.breathingInnerCircle, { backgroundColor: isDark ? '#0D1B17' : '#FFFFFF', borderColor: '#10B981' }]}>
                            <Ionicons name="leaf-outline" size={28} color="#10B981" style={{ marginBottom: 4 }} />
                            <Text style={[styles.breathePhaseText, { color: theme.text }]}>{breathePhase}</Text>
                        </View>
                    </View>

                    <Text style={[styles.breathingHint, { color: theme.textSecondary }]}>
                        {breathePhase === 'Inhale' ? 'Inhale peace deeply (4s)...' : breathePhase === 'Hold' ? 'Hold softly and rest (7s)...' : 'Exhale all tension completely (8s)...'}
                    </Text>
                </View>

                {/* 2. AI Mindful Script Generator */}
                <TouchableOpacity
                    style={[styles.genAiBtn, { backgroundColor: '#10B981' }]}
                    onPress={generateAiMeditation}
                    disabled={isGeneratingGenAi}
                    activeOpacity={0.85}
                >
                    <Ionicons name="sparkles" size={18} color={isDark ? "#000" : "#FFF"} style={{ marginRight: 8 }} />
                    <Text style={[styles.genAiBtnText, { color: isDark ? '#000' : '#FFF' }]}>
                        {isGeneratingGenAi ? 'AI Crafting Mindful Script...' : '✨ Generate AI Personalized Meditation'}
                    </Text>
                </TouchableOpacity>

                {genAiScript && (
                    <View style={[styles.genAiCard, { backgroundColor: isDark ? 'rgba(16, 185, 129, 0.12)' : '#FFFFFF', borderColor: 'rgba(16, 185, 129, 0.3)' }]}>
                        <View style={styles.genAiHeader}>
                            <Ionicons name="sparkles-outline" size={18} color="#10B981" style={{ marginRight: 6 }} />
                            <Text style={[styles.genAiCardTitle, { color: theme.text }]}>{genAiScript.title}</Text>
                        </View>
                        {(genAiScript.steps || []).map((step: string, idx: number) => (
                            <Text key={idx} style={[styles.genAiStepText, { color: theme.textSecondary }]}>• {step}</Text>
                        ))}
                        {genAiScript.affirmation && (
                            <View style={[styles.affirmationBox, { backgroundColor: isDark ? 'rgba(16, 185, 129, 0.15)' : 'rgba(16, 185, 129, 0.08)' }]}>
                                <Text style={[styles.affirmationText, { color: isDark ? '#A7F3D0' : '#047857' }]}>"{genAiScript.affirmation}"</Text>
                            </View>
                        )}
                    </View>
                )}

                {/* 3. Calm Audio Player */}
                <View style={[styles.playerCard, { backgroundColor: isDark ? theme.card : '#FFFFFF', borderColor: theme.border }]}>
                    <View style={styles.playerCardHeader}>
                        <View style={[styles.iconCircle, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
                            <Ionicons name="headset" size={24} color="#10B981" />
                        </View>
                        <View style={styles.playerMeta}>
                            <Text style={[styles.trackTitle, { color: theme.text }]}>{currentMed.title}</Text>
                            <Text style={[styles.trackSub, { color: theme.textSecondary }]}>{currentMed.description} • {currentMed.duration}</Text>
                        </View>
                    </View>

                    <View style={styles.playerControlsRow}>
                        <TouchableOpacity onPress={prevTrack} style={[styles.ctrlBtn, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : '#F3F4F6' }]}>
                            <Ionicons name="play-skip-back" size={20} color={theme.text} />
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.mainPlayBtn, { backgroundColor: '#10B981' }]} onPress={togglePlay} activeOpacity={0.85}>
                            <Ionicons name={status.playing ? "pause" : "play"} size={26} color={isDark ? "#000" : "#FFF"} />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={nextTrack} style={[styles.ctrlBtn, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : '#F3F4F6' }]}>
                            <Ionicons name="play-skip-forward" size={20} color={theme.text} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* 4. Quick Links Grid */}
                <View style={styles.quickLinksGrid}>
                    <TouchableOpacity
                        style={[styles.linkChip, { backgroundColor: isDark ? theme.surface : '#FFFFFF', borderColor: theme.border }]}
                        onPress={() => router.push('/moods/group-meditation' as any)}
                    >
                        <Ionicons name="people-outline" size={20} color="#10B981" />
                        <Text style={[styles.linkText, { color: theme.text }]}>Group Meditation</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.linkChip, { backgroundColor: isDark ? theme.surface : '#FFFFFF', borderColor: theme.border }]}
                        onPress={() => router.push('/moods/collaborative-art' as any)}
                    >
                        <Ionicons name="color-palette-outline" size={20} color="#B0A4F1" />
                        <Text style={[styles.linkText, { color: theme.text }]}>Celestial Art</Text>
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
    breathingCard: {
        borderRadius: 24,
        padding: 20,
        alignItems: 'center',
        borderWidth: 1,
        marginBottom: 16,
    },
    breathingBadge: {
        fontSize: 11,
        fontWeight: 'bold',
        letterSpacing: 1.2,
        marginBottom: 16,
    },
    breathingCircleContainer: {
        width: 150,
        height: 150,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
    },
    breathingHalo: {
        position: 'absolute',
        width: 130,
        height: 130,
        borderRadius: 65,
    },
    breathingInnerCircle: {
        width: 110,
        height: 110,
        borderRadius: 55,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2,
    },
    breathePhaseText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    breathingHint: {
        fontSize: 13,
        textAlign: 'center',
        marginTop: 14,
    },
    genAiBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 18,
        marginBottom: 16,
    },
    genAiBtnText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    genAiCard: {
        borderRadius: 20,
        padding: 18,
        borderWidth: 1,
        marginBottom: 16,
    },
    genAiHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    genAiCardTitle: {
        fontSize: 15,
        fontWeight: 'bold',
    },
    genAiStepText: {
        fontSize: 13,
        lineHeight: 20,
        marginBottom: 6,
    },
    affirmationBox: {
        marginTop: 10,
        padding: 12,
        borderRadius: 12,
    },
    affirmationText: {
        fontSize: 13,
        fontStyle: 'italic',
        textAlign: 'center',
    },
    playerCard: {
        borderRadius: 20,
        padding: 18,
        borderWidth: 1,
        marginBottom: 16,
    },
    playerCardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    iconCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    playerMeta: {
        flex: 1,
    },
    trackTitle: {
        fontSize: 15,
        fontWeight: 'bold',
    },
    trackSub: {
        fontSize: 12,
        marginTop: 2,
    },
    playerControlsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,
    },
    ctrlBtn: {
        width: 42,
        height: 42,
        borderRadius: 21,
        justifyContent: 'center',
        alignItems: 'center',
    },
    mainPlayBtn: {
        width: 54,
        height: 54,
        borderRadius: 27,
        justifyContent: 'center',
        alignItems: 'center',
    },
    quickLinksGrid: {
        flexDirection: 'row',
        gap: 12,
    },
    linkChip: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 14,
        borderRadius: 16,
        borderWidth: 1,
    },
    linkText: {
        fontSize: 13,
        fontWeight: '600',
    }
});
