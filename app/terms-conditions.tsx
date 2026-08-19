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

export default function TermsConditionsScreen() {
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
                <Text style={[styles.headerTitle, { color: theme.text }]}>Terms of Service</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <Text style={[styles.lastUpdated, { color: theme.textSecondary }]}>Last Updated: January 31, 2026</Text>

                <View style={styles.legalSection}>
                    <Text style={styles.sectionHeader}>1. Use of Nivora</Text>
                    <Text style={[styles.text, { color: theme.textSecondary }]}>
                        Nivora is designed to be your mental wellness companion. Our services are meant to support your healing journey but are not a substitute for professional medical advice, diagnosis, or treatment.
                    </Text>
                </View>

                <View style={styles.legalSection}>
                    <Text style={styles.sectionHeader}>2. User Identity & Safety</Text>
                    <Text style={[styles.text, { color: theme.textSecondary }]}>
                        Nivora uses a username-based system to maintain your privacy while ensuring account security. You are responsible for keeping your login credentials safe. Providing a recovery email is optional but highly recommended to ensure you never lose access to your sanctuary.
                    </Text>
                </View>

                <View style={styles.legalSection}>
                    <Text style={styles.sectionHeader}>3. Safety First</Text>
                    <Text style={[styles.text, { color: theme.textSecondary }]}>
                        If you are in an immediate life-threatening situation, please use the SOS feature or contact your local emergency services (e.g., 119 in Sri Lanka). Nivora is here to support you, but professional intervention is critical in emergencies.
                    </Text>
                </View>

                <View style={styles.legalSection}>
                    <Text style={styles.sectionHeader}>4. Community Guidelines</Text>
                    <Text style={[styles.text, { color: theme.textSecondary }]}>
                        Be kind. Nivora is a safe haven. Any form of harassment, hate speech, or abuse will result in immediate permanent blocking from the platform.
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
