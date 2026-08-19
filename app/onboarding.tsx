import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useLanguage } from '@/constants/LanguageContext';
import { useTheme } from '@/constants/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, Dimensions, ImageBackground, Pressable, StyleSheet, TouchableOpacity } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function OnboardingScreen() {
    const router = useRouter();
    const { theme: themeName, isDark } = useTheme();
    const theme = Colors[themeName];
    const { t } = useLanguage();

    const scaleAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        const animation = Animated.loop(
            Animated.sequence([
                Animated.timing(scaleAnim, {
                    toValue: 1.1,
                    duration: 600,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnim, {
                    toValue: 1.0,
                    duration: 600,
                    useNativeDriver: true,
                }),
            ])
        );
        animation.start();
        return () => animation.stop();
    }, []);

    // Split "Heal without Fear" for two lines
    const title = t('healWithoutFear') || 'Heal without Fear';
    const words = title.split(' ');
    const line1 = words.slice(0, Math.ceil(words.length / 2)).join(' ');
    const line2 = words.slice(Math.ceil(words.length / 2)).join(' ');

    return (
        <View style={styles.container}>
            <ImageBackground
                source={require('../assets/images/onboarding-bg.jpg')}
                style={styles.backgroundImage}
                resizeMode="cover"
            >
                <View style={[styles.overlay, { backgroundColor: isDark ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.2)' }]}>
                    <TouchableOpacity
                        style={styles.sosButton}
                        onPress={() => router.push('/emergency')}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="warning" size={20} color="#FF6B6B" />
                        <Text style={styles.sosText}>{t('sosEmergencyLabel')}</Text>
                    </TouchableOpacity>

                    <View style={styles.header}>
                        <Text style={styles.title}>{line1}</Text>
                        <Text style={styles.title}>{line2}</Text>
                    </View>

                    <View style={styles.footer}>
                        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                            <Pressable
                                style={styles.button}
                                onPress={() => router.push('/onboarding2')}
                            >
                                <Text style={styles.buttonText}>{t('welcomeBtn')}</Text>
                            </Pressable>
                        </Animated.View>
                    </View>
                </View>
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backgroundImage: {
        flex: 1,
        width: width,
        height: height,
    },
    overlay: {
        flex: 1,
        justifyContent: 'space-between',
        paddingVertical: 100,
        alignItems: 'center',
    },
    header: {
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    title: {
        fontSize: 62,
        fontWeight: '900',
        color: '#FFFFFF',
        textAlign: 'center',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 0, height: 3 },
        textShadowRadius: 15,
        lineHeight: 70,
    },
    footer: {
        width: '100%',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    button: {
        backgroundColor: '#8692f7',
        paddingHorizontal: 80,
        paddingVertical: 12,
        borderRadius: 40,
        borderWidth: 4,
        borderColor: 'rgba(255, 255, 255, 0.4)',
        shadowColor: '#B2B9FF',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 20,
        elevation: 15,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 42,
        fontWeight: '700',
        textAlign: 'center',
        textShadowColor: 'rgba(255, 255, 255, 0.5)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 10,
    },
    sosButton: {
        position: 'absolute',
        top: 60,
        right: 20,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 107, 107, 0.1)',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 107, 107, 0.3)',
        gap: 8,
        zIndex: 100,
    },
    sosText: {
        color: '#FF6B6B',
        fontWeight: 'bold',
        fontSize: 14,
    },
});
