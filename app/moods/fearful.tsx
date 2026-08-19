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
    Vibration,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const GROUNDING_STEPS = [
    { id: 5, label: '5 Things You Can SEE', hint: 'Look around. Identify 5 objects right now.', icon: 'eye-outline' },
    { id: 4, label: '4 Things You Can TOUCH', hint: 'Feel your feet on the ground or fabric on your skin.', icon: 'hand-left-outline' },
    { id: 3, label: '3 Things You Can HEAR', hint: 'Listen closely. Notice 3 subtle ambient sounds.', icon: 'volume-high-outline' },
    { id: 2, label: '2 Things You Can SMELL', hint: 'Inhale through your nose. Notice scents in the room.', icon: 'flower-outline' },
    { id: 1, label: '1 Thing You Can TASTE', hint: 'Notice the taste in your mouth or sip cool water.', icon: 'restaurant-outline' },
];

const FALLBACK_FEARFUL_AUDIO = [
    {
        id: '1',
        title: '528Hz Deep Panic Anchor',
        duration: '10 mins',
        description: 'Stabilizing grounding pulse designed to stop anxiety spikes instantly.',
        url: 'https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f792cb.mp3?filename=meditation-soundscape-124707.mp3'
    },
    {
        id: '2',
        title: 'Calm Ocean Shoreline',
        duration: '15 mins',
        description: 'Steady rhythm of gentle ocean tides to bring down hyperventilation.',
        url: 'https://cdn.pixabay.com/download/audio/2022/05/16/audio_c9769854ef.mp3?filename=ocean-waves-ambient-110825.mp3'
    }
];

export default function FearfulScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { theme: themeName, isDark } = useTheme();
    const theme = Colors[themeName];
    const { t } = useLanguage();

    const [currentStep, setCurrentStep] = useState(0);

    const nextGroundingStep = () => {
        Vibration.vibrate(25);
        if (currentStep < GROUNDING_STEPS.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            setCurrentStep(0);
        }
    };

    // Box Breathing (4-4-4-4)
    const boxBreathFill = useRef(new Animated.Value(0)).current;
    const [boxPhase, setBoxPhase] = useState<'Inhale' | 'Hold In' | 'Exhale' | 'Hold Out'>('Inhale');

    useEffect(() => {
        let isMounted = true;
        const runBoxCycle = () => {
            if (!isMounted) return;
            setBoxPhase('Inhale');
            Animated.timing(boxBreathFill, {
                toValue: 1,
                duration: 4000,
                easing: Easing.linear,
                useNativeDriver: false,
            }).start(() => {
                if (!isMounted) return;
                setBoxPhase('Hold In');
                setTimeout(() => {
                    if (!isMounted) return;
                    setBoxPhase('Exhale');
                    Animated.timing(boxBreathFill, {
                        toValue: 0,
                        duration: 4000,
                        easing: Easing.linear,
                        useNativeDriver: false,
                    }).start(() => {
                        if (!isMounted) return;
                        setBoxPhase('Hold Out');
                        setTimeout(() => {
                            if (isMounted) runBoxCycle();
                        }, 4000);
                    });
                }, 4000);
            });
        };

        runBoxCycle();
        return () => {
            isMounted = false;
        };
    }, []);

    // Audio State
    const [groundingMedia, setGroundingMedia] = useState<any[]>(FALLBACK_FEARFUL_AUDIO);
    const [currentIndex, setCurrentIndex] = useState(0);

    const player = useAudioPlayer(groundingMedia[currentIndex]?.url || FALLBACK_FEARFUL_AUDIO[0].url);
    const status = useAudioPlayerStatus(player);

    useEffect(() => {
        fetchGroundingMedia();
    }, []);

    useEffect(() => {
        const url = groundingMedia[currentIndex]?.url;
        if (url) {
            player.replace({ uri: url });
        }
    }, [currentIndex, groundingMedia]);

    const fetchGroundingMedia = async () => {
        try {
            const response = await fetch(`${BACKEND_URL}/media?category=fearful`);
            const data = await response.json();
            if (Array.isArray(data) && data.length > 0) {
                setGroundingMedia(data);
            }
        } catch {
            setGroundingMedia(FALLBACK_FEARFUL_AUDIO);
        }
    };

    const togglePlay = () => {
        if (status.playing) player.pause();
        else player.play();
    };

    const currentMedia = groundingMedia[currentIndex] || FALLBACK_FEARFUL_AUDIO[0];

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <NightSkyBackground />
            <View style={{ height: insets.top, backgroundColor: theme.background, width: '100%', position: 'absolute', top: 0, zIndex: 10 }} />

            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top + 12, borderBottomColor: theme.border, backgroundColor: isDark ? 'rgba(7, 6, 20, 0.75)' : 'rgba(255, 255, 255, 0.85)' }]}>
                <TouchableOpacity onPress={() => router.back()} style={[styles.backButton, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)', borderColor: theme.border }]}>
                    <Ionicons name="chevron-back" size={24} color="#FF9800" />
                </TouchableOpacity>
                <View style={styles.headerTitleGroup}>
                    <Ionicons name="shield-checkmark" size={18} color="#FF9800" style={{ marginRight: 6 }} />
                    <Text style={[styles.title, { color: theme.text }]}>Grounding Sanctuary</Text>
                </View>
                <TouchableOpacity
                    style={[styles.sosBtn, { backgroundColor: 'rgba(255, 152, 0, 0.15)', borderColor: 'rgba(255, 152, 0, 0.35)' }]}
                    onPress={() => router.push('/(tabs)/emergency')}
                >
                    <Ionicons name="alert-circle" size={16} color="#FF9800" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={[styles.content, { paddingBottom: 24 }]} showsVerticalScrollIndicator={false}>
                {/* 1. 5-4-3-2-1 Sensory Grounding Guide */}
                <View style={[styles.groundingCard, { backgroundColor: isDark ? 'rgba(255, 152, 0, 0.08)' : 'rgba(255, 152, 0, 0.06)', borderColor: isDark ? 'rgba(255, 152, 0, 0.28)' : 'rgba(255, 152, 0, 0.20)' }]}>
                    <Text style={[styles.groundingSubtitle, { color: '#FF9800' }]}>SENSORY ANCHOR TECHNIQUE</Text>
                    <Text style={[styles.groundingTitle, { color: theme.text }]}>5-4-3-2-1 Stabilizer</Text>

                    <View style={styles.stepIndicator}>
                        {GROUNDING_STEPS.map((_, i) => (
                            <View
                                key={i}
                                style={[
                                    styles.dot,
                                    { backgroundColor: isDark ? 'rgba(255,255,255,0.12)' : '#E5E7EB' },
                                    i === currentStep && { backgroundColor: '#FF9800', width: 22 },
                                    i < currentStep && { backgroundColor: '#FF9800' }
                                ]}
                            />
                        ))}
                    </View>

                    <View style={styles.activeStepContainer}>
                        <View style={[styles.stepCircle, { backgroundColor: isDark ? 'rgba(255, 152, 0, 0.15)' : 'rgba(255, 152, 0, 0.10)', borderColor: 'rgba(255, 152, 0, 0.3)' }]}>
                            <Ionicons name={GROUNDING_STEPS[currentStep].icon as any} size={44} color="#FF9800" />
                            <Text style={styles.stepNumber}>{GROUNDING_STEPS[currentStep].id}</Text>
                        </View>
                        <Text style={[styles.stepLabel, { color: theme.text }]}>{GROUNDING_STEPS[currentStep].label}</Text>
                        <Text style={[styles.stepHint, { color: theme.textSecondary }]}>{GROUNDING_STEPS[currentStep].hint}</Text>
                    </View>

                    <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#FF9800' }]} onPress={nextGroundingStep} activeOpacity={0.85}>
                        <Text style={[styles.actionButtonText, { color: isDark ? '#000' : '#FFF' }]}>
                            {currentStep === GROUNDING_STEPS.length - 1 ? "Start Over ✨" : "Next Sense →"}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* 2. Box Breathing Anchor */}
                <View style={[styles.boxCard, { backgroundColor: isDark ? theme.card : '#FFFFFF', borderColor: theme.border }]}>
                    <Text style={[styles.cardTitle, { color: theme.text }]}>Box Breathing Anchor (4-4-4-4)</Text>
                    <Text style={[styles.cardDesc, { color: theme.textSecondary }]}>Equal duration inhalation, hold, exhalation, and hold. Rapidly stops anxiety spikes.</Text>

                    <View style={styles.barContainer}>
                        <View style={[styles.barBg, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : '#F3F4F6' }]}>
                            <Animated.View
                                style={[
                                    styles.barFill,
                                    {
                                        backgroundColor: '#FF9800',
                                        width: boxBreathFill.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: ['0%', '100%']
                                        })
                                    }
                                ]}
                            />
                        </View>
                    </View>
                    <Text style={[styles.phaseText, { color: '#FF9800' }]}>{boxPhase.toUpperCase()}</Text>
                </View>

                {/* 3. Audio Player */}
                {currentMedia && (
                    <View style={[styles.audioCard, { backgroundColor: isDark ? theme.card : '#FFFFFF', borderColor: theme.border }]}>
                        <View style={styles.audioInfo}>
                            <Ionicons name="headset" size={26} color="#FF9800" />
                            <View style={{ marginLeft: 12, flex: 1 }}>
                                <Text style={[styles.audioTitle, { color: theme.text }]}>{currentMedia.title}</Text>
                                <Text style={[styles.audioDesc, { color: theme.textSecondary }]}>{currentMedia.description}</Text>
                            </View>
                        </View>
                        <TouchableOpacity onPress={togglePlay} style={[styles.playBtn, { backgroundColor: '#FF9800' }]} activeOpacity={0.85}>
                            <Ionicons name={status.playing ? "pause" : "play"} size={22} color={isDark ? "#000" : "#FFF"} />
                        </TouchableOpacity>
                    </View>
                )}
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
    sosBtn: {
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
    groundingCard: {
        borderRadius: 24,
        padding: 20,
        alignItems: 'center',
        borderWidth: 1,
        marginBottom: 16,
    },
    groundingSubtitle: {
        fontSize: 11,
        fontWeight: 'bold',
        letterSpacing: 1.2,
        marginBottom: 4,
    },
    groundingTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    stepIndicator: {
        flexDirection: 'row',
        gap: 6,
        marginBottom: 16,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    activeStepContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    stepCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 1.5,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        marginBottom: 12,
    },
    stepNumber: {
        position: 'absolute',
        top: 6,
        right: 12,
        fontSize: 14,
        fontWeight: 'bold',
        color: '#FF9800',
    },
    stepLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    stepHint: {
        fontSize: 12,
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    actionButton: {
        width: '100%',
        paddingVertical: 14,
        borderRadius: 16,
        alignItems: 'center',
    },
    actionButtonText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    boxCard: {
        borderRadius: 20,
        padding: 18,
        borderWidth: 1,
        marginBottom: 16,
    },
    cardTitle: {
        fontSize: 15,
        fontWeight: 'bold',
    },
    cardDesc: {
        fontSize: 12,
        marginTop: 4,
        marginBottom: 14,
    },
    barContainer: {
        width: '100%',
        marginBottom: 8,
    },
    barBg: {
        height: 14,
        borderRadius: 7,
        overflow: 'hidden',
    },
    barFill: {
        height: '100%',
        borderRadius: 7,
    },
    phaseText: {
        fontSize: 12,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 4,
    },
    audioCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 18,
        padding: 16,
        borderWidth: 1,
    },
    audioInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginRight: 10,
    },
    audioTitle: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    audioDesc: {
        fontSize: 11,
        marginTop: 2,
    },
    playBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    }
});
