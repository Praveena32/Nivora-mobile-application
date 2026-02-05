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
    const { t } = useLanguage();
    const [selectedCat, setSelectedCat] = useState<JusticeCategory | null>(null);

    const JUSTICE_CATEGORIES: JusticeCategory[] = [
        {
            id: 'rights',
            title: t('legalInfoBasics'),
            desc: t('legalInfoDesc'),
            icon: 'book',
            color: '#A61C00',
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
            icon: 'document-text',
            color: '#7B1FA2',
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
            icon: 'shield-half',
            color: '#1976D2',
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
            icon: 'call',
            color: '#388E3C',
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
        <View style={[styles.container, { backgroundColor: '#050510' }]}>
            <NightSkyBackground />

            <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={28} color="#B0A4F1" />
                </TouchableOpacity>
                <Text style={styles.title}>{t('justiceLinkTitle')}</Text>
                <TouchableOpacity
                    style={styles.exitButton}
                    onPress={() => router.replace('/')}
                >
                    <Ionicons name="exit-outline" size={16} color="#FF8A8A" style={{ marginRight: 6 }} />
                    <Text style={styles.exitText}>{t('quickExit')}</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={[styles.content, { paddingBottom: 40 + insets.bottom }]}>
                <View style={styles.hero}>
                    <Text style={styles.heroTitle}>{t('legalOfficialHelp')}</Text>
                    <Text style={styles.heroSub}>{t('justiceHeroSub')}</Text>
                </View>

                <View style={styles.grid}>
                    {JUSTICE_CATEGORIES.map(cat => (
                        <TouchableOpacity
                            key={cat.id}
                            style={styles.card}
                            onPress={() => setSelectedCat(cat)}
                        >
                            <View style={[styles.iconBox, { backgroundColor: cat.color + '15' }]}>
                                <Ionicons name={cat.icon as any} size={26} color={cat.color} />
                            </View>
                            <Text style={styles.cardTitle}>{cat.title}</Text>
                            <Text style={styles.cardDesc}>{cat.desc}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.hotlineSection}>
                    <Text style={styles.sectionTitle}>{t('emergencyHotlines')}</Text>
                    <View style={styles.hotlineGrid}>
                        <TouchableOpacity style={styles.hotlineItem} onPress={() => handleCall('119')}>
                            <Ionicons name="shield" size={20} color="#F44336" />
                            <Text style={styles.hotlineText}>{t('police')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.hotlineItem} onPress={() => handleCall('1919')}>
                            <Ionicons name="woman" size={20} color="#E91E63" />
                            <Text style={styles.hotlineText}>{t('womenHelpline')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.hotlineItem} onPress={() => handleCall('1098')}>
                            <Ionicons name="body" size={20} color="#2196F3" />
                            <Text style={styles.hotlineText}>{t('childSafety')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>

            <Modal
                visible={!!selectedCat}
                transparent={true}
                animationType="slide"
            >
                <View style={[styles.modalOverlay, { paddingBottom: 0 }]}>
                    <View style={[styles.modalBody, { paddingBottom: 30 + insets.bottom }]}>
                        <View style={styles.modalHeader}>
                            <Ionicons name={selectedCat?.icon as any} size={30} color={selectedCat?.color} />
                            <Text style={styles.modalTitle}>{selectedCat?.title}</Text>
                            <TouchableOpacity onPress={() => setSelectedCat(null)}>
                                <Ionicons name="close" size={24} color="rgba(255,255,255,0.4)" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.modalScroll}>
                            <Text style={styles.modalSub}>{t('keyInformation')}</Text>
                            {selectedCat?.info.map((item, i) => (
                                <View key={i} style={styles.infoItem}>
                                    <View style={[styles.dot, { backgroundColor: selectedCat?.color }]} />
                                    <Text style={styles.infoText}>{item}</Text>
                                </View>
                            ))}

                            {selectedCat?.contacts && (
                                <>
                                    <View style={styles.divider} />
                                    <Text style={styles.modalSub}>{t('authorityContacts')}</Text>
                                    {selectedCat.contacts.map((contact, i) => (
                                        <TouchableOpacity
                                            key={i}
                                            style={styles.contactItem}
                                            onPress={() => handleCall(contact.contact)}
                                        >
                                            <View style={styles.contactInfo}>
                                                <Text style={styles.contactName}>{contact.name}</Text>
                                                <Text style={styles.contactType}>{contact.type}</Text>
                                            </View>
                                            <Ionicons name="call" size={20} color={selectedCat.color} />
                                        </TouchableOpacity>
                                    ))}
                                </>
                            )}
                        </ScrollView>

                        <TouchableOpacity
                            style={[styles.coordinatBtn, { backgroundColor: selectedCat?.color }]}
                            onPress={() => {
                                router.push({
                                    pathname: `/moods/justice-${selectedCat?.id}-chat`,
                                    params: {
                                        name: selectedCat?.title,
                                        type: 'Legal Guidance',
                                        color: selectedCat?.color
                                    }
                                } as any);
                                setSelectedCat(null);
                            }}
                        >
                            <Text style={styles.coordinatBtnText}>{t('chatJusticeCoordinator')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 15 },
    backButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.05)', justifyContent: 'center', alignItems: 'center' },
    exitButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,138,138,0.12)',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,138,138,0.4)',
        shadowColor: '#FF8A8A',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 5
    },
    exitText: { color: '#FF8A8A', fontSize: 13, fontWeight: 'bold', letterSpacing: 0.5 },
    title: { fontSize: 20, fontWeight: 'bold', color: '#FFF' },
    content: { padding: 20 },
    hero: { marginBottom: 30 },
    heroTitle: { color: '#FFF', fontSize: 28, fontWeight: 'bold' },
    heroSub: { color: 'rgba(255,255,255,0.5)', fontSize: 14, marginTop: 8, lineHeight: 22 },
    grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    card: { width: '48%', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 24, padding: 20, marginBottom: 15, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
    iconBox: { width: 50, height: 50, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
    cardTitle: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
    cardDesc: { color: 'rgba(255,255,255,0.4)', fontSize: 11, marginTop: 4, lineHeight: 16 },
    hotlineSection: { marginTop: 20 },
    sectionTitle: { color: 'rgba(255,255,255,0.4)', fontSize: 13, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 15 },
    hotlineGrid: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
    hotlineItem: { flex: 1, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 20, padding: 15, alignItems: 'center', gap: 8 },
    hotlineText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },

    // Modal
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'flex-end' },
    modalBody: { backgroundColor: '#0B0B1F', borderTopLeftRadius: 40, borderTopRightRadius: 40, padding: 30, maxHeight: '85%' },
    modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 25 },
    modalTitle: { flex: 1, color: '#FFF', fontSize: 22, fontWeight: 'bold', marginLeft: 15 },
    modalScroll: { marginBottom: 20 },
    modalSub: { color: 'rgba(255,255,255,0.4)', fontWeight: 'bold', fontSize: 12, textTransform: 'uppercase', marginBottom: 15, letterSpacing: 1 },
    infoItem: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 15 },
    dot: { width: 6, height: 6, borderRadius: 3 },
    infoText: { color: '#FFF', fontSize: 14, flex: 1, lineHeight: 22 },
    divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.05)', marginVertical: 20 },
    contactItem: { backgroundColor: 'rgba(255,255,255,0.02)', padding: 15, borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
    contactInfo: { flex: 1 },
    contactName: { color: '#FFF', fontSize: 14, fontWeight: 'bold' },
    contactType: { color: 'rgba(255,255,255,0.4)', fontSize: 12, marginTop: 2 },
    coordinatBtn: { height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginTop: 10 },
    coordinatBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' }
});
