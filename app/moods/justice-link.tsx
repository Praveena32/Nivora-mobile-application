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

type JusticeCategory = {
    id: string;
    title: string;
    desc: string;
    icon: string;
    color: string;
    info: string[];
    contacts?: { name: string; type: string; contact: string }[];
};

export default function JusticeLinkScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { theme: themeName, isDark } = useTheme();
    const theme = Colors[themeName];
    const { t } = useLanguage();
    const [selectedCat, setSelectedCat] = useState<JusticeCategory | null>(null);

    const JUSTICE_CATEGORIES: JusticeCategory[] = [
        {
            id: 'rights',
            title: t('legalInfoBasics'),
            desc: t('legalInfoDesc'),
            icon: 'book-outline',
            color: '#E53E3E',
            info: [
                t('rightsInfo1'),
                t('rightsInfo2'),
                t('rightsInfo3'),
                t('rightsInfo4'),
            ]
        },
        {
            id: 'complaints',
            title: t('howToFileComplaints'),
            desc: t('complaintsDesc'),
            icon: 'document-text-outline',
            color: '#9333EA',
            info: [
                t('complaintsInfo1'),
                t('complaintsInfo2'),
                t('complaintsInfo3'),
                t('complaintsInfo4'),
            ]
        },
        {
            id: 'protection',
            title: t('protectionUnitsTitle'),
            desc: t('protectionUnitsDesc'),
            icon: 'shield-half-outline',
            color: '#2563EB',
            info: [
                t('protectionInfo1'),
                t('protectionInfo2'),
                t('protectionInfo3'),
            ],
            contacts: [
                { name: 'University Safety Cell', type: 'Official', contact: '1234-567-890' },
                { name: 'Local Women\'s Unit', type: 'Authority', contact: '0987-654-321' }
            ]
        },
        {
            id: 'directory',
            title: t('ngoHotlineDirectory'),
            desc: t('directoryDesc'),
            icon: 'call-outline',
            color: '#16A34A',
            info: [
                t('directoryInfo1'),
                t('directoryInfo2'),
                t('directoryInfo3'),
            ],
            contacts: [
                { name: 'Legal Aid Society', type: 'NGO', contact: 'Aid-Legal-101' },
                { name: 'Women\'s Helpline', type: 'Emergency', contact: '1919' },
                { name: 'Child Safety Line', type: 'Emergency', contact: '1098' }
            ]
        }
    ];

    const handleCall = (number: string) => {
        Linking.openURL(`tel:${number}`);
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <NightSkyBackground />
            <View style={{ height: insets.top, backgroundColor: theme.background, width: '100%', position: 'absolute', top: 0, zIndex: 10 }} />

            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top + 12, borderBottomColor: theme.border, backgroundColor: isDark ? 'rgba(7, 6, 20, 0.75)' : 'rgba(255, 255, 255, 0.85)' }]}>
                <TouchableOpacity onPress={() => router.back()} style={[styles.backButton, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)', borderColor: theme.border }]}>
                    <Ionicons name="chevron-back" size={24} color="#E53E3E" />
                </TouchableOpacity>

                <View style={styles.headerTitleGroup}>
                    <Ionicons name="scale-outline" size={18} color="#E53E3E" style={{ marginRight: 6 }} />
                    <Text style={[styles.title, { color: theme.text }]}>{t('justiceLinkTitle')}</Text>
                </View>

                <TouchableOpacity
                    style={[styles.exitButton, { backgroundColor: isDark ? 'rgba(229, 62, 62, 0.18)' : 'rgba(229, 62, 62, 0.12)', borderColor: 'rgba(229, 62, 62, 0.3)' }]}
                    onPress={() => router.replace('/(tabs)')}
                    activeOpacity={0.8}
                >
                    <Ionicons name="exit-outline" size={14} color="#E53E3E" style={{ marginRight: 4 }} />
                    <Text style={[styles.exitText, { color: '#E53E3E' }]}>{t('quickExit')}</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={[styles.content, { paddingBottom: 24 }]} showsVerticalScrollIndicator={false}>
                {/* 1. Hero Legal Banner */}
                <View style={[styles.heroCard, { backgroundColor: isDark ? 'rgba(229, 62, 62, 0.10)' : 'rgba(229, 62, 62, 0.06)', borderColor: isDark ? 'rgba(229, 62, 62, 0.28)' : 'rgba(229, 62, 62, 0.22)' }]}>
                    <View style={styles.heroBadgeRow}>
                        <View style={[styles.heroBadge, { backgroundColor: 'rgba(229, 62, 62, 0.2)', borderColor: 'rgba(229, 62, 62, 0.4)' }]}>
                            <Ionicons name="document-text" size={12} color="#E53E3E" style={{ marginRight: 4 }} />
                            <Text style={[styles.heroBadgeText, { color: isDark ? '#FEB2B2' : '#9B2C2C' }]}>LEGAL ASSISTANCE PORTAL</Text>
                        </View>
                    </View>
                    <Text style={[styles.heroTitle, { color: theme.text }]}>{t('legalOfficialHelp')}</Text>
                    <Text style={[styles.heroSub, { color: theme.textSecondary }]}>{t('justiceHeroSub')}</Text>
                </View>

                {/* 2. Justice Pillars 2-Column Grid */}
                <View style={styles.grid}>
                    {JUSTICE_CATEGORIES.map(cat => (
                        <TouchableOpacity
                            key={cat.id}
                            style={[styles.card, { backgroundColor: isDark ? theme.card : '#FFFFFF', borderColor: theme.border }]}
                            onPress={() => setSelectedCat(cat)}
                            activeOpacity={0.82}
                        >
                            <View style={[styles.iconBox, { backgroundColor: cat.color + (isDark ? '20' : '15') }]}>
                                <Ionicons name={cat.icon as any} size={24} color={cat.color} />
                            </View>
                            <Text style={[styles.cardTitle, { color: theme.text }]} numberOfLines={2}>{cat.title}</Text>
                            <Text style={[styles.cardDesc, { color: theme.textSecondary }]} numberOfLines={2}>{cat.desc}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* 3. Emergency National Helplines Bar */}
                <View style={[styles.hotlineSection, { backgroundColor: isDark ? theme.card : '#FFFFFF', borderColor: theme.border }]}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('emergencyHotlines')}</Text>
                    <View style={styles.hotlineGrid}>
                        <TouchableOpacity style={[styles.hotlineItem, { backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#F9FAFB', borderColor: theme.border }]} onPress={() => handleCall('119')} activeOpacity={0.8}>
                            <View style={[styles.hotlineIconCircle, { backgroundColor: 'rgba(239, 68, 68, 0.15)' }]}>
                                <Ionicons name="shield" size={18} color="#EF4444" />
                            </View>
                            <Text style={[styles.hotlineText, { color: theme.text }]}>{t('police')}</Text>
                            <Text style={[styles.hotlineSub, { color: theme.textSecondary }]}>Call 119</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.hotlineItem, { backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#F9FAFB', borderColor: theme.border }]} onPress={() => handleCall('1919')} activeOpacity={0.8}>
                            <View style={[styles.hotlineIconCircle, { backgroundColor: 'rgba(236, 72, 153, 0.15)' }]}>
                                <Ionicons name="woman" size={18} color="#EC4899" />
                            </View>
                            <Text style={[styles.hotlineText, { color: theme.text }]}>{t('womenHelpline')}</Text>
                            <Text style={[styles.hotlineSub, { color: theme.textSecondary }]}>Call 1919</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.hotlineItem, { backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#F9FAFB', borderColor: theme.border }]} onPress={() => handleCall('1098')} activeOpacity={0.8}>
                            <View style={[styles.hotlineIconCircle, { backgroundColor: 'rgba(59, 130, 246, 0.15)' }]}>
                                <Ionicons name="body" size={18} color="#3B82F6" />
                            </View>
                            <Text style={[styles.hotlineText, { color: theme.text }]}>{t('childSafety')}</Text>
                            <Text style={[styles.hotlineSub, { color: theme.textSecondary }]}>Call 1098</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
            <View style={{ height: insets.bottom, backgroundColor: theme.background, width: '100%', zIndex: 10 }} />

            {/* --- LEGAL GUIDANCE MODAL --- */}
            <Modal
                visible={!!selectedCat}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setSelectedCat(null)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalBody, { backgroundColor: isDark ? '#0B0914' : '#FFFFFF', borderColor: theme.border }]}>
                        <View style={[styles.modalHeader, { borderBottomColor: theme.border }]}>
                            <View style={[styles.modalIconCircle, { backgroundColor: (selectedCat?.color || '#E53E3E') + '20' }]}>
                                <Ionicons name={selectedCat?.icon as any} size={22} color={selectedCat?.color || '#E53E3E'} />
                            </View>
                            <Text style={[styles.modalTitle, { color: theme.text }]}>{selectedCat?.title}</Text>
                            <TouchableOpacity onPress={() => setSelectedCat(null)}>
                                <Ionicons name="close-circle" size={24} color={theme.textSecondary} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
                            <Text style={[styles.modalSubHeader, { color: theme.textSecondary }]}>{t('keyInformation')}</Text>
                            {selectedCat?.info.map((item, i) => (
                                <View key={i} style={[styles.infoItem, { backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#F9FAFB', borderColor: theme.border }]}>
                                    <View style={[styles.dot, { backgroundColor: selectedCat?.color || '#E53E3E' }]} />
                                    <Text style={[styles.infoText, { color: theme.text }]}>{item}</Text>
                                </View>
                            ))}

                            {selectedCat?.contacts && (
                                <>
                                    <View style={[styles.divider, { backgroundColor: theme.border }]} />
                                    <Text style={[styles.modalSubHeader, { color: theme.textSecondary }]}>{t('authorityContacts')}</Text>
                                    {selectedCat.contacts.map((contact, i) => (
                                        <TouchableOpacity
                                            key={i}
                                            style={[styles.contactItem, { backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#F9FAFB', borderColor: theme.border }]}
                                            onPress={() => handleCall(contact.contact)}
                                            activeOpacity={0.8}
                                        >
                                            <View style={styles.contactInfo}>
                                                <Text style={[styles.contactName, { color: theme.text }]}>{contact.name}</Text>
                                                <Text style={[styles.contactType, { color: theme.textSecondary }]}>{contact.type} • {contact.contact}</Text>
                                            </View>
                                            <Ionicons name="call" size={18} color={selectedCat.color} />
                                        </TouchableOpacity>
                                    ))}
                                </>
                            )}
                        </ScrollView>

                        <TouchableOpacity
                            style={[styles.coordinatBtn, { backgroundColor: selectedCat?.color || '#E53E3E' }]}
                            onPress={() => {
                                const targetCatId = selectedCat?.id;
                                const catTitle = selectedCat?.title;
                                const catColor = selectedCat?.color;
                                setSelectedCat(null);
                                router.push({
                                    pathname: `/moods/justice-${targetCatId}-chat`,
                                    params: {
                                        name: catTitle,
                                        type: 'Legal Guidance',
                                        color: catColor
                                    }
                                } as any);
                            }}
                            activeOpacity={0.85}
                        >
                            <Ionicons name="chatbubbles" size={18} color={isDark ? "#000" : "#FFF"} style={{ marginRight: 6 }} />
                            <Text style={[styles.coordinatBtnText, { color: isDark ? '#000' : '#FFF' }]}>{t('chatJusticeCoordinator')}</Text>
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
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 16,
    },
    card: {
        width: (width - 48) / 2,
        borderRadius: 20,
        padding: 16,
        borderWidth: 1,
    },
    iconBox: {
        width: 44,
        height: 44,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    cardTitle: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    cardDesc: {
        fontSize: 11,
        marginTop: 4,
        lineHeight: 15,
    },
    hotlineSection: {
        borderRadius: 20,
        padding: 16,
        borderWidth: 1,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    hotlineGrid: {
        flexDirection: 'row',
        gap: 10,
    },
    hotlineItem: {
        flex: 1,
        borderRadius: 16,
        padding: 12,
        borderWidth: 1,
        alignItems: 'center',
    },
    hotlineIconCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 6,
    },
    hotlineText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    hotlineSub: {
        fontSize: 10,
        marginTop: 2,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        justifyContent: 'flex-end',
    },
    modalBody: {
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
    modalScroll: {
        marginBottom: 16,
    },
    modalSubHeader: {
        fontSize: 11,
        fontWeight: 'bold',
        letterSpacing: 1,
        marginBottom: 10,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 14,
        borderWidth: 1,
        marginBottom: 8,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginRight: 10,
    },
    infoText: {
        fontSize: 13,
        flex: 1,
        lineHeight: 18,
    },
    divider: {
        height: 1,
        marginVertical: 14,
    },
    contactItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 12,
        borderRadius: 14,
        borderWidth: 1,
        marginBottom: 8,
    },
    contactInfo: {
        flex: 1,
        marginRight: 8,
    },
    contactName: {
        fontSize: 13,
        fontWeight: 'bold',
    },
    contactType: {
        fontSize: 11,
        marginTop: 2,
    },
    coordinatBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderRadius: 16,
    },
    coordinatBtnText: {
        fontSize: 14,
        fontWeight: 'bold',
    }
});
