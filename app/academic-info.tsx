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
                <Text style={[styles.title, { color: currentColors.text }]}>Project Ownership</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.introSection}>
                    <View style={styles.logoCircle}>
                        <Ionicons name="school" size={40} color="#FFF" />
                    </View>
                    <Text style={[styles.introTitle, { color: currentColors.text }]}>Academic Submission</Text>
                    <Text style={styles.introSubtitle}>University 3rd Year Final Project</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionHeader}>Developer Identity</Text>
                    <ProjectDetail icon="person" label="Developed By" value="M.P.B.Kalpana" />
                    <ProjectDetail icon="id-card" label="Student ID" value="2021ICTS32" />
                    <ProjectDetail icon="business" label="University" value="University of Vavuniya" />
                </View>

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
                            <View style={styles.tag}><Text style={styles.tagText}>Custom UI/UX</Text></View>
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionHeader}>Research References</Text>
                    <TouchableOpacity
                        style={[styles.linkBox, { backgroundColor: isDark ? '#111' : '#F8F8F8' }]}
                        onPress={() => Linking.openURL('https://github.com/')}
                    >
                        <Text style={styles.linkLabel}>Technical Documentation</Text>
                        <Ionicons name="open-outline" size={16} color="#B0A4F1" />
                    </TouchableOpacity>
                </View>

                <View style={styles.certSection}>
                    <View style={styles.certDivider} />
                    <Ionicons name="shield-checkmark" size={24} color="#B0A4F1" />
                    <Text style={styles.certText}>Verified Academic Edition</Text>
                    <Text style={styles.certSub}>Nivora v1.0.4.Academic</Text>
                </View>

                <View style={{ height: 40 }} />
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
        fontSize: 20,
        fontWeight: 'bold',
    },
    scrollContent: {
        padding: 20,
    },
    introSection: {
        alignItems: 'center',
        marginBottom: 30,
        marginTop: 10,
    },
    logoCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#B0A4F1',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
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
        fontSize: 14,
        color: '#B0A4F1',
        fontWeight: '600',
        marginTop: 4,
    },
    section: {
        marginBottom: 25,
    },
    sectionHeader: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#666',
        textTransform: 'uppercase',
        letterSpacing: 1.2,
        marginBottom: 12,
        marginLeft: 4,
    },
    detailCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        marginBottom: 10,
    },
    iconBox: {
        width: 40,
        height: 40,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
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
        fontSize: 15,
        fontWeight: '600',
    },
    logicCard: {
        padding: 20,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#B0A4F130',
    },
    logicText: {
        fontSize: 14,
        lineHeight: 22,
        marginBottom: 15,
    },
    tagRow: {
        flexDirection: 'row',
        gap: 8,
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
        padding: 18,
        borderRadius: 16,
    },
    linkLabel: {
        fontSize: 14,
        color: '#888',
    },
    certSection: {
        alignItems: 'center',
        marginTop: 20,
        opacity: 0.6,
    },
    certDivider: {
        width: 60,
        height: 2,
        backgroundColor: '#B0A4F130',
        marginBottom: 15,
    },
    certText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#B0A4F1',
        marginTop: 8,
    },
    certSub: {
        fontSize: 10,
        color: '#666',
        marginTop: 2,
    }
});
