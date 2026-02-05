import NightSkyBackground from '@/components/NightSkyBackground';
import { BACKEND_URL } from '@/constants/Backend';
import { Ionicons } from '@expo/vector-icons';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function AngryScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const [releaseCount, setReleaseCount] = useState(0);
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handleRelease = () => {
        setReleaseCount(prev => prev + 1);
        Animated.sequence([
            Animated.timing(scaleAnim, { toValue: 1.2, duration: 100, useNativeDriver: true }),
            Animated.spring(scaleAnim, { toValue: 1, friction: 3, useNativeDriver: true }),
        ]).start();
    };

    const [angryMedia, setAngryMedia] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);

    const player = useAudioPlayer(angryMedia[currentIndex]?.url);
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
            setAngryMedia(data);
        } catch (error) {
            console.error('Fetch Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const togglePlay = () => {
        if (status.playing) {
            player.pause();
        } else {
            player.play();
        }
    };

    const nextTrack = () => {
        if (angryMedia.length === 0) return;
        setCurrentIndex((currentIndex + 1) % angryMedia.length);
    };

    const prevTrack = () => {
        if (angryMedia.length === 0) return;
        setCurrentIndex((currentIndex - 1 + angryMedia.length) % angryMedia.length);
    };

    const currentMedia = angryMedia[currentIndex];

    return (
        <View style={[styles.container, { backgroundColor: '#050510' }]}>
            <NightSkyBackground />

            <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={28} color="#B0A4F1" />
                </TouchableOpacity>
                <Text style={styles.title}>Release Inner Heat</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.exerciseBox}>
                    <Text style={styles.exerciseTitle}>Aggressive Release</Text>
                    <Text style={styles.exerciseDesc}>Tap the orb rapidly to release bottled-up energy.</Text>

                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={handleRelease}
                        style={styles.releaseContainer}
                    >
                        <Animated.View style={[styles.releaseOrb, { transform: [{ scale: scaleAnim }] }]}>
                            <Text style={styles.orbText}>{releaseCount}</Text>
                        </Animated.View>
                    </TouchableOpacity>
                    <Text style={styles.releaseHint}>Let it all out.</Text>
                </View>

                {currentMedia && (
                    <View style={styles.audioCard}>
                        <View style={styles.audioInfo}>
                            <Ionicons name="flame" size={32} color="#F44336" />
                            <View style={{ marginLeft: 15, flex: 1 }}>
                                <Text style={styles.audioTitle}>{currentMedia.title}</Text>
                                <Text style={styles.audioDesc}>{currentMedia.description} ({currentMedia.duration})</Text>
                            </View>
                        </View>
                        <View style={styles.miniControls}>
                            <TouchableOpacity onPress={prevTrack}>
                                <Ionicons name="play-skip-back" size={24} color="#FFF" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={togglePlay} style={styles.miniPlayButton}>
                                <Ionicons name={status.playing ? "pause" : "play"} size={24} color="#000" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={nextTrack}>
                                <Ionicons name="play-skip-forward" size={24} color="#FFF" />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                <View style={styles.breathingCard}>
                    <Text style={styles.cardTitle}>Cooling Breath</Text>
                    <Text style={styles.cardDesc}>Watch the bar. Sharp inhale, long cooling exhale.</Text>

                    <View style={styles.breathBarContainer}>
                        <View style={styles.breathBarBackground}>
                            <Animated.View style={styles.breathBarFill} />
                        </View>
                        <View style={styles.breathLabels}>
                            <Text style={styles.breathLabel}>Inhale (3s)</Text>
                            <Text style={styles.breathLabel}>Exhale (6s)</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.voyaBox}>
                    <Text style={styles.voyaText}>Voya is here if you want to scream (digitally).</Text>
                    <TouchableOpacity style={styles.chatButton} onPress={() => router.push('/voya-chat')}>
                        <Text style={styles.chatButtonText}>Vent to Voya</Text>
                    </TouchableOpacity>
                </View>
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
        padding: 24,
        alignItems: 'center',
    },
    exerciseBox: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 40,
    },
    exerciseTitle: {
        color: '#F44336',
        fontSize: 14,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 8,
    },
    exerciseDesc: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 30,
    },
    releaseContainer: {
        width: 200,
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
    },
    releaseOrb: {
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: 'rgba(244, 67, 54, 0.2)',
        borderWidth: 2,
        borderColor: '#F44336',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#F44336',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 10,
    },
    orbText: {
        color: '#FFF',
        fontSize: 40,
        fontWeight: 'bold',
    },
    releaseHint: {
        color: 'rgba(244, 67, 54, 0.5)',
        marginTop: 20,
        fontSize: 14,
        fontStyle: 'italic',
    },
    breathingCard: {
        width: '100%',
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 24,
        padding: 24,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
        marginBottom: 30,
    },
    cardTitle: {
        color: '#FFF',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    cardDesc: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 14,
        marginBottom: 25,
    },
    breathBarContainer: {
        width: '100%',
    },
    breathBarBackground: {
        height: 12,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 6,
        overflow: 'hidden',
    },
    breathBarFill: {
        height: '100%',
        width: '30%',
        backgroundColor: '#F44336',
        borderRadius: 6,
    },
    breathLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    breathLabel: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 12,
    },
    voyaBox: {
        width: '100%',
        padding: 24,
        borderRadius: 24,
        backgroundColor: 'rgba(176, 164, 241, 0.05)',
        alignItems: 'center',
    },
    voyaText: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 15,
    },
    chatButton: {
        backgroundColor: '#B0A4F1',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 16,
    },
    chatButtonText: {
        color: '#000',
        fontWeight: 'bold',
    },
    audioCard: {
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 24,
        padding: 20,
        borderWidth: 1,
        borderColor: 'rgba(244, 67, 54, 0.1)',
        marginBottom: 30,
        width: '100%',
    },
    audioInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    audioTitle: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    audioDesc: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 14,
        marginTop: 4,
    },
    miniControls: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 30,
    },
    miniPlayButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#F44336',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
