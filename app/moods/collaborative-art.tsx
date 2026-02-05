import NightSkyBackground from '@/components/NightSkyBackground';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

export default function CollaborativeArtScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [dots, setDots] = useState<{ x: number, y: number, color: string, id: number }[]>([]);

    const addDot = (evt: any) => {
        const { locationX, locationY } = evt.nativeEvent;
        const colors = ['#B0A4F1', '#4CAF50', '#2196F3', '#FF9800', '#F44336'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];

        const newDot = {
            x: locationX,
            y: locationY,
            color: randomColor,
            id: Date.now()
        };

        setDots(prev => [...prev.slice(-49), newDot]); // Keep last 50 dots
    };

    useEffect(() => {
        // Mock "other users" adding dots
        const interval = setInterval(() => {
            if (Math.random() > 0.3) {
                const colors = ['#B0A4F1', '#4CAF50', '#2196F3', '#FF9800', '#F44336'];
                const randomDot = {
                    x: Math.random() * width,
                    y: Math.random() * (height - 200),
                    color: colors[Math.floor(Math.random() * colors.length)],
                    id: Math.random()
                };
                setDots(prev => [...prev.slice(-49), randomDot]);
            }
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <View style={[styles.container, { backgroundColor: '#050510' }]}>
            <NightSkyBackground />

            <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={28} color="#B0A4F1" />
                </TouchableOpacity>
                <Text style={styles.title}>Collective Light</Text>
                <View style={{ width: 40 }} />
            </View>

            <TouchableOpacity
                activeOpacity={1}
                onPress={addDot}
                style={styles.canvas}
            >
                {dots.map(dot => (
                    <View
                        key={dot.id}
                        style={[
                            styles.dot,
                            {
                                left: dot.x - 10,
                                top: dot.y - 10,
                                backgroundColor: dot.color,
                                shadowColor: dot.color,
                            }
                        ]}
                    />
                ))}

                <View style={styles.canvasHint}>
                    <Text style={styles.hintText}>Tap anywhere to add your light</Text>
                    <Text style={styles.subHintText}>Collective art from all sanctuary members</Text>
                </View>
            </TouchableOpacity>

            <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
                <TouchableOpacity style={styles.clearButton} onPress={() => setDots([])}>
                    <Text style={styles.clearButtonText}>Clear My Workspace</Text>
                </TouchableOpacity>
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
        paddingBottom: 20,
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
    canvas: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.02)',
        marginHorizontal: 20,
        borderRadius: 32,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
        overflow: 'hidden',
    },
    dot: {
        position: 'absolute',
        width: 20,
        height: 20,
        borderRadius: 10,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 5,
    },
    canvasHint: {
        position: 'absolute',
        bottom: 40,
        width: '100%',
        alignItems: 'center',
        pointerEvents: 'none',
    },
    hintText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '500',
        opacity: 0.6,
    },
    subHintText: {
        color: 'rgba(255,255,255,0.3)',
        fontSize: 12,
        marginTop: 4,
    },
    footer: {
        alignItems: 'center',
        paddingTop: 20,
    },
    clearButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    clearButtonText: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 14,
    }
});
