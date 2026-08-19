import Colors from '@/constants/Colors';
import { useTheme } from '@/constants/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AcademicInfoScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const currentColors = Colors[theme];

    const ProjectDetail = ({ label, value, icon }: { label: string, value: string, icon: any }) => (
        <View style={[styles.detailCard, { backgroundColor: isDark ? '#111' : '#F8F8F8', borderColor: isDark ? '#222' : '#EEE' }]}>
            <View style={[styles.iconBox, { backgroundColor: '#B0A4F120' }]}>
                <Ionicons name={icon} size={20} color="#B0A4F1" />
            </View>
            <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>{label}</Text>
                <Text style={[styles.detailValue, { color: currentColors.text }]}>{value}</Text>
            </View>
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor: currentColors.background }]}>
            <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={28} color="#B0A4F1" />
                </TouchableOpacity>
                <Text style={[styles.title, { color: currentColors.text }]}>Project Ownership & Tech Stack</Text>
            </View>

            <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 28 }]} showsVerticalScrollIndicator={false}>
                <View style={styles.introSection}>
                    <View style={styles.logoCircle}>
                        <Ionicons name="school" size={40} color="#FFF" />
                    </View>
                    <Text style={[styles.introTitle, { color: currentColors.text }]}>Academic Submission</Text>
                    <Text style={styles.introSubtitle}>University 3rd Year Final Project • ICTEXPO 4.0 Edition</Text>
                </View>

                {/* Developer Identity */}
                <View style={styles.section}>
                    <Text style={styles.sectionHeader}>Developer Identity</Text>
                    <ProjectDetail icon="person" label="Developed By" value="M.P.B.Kalpana" />
                    <ProjectDetail icon="id-card" label="Student ID" value="2021ICTS32" />
                    <ProjectDetail icon="business" label="University" value="University of Vavuniya" />
                </View>

                {/* Technology Stack Details */}
                <View style={styles.section}>
                    <Text style={styles.sectionHeader}>Technology Stack & Frameworks</Text>
                    <View style={[styles.stackCard, { backgroundColor: isDark ? '#111' : '#F8F8F8', borderColor: isDark ? '#222' : '#EEE' }]}>
                        <View style={styles.stackRow}>
                            <Ionicons name="code-slash-outline" size={18} color="#B0A4F1" style={{ marginRight: 10 }} />
                            <Text style={[styles.stackTitle, { color: currentColors.text }]}>React Native (0.76+) & TypeScript 5.x</Text>
                        </View>
                        <View style={styles.stackRow}>
                            <Ionicons name="layers-outline" size={18} color="#38BDF8" style={{ marginRight: 10 }} />
                            <Text style={[styles.stackTitle, { color: currentColors.text }]}>Expo SDK 52/53 & Expo Router (Typed)</Text>
                        </View>
                        <View style={styles.stackRow}>
                            <Ionicons name="headset-outline" size={18} color="#10B981" style={{ marginRight: 10 }} />
                            <Text style={[styles.stackTitle, { color: currentColors.text }]}>Expo Audio Engine & Haptic Resonances</Text>
                        </View>
                        <View style={styles.stackRow}>
                            <Ionicons name="sparkles-outline" size={18} color="#F59E0B" style={{ marginRight: 10 }} />
                            <Text style={[styles.stackTitle, { color: currentColors.text }]}>Node.js Express & Google Gemini AI API</Text>
                        </View>
                    </View>
                </View>

                {/* Application Logic & Intellect */}
                <View style={styles.section}>
                    <Text style={styles.sectionHeader}>Application Logic & Intellect</Text>
                    <View style={[styles.logicCard, { backgroundColor: isDark ? '#0A0A15' : '#F0F0FF' }]}>
                        <Text style={[styles.logicText, { color: isDark ? '#AAA' : '#555' }]}>
                            This application is a unique synthesis of mental health support and digital safety,
                            featuring custom-built logic for emotional state management, anonymous peer support coordination,
                            and academic-grade evidence management for digital safety.
                        </Text>
                        <View style={styles.tagRow}>
                            <View style={styles.tag}><Text style={styles.tagText}>Original Logic</Text></View>
                            <View style={styles.tag}><Text style={styles.tagText}>Trauma-Informed UI</Text></View>
                            <View style={styles.tag}><Text style={styles.tagText}>Zero Friction</Text></View>
                        </View>
                    </View>
                </View>

                {/* Research References */}
                <View style={styles.section}>
                    <Text style={styles.sectionHeader}>Research References</Text>
                    <TouchableOpacity
                        style={[styles.linkBox, { backgroundColor: isDark ? '#111' : '#F8F8F8' }]}
                        onPress={() => Linking.openURL('https://github.com/')}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.linkLabel}>Technical Documentation</Text>
                        <Ionicons name="open-outline" size={16} color="#B0A4F1" />
                    </TouchableOpacity>
                </View>

                {/* Cert Section */}
                <View style={styles.certSection}>
                    <View style={styles.certDivider} />
                    <Ionicons name="shield-checkmark" size={24} color="#B0A4F1" />
                    <Text style={styles.certText}>Verified Academic Edition</Text>
                    <Text style={styles.certSub}>Nivora v1.0.4.Academic • ICTEXPO 4.0</Text>
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
        paddingBottom: 15,
    },
    backButton: {
        marginRight: 15,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    scrollContent: {
        padding: 20,
    },
    introSection: {
        alignItems: 'center',
        marginBottom: 24,
        marginTop: 6,
    },
    logoCircle: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: '#B0A4F1',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
        elevation: 5,
        shadowColor: '#B0A4F1',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    introTitle: {
        fontSize: 22,
        fontWeight: 'bold',
    },
    introSubtitle: {
        fontSize: 13,
        color: '#B0A4F1',
        fontWeight: '600',
        marginTop: 4,
    },
    section: {
        marginBottom: 20,
    },
    sectionHeader: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#888',
        textTransform: 'uppercase',
        letterSpacing: 1.2,
        marginBottom: 10,
        marginLeft: 4,
    },
    detailCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        borderRadius: 16,
        borderWidth: 1,
        marginBottom: 8,
    },
    iconBox: {
        width: 38,
        height: 38,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    detailContent: {
        flex: 1,
    },
    detailLabel: {
        fontSize: 11,
        color: '#888',
        marginBottom: 2,
    },
    detailValue: {
        fontSize: 14,
        fontWeight: '600',
    },
    stackCard: {
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        gap: 12,
    },
    stackRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    stackTitle: {
        fontSize: 13,
        fontWeight: '600',
    },
    logicCard: {
        padding: 18,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#B0A4F130',
    },
    logicText: {
        fontSize: 13,
        lineHeight: 20,
        marginBottom: 12,
    },
    tagRow: {
        flexDirection: 'row',
        gap: 8,
        flexWrap: 'wrap',
    },
    tag: {
        backgroundColor: '#B0A4F1',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
    },
    tagText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#000',
    },
    linkBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
    },
    linkLabel: {
        fontSize: 13,
        color: '#888',
    },
    certSection: {
        alignItems: 'center',
        marginTop: 10,
        opacity: 0.6,
    },
    certDivider: {
        width: 60,
        height: 2,
        backgroundColor: '#B0A4F130',
        marginBottom: 12,
    },
    certText: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#B0A4F1',
        marginTop: 6,
    },
    certSub: {
        fontSize: 10,
        color: '#666',
        marginTop: 2,
    }
});
