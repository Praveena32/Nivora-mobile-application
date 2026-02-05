import { useAuth } from '@/constants/AuthContext';
import Colors from '@/constants/Colors';
import { useTheme } from '@/constants/ThemeContext';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';

export default function SplashScreen() {
    const router = useRouter();
    const { isLoggedIn, hasCompletedOnboarding, isGuest } = useAuth();
    const { theme: themeName } = useTheme();
    const theme = Colors[themeName];
    const fadeAnim = new Animated.Value(0);

    useEffect(() => {
        // Logo fade-in animation
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
        }).start();

        // Automatic transition logic
        const timer = setTimeout(() => {
            router.replace('/onboarding');
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <Animated.View style={{ opacity: fadeAnim, alignItems: 'center' }}>
                <Image
                    source={require('../assets/images/icon.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
                <Text style={[styles.tagline, { color: theme.tabIconDefault }]}>Heal without fear</Text>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        width: 300,
        height: 400,
        marginBottom: 0,
    },
    tagline: {
        fontSize: 20,
        marginTop: -30,
        fontWeight: '300',
        fontStyle: 'italic',
    },
});
