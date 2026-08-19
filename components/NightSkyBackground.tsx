import Colors from '@/constants/Colors';
import { useTheme } from '@/constants/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import { Animated, Dimensions, Easing, StyleSheet, View } from 'react-native';

const { width, height } = Dimensions.get('window');

const STAR_COUNT = 36;

const Star = ({ index, isDark }: { index: number; isDark: boolean }) => {
    const opacity = useRef(new Animated.Value(Math.random())).current;
    const scale = useRef(new Animated.Value(Math.random())).current;

    useEffect(() => {
        const animate = () => {
            Animated.parallel([
                Animated.sequence([
                    Animated.timing(opacity, {
                        toValue: isDark ? (0.2 + Math.random() * 0.8) : (0.15 + Math.random() * 0.45),
                        duration: 2000 + Math.random() * 3000,
                        useNativeDriver: true,
                        easing: Easing.inOut(Easing.sin),
                    }),
                    Animated.timing(opacity, {
                        toValue: 0.08,
                        duration: 2000 + Math.random() * 3000,
                        useNativeDriver: true,
                        easing: Easing.inOut(Easing.sin),
                    }),
                ]),
                Animated.sequence([
                    Animated.timing(scale, {
                        toValue: 0.5 + Math.random() * 1.5,
                        duration: 3000 + Math.random() * 4000,
                        useNativeDriver: true,
                        easing: Easing.inOut(Easing.sin),
                    }),
                    Animated.timing(scale, {
                        toValue: 0.2,
                        duration: 3000 + Math.random() * 4000,
                        useNativeDriver: true,
                        easing: Easing.inOut(Easing.sin),
                    }),
                ]),
            ]).start(() => animate());
        };

        animate();
    }, [opacity, scale, isDark]);

    const top = Math.random() * height;
    const left = Math.random() * width;

    return (
        <Animated.View
            style={[
                styles.star,
                {
                    top,
                    left,
                    opacity,
                    transform: [{ scale }],
                },
            ]}
        >
            <Ionicons name="sparkles" size={8} color={isDark ? "#FFF" : "#7868E6"} />
        </Animated.View>
    );
};

const Nebula = ({ color, size, top, left, delay, maxOpacity = 0.3 }: { color: string; size: number; top: number; left: number; delay: number; maxOpacity?: number }) => {
    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: maxOpacity,
                    duration: 5000,
                    delay,
                    useNativeDriver: true,
                    easing: Easing.inOut(Easing.sin),
                }),
                Animated.timing(opacity, {
                    toValue: maxOpacity * 0.3,
                    duration: 5000,
                    useNativeDriver: true,
                    easing: Easing.inOut(Easing.sin),
                }),
            ])
        ).start();
    }, [opacity, delay, maxOpacity]);

    return (
        <Animated.View
            style={[
                styles.nebula,
                {
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    backgroundColor: color,
                    top,
                    left,
                    opacity,
                },
            ]}
        />
    );
};

export default function NightSkyBackground() {
    const { theme: themeName, isDark } = useTheme();
    const theme = Colors[themeName];

    return (
        <View style={StyleSheet.absoluteFill}>
            <View style={[StyleSheet.absoluteFill, { backgroundColor: theme.background }]} />

            {/* Soft Ambient Nebulas */}
            {isDark ? (
                <>
                    <Nebula color="#B0A4F1" size={300} top={-50} left={-100} delay={0} maxOpacity={0.25} />
                    <Nebula color="#4B0082" size={400} top={height * 0.4} left={width * 0.5} delay={1000} maxOpacity={0.3} />
                    <Nebula color="#1A237E" size={350} top={height * 0.7} left={-50} delay={2000} maxOpacity={0.25} />
                </>
            ) : (
                <>
                    <Nebula color="#D6CEFA" size={320} top={-60} left={-80} delay={0} maxOpacity={0.45} />
                    <Nebula color="#E4DEFB" size={420} top={height * 0.35} left={width * 0.45} delay={1000} maxOpacity={0.5} />
                    <Nebula color="#D0E8FF" size={360} top={height * 0.65} left={-60} delay={2000} maxOpacity={0.4} />
                </>
            )}

            {/* Ambient Shimmer / Stars */}
            {[...Array(STAR_COUNT)].map((_, i) => (
                <Star key={i} index={i} isDark={isDark} />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    star: {
        position: 'absolute',
    },
    nebula: {
        position: 'absolute',
    },
});

