import NightSkyBackground from '@/components/NightSkyBackground';
import { useLanguage } from '@/constants/LanguageContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type CyberCategory = {
    id: string;
    title: string;
    desc: string;
    icon: string;
    color: string;
    guide: string[];
};

export default function CyberGuardScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { t } = useLanguage();
    const [selectedCategory, setSelectedCategory] = useState<CyberCategory | null>(null);

    const CATEGORIES: CyberCategory[] = [
        {
            id: 'blackmail',
            title: t('onlineBlackmail'),
            desc: t('blackmailDesc'),
            icon: 'eye-off-outline',
            color: '#FF8A8A',
            guide: [
                t('blackmailStep1'),
                t('blackmailStep2'),
                t('blackmailStep3'),
                t('blackmailStep4'),
                t('blackmailStep5'),
            ]
        },
        {
            id: 'scams',
            title: t('scamAwareness'),
            desc: t('scamDesc'),
            icon: 'card-outline',
            color: '#B0A4F1',
            guide: [
                t('scamStep1'),
                t('scamStep2'),
                t('scamStep3'),
                t('scamStep4'),
                t('scamStep5'),
            ]
        },
        {
            id: 'privacy',
            title: t('privacyAbuse'),
            desc: t('privacyDesc'),
            icon: 'lock-closed-outline',
            color: '#82E9FF',
            guide: [
                t('privacyStep1'),
                t('privacyStep2'),
                t('privacyStep3'),
                t('privacyStep4'),
                t('privacyStep5'),
            ]
        }
    ];

    const EVIDENCE_CHECKLIST = [
        { label: t('evidenceThreats'), icon: 'camera-outline' },
        { label: t('evidenceHistory'), icon: 'list-outline' },
        { label: t('evidenceSessions'), icon: 'time-outline' },
    ];

    return (
        <View style={styles.container}>
            <NightSkyBackground />

            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={28} color="#82E9FF" />
                </TouchableOpacity>
                <Text style={styles.title}>{t('cyberGuardTitle')}</Text>
                <TouchableOpacity
                    style={styles.sosButton}
                    onPress={() => router.push('/moods/counselor-chat' as any)}
                >
                    <Ionicons name="shield" size={20} color="#000" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={[styles.content, { paddingBottom: 100 }]} showsVerticalScrollIndicator={false}>
                {/* Hero */}
                <View style={styles.heroSection}>
                    <View style={styles.techBadge}>
                        <Ionicons name="pulse" size={14} color="#82E9FF" />
                        <Text style={styles.techBadgeText}>ENCRYPTED SUPPORT</Text>
                    </View>
                    <Text style={styles.heroTitle}>{t('cyberGuardTitle')}</Text>
                    <Text style={styles.heroSub}>{t('cyberHeroSub')}</Text>
                </View>

                {/* Categories */}
                <View style={styles.grid}>
                    {CATEGORIES.map((cat) => (
                        <TouchableOpacity
                            key={cat.id}
                            style={styles.card}
                            onPress={() => setSelectedCategory(cat)}
                        >
                            <View style={[styles.iconContainer, { backgroundColor: cat.color + '15' }]}>
                                <Ionicons name={cat.icon as any} size={32} color={cat.color} />
                            </View>
                            <View style={styles.cardContent}>
                                <Text style={styles.cardTitle}>{cat.title}</Text>
                                <Text style={styles.cardDesc}>{cat.desc}</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.2)" />
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Evidence Helper */}
                <View style={styles.evidenceSection}>
                    <Text style={styles.sectionTitle}>{t('evidenceChecklist')}</Text>
                    <View style={styles.evidenceRow}>
                        {EVIDENCE_CHECKLIST.map((item, idx) => (
                            <View key={idx} style={styles.evidenceItem}>
                                <View style={styles.evidenceIcon}>
                                    <Ionicons name={item.icon as any} size={24} color="#82E9FF" />
                                </View>
                                <Text style={styles.evidenceLabel}>{item.label}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Cyber Precautions */}
                <View style={styles.precautionSection}>
                    <Text style={styles.sectionTitle}>{t('digitalSafetyTips')}</Text>
                    <TouchableOpacity style={styles.precautionCard}>
                        <Ionicons name="lock-closed-outline" size={24} color="#B0A4F1" />
                        <Text style={styles.precautionText}>{t('strongPasswords')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.precautionCard}>
                        <Ionicons name="location-outline" size={24} color="#82E9FF" />
                        <Text style={styles.precautionText}>{t('disableLocation')}</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Guide Modal */}
            <Modal
                visible={!!selectedCategory}
                transparent
                animationType="fade"
                onRequestClose={() => setSelectedCategory(null)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalBody}>
                        <View style={styles.modalHeader}>
                            <View style={[styles.modalIcon, { backgroundColor: selectedCategory?.color + '15' }]}>
                                <Ionicons name={selectedCategory?.icon as any} size={28} color={selectedCategory?.color} />
                            </View>
                            <Text style={styles.modalTitle}>{selectedCategory?.title}</Text>
                        </View>

                        <Text style={styles.guideIntro}>{t('guidedRecommendations')}</Text>
                        <ScrollView style={styles.stepsScroll}>
                            {selectedCategory?.guide.map((step, idx) => (
                                <View key={idx} style={styles.stepRow}>
                                    <View style={[styles.stepNumber, { backgroundColor: selectedCategory?.color }]}>
                                        <Text style={styles.stepNumberText}>{idx + 1}</Text>
                                    </View>
                                    <Text style={styles.stepText}>{step}</Text>
                                </View>
                            ))}
                        </ScrollView>

                        <TouchableOpacity
                            style={[styles.primaryBtn, { backgroundColor: selectedCategory?.color }]}
                            onPress={() => {
                                setSelectedCategory(null);
                                router.push('/moods/counselor-chat' as any);
                            }}
                        >
                            <Text style={styles.primaryBtnText}>GET EXPERT HELP</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.closeBtn} onPress={() => setSelectedCategory(null)}>
                            <Text style={styles.closeBtnText}>{t('goBack')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#050510'
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        zIndex: 10,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 15,
        backgroundColor: 'rgba(130,233,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFF',
    },
    sosButton: {
        width: 44,
        height: 44,
        borderRadius: 15,
        backgroundColor: '#82E9FF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        padding: 24,
    },
    heroSection: {
        marginBottom: 32,
    },
    techBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(130,233,255,0.1)',
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 10,
        marginBottom: 16,
    },
    techBadgeText: {
        color: '#82E9FF',
        fontSize: 10,
        fontWeight: 'bold',
        marginLeft: 8,
        letterSpacing: 1,
    },
    heroTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 8,
    },
    heroSub: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.5)',
        lineHeight: 24,
    },
    grid: {
        gap: 16,
        marginBottom: 40,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 24,
        padding: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    iconContainer: {
        width: 56,
        height: 56,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardContent: {
        flex: 1,
        marginLeft: 16,
    },
    cardTitle: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    cardDesc: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 12,
        marginTop: 4,
    },
    evidenceSection: {
        marginBottom: 40,
    },
    sectionTitle: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        marginBottom: 20,
        opacity: 0.5,
    },
    evidenceRow: {
        flexDirection: 'row',
        gap: 12,
    },
    evidenceItem: {
        flex: 1,
        backgroundColor: 'rgba(130,233,255,0.05)',
        borderRadius: 20,
        padding: 16,
        alignItems: 'center',
    },
    evidenceIcon: {
        marginBottom: 12,
    },
    evidenceLabel: {
        color: '#FFF',
        fontSize: 10,
        textAlign: 'center',
        fontWeight: '600',
    },
    precautionSection: {
        marginBottom: 20,
    },
    precautionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.02)',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        gap: 16,
    },
    precautionText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '500',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.9)',
        justifyContent: 'center',
        padding: 24,
    },
    modalBody: {
        backgroundColor: '#0A0A1F',
        borderRadius: 32,
        padding: 24,
        maxHeight: '80%',
        borderWidth: 1,
        borderColor: 'rgba(130,233,255,0.2)',
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
        gap: 16,
    },
    modalIcon: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalTitle: {
        color: '#FFF',
        fontSize: 20,
        fontWeight: 'bold',
    },
    guideIntro: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 16,
        textTransform: 'uppercase',
    },
    stepsScroll: {
        marginBottom: 24,
    },
    stepRow: {
        flexDirection: 'row',
        marginBottom: 16,
        gap: 16,
    },
    stepNumber: {
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 2,
    },
    stepNumberText: {
        color: '#000',
        fontSize: 12,
        fontWeight: 'bold',
    },
    stepText: {
        flex: 1,
        color: '#FFF',
        fontSize: 14,
        lineHeight: 20,
    },
    primaryBtn: {
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    primaryBtnText: {
        color: '#000',
        fontSize: 14,
        fontWeight: 'bold',
    },
    closeBtn: {
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8,
    },
    closeBtnText: {
        color: 'rgba(255,255,255,0.3)',
        fontSize: 13,
    }
});
