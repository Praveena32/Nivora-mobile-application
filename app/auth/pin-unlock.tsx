import { useAuth } from '@/constants/AuthContext';
import Colors from '@/constants/Colors';
import { useTheme } from '@/constants/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Alert, Animated, BackHandler, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function PinUnlockScreen() {
    const [pin, setPin] = useState('');
    const { unlockApp, signOut } = useAuth();
    const router = useRouter();
    const { theme: themeName, isDark } = useTheme();
    const theme = Colors[themeName];
    const insets = useSafeAreaInsets();
    const shakeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (pin.length === 6) {
            handleUnlock();
        }
    }, [pin]);

    const handleUnlock = () => {
        const success = unlockApp(pin);
        if (success) {
            router.replace('/(tabs)');
        } else {
            setPin('');
            shake();
        }
    };

    const shake = () => {
        Animated.sequence([
            Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
        ]).start();
    };

    const onPressNumber = (num: string) => {
        if (pin.length < 6) {
            setPin(prev => prev + num);
        }
    };

    const onDelete = () => {
        setPin(prev => prev.slice(0, -1));
    };

    const handleExit = () => {
        BackHandler.exitApp();
    };

    const handleResetAccount = () => {
        Alert.alert(
            "Reset Account",
            "This will permanently delete all your data and settings. You will need to set up your sanctuary again. Are you sure?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Reset & Delete",
                    style: "destructive",
                    onPress: async () => {
                        await signOut();
                        router.replace('/onboarding');
                    }
                }
            ]
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: '#050510', paddingTop: insets.top, paddingBottom: insets.bottom + 20 }]}>
            <View style={styles.header}>
                <Ionicons name="lock-closed" size={40} color="#B0A4F1" />
                <Text style={styles.title}>Nivora Locked</Text>
                <Text style={styles.subtitle}>Enter your 6-digit PIN to unlock</Text>
            </View>

            <Animated.View style={[styles.pinDots, { transform: [{ translateX: shakeAnim }] }]}>
                {[...Array(6)].map((_, i) => (
                    <View
                        key={i}
                        style={[
                            styles.dot,
                            { backgroundColor: i < pin.length ? '#B0A4F1' : 'rgba(176, 164, 241, 0.2)' }
                        ]}
                    />
                ))}
            </Animated.View>

            <View style={styles.keypad}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                    <TouchableOpacity key={num} style={styles.key} onPress={() => onPressNumber(num.toString())}>
                        <Text style={styles.keyText}>{num}</Text>
                    </TouchableOpacity>
                ))}
                <TouchableOpacity style={styles.key} onPress={handleExit}>
                    <Text style={[styles.keyText, { fontSize: 16, color: '#F44336', fontWeight: 'bold' }]}>Exit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.key} onPress={() => onPressNumber('0')}>
                    <Text style={styles.keyText}>0</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.key} onPress={onDelete}>
                    <Ionicons name="backspace-outline" size={24} color="#FFF" />
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                style={styles.sosButton}
                onPress={() => router.push('/emergency')}
            >
                <Ionicons name="warning-outline" size={20} color="#F44336" />
                <Text style={styles.sosText}>Emergency SOS</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.forgotButton}
                onPress={() => router.push('/auth/credential-setup')}
            >
                <Text style={styles.forgotText}>Forgot PIN? <Text style={styles.resetText}>Reset</Text></Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.resetAccountButton}
                onPress={handleResetAccount}
            >
                <Text style={styles.resetAccountText}>Reset Account</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFF',
        marginTop: 15,
    },
    subtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.6)',
        marginTop: 10,
    },
    pinDots: {
        flexDirection: 'row',
        marginBottom: 30,
    },
    dot: {
        width: 15,
        height: 15,
        borderRadius: 7.5,
        marginHorizontal: 10,
        borderWidth: 1,
        borderColor: '#B0A4F1',
    },
    keypad: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: width * 0.8,
        justifyContent: 'center',
        marginBottom: 10,
    },
    key: {
        width: width * 0.2,
        height: width * 0.2,
        margin: 10,
        borderRadius: width * 0.1,
        backgroundColor: 'rgba(255,255,255,0.05)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    keyText: {
        fontSize: 28,
        color: '#FFF',
        fontWeight: '500',
    },
    forgotButton: {
        marginTop: 10,
        padding: 10,
    },
    forgotText: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 14,
    },
    resetText: {
        color: '#B0A4F1',
        fontWeight: 'bold',
    },
    resetAccountButton: {
        marginTop: 10,
        padding: 5,
    },
    resetAccountText: {
        color: '#F44336',
        fontSize: 12,
        opacity: 0.7,
    },
    sosButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(244, 67, 54, 0.1)',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: 'rgba(244, 67, 54, 0.3)',
        marginTop: 10,
        gap: 8,
    },
    sosText: {
        color: '#F44336',
        fontWeight: 'bold',
        fontSize: 14,
    },
});
