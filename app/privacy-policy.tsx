import Colors from '@/constants/Colors';
import { useTheme } from '@/constants/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function PrivacyPolicyScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { theme: themeName } = useTheme();
    const theme = Colors[themeName];

    return (
        <View style={[styles.container, { paddingTop: insets.top, backgroundColor: theme.background }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={28} color="#B0A4F1" />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.text }]}>Privacy Policy</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <Text style={[styles.lastUpdated, { color: theme.textSecondary }]}>Last Updated: January 31, 2026</Text>

                <View style={styles.legalSection}>
                    <Text style={styles.sectionHeader}>1. Minimal Data Collection</Text>
                    <Text style={[styles.text, { color: theme.textSecondary }]}>
                        We prioritize your privacy. We collect a chosen username for your account and an optional recovery email. This email is used exclusively for account recovery purposes and is never shared with third parties or used for marketing.
                    </Text>
                </View>

                <View style={styles.legalSection}>
                    <Text style={styles.sectionHeader}>2. End-to-End Encryption</Text>
                    <Text style={[styles.text, { color: theme.textSecondary }]}>
                        Your journal entries and chats with Voya are end-to-end encrypted. This means only you can access your thoughts. Even our team cannot read your private records.
                    </Text>
                </View>

                <View style={styles.legalSection}>
                    <Text style={styles.sectionHeader}>3. Anonymized Analytics</Text>
                    <Text style={[styles.text, { color: theme.textSecondary }]}>
                        We may collect anonymized usage data (e.g., which buttons are tapped most) to improve the app experience. This data cannot be traced back to you.
                    </Text>
                </View>

                <View style={styles.legalSection}>
                    <Text style={styles.sectionHeader}>4. Your Rights</Text>
                    <Text style={[styles.text, { color: theme.textSecondary }]}>
                        You have full control over your data. You can update your recovery email or delete your account at any time. Deleting your account will permanently remove all journal entries and chat history from our secure servers.
                    </Text>
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
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    backButton: {
        marginRight: 15,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    content: {
        padding: 20,
    },
    lastUpdated: {
        fontSize: 12,
        marginBottom: 25,
    },
    legalSection: {
        marginBottom: 30,
    },
    sectionHeader: {
        color: '#B0A4F1',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    text: {
        fontSize: 14,
        lineHeight: 22,
        textAlign: 'justify',
    },
});
