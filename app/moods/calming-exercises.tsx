import NightSkyBackground from '@/components/NightSkyBackground';
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
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

export default function CalmingExercisesScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { t } = useLanguage();
    const { theme: themeName, isDark } = useTheme();
    const theme = Colors[themeName];

    // Binaural Player
    const player = useAudioPlayer('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3');
    const status = useAudioPlayerStatus(player);
    const [activeExercise, setActiveExercise] = useState<string | null>(null);

    // 4-7-8 Breathing State
    const [breathPhase, setBreathPhase] = useState(t('getReady'));
    const [breathTimer, setBreathTimer] = useState(0);
    const breathAnim = useRef(new Animated.Value(1)).current;

    // Grounding State
    const [groundingStep, setGroundingStep] = useState(0);
    const GROUNDING_STEPS = [
        { count: 5, label: t('groundingSee'), icon: 'eye' },
        { count: 4, label: t('groundingTouch'), icon: 'hand-right' },
        { count: 3, label: t('groundingHear'), icon: 'volume-high' },
        { count: 2, label: t('groundingSmell'), icon: 'flower' },
        { count: 1, label: t('groundingTaste'), icon: 'water' },
    ];

    // Progressive Relaxation State
    const [relaxationStep, setRelaxationStep] = useState(0);
    const RELAXATION_STEPS = [
        t('relaxStep1'),
        t('relaxStep2'),
        t('relaxStep3'),
        t('relaxStep4'),
        t('relaxStep5'),
        t('relaxStep6'),
        t('relaxStep7'),
        t('relaxStep8'),
        t('relaxStep9'),
        t('relaxStep10'),
    ];

    const startBreathing = () => {
        setBreathPhase(t('inhale'));
        setBreathTimer(4);

        const runCycle = () => {
            // Inhale (4s)
            setBreathPhase(t('inhale'));
            setBreathTimer(4);
            Animated.timing(breathAnim, {
                toValue: 1.5,
                duration: 4000,
                easing: Easing.linear,
                useNativeDriver: true
            }).start(() => {
                // Hold (7s)
                setBreathPhase(t('holdStatic'));
                setBreathTimer(7);
                setTimeout(() => {
                    // Exhale (8s)
                    setBreathPhase(t('exhale'));
                    setBreathTimer(8);
                    Animated.timing(breathAnim, {
                        toValue: 1,
                        duration: 8000,
                        easing: Easing.linear,
                        useNativeDriver: true
                    }).start(() => runCycle());
                }, 7000);
            });
        };

        runCycle();
    };

    useEffect(() => {
        let interval: any;
        if (activeExercise === '1') {
            startBreathing();
            interval = setInterval(() => {
                setBreathTimer(prev => (prev > 0 ? prev - 1 : 0));
            }, 1000);
        } else {
            setBreathPhase(t('getReady'));
            setBreathTimer(0);
        }
        return () => {
            clearInterval(interval);
            breathAnim.stopAnimation();
        };
    }, [activeExercise]);

    const EXERCISES = [
        {
            id: '1',
            title: t('breathing478'),
            desc: t('breathingDesc'),
            icon: 'sync-outline',
            color: '#4CAF50'
        },
        {
            id: '2',
            title: t('grounding54321'),
            desc: t('groundingDesc'),
            icon: 'hand-left-outline',
            color: '#2196F3'
        },
        {
            id: '3',
            title: t('progressiveRelaxation'),
            desc: t('relaxationDesc'),
            icon: 'body-outline',
            color: '#9C27B0'
        },
    ];

    const renderExerciseModal = () => {
        if (!activeExercise) return null;

        return (
            <Modal transparent animationType="fade" visible={!!activeExercise} onRequestClose={() => setActiveExercise(null)}>
                <View style={styles.modalBg}>
                    <NightSkyBackground />
                    <TouchableOpacity
                        style={[styles.closeModal, { top: insets.top + 20 }]}
                        onPress={() => setActiveExercise(null)}
                    >
                        <Ionicons name="close" size={30} color="#FFF" />
                    </TouchableOpacity>

                    {activeExercise === '1' && (
                        <View style={styles.exerciseContent}>
                            <Animated.View style={[styles.breathOrb, { transform: [{ scale: breathAnim }] }]}>
                                <Text style={styles.breathTime}>{breathTimer}</Text>
                            </Animated.View>
                            <Text style={styles.breathLabel}>{breathPhase}</Text>
                            <Text style={styles.breathDesc}>{t('focusOnlyBreath')}</Text>
                        </View>
                    )}

                    {activeExercise === '2' && (
                        <View style={styles.exerciseContent}>
                            <View style={styles.groundingIcon}>
                                <Ionicons name={GROUNDING_STEPS[groundingStep].icon as any} size={60} color="#2196F3" />
                            </View>
                            <Text style={styles.groundingCount}>{GROUNDING_STEPS[groundingStep].count}</Text>
                            <Text style={styles.groundingText}>{t('anchorSenses')} {GROUNDING_STEPS[groundingStep].label}</Text>
                            <TouchableOpacity
                                style={styles.nextButton}
                                onPress={() => {
                                    if (groundingStep < GROUNDING_STEPS.length - 1) setGroundingStep(prev => prev + 1);
                                    else {
                                        setActiveExercise(null);
                                        setGroundingStep(0);
                                    }
                                }}
                            >
                                <Text style={styles.nextButtonText}>
                                    {groundingStep === GROUNDING_STEPS.length - 1 ? t('complete') : t('foundThem')}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {activeExercise === '3' && (
                        <View style={styles.exerciseContent}>
                            <View style={styles.relaxIcon}>
                                <Ionicons name="body" size={60} color="#9C27B0" />
                            </View>
                            <Text style={styles.relaxText}>{RELAXATION_STEPS[relaxationStep]}</Text>
                            <View style={styles.stepIndicator}>
                                {RELAXATION_STEPS.map((_, i) => (
                                    <View key={i} style={[styles.dot, relaxationStep === i && styles.dotActive]} />
                                ))}
                            </View>
                            <TouchableOpacity
                                style={[styles.nextButton, { backgroundColor: '#9C27B0' }]}
                                onPress={() => {
                                    if (relaxationStep < RELAXATION_STEPS.length - 1) setRelaxationStep(prev => prev + 1);
                                    else {
                                        setActiveExercise(null);
                                        setRelaxationStep(0);
                                    }
                                }}
                            >
                                <Text style={styles.nextButtonText}>
                                    {relaxationStep === RELAXATION_STEPS.length - 1 ? t('feelLighter') : t('nextStep')}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </Modal>
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: '#050510' }]}>
            <NightSkyBackground />
            {renderExerciseModal()}

            <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={28} color="#B0A4F1" />
                </TouchableOpacity>
                <Text style={styles.title}>{t('calmingToolsTitle')}</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {/* Binaural Special Card */}
                <TouchableOpacity
                    style={[styles.binauralCard, status.playing && styles.binauralActive]}
                    onPress={() => status.playing ? player.pause() : player.play()}
                >
                    <View style={styles.binauralHeader}>
                        <View style={styles.binauralIcon}>
                            <Ionicons name="headset" size={32} color={status.playing ? '#000' : '#B0A4F1'} />
                        </View>
                        <View style={styles.binauralText}>
                            <Text style={[styles.binauralTitle, status.playing && styles.textDark]}>{t('binauralBeats')}</Text>
                            <Text style={[styles.binauralSub, status.playing && styles.textDarkOp]}>{t('thetaWavesSub')}</Text>
                        </View>
                        <Ionicons
                            name={status.playing ? "pause-circle" : "play-circle"}
                            size={44}
                            color={status.playing ? '#000' : '#B0A4F1'}
                        />
                    </View>
                    {status.playing && (
                        <View style={styles.waveVisual}>
                            <View style={[styles.wave, { height: 10 }]} />
                            <View style={[styles.wave, { height: 20 }]} />
                            <View style={[styles.wave, { height: 15 }]} />
                            <View style={[styles.wave, { height: 25 }]} />
                            <View style={[styles.wave, { height: 10 }]} />
                        </View>
                    )}
                </TouchableOpacity>

                <Text style={styles.sectionTitle}>{t('guidedExercises')}</Text>

                {EXERCISES.map(ex => (
                    <TouchableOpacity
                        key={ex.id}
                        style={styles.exerciseCard}
                        onPress={() => setActiveExercise(ex.id)}
                    >
                        <View style={[styles.exIcon, { backgroundColor: `${ex.color}15` }]}>
                            <Ionicons name={ex.icon as any} size={24} color={ex.color} />
                        </View>
                        <View style={styles.exText}>
                            <Text style={styles.exTitle}>{ex.title}</Text>
                            <Text style={styles.exDesc}>{ex.desc}</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.2)" />
                    </TouchableOpacity>
                ))}
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
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingBottom: 20,
        zIndex: 10,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.05)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#FFF',
    },
    content: {
        padding: 20,
    },
    binauralCard: {
        backgroundColor: 'rgba(176, 164, 241, 0.1)',
        borderRadius: 32,
        padding: 24,
        borderWidth: 1,
        borderColor: 'rgba(176, 164, 241, 0.2)',
        marginBottom: 30,
    },
    binauralActive: {
        backgroundColor: '#B0A4F1',
    },
    binauralHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    binauralIcon: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(255,255,255,0.05)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    binauralText: {
        flex: 1,
    },
    binauralTitle: {
        color: '#FFF',
        fontSize: 20,
        fontWeight: 'bold',
    },
    binauralSub: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 14,
        marginTop: 2,
    },
    textDark: {
        color: '#000',
    },
    textDarkOp: {
        color: 'rgba(0,0,0,0.6)',
    },
    waveVisual: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        marginTop: 20,
    },
    wave: {
        width: 4,
        backgroundColor: '#000',
        borderRadius: 2,
    },
    sectionTitle: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 14,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 16,
        marginLeft: 4,
    },
    exerciseCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 24,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    exIcon: {
        width: 50,
        height: 50,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    exText: {
        flex: 1,
    },
    exTitle: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    exDesc: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 12,
        marginTop: 2,
    },
    modalBg: {
        flex: 1,
        backgroundColor: '#050510',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeModal: {
        position: 'absolute',
        right: 20,
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100,
    },
    exerciseContent: {
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    breathOrb: {
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: '#4CAF50',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#4CAF50',
        shadowRadius: 30,
        shadowOpacity: 0.5,
        elevation: 10,
        marginBottom: 40,
    },
    breathTime: {
        color: '#FFF',
        fontSize: 48,
        fontWeight: 'bold',
    },
    breathLabel: {
        color: '#FFF',
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    breathDesc: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 16,
        textAlign: 'center',
    },
    groundingIcon: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'rgba(33, 150, 243, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
    },
    groundingCount: {
        color: '#2196F3',
        fontSize: 80,
        fontWeight: 'bold',
    },
    groundingText: {
        color: '#FFF',
        fontSize: 24,
        fontWeight: '500',
        textAlign: 'center',
        marginBottom: 40,
    },
    nextButton: {
        backgroundColor: '#2196F3',
        paddingVertical: 18,
        paddingHorizontal: 40,
        borderRadius: 20,
        minWidth: 200,
        alignItems: 'center',
    },
    nextButtonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    relaxIcon: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'rgba(156, 39, 176, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
    },
    relaxText: {
        color: '#FFF',
        fontSize: 22,
        textAlign: 'center',
        lineHeight: 32,
        marginBottom: 40,
        minHeight: 100,
    },
    stepIndicator: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 40,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    dotActive: {
        backgroundColor: '#9C27B0',
        width: 24,
    }
});
