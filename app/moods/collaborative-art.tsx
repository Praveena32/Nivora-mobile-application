import NightSkyBackground from '@/components/NightSkyBackground';
import Colors from '@/constants/Colors';
import { useTheme } from '@/constants/ThemeContext';
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

const EMOTION_PALETTES = [
    { id: 'peace', label: 'Peace', color: '#7868E6', darkColor: '#B0A4F1', emoji: '✨' },
    { id: 'hope', label: 'Hope', color: '#D97706', darkColor: '#FBBF24', emoji: '🌟' },
    { id: 'calm', label: 'Calm', color: '#0284C7', darkColor: '#38BDF8', emoji: '💧' },
    { id: 'growth', label: 'Growth', color: '#16A34A', darkColor: '#4ADE80', emoji: '🌱' },
    { id: 'love', label: 'Love', color: '#DB2777', darkColor: '#F472B6', emoji: '💖' },
];

export default function CollaborativeArtScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { theme: themeName, isDark } = useTheme();
    const theme = Colors[themeName];

    const [dots, setDots] = useState<{ x: number; y: number; color: string; id: number; symbol: string }[]>([]);
    const [selectedPaletteIdx, setSelectedPaletteIdx] = useState(0);
    const [totalStarsPlaced, setTotalStarsPlaced] = useState(1420);

    const addDot = (evt: any) => {
        const { locationX, locationY } = evt.nativeEvent;
        const currentPalette = EMOTION_PALETTES[selectedPaletteIdx];
        const dotColor = isDark ? currentPalette.darkColor : currentPalette.color;

        const newDot = {
            x: locationX,
            y: locationY,
            color: dotColor,
            symbol: currentPalette.emoji,
            id: Date.now() + Math.random(),
        };

        setDots(prev => [...prev.slice(-59), newDot]); // Keep last 60 stars
        setTotalStarsPlaced(prev => prev + 1);
    };

    useEffect(() => {
        // Simulated live peer stars
        const interval = setInterval(() => {
            if (Math.random() > 0.35) {
                const randomP = EMOTION_PALETTES[Math.floor(Math.random() * EMOTION_PALETTES.length)];
                const randomDot = {
                    x: 20 + Math.random() * (width - 80),
                    y: 20 + Math.random() * (height - 340),
                    color: isDark ? randomP.darkColor : randomP.color,
                    symbol: randomP.emoji,
                    id: Math.random(),
                };
                setDots(prev => [...prev.slice(-59), randomDot]);
                setTotalStarsPlaced(prev => prev + 1);
            }
        }, 3500);
        return () => clearInterval(interval);
    }, [isDark]);

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
                    <Text style={[styles.title, { color: theme.text }]}>Cosmic Constellation</Text>
                    <Text style={[styles.subtitle, { color: isDark ? '#FBBF24' : '#D97706' }]}>
                        ✨ {totalStarsPlaced.toLocaleString()} Starlight Points Placed Today
                    </Text>
                </View>

                <TouchableOpacity
                    onPress={() => setDots([])}
                    style={[styles.clearBtn, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)', borderColor: theme.border }]}
                    activeOpacity={0.75}
                >
                    <Ionicons name="refresh-outline" size={18} color={theme.textSecondary} />
                </TouchableOpacity>
            </View>

            {/* Emotion Star Palette Selector */}
            <View style={styles.paletteContainer}>
                <Text style={[styles.paletteLabel, { color: theme.textSecondary }]}>Pick your emotion light:</Text>
                <View style={styles.paletteRow}>
                    {EMOTION_PALETTES.map((p, idx) => {
                        const isSelected = selectedPaletteIdx === idx;
                        const pColor = isDark ? p.darkColor : p.color;
                        return (
                            <TouchableOpacity
                                key={p.id}
                                style={[
                                    styles.paletteChip,
                                    {
                                        backgroundColor: isSelected ? (pColor + (isDark ? '25' : '15')) : (isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.85)'),
                                        borderColor: isSelected ? pColor : (isDark ? 'rgba(255, 255, 255, 0.10)' : 'rgba(0, 0, 0, 0.08)'),
                                    }
                                ]}
                                onPress={() => setSelectedPaletteIdx(idx)}
                                activeOpacity={0.8}
                            >
                                <Text style={{ fontSize: 14, marginRight: 4 }}>{p.emoji}</Text>
                                <Text style={[styles.paletteChipText, { color: isSelected ? pColor : theme.textSecondary }]}>
                                    {p.label}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>

            {/* Interactive Mural Canvas */}
            <TouchableOpacity
                activeOpacity={1}
                onPress={addDot}
                style={[
                    styles.canvas,
                    {
                        backgroundColor: isDark ? 'rgba(12, 8, 26, 0.85)' : 'rgba(255, 255, 255, 0.90)',
                        borderColor: isDark ? 'rgba(176, 164, 241, 0.25)' : 'rgba(120, 104, 230, 0.20)',
                    }
                ]}
            >
                {dots.map(dot => (
                    <View
                        key={dot.id}
                        style={[
                            styles.starPoint,
                            {
                                left: Math.max(10, Math.min(width - 70, dot.x - 12)),
                                top: Math.max(10, dot.y - 12),
                                shadowColor: dot.color,
                            }
                        ]}
                    >
                        <View style={[styles.starGlowHalo, { backgroundColor: dot.color + '40' }]} />
                        <Text style={{ fontSize: 16 }}>{dot.symbol}</Text>
                    </View>
                ))}

                <View style={styles.canvasHint}>
                    <Text style={[styles.hintText, { color: theme.text }]}>
                        Tap anywhere on the canvas to place your light
                    </Text>
                    <Text style={[styles.subHintText, { color: theme.textSecondary }]}>
                        Every star represents a quiet soul healing with you right now
                    </Text>
                </View>
            </TouchableOpacity>

            <View style={{ height: insets.bottom + 20 }} />
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
        paddingBottom: 10,
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
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 11,
        fontWeight: '700',
        marginTop: 2,
    },
    clearBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
    },
    paletteContainer: {
        paddingHorizontal: 18,
        marginBottom: 12,
    },
    paletteLabel: {
        fontSize: 11,
        fontWeight: '700',
        marginBottom: 6,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    paletteRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    paletteChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 12,
        borderWidth: 1,
    },
    paletteChipText: {
        fontSize: 11,
        fontWeight: '700',
    },
    canvas: {
        flex: 1,
        marginHorizontal: 18,
        borderRadius: 28,
        borderWidth: 1.5,
        overflow: 'hidden',
        position: 'relative',
    },
    starPoint: {
        position: 'absolute',
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 6,
    },
    starGlowHalo: {
        position: 'absolute',
        width: 28,
        height: 28,
        borderRadius: 14,
    },
    canvasHint: {
        position: 'absolute',
        bottom: 24,
        width: '100%',
        alignItems: 'center',
        paddingHorizontal: 20,
        pointerEvents: 'none',
    },
    hintText: {
        fontSize: 13,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    subHintText: {
        fontSize: 11,
        textAlign: 'center',
        marginTop: 3,
    },
});
