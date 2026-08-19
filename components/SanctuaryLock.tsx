import Colors from '@/constants/Colors';
import { useTheme } from '@/constants/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

interface SanctuaryLockProps {
    featureName: string;
    description: string;
    icon: keyof typeof Ionicons.glyphMap;
}

export default function SanctuaryLock({ featureName, description, icon }: SanctuaryLockProps) {
    const router = useRouter();
    const { theme: themeName, isDark } = useTheme();
    const theme = Colors[themeName];

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.content}>
                <View style={[styles.iconContainer, { backgroundColor: isDark ? 'rgba(176, 164, 241, 0.08)' : 'rgba(120, 104, 230, 0.08)', borderColor: theme.border }]}>
                    <View style={[styles.glow, { backgroundColor: theme.primary }]} />
                    <Ionicons name={icon} size={80} color={theme.primary} />
                    <Ionicons name="lock-closed" size={30} color={isDark ? "#000" : "#FFF"} style={[styles.lockIcon, { backgroundColor: theme.primary }]} />
                </View>

                <Text style={[styles.title, { color: theme.text }]}>{featureName} Restricted</Text>
                <Text style={[styles.description, { color: theme.textSecondary }]}>{description}</Text>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[styles.primaryButton, { backgroundColor: theme.primary }]}
                        activeOpacity={0.8}
                        onPress={() => router.push('/auth/signup' as any)}
                    >
                        <Text style={[styles.primaryButtonText, { color: isDark ? '#000' : '#FFF' }]}>Create Sanctuary Account</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.secondaryButton}
                        activeOpacity={0.7}
                        onPress={() => router.push('/auth/login' as any)}
                    >
                        <Text style={[styles.secondaryButtonText, { color: theme.primary }]}>Already have an account? Log In</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30,
    },
    content: {
        width: '100%',
        alignItems: 'center',
    },
    iconContainer: {
        width: 160,
        height: 160,
        borderRadius: 80,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
        borderWidth: 1,
    },
    glow: {
        position: 'absolute',
        width: 100,
        height: 100,
        borderRadius: 50,
        opacity: 0.15,
    },
    lockIcon: {
        position: 'absolute',
        bottom: 35,
        right: 35,
        borderRadius: 15,
        padding: 4,
        overflow: 'hidden',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 15,
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 40,
        paddingHorizontal: 10,
    },
    buttonContainer: {
        width: '100%',
        gap: 15,
    },
    primaryButton: {
        width: '100%',
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 5,
    },
    primaryButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    secondaryButton: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    secondaryButtonText: {
        fontSize: 14,
        fontWeight: '600',
    },
});
