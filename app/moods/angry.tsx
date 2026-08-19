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
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    Vibration,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const FALLBACK_ANGRY_AUDIO = [
    {
        id: '1',
        title: 'Deep Thunder Grounding',
        duration: '10 mins',
        description: 'Low-frequency resonant thunder & rain to absorb intense emotional heat.',
        url: 'https://cdn.pixabay.com/download/audio/2021/09/06/audio_823126f582.mp3?filename=rain-and-thunder-nature-sounds-7803.mp3'
    },
    {
        id: '2',
        title: '432Hz Tension Dissolver',
        duration: '12 mins',
        description: 'Steady alpha wave tones designed to lower elevated heart rate and muscle stress.',
        url: 'https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f792cb.mp3?filename=meditation-soundscape-124707.mp3'
    }
];

export default function AngryScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { t } = useLanguage();
    const { theme: themeName, isDark } = useTheme();
    const theme = Colors[themeName];

    // Energy Discharge Orb State
    const [releaseCount, setReleaseCount] = useState(0);
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handleRelease = () => {
        setReleaseCount(prev => prev + 1);
        Vibration.vibrate(30);
        Animated.sequence([
            Animated.timing(scaleAnim, { toValue: 1.25, duration: 90, useNativeDriver: true }),
            Animated.spring(scaleAnim, { toValue: 1, friction: 3, useNativeDriver: true }),
        ]).start();
    };

    // Frustration Burner Tool State
    const [frustrationText, setFrustrationText] = useState('');
    const [isBurned, setIsBurned] = useState(false);
    const burnFadeAnim = useRef(new Animated.Value(1)).current;

    const handleBurnFrustration = () => {
        if (!frustrationText.trim()) return;
        Vibration.vibrate(80);
        Animated.timing(burnFadeAnim, {
            toValue: 0,
            duration: 900,
            useNativeDriver: true,
        }).start(() => {
            setFrustrationText('');
            setIsBurned(true);
            burnFadeAnim.setValue(1);
            setTimeout(() => setIsBurned(false), 4000);
        });
    };

    // Cooling Breath Meter State (4-4-6)
    const breathBarFill = useRef(new Animated.Value(0)).current;
    const [coolingPhase, setCoolingPhase] = useState<'Inhale' | 'Hold' | 'Release'>('Inhale');

    useEffect(() => {
        let isMounted = true;
        const startBreathCycle = () => {
            if (!isMounted) return;
            setCoolingPhase('Inhale');
            Animated.timing(breathBarFill, {
                toValue: 1,
                duration: 4000,
                easing: Easing.linear,
                useNativeDriver: false,
            }).start(() => {
                if (!isMounted) return;
                setCoolingPhase('Hold');
                setTimeout(() => {
                    if (!isMounted) return;
                    setCoolingPhase('Release');
                    Animated.timing(breathBarFill, {
                        toValue: 0,
                        duration: 6000,
                        easing: Easing.linear,
                        useNativeDriver: false,
                    }).start(() => {
                        if (isMounted) startBreathCycle();
                    });
                }, 4000);
            });
        };

        startBreathCycle();
        return () => {
            isMounted = false;
        };
    }, []);

    // Audio Player State
    const [angryMedia, setAngryMedia] = useState<any[]>(FALLBACK_ANGRY_AUDIO);
    const [currentIndex, setCurrentIndex] = useState(0);

    const player = useAudioPlayer(angryMedia[currentIndex]?.url || FALLBACK_ANGRY_AUDIO[0].url);
    const status = useAudioPlayerStatus(player);

    useEffect(() => {
        fetchAngryMedia();
    }, []);

    useEffect(() => {
        const url = angryMedia[currentIndex]?.url;
        if (url) {
            player.replace({ uri: url });
        }
    }, [currentIndex, angryMedia]);

    const fetchAngryMedia = async () => {
        try {
            const response = await fetch(`${BACKEND_URL}/media?category=angry`);
            const data = await response.json();
            if (Array.isArray(data) && data.length > 0) {
                setAngryMedia(data);
            }
        } catch {
            setAngryMedia(FALLBACK_ANGRY_AUDIO);
        }
    };

    const togglePlay = () => {
        if (status.playing) player.pause();
        else player.play();
    };

    const currentMedia = angryMedia[currentIndex] || FALLBACK_ANGRY_AUDIO[0];

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <NightSkyBackground />
            <View style={{ height: insets.top, backgroundColor: theme.background, width: '100%', position: 'absolute', top: 0, zIndex: 10 }} />

            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top + 12, borderBottomColor: theme.border, backgroundColor: isDark ? 'rgba(7, 6, 20, 0.75)' : 'rgba(255, 255, 255, 0.85)' }]}>
                <TouchableOpacity onPress={() => router.back()} style={[styles.backButton, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)', borderColor: theme.border }]}>
                    <Ionicons name="chevron-back" size={24} color="#EF4444" />
                </TouchableOpacity>
                <View style={styles.headerTitleGroup}>
                    <Ionicons name="flame" size={18} color="#EF4444" style={{ marginRight: 6 }} />
                    <Text style={[styles.title, { color: theme.text }]}>Release Inner Heat</Text>
                </View>
                <TouchableOpacity
                    style={[styles.sosBtn, { backgroundColor: 'rgba(239, 68, 68, 0.15)', borderColor: 'rgba(239, 68, 68, 0.35)' }]}
                    onPress={() => router.push('/voya-chat')}
                >
                    <Ionicons name="sparkles" size={16} color="#EF4444" />
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top + 45 : 0}
            >
                <ScrollView contentContainerStyle={[styles.content, { paddingBottom: 24 }]} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                    {/* 1. Energy Discharge Orb */}
                    <View style={[styles.exerciseBox, { backgroundColor: isDark ? 'rgba(239, 68, 68, 0.08)' : 'rgba(239, 68, 68, 0.05)', borderColor: isDark ? 'rgba(239, 68, 68, 0.25)' : 'rgba(239, 68, 68, 0.20)' }]}>
                        <Text style={[styles.exerciseTitle, { color: theme.text }]}>Energy Discharge Orb</Text>
                        <Text style={[styles.exerciseDesc, { color: theme.textSecondary }]}>Tap the pulsating core rapidly to discharge frustration safely.</Text>

                        <TouchableOpacity
                            activeOpacity={0.82}
                            onPress={handleRelease}
                            style={styles.releaseContainer}
                        >
                            <Animated.View style={[styles.releaseOrb, { transform: [{ scale: scaleAnim }], backgroundColor: '#EF4444' }]}>
                                <Text style={styles.orbText}>{releaseCount}</Text>
                            </Animated.View>
                        </TouchableOpacity>
                        <Text style={[styles.releaseHint, { color: theme.textSecondary }]}>Discharged Pulses: {releaseCount}</Text>
                    </View>

                    {/* 2. Frustration Shredder / Burner */}
                    <View style={[styles.burnCard, { backgroundColor: isDark ? theme.card : '#FFFFFF', borderColor: theme.border }]}>
                        <View style={styles.burnHeader}>
                            <Ionicons name="flame-outline" size={18} color="#EF4444" style={{ marginRight: 6 }} />
                            <Text style={[styles.burnTitle, { color: theme.text }]}>Frustration Shredder</Text>
                        </View>
                        <Text style={[styles.burnSub, { color: theme.textSecondary }]}>Write down what angered you today and watch it dissolve safely into smoke.</Text>

                        <Animated.View style={{ opacity: burnFadeAnim }}>
                            <TextInput
                                style={[styles.burnInput, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : '#FFF5F5', color: theme.text, borderColor: theme.border }]}
                                placeholder="What provoked your anger? Put it in words here..."
                                placeholderTextColor={theme.placeholder}
                                value={frustrationText}
                                onChangeText={setFrustrationText}
                                multiline
                            />
                        </Animated.View>

                        {isBurned ? (
                            <View style={[styles.burnedToast, { backgroundColor: 'rgba(239, 68, 68, 0.15)' }]}>
                                <Ionicons name="checkmark-done-circle-outline" size={18} color="#EF4444" style={{ marginRight: 6 }} />
                                <Text style={[styles.burnedText, { color: isDark ? '#FCA5A5' : '#DC2626' }]}>Your anger has been safely burned to ashes 🔥</Text>
                            </View>
                        ) : (
                            <TouchableOpacity
                                style={[styles.burnBtn, { backgroundColor: '#EF4444' }, !frustrationText.trim() && { opacity: 0.5 }]}
                                onPress={handleBurnFrustration}
                                disabled={!frustrationText.trim()}
                                activeOpacity={0.85}
                            >
                                <Ionicons name="flame" size={16} color={isDark ? "#000" : "#FFF"} style={{ marginRight: 6 }} />
                                <Text style={[styles.burnBtnText, { color: isDark ? '#000' : '#FFF' }]}>Burn Frustration 🔥</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* 3. Cooling Breath Bar */}
                    <View style={[styles.breathingCard, { backgroundColor: isDark ? theme.card : '#FFFFFF', borderColor: theme.border }]}>
                        <Text style={[styles.cardTitle, { color: theme.text }]}>Physiological Cooling Breath (4-4-6)</Text>
                        <Text style={[styles.cardDesc, { color: theme.textSecondary }]}>Follow the cooling bar. Slow breath lowers physical pulse instantly.</Text>

                        <View style={styles.breathBarContainer}>
                            <View style={[styles.breathBarBackground, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : '#F3F4F6' }]}>
                                <Animated.View
                                    style={[
                                        styles.breathBarFill,
                                        {
                                            backgroundColor: '#EF4444',
                                            width: breathBarFill.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: ['0%', '100%']
                                            })
                                        }
                                    ]}
                                />
                            </View>
                        </View>
                        <Text style={[styles.phaseIndicator, { color: '#EF4444' }]}>{coolingPhase.toUpperCase()} NOW</Text>
                    </View>

                    {/* 4. De-escalation Audio Player */}
                    {currentMedia && (
                        <View style={[styles.audioCard, { backgroundColor: isDark ? theme.card : '#FFFFFF', borderColor: theme.border }]}>
                            <View style={styles.audioInfo}>
                                <Ionicons name="headset" size={26} color="#EF4444" />
                                <View style={{ marginLeft: 12, flex: 1 }}>
                                    <Text style={[styles.audioTitle, { color: theme.text }]}>{currentMedia.title}</Text>
                                    <Text style={[styles.audioDesc, { color: theme.textSecondary }]}>{currentMedia.description}</Text>
                                </View>
                            </View>
                            <TouchableOpacity onPress={togglePlay} style={[styles.playBtn, { backgroundColor: '#EF4444' }]} activeOpacity={0.85}>
                                <Ionicons name={status.playing ? "pause" : "play"} size={22} color={isDark ? "#000" : "#FFF"} />
                            </TouchableOpacity>
                        </View>
                    )}
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
    exerciseBox: {
        borderRadius: 22,
        padding: 20,
        alignItems: 'center',
        borderWidth: 1,
        marginBottom: 16,
    },
    exerciseTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 6,
    },
    exerciseDesc: {
        fontSize: 13,
        textAlign: 'center',
        marginBottom: 16,
    },
    releaseContainer: {
        marginVertical: 10,
    },
    releaseOrb: {
        width: 110,
        height: 110,
        borderRadius: 55,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#EF4444',
        shadowOpacity: 0.6,
        shadowRadius: 15,
        elevation: 8,
    },
    orbText: {
        color: '#FFFFFF',
        fontSize: 32,
        fontWeight: 'bold',
    },
    releaseHint: {
        fontSize: 12,
        fontWeight: '600',
        marginTop: 14,
    },
    burnCard: {
        borderRadius: 20,
        padding: 18,
        borderWidth: 1,
        marginBottom: 16,
    },
    burnHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    burnTitle: {
        fontSize: 15,
        fontWeight: 'bold',
    },
    burnSub: {
        fontSize: 12,
        marginBottom: 12,
    },
    burnInput: {
        borderRadius: 14,
        padding: 14,
        fontSize: 14,
        minHeight: 90,
        borderWidth: 1,
        textAlignVertical: 'top',
        marginBottom: 12,
    },
    burnBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 14,
    },
    burnBtnText: {
        fontSize: 13,
        fontWeight: 'bold',
    },
    burnedToast: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 14,
    },
    burnedText: {
        fontSize: 13,
        fontWeight: 'bold',
    },
    breathingCard: {
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
    breathBarContainer: {
        width: '100%',
        marginBottom: 10,
    },
    breathBarBackground: {
        height: 14,
        borderRadius: 7,
        overflow: 'hidden',
    },
    breathBarFill: {
        height: '100%',
        borderRadius: 7,
    },
    phaseIndicator: {
        fontSize: 12,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 6,
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
