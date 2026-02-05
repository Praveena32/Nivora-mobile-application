import NightSkyBackground from '@/components/NightSkyBackground';
import { BACKEND_URL } from '@/constants/Backend';
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

export default function CalmScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { theme: themeName } = useTheme();
    const theme = Colors[themeName];

    const breatheAnim = useRef(new Animated.Value(0)).current;
    const [isInhaling, setIsInhaling] = useState(true);

    useEffect(() => {
        const listener = breatheAnim.addListener(({ value }: { value: number }) => {
            if (value > 0.5 && isInhaling) {
                setIsInhaling(false);
            } else if (value < 0.5 && !isInhaling) {
                setIsInhaling(true);
            }
        });

        Animated.loop(
            Animated.sequence([
                Animated.timing(breatheAnim, {
                    toValue: 1,
                    duration: 4000,
                    easing: Easing.inOut(Easing.sin),
                    useNativeDriver: true,
                }),
                Animated.timing(breatheAnim, {
                    toValue: 0,
                    duration: 4000,
                    easing: Easing.inOut(Easing.sin),
                    useNativeDriver: true,
                }),
            ])
        ).start();

        return () => breatheAnim.removeListener(listener);
    }, [isInhaling]);

    const breatheScale = breatheAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 1.4],
    });

    const breatheOpacity = breatheAnim.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0.3, 0.6, 0.3],
    });

    const [meditations, setMeditations] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);

    const player = useAudioPlayer(meditations[currentIndex]?.url);
    const status = useAudioPlayerStatus(player);

    useEffect(() => {
        fetchMeditations();
    }, []);

    useEffect(() => {
        const url = meditations[currentIndex]?.url;
        if (url) {
            console.log('Loading Audio:', url);
            player.replace({ uri: url });
        }
    }, [currentIndex, meditations]);

    const fetchMeditations = async () => {
        try {
            const response = await fetch(`${BACKEND_URL}/media?category=calm`);
            const data = await response.json();
            setMeditations(data);
        } catch (error) {
            console.error('Fetch Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const togglePlay = () => {
        try {
            if (status.playing) {
                player.pause();
                console.log('Paused');
            } else {
                player.play();
                console.log('Playing...');
            }
        } catch (err) {
            console.error('Playback Error:', err);
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

    const currentMed = meditations[currentIndex];

    return (
        <View style={[styles.container, { backgroundColor: '#050510' }]}>
            <NightSkyBackground />

            <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={28} color="#B0A4F1" />
                </TouchableOpacity>
                <Text style={styles.title}>Calm Space</Text>
                <View style={{ width: 40 }} />
            </View>

            <View style={styles.content}>
                <View style={styles.breathingContainer}>
                    <Animated.View
                        style={[
                            styles.breathingCircle,
                            {
                                transform: [{ scale: breatheScale }],
                                opacity: breatheOpacity,
                                backgroundColor: '#4CAF50'
                            }
                        ]}
                    />
                    <View style={[styles.breathingCircleInner, { borderColor: '#4CAF50' }]}>
                        <Text style={styles.breatheText}>
                            {isInhaling ? 'Breathe In' : 'Breathe Out'}
                        </Text>
                    </View>
                </View>

                {currentMed ? (
                    <View style={styles.meditationCard}>
                        <Ionicons name="headset" size={32} color="#4CAF50" />
                        <Text style={styles.cardTitle}>{currentMed.title}</Text>
                        <Text style={styles.cardDesc}>{currentMed.description} ({currentMed.duration})</Text>

                        <View style={styles.playerControls}>
                            <TouchableOpacity onPress={prevTrack}>
                                <Ionicons name="play-skip-back" size={32} color="#FFF" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.playButton} onPress={togglePlay}>
                                <Ionicons name={status.playing ? "pause" : "play"} size={32} color="#000" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={nextTrack}>
                                <Ionicons name="play-skip-forward" size={32} color="#FFF" />
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : (
                    <View style={styles.meditationCard}>
                        <Text style={[styles.cardDesc, { textAlign: 'center' }]}>
                            {isLoading ? 'Finding calm frequencies...' : 'No meditations available right now.'}
                        </Text>
                    </View>
                )}
            </View>
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
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFF',
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 30,
    },
    breathingContainer: {
        width: 200,
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 60,
    },
    breathingCircle: {
        width: 150,
        height: 150,
        borderRadius: 75,
        position: 'absolute',
    },
    breathingCircleInner: {
        width: 160,
        height: 160,
        borderRadius: 80,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    breatheText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '500',
    },
    meditationCard: {
        width: '100%',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 24,
        padding: 24,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(76, 175, 80, 0.2)',
    },
    cardTitle: {
        color: '#FFF',
        fontSize: 22,
        fontWeight: 'bold',
        marginTop: 15,
    },
    cardDesc: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 14,
        marginTop: 5,
        marginBottom: 25,
    },
    playerControls: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 30,
    },
    playButton: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
    }
});
