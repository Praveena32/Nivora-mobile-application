import NightSkyBackground from '@/components/NightSkyBackground';
import Colors from '@/constants/Colors';
import { useTheme } from '@/constants/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    Easing,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const SOUND_TRACKS = [
    {
        id: 'theta',
        label: 'Theta Wave 432Hz',
        icon: 'pulse-outline' as const,
        uri: 'https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f792cb.mp3?filename=meditation-soundscape-124707.mp3'
    },
    {
        id: 'rain',
        label: 'Sanctuary Rain',
        icon: 'rainy-outline' as const,
        uri: 'https://cdn.pixabay.com/download/audio/2021/09/06/audio_823126f582.mp3?filename=rain-and-thunder-nature-sounds-7803.mp3'
    },
    {
        id: 'om',
        label: 'Cosmic Drone',
        icon: 'planet-outline' as const,
        uri: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=forest-with-small-river-birds-and-nature-field-recording-6735.mp3'
    },
];

export default function GroupMeditationScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { theme: themeName, isDark } = useTheme();
    const theme = Colors[themeName];

    const [userCount, setUserCount] = useState(128);
    const breatheAnim = useRef(new Animated.Value(0)).current;
    const [phase, setPhase] = useState('Inhale');
    const animationRef = useRef<Animated.CompositeAnimation | null>(null);

    // Expo Audio player
    const [selectedTrackIdx, setSelectedTrackIdx] = useState(0);

    const player = useAudioPlayer(SOUND_TRACKS[selectedTrackIdx]?.uri);
    const status = useAudioPlayerStatus(player);

    useEffect(() => {
        const uri = SOUND_TRACKS[selectedTrackIdx]?.uri;
        if (uri) {
            try {
                player.replace({ uri });
            } catch (e) {
                console.log('Audio load error:', e);
            }
        }
    }, [selectedTrackIdx]);

    useEffect(() => {
        const interval = setInterval(() => {
            setUserCount(prev => prev + (Math.random() > 0.5 ? 1 : -1));
        }, 5000);

        const runAnimation = () => {
            animationRef.current = Animated.sequence([
                // Inhale 4s
                Animated.timing(breatheAnim, {
                    toValue: 1,
                    duration: 4000,
                    easing: Easing.inOut(Easing.sin),
                    useNativeDriver: true,
                }),
                // Hold 4s
                Animated.delay(4000),
                // Exhale 6s
                Animated.timing(breatheAnim, {
                    toValue: 0,
                    duration: 6000,
                    easing: Easing.inOut(Easing.sin),
                    useNativeDriver: true,
                }),
                // Rest 2s
                Animated.delay(2000),
            ]);

            animationRef.current.start(({ finished }) => {
                if (finished) runAnimation();
            });
        };

        runAnimation();

        let lastVal = 0;
        const phaseListener = breatheAnim.addListener(({ value }: { value: number }) => {
            if (value > lastVal) {
                if (value > 0.96) {
                    setPhase('Hold');
                } else {
                    setPhase('Inhale Slowly');
                }
            } else {
                if (value < 0.05) {
                    setPhase('Rest & Center');
                } else {
                    setPhase('Release & Exhale');
                }
            }
            lastVal = value;
        });

        return () => {
            clearInterval(interval);
            breatheAnim.removeListener(phaseListener);
            if (animationRef.current) {
                animationRef.current.stop();
            }
        };
    }, []);

    const toggleAudio = () => {
        try {
            if (status.playing) {
                player.pause();
            } else {
                player.play();
            }
        } catch (e) {
            console.log('Audio toggle error:', e);
        }
    };

    const changeTrack = (idx: number) => {
        setSelectedTrackIdx(idx);
    };

    const scale = breatheAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 1.8],
    });

    const glowOpacity = breatheAnim.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0.35, 0.75, 0.4],
    });

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

                <View style={{ alignItems: 'center' }}>
                    <Text style={[styles.headerTitle, { color: theme.text }]}>Together in Silence</Text>
                    <Text style={[styles.headerSubtitle, { color: isDark ? '#38BDF8' : '#0284C7' }]}>
                        Live Synchronized Breath
                    </Text>
                </View>

                <TouchableOpacity
                    onPress={toggleAudio}
                    style={[
                        styles.soundToggleBtn,
                        {
                            backgroundColor: status.playing
                                ? (isDark ? 'rgba(176, 164, 241, 0.25)' : 'rgba(120, 104, 230, 0.15)')
                                : (isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)'),
                            borderColor: status.playing ? theme.primary : theme.border,
                        }
                    ]}
                    activeOpacity={0.8}
                >
                    <Ionicons
                        name={status.playing ? "volume-high" : "volume-mute"}
                        size={20}
                        color={status.playing ? theme.primary : theme.textSecondary}
                    />
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                {/* Live Presence Badge */}
                <View style={[
                    styles.presenceBox,
                    {
                        backgroundColor: isDark ? 'rgba(56, 189, 248, 0.12)' : 'rgba(14, 165, 233, 0.10)',
                        borderColor: isDark ? 'rgba(56, 189, 248, 0.30)' : 'rgba(14, 165, 233, 0.25)'
                    }
                ]}>
                    <View style={styles.pulseDot} />
                    <Text style={[styles.presenceText, { color: isDark ? '#38BDF8' : '#0284C7' }]}>
                        {userCount} souls breathing synchronously with you
                    </Text>
                </View>

                {/* Breathing Orb Visualization */}
                <View style={styles.orbContainer}>
                    <Animated.View
                        style={[
                            styles.outerGlowRing,
                            {
                                transform: [{ scale }],
                                opacity: glowOpacity,
                                backgroundColor: isDark ? 'rgba(176, 164, 241, 0.35)' : 'rgba(120, 104, 230, 0.25)',
                            }
                        ]}
                    />

                    <View style={[
                        styles.innerCore,
                        {
                            backgroundColor: isDark ? 'rgba(18, 12, 38, 0.90)' : 'rgba(255, 255, 255, 0.95)',
                            borderColor: isDark ? '#B0A4F1' : '#7868E6',
                        }
                    ]}>
                        <Ionicons
                            name="flower-outline"
                            size={32}
                            color={isDark ? '#B0A4F1' : '#6E5EC7'}
                            style={{ marginBottom: 6 }}
                        />
                        <Text style={[styles.phaseTitle, { color: theme.text }]}>{phase}</Text>
                        <Text style={[styles.cadenceHint, { color: theme.textSecondary }]}>
                            4s Inhale • 4s Hold • 6s Exhale • 2s Rest
                        </Text>
                    </View>
                </View>

                {/* Soundscapes Audio Selector */}
                <View style={styles.soundscapesContainer}>
                    <Text style={[styles.soundscapesHeader, { color: theme.textSecondary }]}>
                        AMBIENT SOUNDSCAPES
                    </Text>
                    <View style={styles.soundChipsRow}>
                        {SOUND_TRACKS.map((track, idx) => {
                            const isSelected = selectedTrackIdx === idx;
                            return (
                                <TouchableOpacity
                                    key={track.id}
                                    style={[
                                        styles.soundChip,
                                        {
                                            backgroundColor: isSelected
                                                ? (isDark ? 'rgba(176, 164, 241, 0.20)' : 'rgba(120, 104, 230, 0.12)')
                                                : (isDark ? 'rgba(255, 255, 255, 0.05)' : '#F3F4F6'),
                                            borderColor: isSelected ? theme.primary : theme.border,
                                        }
                                    ]}
                                    onPress={() => changeTrack(idx)}
                                    activeOpacity={0.8}
                                >
                                    <Ionicons
                                        name={track.icon}
                                        size={16}
                                        color={isSelected ? theme.primary : theme.textSecondary}
                                        style={{ marginRight: 6 }}
                                    />
                                    <Text style={[
                                        styles.soundChipText,
                                        {
                                            color: isSelected ? theme.primary : theme.text,
                                            fontWeight: isSelected ? 'bold' : 'normal'
                                        }
                                    ]}>
                                        {track.label}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>

                {/* Bottom Encouragement */}
                <View style={[
                    styles.encouragementCard,
                    {
                        backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.03)',
                        borderColor: theme.border,
                    }
                ]}>
                    <Ionicons name="sparkles-outline" size={16} color={theme.primary} style={{ marginRight: 8 }} />
                    <Text style={[styles.encouragementText, { color: theme.textSecondary }]}>
                        You are part of a global moment of quiet healing.
                    </Text>
                </View>
            </View>
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
        zIndex: 10,
    },
    backButton: {
        width: 38,
        height: 38,
        borderRadius: 19,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
    },
    headerTitle: {
        fontSize: 17,
        fontWeight: 'bold',
    },
    headerSubtitle: {
        fontSize: 11,
        fontWeight: '600',
        marginTop: 1,
    },
    soundToggleBtn: {
        width: 38,
        height: 38,
        borderRadius: 19,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
        justifyContent: 'space-between',
        paddingBottom: 30,
    },
    presenceBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 20,
        borderWidth: 1,
        marginTop: 10,
    },
    pulseDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#38BDF8',
        marginRight: 8,
    },
    presenceText: {
        fontSize: 12,
        fontWeight: '600',
    },
    orbContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 240,
    },
    outerGlowRing: {
        position: 'absolute',
        width: 140,
        height: 140,
        borderRadius: 70,
    },
    innerCore: {
        width: 170,
        height: 170,
        borderRadius: 85,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 16,
        shadowColor: '#7868E6',
        shadowOpacity: 0.25,
        shadowRadius: 16,
        elevation: 8,
    },
    phaseTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 4,
    },
    cadenceHint: {
        fontSize: 10,
        textAlign: 'center',
        fontWeight: '500',
    },
    soundscapesContainer: {
        width: '100%',
    },
    soundscapesHeader: {
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: 1.2,
        marginBottom: 10,
        textAlign: 'center',
    },
    soundChipsRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
        flexWrap: 'wrap',
    },
    soundChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 16,
        borderWidth: 1,
    },
    soundChipText: {
        fontSize: 12,
    },
    encouragementCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 16,
        borderWidth: 1,
    },
    encouragementText: {
        fontSize: 12,
        fontStyle: 'italic',
    }
});
