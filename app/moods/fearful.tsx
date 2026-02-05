import NightSkyBackground from '@/components/NightSkyBackground';
import { BACKEND_URL } from '@/constants/Backend';
import { Ionicons } from '@expo/vector-icons';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const GROUNDING_STEPS = [
    { id: 5, label: 'Things you can SEE', icon: 'eye-outline' },
    { id: 4, label: 'Things you can TOUCH', icon: 'hand-left-outline' },
    { id: 3, label: 'Things you can HEAR', icon: 'volume-high-outline' },
    { id: 2, label: 'Things you can SMELL', icon: 'flower-outline' },
    { id: 1, label: 'Thing you can TASTE', icon: 'restaurant-outline' },
];

export default function FearfulScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [currentStep, setCurrentStep] = useState(0);

    const nextGroundingStep = () => {
        if (currentStep < GROUNDING_STEPS.length - 1) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const [groundingMedia, setGroundingMedia] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);

    const player = useAudioPlayer(groundingMedia[currentIndex]?.url);
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
            setGroundingMedia(data);
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
        if (groundingMedia.length === 0) return;
        setCurrentIndex((currentIndex + 1) % groundingMedia.length);
    };

    const prevTrack = () => {
        if (groundingMedia.length === 0) return;
        setCurrentIndex((currentIndex - 1 + groundingMedia.length) % groundingMedia.length);
    };

    const currentMedia = groundingMedia[currentIndex];

    return (
        <View style={[styles.container, { backgroundColor: '#050510' }]}>
            <NightSkyBackground />

            <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={28} color="#B0A4F1" />
                </TouchableOpacity>
                <Text style={styles.title}>Grounding Presence</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.groundingCard}>
                    <Text style={styles.groundingSubtitle}>5-4-3-2-1 Technique</Text>
                    <Text style={styles.groundingTitle}>Stabilize your senses</Text>

                    <View style={styles.stepIndicator}>
                        {GROUNDING_STEPS.map((_, i) => (
                            <View
                                key={i}
                                style={[
                                    styles.dot,
                                    i === currentStep && styles.activeDot,
                                    i < currentStep && styles.completedDot
                                ]}
                            />
                        ))}
                    </View>

                    <View style={styles.activeStepContainer}>
                        <View style={styles.stepCircle}>
                            <Ionicons name={GROUNDING_STEPS[currentStep].icon as any} size={48} color="#FF9800" />
                            <Text style={styles.stepNumber}>{GROUNDING_STEPS[currentStep].id}</Text>
                        </View>
                        <Text style={styles.stepLabel}>{GROUNDING_STEPS[currentStep].label}</Text>
                        <Text style={styles.stepHint}>Take a slow breath and notice them now.</Text>
                    </View>

                    <TouchableOpacity style={styles.actionButton} onPress={nextGroundingStep}>
                        <Text style={styles.actionButtonText}>
                            {currentStep === GROUNDING_STEPS.length - 1 ? "I'm Grounded" : "Next Sense"}
                        </Text>
                    </TouchableOpacity>
                </View>

                {currentMedia && (
                    <View style={styles.audioCard}>
                        <View style={styles.audioInfo}>
                            <Ionicons name="pulse" size={32} color="#FF9800" />
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

                <View style={styles.emergencyQuickLinks}>
                    <Text style={styles.linksTitle}>Quick Support</Text>
                    <View style={styles.linksRow}>
                        <TouchableOpacity style={styles.linkItem} onPress={() => router.push('/(tabs)/emergency')}>
                            <Ionicons name="call" size={24} color="#F44336" />
                            <Text style={styles.linkText}>Emergency</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.linkItem} onPress={() => router.push('/voya-chat')}>
                            <Ionicons name="sparkles" size={24} color="#B0A4F1" />
                            <Text style={styles.linkText}>Talk to Voya</Text>
                        </TouchableOpacity>
                    </View>
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
    },
    groundingCard: {
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 32,
        padding: 30,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,152,0,0.2)',
        marginBottom: 30,
    },
    groundingSubtitle: {
        color: '#FF9800',
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
    groundingTitle: {
        color: '#FFF',
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 8,
        marginBottom: 20,
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
    activeDot: {
        width: 24,
        backgroundColor: '#FF9800',
    },
    completedDot: {
        backgroundColor: 'rgba(255,152,0,0.4)',
    },
    activeStepContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    stepCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'rgba(255,152,0,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    stepNumber: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: '#FF9800',
        color: '#000',
        fontSize: 14,
        fontWeight: 'bold',
        width: 28,
        height: 28,
        borderRadius: 14,
        textAlign: 'center',
        lineHeight: 28,
    },
    stepLabel: {
        color: '#FFF',
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    stepHint: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 14,
        marginTop: 8,
        textAlign: 'center',
    },
    actionButton: {
        backgroundColor: '#FF9800',
        width: '100%',
        height: 54,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionButtonText: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 16,
    },
    emergencyQuickLinks: {
        width: '100%',
    },
    linksTitle: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    linksRow: {
        flexDirection: 'row',
        gap: 15,
    },
    linkItem: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    linkText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '500',
        marginTop: 8,
    },
    audioCard: {
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 24,
        padding: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,152,0,0.1)',
        marginBottom: 30,
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
        backgroundColor: '#FF9800',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
