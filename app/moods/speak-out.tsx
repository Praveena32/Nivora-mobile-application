import NightSkyBackground from '@/components/NightSkyBackground';
import { useLanguage } from '@/constants/LanguageContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Linking,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type SupportCategory = {
    id: string;
    title: string;
    desc: string;
    icon: string;
    color: string;
    guide: string[];
};

export default function SpeakOutHub() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { t } = useLanguage();
    const [selectedCategory, setSelectedCategory] = useState<SupportCategory | null>(null);

    const CATEGORIES: SupportCategory[] = [
        {
            id: 'ragging',
            title: t('raggingTitle'),
            desc: t('raggingDesc'),
            icon: 'shield-outline',
            color: '#FF8A8A',
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
            color: '#82E9FF',
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
        Linking.openURL('tel:1919'); // Student support/Police link
    };

    const handleChatSupport = () => {
        if (selectedCategory) {
            router.push({
                pathname: '/moods/counselor-chat',
                params: {
                    name: 'Incident Support Staff',
                    type: 'Incident Support',
                    category: selectedCategory.title
                }
            } as any);
        }
    };

    return (
        <View style={styles.container}>
            <NightSkyBackground />

            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={28} color="#FF8A8A" />
                </TouchableOpacity>
                <Text style={styles.title}>{t('speakOutHub')}</Text>
                <TouchableOpacity
                    style={styles.exitButton}
                    onPress={() => router.replace('/(tabs)')}
                >
                    <Text style={styles.exitText}>{t('quickExit')}</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={[styles.content, { paddingBottom: 100 }]} showsVerticalScrollIndicator={false}>
                {/* Hero Section */}
                <View style={styles.heroSection}>
                    <View style={styles.badge}>
                        <Ionicons name="shield-checkmark" size={14} color="#FF8A8A" />
                        <Text style={styles.badgeText}>{t('incidentSupport')}</Text>
                    </View>
                    <Text style={styles.heroSub}>
                        {t('speakOutHeroSub')}
                    </Text>
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
                            <Text style={styles.cardTitle}>{cat.title}</Text>
                            <Text style={styles.cardDesc}>{cat.desc}</Text>
                            <View style={styles.cardFooter}>
                                <Text style={[styles.viewGuide, { color: cat.color }]}>View Guide</Text>
                                <Ionicons name="arrow-forward" size={16} color={cat.color} />
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Direct Help */}
                <View style={styles.directHelpSection}>
                    <Text style={styles.sectionTitle}>{t('directHelp')}</Text>
                    <View style={styles.helpRow}>
                        <TouchableOpacity style={styles.helpButton} onPress={handleCallStaff}>
                            <View style={[styles.helpIcon, { backgroundColor: '#FF8A8A20' }]}>
                                <Ionicons name="call" size={24} color="#FF8A8A" />
                            </View>
                            <Text style={styles.helpLabel}>{t('callStaff')}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.helpButton}
                            onPress={() => router.push('/moods/counselor-chat' as any)}
                        >
                            <View style={[styles.helpIcon, { backgroundColor: '#B0A4F120' }]}>
                                <Ionicons name="chatbubbles" size={24} color="#B0A4F1" />
                            </View>
                            <Text style={styles.helpLabel}>{t('chatHelp')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>

            {/* Guide Modal */}
            <Modal
                visible={!!selectedCategory}
                transparent
                animationType="slide"
                onRequestClose={() => setSelectedCategory(null)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={[styles.modalHeader, { borderColor: (selectedCategory?.color || '#FFF') + '40' }]}>
                            <View style={[styles.modalIcon, { backgroundColor: (selectedCategory?.color || '#FFF') + '15' }]}>
                                <Ionicons name={selectedCategory?.icon as any} size={24} color={selectedCategory?.color} />
                            </View>
                            <Text style={styles.modalTitle}>{selectedCategory?.title}</Text>
                        </View>

                        <ScrollView style={styles.modalBody}>
                            <Text style={styles.guideIntro}>{t('guidedRecommendations')}</Text>
                            {selectedCategory?.guide.map((step, idx) => (
                                <View key={idx} style={styles.stepRow}>
                                    <View style={[styles.stepNumber, { backgroundColor: selectedCategory?.color }]}>
                                        <Text style={styles.stepNumberText}>{idx + 1}</Text>
                                    </View>
                                    <Text style={styles.stepText}>{step}</Text>
                                </View>
                            ))}
                        </ScrollView>

                        <View style={styles.modalFooter}>
                            <TouchableOpacity
                                style={[styles.reportButton, { backgroundColor: selectedCategory?.color }]}
                                onPress={() => {
                                    setSelectedCategory(null);
                                    router.push('/moods/counselor-chat' as any);
                                }}
                            >
                                <Text style={styles.reportButtonText}>{t('reportIncident')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => setSelectedCategory(null)}
                            >
                                <Text style={styles.closeButtonText}>{t('goBack')}</Text>
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
        borderRadius: 22,
        backgroundColor: 'rgba(255,138,138,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFF',
    },
    exitButton: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    exitText: {
        color: '#FF8A8A',
        fontSize: 12,
        fontWeight: 'bold',
    },
    content: {
        padding: 24,
    },
    heroSection: {
        marginBottom: 32,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,138,138,0.1)',
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        marginBottom: 12,
    },
    badgeText: {
        color: '#FF8A8A',
        fontSize: 11,
        fontWeight: 'bold',
        marginLeft: 6,
        textTransform: 'uppercase',
    },
    heroSub: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 16,
        lineHeight: 24,
    },
    grid: {
        gap: 20,
    },
    card: {
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 24,
        padding: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    iconContainer: {
        width: 56,
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    cardTitle: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    cardDesc: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 13,
        lineHeight: 18,
        marginBottom: 16,
    },
    cardFooter: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    viewGuide: {
        fontSize: 13,
        fontWeight: 'bold',
        marginRight: 6,
    },
    directHelpSection: {
        marginTop: 40,
    },
    sectionTitle: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    helpRow: {
        flexDirection: 'row',
        gap: 16,
    },
    helpButton: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.02)',
        borderRadius: 20,
        padding: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    helpIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    helpLabel: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: '600',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.85)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#0A0A15',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        minHeight: '70%',
        padding: 24,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
        paddingBottom: 20,
        borderBottomWidth: 1,
    },
    modalIcon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    modalTitle: {
        color: '#FFF',
        fontSize: 20,
        fontWeight: 'bold',
    },
    modalBody: {
        marginBottom: 24,
    },
    guideIntro: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 14,
        marginBottom: 20,
    },
    stepRow: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    stepNumber: {
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
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
        fontSize: 15,
        lineHeight: 22,
    },
    modalFooter: {
        gap: 12,
    },
    reportButton: {
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    reportButtonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: 'bold',
    },
    closeButton: {
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButtonText: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 14,
        fontWeight: '600',
    }
});
