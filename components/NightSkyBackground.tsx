import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import { Animated, Dimensions, Easing, StyleSheet, View } from 'react-native';

const { width, height } = Dimensions.get('window');

const STAR_COUNT = 40;

const Star = ({ index }: { index: number }) => {
    const opacity = useRef(new Animated.Value(Math.random())).current;
    const scale = useRef(new Animated.Value(Math.random())).current;

    useEffect(() => {
        const animate = () => {
            Animated.parallel([
                Animated.sequence([
                    Animated.timing(opacity, {
                        toValue: 0.2 + Math.random() * 0.8,
                        duration: 2000 + Math.random() * 3000,
                        useNativeDriver: true,
                        easing: Easing.inOut(Easing.sin),
                    }),
                    Animated.timing(opacity, {
                        toValue: 0.1,
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
    }, [opacity, scale]);

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
            <Ionicons name="sparkles" size={8} color="#FFF" />
        </Animated.View>
    );
};

const Nebula = ({ color, size, top, left, delay }: { color: string, size: number, top: number, left: number, delay: number }) => {
    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 0.3,
                    duration: 5000,
                    delay,
                    useNativeDriver: true,
                    easing: Easing.inOut(Easing.sin),
                }),
                Animated.timing(opacity, {
                    toValue: 0.1,
                    duration: 5000,
                    useNativeDriver: true,
                    easing: Easing.inOut(Easing.sin),
                }),
            ])
        ).start();
    }, [opacity, delay]);

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
    return (
        <View style={StyleSheet.absoluteFill}>
            <View style={[StyleSheet.absoluteFill, { backgroundColor: '#050510' }]} />

            {/* Soft Nebulas */}
            <Nebula color="#B0A4F1" size={300} top={-50} left={-100} delay={0} />
            <Nebula color="#4B0082" size={400} top={height * 0.4} left={width * 0.5} delay={1000} />
            <Nebula color="#1A237E" size={350} top={height * 0.7} left={-50} delay={2000} />

            {/* Twinkling Stars */}
            {[...Array(STAR_COUNT)].map((_, i) => (
                <Star key={i} index={i} />
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
        filter: 'blur(80px)', // Note: standard RN doesn't support filter, we'll use opacity and large borderRadius
    },
});
