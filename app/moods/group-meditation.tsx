import NightSkyBackground from '@/components/NightSkyBackground';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Easing,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function GroupMeditationScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [userCount, setUserCount] = useState(42);
    const breatheAnim = useRef(new Animated.Value(0)).current;
    const [phase, setPhase] = useState('Prepare');
    const animationRef = useRef<Animated.CompositeAnimation | null>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            setUserCount(prev => prev + (Math.random() > 0.5 ? 1 : -1));
        }, 5000);

        const runAnimation = () => {
            animationRef.current = Animated.sequence([
                Animated.timing(breatheAnim, {
                    toValue: 1,
                    duration: 5000,
                    easing: Easing.inOut(Easing.sin),
                    useNativeDriver: true,
                }),
                Animated.delay(1000),
                Animated.timing(breatheAnim, {
                    toValue: 0,
                    duration: 7000,
                    easing: Easing.inOut(Easing.sin),
                    useNativeDriver: true,
                }),
                Animated.delay(500),
            ]);

            animationRef.current.start(({ finished }) => {
                if (finished) runAnimation();
            });
        };

        runAnimation();

        // Robust phase tracking logic
        let lastValue = 0;
        const phaseListener = breatheAnim.addListener(({ value }: { value: number }) => {
            if (value > lastValue) {
                if (value > 0.95) setPhase('Hold');
                else setPhase('Inhale');
            } else {
                if (value < 0.05) setPhase('Prepare');
                else setPhase('Exhale');
            }
            lastValue = value;
        });

        return () => {
            clearInterval(interval);
            breatheAnim.removeListener(phaseListener);
            if (animationRef.current) {
                animationRef.current.stop();
            }
        };
    }, []);

    const scale = breatheAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 1.8],
    });

    const opacity = breatheAnim.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0.4, 0.7, 0.4],
    });

    return (
        <View style={[styles.container, { backgroundColor: '#050510' }]}>
            <NightSkyBackground />

            <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={28} color="#B0A4F1" />
                </TouchableOpacity>
                <Text style={styles.title}>Group Meditation</Text>
                <View style={{ width: 40 }} />
            </View>

            <View style={styles.content}>
                <View style={styles.presenceBox}>
                    <View style={styles.pulseDot} />
                    <Text style={styles.presenceText}>{userCount} others breathing with you</Text>
                </View>

                <View style={styles.orbContainer}>
                    <Animated.View style={[styles.orbGlow, { transform: [{ scale }], opacity }]} />
                    <Animated.View style={[styles.orbMain, { transform: [{ scale: scale.interpolate({ inputRange: [1, 1.8], outputRange: [1, 1.3] }) }] }]}>
                        <Text style={styles.phaseText}>{phase}</Text>
                    </Animated.View>
                </View>

                <View style={styles.instructionBox}>
                    <Text style={styles.tip}>Sync your breath with the expanding orb.</Text>
                    <Text style={styles.subtip}>Feel the collective peace of the sanctuary.</Text>
                </View>
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
        justifyContent: 'space-around',
        paddingBottom: 60,
    },
    presenceBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(76, 175, 80, 0.2)',
    },
    presenceText: {
        color: '#4CAF50',
        fontSize: 14,
        fontWeight: '600',
    },
    pulseDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#4CAF50',
        marginRight: 10,
    },
    orbContainer: {
        width: 300,
        height: 300,
        justifyContent: 'center',
        alignItems: 'center',
    },
    orbGlow: {
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: '#B0A4F1',
        position: 'absolute',
    },
    orbMain: {
        width: 160,
        height: 160,
        borderRadius: 80,
        backgroundColor: 'rgba(5, 5, 16, 0.8)',
        borderWidth: 2,
        borderColor: '#B0A4F1',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#B0A4F1',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 10,
    },
    phaseText: {
        color: '#FFF',
        fontSize: 24,
        fontWeight: 'bold',
    },
    instructionBox: {
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    tip: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '500',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtip: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 14,
        textAlign: 'center',
    }
});
