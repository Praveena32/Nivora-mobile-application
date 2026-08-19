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
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

type SupportCategory = {
    id: string;
    title: string;
    desc: string;
    icon: string;
    color: string;
    guide: string[];
};

export default function SpeakOutScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { theme: themeName, isDark } = useTheme();
    const theme = Colors[themeName];
    const { t } = useLanguage();

    const [selectedCategory, setSelectedCategory] = useState<SupportCategory | null>(null);

    const CATEGORIES: SupportCategory[] = [
        {
            id: 'ragging',
            title: t('raggingTitle'),
            desc: t('raggingDesc'),
            icon: 'shield-half-outline',
            color: '#FF6B6B',
            guide: [
                t('raggingStep1'),
                t('raggingStep2'),
                t('raggingStep3'),
                t('raggingStep4'),
                t('raggingStep5'),
            ]
        },
        {
            id: 'domestic',
            title: t('domesticTitle'),
            desc: t('domesticDesc'),
            icon: 'home-outline',
            color: '#B0A4F1',
            guide: [
                t('domesticStep1'),
                t('domesticStep2'),
                t('domesticStep3'),
                t('domesticStep4'),
                t('domesticStep5'),
            ]
        },
        {
            id: 'harassment',
            title: t('harassmentTitle'),
            desc: t('harassmentDesc'),
            icon: 'warning-outline',
            color: '#38BDF8',
            guide: [
                t('harassmentStep1'),
                t('harassmentStep2'),
                t('harassmentStep3'),
                t('harassmentStep4'),
                t('harassmentStep5'),
            ]
        }
    ];

    const handleCallStaff = () => {
        Linking.openURL('tel:1919');
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <NightSkyBackground />
            <View style={{ height: insets.top, backgroundColor: theme.background, width: '100%', position: 'absolute', top: 0, zIndex: 10 }} />

            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top + 12, borderBottomColor: theme.border, backgroundColor: isDark ? 'rgba(7, 6, 20, 0.75)' : 'rgba(255, 255, 255, 0.85)' }]}>
                <TouchableOpacity onPress={() => router.back()} style={[styles.backButton, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)', borderColor: theme.border }]}>
                    <Ionicons name="chevron-back" size={24} color="#FF6B6B" />
                </TouchableOpacity>

                <View style={styles.headerTitleGroup}>
                    <Ionicons name="megaphone" size={18} color="#FF6B6B" style={{ marginRight: 6 }} />
                    <Text style={[styles.title, { color: theme.text }]}>{t('speakOutHub')}</Text>
                </View>

                <TouchableOpacity
                    style={[styles.exitButton, { backgroundColor: isDark ? 'rgba(255, 107, 107, 0.18)' : 'rgba(255, 107, 107, 0.12)', borderColor: 'rgba(255, 107, 107, 0.3)' }]}
                    onPress={() => router.replace('/(tabs)')}
                    activeOpacity={0.8}
                >
                    <Ionicons name="exit-outline" size={14} color="#FF6B6B" style={{ marginRight: 4 }} />
                    <Text style={[styles.exitText, { color: '#FF6B6B' }]}>{t('quickExit')}</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={[styles.content, { paddingBottom: 24 }]} showsVerticalScrollIndicator={false}>
                {/* 1. Hero Sanctuary Banner */}
                <View style={[styles.heroCard, { backgroundColor: isDark ? 'rgba(255, 107, 107, 0.10)' : 'rgba(255, 107, 107, 0.06)', borderColor: isDark ? 'rgba(255, 107, 107, 0.28)' : 'rgba(255, 107, 107, 0.22)' }]}>
                    <View style={styles.heroBadgeRow}>
                        <View style={[styles.heroBadge, { backgroundColor: 'rgba(255, 107, 107, 0.2)', borderColor: 'rgba(255, 107, 107, 0.4)' }]}>
                            <Ionicons name="shield-checkmark" size={12} color="#FF6B6B" style={{ marginRight: 4 }} />
                            <Text style={[styles.heroBadgeText, { color: isDark ? '#FFC0C0' : '#C53030' }]}>{t('incidentSupport')}</Text>
                        </View>
                    </View>
                    <Text style={[styles.heroTitle, { color: theme.text }]}>Safe & Anonymous Portal</Text>
                    <Text style={[styles.heroSub, { color: theme.textSecondary }]}>{t('speakOutHeroSub')}</Text>
                </View>

                {/* 2. Support Categories Grid */}
                <View style={styles.grid}>
                    {CATEGORIES.map((cat) => (
                        <TouchableOpacity
                            key={cat.id}
                            style={[styles.card, { backgroundColor: isDark ? theme.card : '#FFFFFF', borderColor: theme.border }]}
                            onPress={() => setSelectedCategory(cat)}
                            activeOpacity={0.82}
                        >
                            <View style={[styles.iconContainer, { backgroundColor: cat.color + (isDark ? '20' : '15') }]}>
                                <Ionicons name={cat.icon as any} size={28} color={cat.color} />
                            </View>
                            <View style={styles.cardTextContent}>
                                <Text style={[styles.cardTitle, { color: theme.text }]}>{cat.title}</Text>
                                <Text style={[styles.cardDesc, { color: theme.textSecondary }]}>{cat.desc}</Text>
                            </View>
                            <View style={styles.cardFooterRow}>
                                <Text style={[styles.viewGuide, { color: cat.color }]}>View Action Guide</Text>
                                <Ionicons name="arrow-forward" size={14} color={cat.color} />
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* 3. Direct Emergency & Support Channels */}
                <View style={styles.directHelpSection}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('directHelp')}</Text>
                    <View style={styles.helpRow}>
                        <TouchableOpacity
                            style={[styles.helpButton, { backgroundColor: isDark ? theme.card : '#FFFFFF', borderColor: theme.border }]}
                            onPress={handleCallStaff}
                            activeOpacity={0.8}
                        >
                            <View style={[styles.helpIcon, { backgroundColor: 'rgba(255, 107, 107, 0.15)' }]}>
                                <Ionicons name="call" size={22} color="#FF6B6B" />
                            </View>
                            <Text style={[styles.helpLabel, { color: theme.text }]}>{t('callStaff')}</Text>
                            <Text style={[styles.helpSub, { color: theme.textSecondary }]}>Emergency 1919</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.helpButton, { backgroundColor: isDark ? theme.card : '#FFFFFF', borderColor: theme.border }]}
                            onPress={() => router.push({
                                pathname: '/moods/counselor-chat',
                                params: { name: 'Incident Support Staff', type: 'Incident Support' }
                            } as any)}
                            activeOpacity={0.8}
                        >
                            <View style={[styles.helpIcon, { backgroundColor: 'rgba(176, 164, 241, 0.15)' }]}>
                                <Ionicons name="chatbubbles" size={22} color="#B0A4F1" />
                            </View>
                            <Text style={[styles.helpLabel, { color: theme.text }]}>{t('chatHelp')}</Text>
                            <Text style={[styles.helpSub, { color: theme.textSecondary }]}>Confidential Chat</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Legal & Rights Directory Button */}
                    <TouchableOpacity
                        style={[styles.rightsBanner, { backgroundColor: isDark ? 'rgba(56, 189, 248, 0.10)' : 'rgba(56, 189, 248, 0.06)', borderColor: isDark ? 'rgba(56, 189, 248, 0.28)' : 'rgba(56, 189, 248, 0.20)' }]}
                        onPress={() => router.push('/moods/justice-rights-chat' as any)}
                        activeOpacity={0.85}
                    >
                        <Ionicons name="scale-outline" size={22} color="#38BDF8" style={{ marginRight: 12 }} />
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.rightsTitle, { color: theme.text }]}>Know Your Legal Rights</Text>
                            <Text style={[styles.rightsSub, { color: theme.textSecondary }]}>Anti-ragging, domestic safety & legal protection laws</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color="#38BDF8" />
                    </TouchableOpacity>
                </View>
            </ScrollView>
            <View style={{ height: insets.bottom, backgroundColor: theme.background, width: '100%', zIndex: 10 }} />

            {/* --- ACTION GUIDE MODAL --- */}
            <Modal
                visible={!!selectedCategory}
                transparent
                animationType="slide"
                onRequestClose={() => setSelectedCategory(null)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: isDark ? '#0B0914' : '#FFFFFF', borderColor: theme.border }]}>
                        <View style={[styles.modalHeader, { borderBottomColor: theme.border }]}>
                            <View style={[styles.modalIconCircle, { backgroundColor: (selectedCategory?.color || '#FF6B6B') + '20' }]}>
                                <Ionicons name={selectedCategory?.icon as any} size={24} color={selectedCategory?.color || '#FF6B6B'} />
                            </View>
                            <Text style={[styles.modalTitle, { color: theme.text }]}>{selectedCategory?.title}</Text>
                            <TouchableOpacity onPress={() => setSelectedCategory(null)}>
                                <Ionicons name="close-circle" size={24} color={theme.textSecondary} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                            <Text style={[styles.guideIntro, { color: theme.textSecondary }]}>{t('guidedRecommendations')}</Text>
                            {selectedCategory?.guide.map((step, idx) => (
                                <View key={idx} style={[styles.stepRow, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : '#F9FAFB', borderColor: theme.border }]}>
                                    <View style={[styles.stepNumber, { backgroundColor: selectedCategory?.color || '#FF6B6B' }]}>
                                        <Text style={[styles.stepNumberText, { color: isDark ? '#000' : '#FFF' }]}>{idx + 1}</Text>
                                    </View>
                                    <Text style={[styles.stepText, { color: theme.text }]}>{step}</Text>
                                </View>
                            ))}
                        </ScrollView>

                        <View style={styles.modalFooter}>
                            <TouchableOpacity
                                style={[styles.reportButton, { backgroundColor: selectedCategory?.color || '#FF6B6B' }]}
                                onPress={() => {
                                    const catName = selectedCategory?.title;
                                    setSelectedCategory(null);
                                    router.push({
                                        pathname: '/moods/counselor-chat',
                                        params: {
                                            name: 'Incident Support Staff',
                                            type: 'Incident Support',
                                            category: catName
                                        }
                                    } as any);
                                }}
                                activeOpacity={0.85}
                            >
                                <Ionicons name="shield-checkmark" size={18} color={isDark ? "#000" : "#FFF"} style={{ marginRight: 6 }} />
                                <Text style={[styles.reportButtonText, { color: isDark ? '#000' : '#FFF' }]}>{t('reportIncident')}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => setSelectedCategory(null)}
                            >
                                <Text style={[styles.closeButtonText, { color: theme.textSecondary }]}>{t('goBack')}</Text>
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
    exitButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 12,
        borderWidth: 1,
    },
    exitText: {
        fontSize: 11,
        fontWeight: 'bold',
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
        gap: 12,
        marginBottom: 18,
    },
    card: {
        borderRadius: 20,
        padding: 16,
        borderWidth: 1,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    cardTextContent: {
        marginBottom: 12,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    cardDesc: {
        fontSize: 12,
        lineHeight: 17,
    },
    cardFooterRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    viewGuide: {
        fontSize: 12,
        fontWeight: 'bold',
        marginRight: 4,
    },
    directHelpSection: {
        marginTop: 6,
    },
    sectionTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    helpRow: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 12,
    },
    helpButton: {
        flex: 1,
        borderRadius: 18,
        padding: 14,
        borderWidth: 1,
        alignItems: 'center',
    },
    helpIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
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
    rightsBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        borderRadius: 18,
        borderWidth: 1,
    },
    rightsTitle: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    rightsSub: {
        fontSize: 11,
        marginTop: 2,
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
    modalIconCircle: {
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
    modalBody: {
        marginBottom: 16,
    },
    guideIntro: {
        fontSize: 12,
        marginBottom: 14,
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
    reportButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderRadius: 16,
    },
    reportButtonText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    closeButton: {
        alignItems: 'center',
        paddingVertical: 10,
    },
    closeButtonText: {
        fontSize: 13,
        fontWeight: '600',
    }
});
