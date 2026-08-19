import NightSkyBackground from '@/components/NightSkyBackground';
import Colors from '@/constants/Colors';
import { useLanguage } from '@/constants/LanguageContext';
import { useTheme } from '@/constants/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Dimensions,
    Linking,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    Vibration,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

interface CyberCategory {
    id: string;
    title: string;
    desc: string;
    icon: string;
    color: string;
    guide: string[];
}

export default function CyberGuardScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { theme: themeName, isDark } = useTheme();
    const theme = Colors[themeName];
    const { t } = useLanguage();

    const [selectedCategory, setSelectedCategory] = useState<CyberCategory | null>(null);
    const [checkedEvidence, setCheckedEvidence] = useState<{ [key: number]: boolean }>({});

    const CATEGORIES: CyberCategory[] = [
        {
            id: 'blackmail',
            title: 'Cyber Blackmail',
            desc: 'Protection against sextortion, extortion, and online threats',
            icon: 'lock-closed-outline',
            color: '#FF6B6B',
            guide: [
                'Do not pay money or send additional photos.',
                'Screenshot messages, profiles, and transaction IDs immediately.',
                'Block all communication channels to prevent further demands.',
                'Report to local cyber crime authorities (Helpline 101 / 1919).',
                'Connect with our encrypted counseling support below.'
            ]
        },
        {
            id: 'nude_leak',
            title: 'Photo & Image Threats',
            desc: 'Immediate action for non-consensual image distribution',
            icon: 'eye-off-outline',
            color: '#F59E0B',
            guide: [
                'Take timestamped evidence screenshots of all URLs and profiles.',
                'Submit takedown notices to platform webmasters and ISPs.',
                'Do not negotiate or give into blackmailers.',
                'Contact national cyber helpline (101) immediately.',
                'Seek confidential emotional guidance through Voya or counseling.'
            ]
        },
        {
            id: 'account_hack',
            title: 'Account Compromise',
            desc: 'Recover stolen accounts and prevent credential leaks',
            icon: 'key-outline',
            color: '#38BDF8',
            guide: [
                'Change passwords for associated recovery email accounts immediately.',
                'Enable hardware or authenticator-based 2-Factor Authentication (2FA).',
                'Revoke third-party app authorizations and active user sessions.',
                'Notify close contacts to ignore suspicious requests.',
                'Run full anti-malware and spyware diagnostics on your devices.'
            ]
        },
        {
            id: 'privacy',
            title: 'Privacy Shield',
            desc: 'Digital privacy hygiene and stalkerware prevention',
            icon: 'shield-checkmark-outline',
            color: '#B0A4F1',
            guide: [
                'Audit location permissions on all mobile devices.',
                'Remove unknown Bluetooth and paired accessories.',
                'Use encrypted VPNs on untrusted public Wi-Fi networks.',
                'Lock personal galleries and apps with encrypted PINs.',
                'Regularly check breach databases for your email.'
            ]
        }
    ];

    const EVIDENCE_CHECKLIST = [
        { id: 0, label: 'Screenshot threats, chats & profile URIs', icon: 'camera-outline' },
        { id: 1, label: 'Export full chat logs & transaction IDs', icon: 'list-outline' },
        { id: 2, label: 'Record exact timestamps & user handles', icon: 'time-outline' },
    ];

    const toggleEvidenceCheck = (index: number) => {
        Vibration.vibrate(20);
        setCheckedEvidence(prev => ({ ...prev, [index]: !prev[index] }));
    };

    const handleCallHelpline = () => {
        Linking.openURL('tel:101');
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <NightSkyBackground />
            <View style={{ height: insets.top, backgroundColor: theme.background, width: '100%', position: 'absolute', top: 0, zIndex: 10 }} />

            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top + 12, borderBottomColor: theme.border, backgroundColor: isDark ? 'rgba(7, 6, 20, 0.75)' : 'rgba(255, 255, 255, 0.85)' }]}>
                <TouchableOpacity onPress={() => router.back()} style={[styles.backButton, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)', borderColor: theme.border }]}>
                    <Ionicons name="chevron-back" size={24} color="#38BDF8" />
                </TouchableOpacity>

                <View style={styles.headerTitleGroup}>
                    <Ionicons name="shield-half" size={18} color="#38BDF8" style={{ marginRight: 6 }} />
                    <Text style={[styles.title, { color: theme.text }]}>{t('cyberGuardTitle')}</Text>
                </View>

                <TouchableOpacity
                    style={[styles.sosButton, { backgroundColor: '#38BDF8' }]}
                    onPress={() => router.push({
                        pathname: '/moods/counselor-chat',
                        params: { name: 'Cyber Support Counselor', type: 'Cyber Incident' }
                    } as any)}
                    activeOpacity={0.85}
                >
                    <Ionicons name="shield" size={18} color={isDark ? "#000" : "#FFF"} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={[styles.content, { paddingBottom: 24 }]} showsVerticalScrollIndicator={false}>
                {/* 1. Hero Shield Card */}
                <View style={[styles.heroCard, { backgroundColor: isDark ? 'rgba(56, 189, 248, 0.10)' : 'rgba(56, 189, 248, 0.06)', borderColor: isDark ? 'rgba(56, 189, 248, 0.28)' : 'rgba(56, 189, 248, 0.22)' }]}>
                    <View style={styles.heroBadgeRow}>
                        <View style={[styles.heroBadge, { backgroundColor: 'rgba(56, 189, 248, 0.2)', borderColor: 'rgba(56, 189, 248, 0.4)' }]}>
                            <Ionicons name="pulse" size={12} color="#38BDF8" style={{ marginRight: 4 }} />
                            <Text style={[styles.heroBadgeText, { color: isDark ? '#BAE6FD' : '#0369A1' }]}>ENCRYPTED CYBER SHIELD</Text>
                        </View>
                    </View>
                    <Text style={[styles.heroTitle, { color: theme.text }]}>{t('cyberGuardTitle')}</Text>
                    <Text style={[styles.heroSub, { color: theme.textSecondary }]}>{t('cyberHeroSub')}</Text>
                </View>

                {/* 2. Cyber Incident Categories Grid */}
                <View style={styles.grid}>
                    {CATEGORIES.map((cat) => (
                        <TouchableOpacity
                            key={cat.id}
                            style={[styles.card, { backgroundColor: isDark ? theme.card : '#FFFFFF', borderColor: theme.border }]}
                            onPress={() => setSelectedCategory(cat)}
                            activeOpacity={0.82}
                        >
                            <View style={[styles.iconContainer, { backgroundColor: cat.color + (isDark ? '20' : '15') }]}>
                                <Ionicons name={cat.icon as any} size={26} color={cat.color} />
                            </View>
                            <View style={styles.cardContent}>
                                <Text style={[styles.cardTitle, { color: theme.text }]}>{cat.title}</Text>
                                <Text style={[styles.cardDesc, { color: theme.textSecondary }]}>{cat.desc}</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={18} color={theme.textSecondary} />
                        </TouchableOpacity>
                    ))}
                </View>

                {/* 3. Interactive Evidence Checklist */}
                <View style={[styles.evidenceCard, { backgroundColor: isDark ? theme.card : '#FFFFFF', borderColor: theme.border }]}>
                    <View style={styles.evidenceHeaderRow}>
                        <Ionicons name="checkbox-outline" size={18} color="#38BDF8" style={{ marginRight: 6 }} />
                        <Text style={[styles.evidenceTitle, { color: theme.text }]}>{t('evidenceChecklist')}</Text>
                    </View>
                    <Text style={[styles.evidenceSub, { color: theme.textSecondary }]}>Tap items to track evidence collected before reporting:</Text>

                    <View style={styles.evidenceList}>
                        {EVIDENCE_CHECKLIST.map((item) => {
                            const isChecked = checkedEvidence[item.id];
                            return (
                                <TouchableOpacity
                                    key={item.id}
                                    style={[
                                        styles.evidenceItem,
                                        { backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#F9FAFB', borderColor: theme.border },
                                        isChecked && { borderColor: '#38BDF8', backgroundColor: isDark ? 'rgba(56, 189, 248, 0.12)' : 'rgba(56, 189, 248, 0.06)' }
                                    ]}
                                    onPress={() => toggleEvidenceCheck(item.id)}
                                    activeOpacity={0.8}
                                >
                                    <View style={[styles.checkboxCircle, isChecked && { backgroundColor: '#38BDF8', borderColor: '#38BDF8' }]}>
                                        {isChecked && <Ionicons name="checkmark" size={12} color="#000" />}
                                    </View>
                                    <Ionicons name={item.icon as any} size={18} color={isChecked ? '#38BDF8' : theme.textSecondary} style={{ marginRight: 8 }} />
                                    <Text style={[styles.evidenceLabel, { color: isChecked ? theme.text : theme.textSecondary, textDecorationLine: isChecked ? 'line-through' : 'none' }]}>
                                        {item.label}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>

                {/* 4. Direct Emergency Call & Chat Channels */}
                <View style={styles.helpRow}>
                    <TouchableOpacity
                        style={[styles.helpButton, { backgroundColor: isDark ? theme.card : '#FFFFFF', borderColor: theme.border }]}
                        onPress={handleCallHelpline}
                        activeOpacity={0.8}
                    >
                        <View style={[styles.helpIcon, { backgroundColor: 'rgba(56, 189, 248, 0.15)' }]}>
                            <Ionicons name="call" size={20} color="#38BDF8" />
                        </View>
                        <Text style={[styles.helpLabel, { color: theme.text }]}>Cyber Helpline</Text>
                        <Text style={[styles.helpSub, { color: theme.textSecondary }]}>Call 101 / 1919</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.helpButton, { backgroundColor: isDark ? theme.card : '#FFFFFF', borderColor: theme.border }]}
                        onPress={() => router.push('/moods/counselor-chat' as any)}
                        activeOpacity={0.8}
                    >
                        <View style={[styles.helpIcon, { backgroundColor: 'rgba(176, 164, 241, 0.15)' }]}>
                            <Ionicons name="chatbubbles" size={20} color="#B0A4F1" />
                        </View>
                        <Text style={[styles.helpLabel, { color: theme.text }]}>Expert Support</Text>
                        <Text style={[styles.helpSub, { color: theme.textSecondary }]}>Encrypted Chat</Text>
                    </TouchableOpacity>
                </View>

                {/* 5. Digital Safety Precautions */}
                <View style={styles.precautionSection}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('digitalSafetyTips')}</Text>
                    <View style={[styles.precautionCard, { backgroundColor: isDark ? theme.card : '#FFFFFF', borderColor: theme.border }]}>
                        <Ionicons name="lock-closed" size={20} color="#B0A4F1" style={{ marginRight: 12 }} />
                        <Text style={[styles.precautionText, { color: theme.text }]}>{t('strongPasswords')}</Text>
                    </View>
                    <View style={[styles.precautionCard, { backgroundColor: isDark ? theme.card : '#FFFFFF', borderColor: theme.border }]}>
                        <Ionicons name="location" size={20} color="#38BDF8" style={{ marginRight: 12 }} />
                        <Text style={[styles.precautionText, { color: theme.text }]}>{t('disableLocation')}</Text>
                    </View>
                </View>
            </ScrollView>
            <View style={{ height: insets.bottom, backgroundColor: theme.background, width: '100%', zIndex: 10 }} />

            {/* --- GUIDE MODAL --- */}
            <Modal
                visible={!!selectedCategory}
                transparent
                animationType="slide"
                onRequestClose={() => setSelectedCategory(null)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: isDark ? '#0B0914' : '#FFFFFF', borderColor: theme.border }]}>
                        <View style={[styles.modalHeader, { borderBottomColor: theme.border }]}>
                            <View style={[styles.modalIcon, { backgroundColor: (selectedCategory?.color || '#38BDF8') + '20' }]}>
                                <Ionicons name={selectedCategory?.icon as any} size={24} color={selectedCategory?.color || '#38BDF8'} />
                            </View>
                            <Text style={[styles.modalTitle, { color: theme.text }]}>{selectedCategory?.title}</Text>
                            <TouchableOpacity onPress={() => setSelectedCategory(null)}>
                                <Ionicons name="close-circle" size={24} color={theme.textSecondary} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.stepsScroll} showsVerticalScrollIndicator={false}>
                            <Text style={[styles.guideIntro, { color: theme.textSecondary }]}>{t('guidedRecommendations')}</Text>
                            {selectedCategory?.guide.map((step, idx) => (
                                <View key={idx} style={[styles.stepRow, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : '#F9FAFB', borderColor: theme.border }]}>
                                    <View style={[styles.stepNumber, { backgroundColor: selectedCategory?.color || '#38BDF8' }]}>
                                        <Text style={[styles.stepNumberText, { color: isDark ? '#000' : '#FFF' }]}>{idx + 1}</Text>
                                    </View>
                                    <Text style={[styles.stepText, { color: theme.text }]}>{step}</Text>
                                </View>
                            ))}
                        </ScrollView>

                        <View style={styles.modalFooter}>
                            <TouchableOpacity
                                style={[styles.primaryBtn, { backgroundColor: selectedCategory?.color || '#38BDF8' }]}
                                onPress={() => {
                                    const catName = selectedCategory?.title;
                                    setSelectedCategory(null);
                                    router.push({
                                        pathname: '/moods/counselor-chat',
                                        params: {
                                            name: 'Cyber Support Specialist',
                                            type: 'Cyber Incident',
                                            category: catName
                                        }
                                    } as any);
                                }}
                                activeOpacity={0.85}
                            >
                                <Ionicons name="shield-checkmark" size={18} color={isDark ? "#000" : "#FFF"} style={{ marginRight: 6 }} />
                                <Text style={[styles.primaryBtnText, { color: isDark ? '#000' : '#FFF' }]}>GET EXPERT HELP</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.closeBtn} onPress={() => setSelectedCategory(null)}>
                                <Text style={[styles.closeBtnText, { color: theme.textSecondary }]}>{t('goBack')}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
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
        justifyContent: 'space-between',
        paddingHorizontal: 18,
        paddingBottom: 12,
        borderBottomWidth: 1,
        zIndex: 10,
    },
    backButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
    },
    headerTitleGroup: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    sosButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        paddingHorizontal: 18,
        paddingTop: 18,
    },
    heroCard: {
        borderRadius: 22,
        padding: 20,
        borderWidth: 1,
        marginBottom: 16,
    },
    heroBadgeRow: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    heroBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        borderWidth: 1,
    },
    heroBadgeText: {
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: 0.8,
    },
    heroTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 6,
    },
    heroSub: {
        fontSize: 13,
        lineHeight: 19,
    },
    grid: {
        gap: 10,
        marginBottom: 16,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 18,
        padding: 14,
        borderWidth: 1,
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardContent: {
        flex: 1,
        marginLeft: 12,
        marginRight: 8,
    },
    cardTitle: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    cardDesc: {
        fontSize: 11,
        marginTop: 2,
    },
    evidenceCard: {
        borderRadius: 20,
        padding: 16,
        borderWidth: 1,
        marginBottom: 16,
    },
    evidenceHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    evidenceTitle: {
        fontSize: 15,
        fontWeight: 'bold',
    },
    evidenceSub: {
        fontSize: 11,
        marginBottom: 12,
    },
    evidenceList: {
        gap: 8,
    },
    evidenceItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 14,
        borderWidth: 1,
    },
    checkboxCircle: {
        width: 18,
        height: 18,
        borderRadius: 9,
        borderWidth: 1.5,
        borderColor: '#9CA3AF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    evidenceLabel: {
        fontSize: 12,
        flex: 1,
        fontWeight: '500',
    },
    helpRow: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 16,
    },
    helpButton: {
        flex: 1,
        borderRadius: 18,
        padding: 14,
        borderWidth: 1,
        alignItems: 'center',
    },
    helpIcon: {
        width: 42,
        height: 42,
        borderRadius: 21,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    helpLabel: {
        fontSize: 13,
        fontWeight: 'bold',
    },
    helpSub: {
        fontSize: 11,
        marginTop: 2,
    },
    precautionSection: {
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    precautionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        borderRadius: 16,
        borderWidth: 1,
        marginBottom: 8,
    },
    precautionText: {
        fontSize: 13,
        fontWeight: '500',
        flex: 1,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        maxHeight: '80%',
        padding: 24,
        borderWidth: 1,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: 16,
        borderBottomWidth: 1,
        marginBottom: 16,
    },
    modalIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    modalTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        flex: 1,
    },
    guideIntro: {
        fontSize: 12,
        marginBottom: 14,
    },
    stepsScroll: {
        marginBottom: 16,
    },
    stepRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 14,
        borderWidth: 1,
        marginBottom: 8,
    },
    stepNumber: {
        width: 22,
        height: 22,
        borderRadius: 11,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    stepNumberText: {
        fontSize: 11,
        fontWeight: 'bold',
    },
    stepText: {
        flex: 1,
        fontSize: 13,
        lineHeight: 18,
    },
    modalFooter: {
        gap: 8,
    },
    primaryBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderRadius: 16,
    },
    primaryBtnText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    closeBtn: {
        alignItems: 'center',
        paddingVertical: 10,
    },
    closeBtnText: {
        fontSize: 13,
        fontWeight: '600',
    }
});
