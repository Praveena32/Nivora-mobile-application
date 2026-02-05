import NightSkyBackground from '@/components/NightSkyBackground';
import { useLanguage } from '@/constants/LanguageContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

const MOOD_OPTIONS = [
    { label: 'Energetic', icon: 'flash', color: '#FFD700', bg: 'rgba(255,215,0,0.1)' },
    { label: 'Calm', icon: 'water', color: '#82E9FF', bg: 'rgba(130,233,255,0.1)' },
    { label: 'Stressed', icon: 'thunderstorm', color: '#FF8A8A', bg: 'rgba(255,138,138,0.1)' },
    { label: 'Anxious', icon: 'leaf', color: '#B0A4F1', bg: 'rgba(176,164,241,0.1)' },
    { label: 'Sad', icon: 'cloud', color: '#A7A7A7', bg: 'rgba(167,167,167,0.1)' },
];

export default function MindCareScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { t } = useLanguage();
    const [selectedMood, setSelectedMood] = useState<string | null>(null);
    const [activeModal, setActiveModal] = useState<'mood' | 'grounding' | 'stress' | 'binaural' | 'ar' | null>(null);

    // Grounding Quest State
    const [groundingStep, setGroundingStep] = useState(0);
    const GROUNDING_QUESTS = [
        { title: t('senseSight'), quest: t('groundingSightQuest'), icon: 'eye-outline' },
        { title: t('senseTouch'), quest: t('groundingTouchQuest'), icon: 'hand-left-outline' },
        { title: t('senseSound'), quest: t('groundingSoundQuest'), icon: 'volume-high-outline' },
    ];

    // Stress Reset State
    const [isResetting, setIsResetting] = useState(false);
    const pulseAnim = useRef(new Animated.Value(1)).current;

    const startStressReset = () => {
        setIsResetting(true);
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, { toValue: 1.1, duration: 2000, useNativeDriver: true }),
                Animated.timing(pulseAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
            ])
        ).start();
    };

    return (
        <View style={styles.container}>
            <NightSkyBackground />

            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={28} color="#B0A4F1" />
                </TouchableOpacity>
                <Text style={styles.title}>{t('mindCareHub')}</Text>
                <View style={{ width: 44 }} />
            </View>

            <ScrollView contentContainerStyle={[styles.content, { paddingBottom: 100 }]} showsVerticalScrollIndicator={false}>
                {/* Hero */}
                <View style={styles.heroSection}>
                    <Text style={styles.heroTitle}>{t('dailyWellness')}</Text>
                    <Text style={styles.heroSub}>{t('mindCareHeroSub')}</Text>
                </View>

                {/* Main Tools Grid */}
                <View style={styles.toolGrid}>
                    <TouchableOpacity style={styles.largeTool} onPress={() => setActiveModal('mood')}>
                        <View style={[styles.iconBox, { backgroundColor: '#FFD70020' }]}>
                            <Ionicons name="happy-outline" size={32} color="#FFD700" />
                        </View>
                        <Text style={styles.toolTitle}>{t('moodCheck')}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.largeTool} onPress={() => setActiveModal('grounding')}>
                        <View style={[styles.iconBox, { backgroundColor: '#82E9FF20' }]}>
                            <Ionicons name="compass-outline" size={32} color="#82E9FF" />
                        </View>
                        <Text style={styles.toolTitle}>{t('groundingQuest')}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.largeTool} onPress={() => setActiveModal('stress')}>
                        <View style={[styles.iconBox, { backgroundColor: '#FF8A8A20' }]}>
                            <Ionicons name="refresh-circle-outline" size={32} color="#FF8A8A" />
                        </View>
                        <Text style={styles.toolTitle}>{t('stressReset')}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.largeTool} onPress={() => setActiveModal('binaural')}>
                        <View style={[styles.iconBox, { backgroundColor: '#B0A4F120' }]}>
                            <Ionicons name="headset-outline" size={32} color="#B0A4F1" />
                        </View>
                        <Text style={styles.toolTitle}>{t('binauralAudio')}</Text>
                    </TouchableOpacity>
                </View>

                {/* Secondary Tools */}
                <TouchableOpacity style={styles.arBanner} onPress={() => setActiveModal('ar')}>
                    <View style={styles.arInner}>
                        <Ionicons name="cube-outline" size={28} color="#FFF" />
                        <View style={styles.arText}>
                            <Text style={styles.arTitle}>{t('arCounselor')}</Text>
                            <Text style={styles.arSub}>Coming Soon to your space</Text>
                        </View>
                        <Ionicons name="lock-closed" size={20} color="rgba(255,255,255,0.3)" />
                    </View>
                </TouchableOpacity>
            </ScrollView>

            {/* --- MODALS --- */}

            {/* 1. Mood Check Modal */}
            <Modal visible={activeModal === 'mood'} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalHeading}>{t('howAreYouNow')}</Text>
                        <View style={styles.moodRow}>
                            {MOOD_OPTIONS.map((m) => (
                                <TouchableOpacity
                                    key={m.label}
                                    style={[styles.moodItem, selectedMood === m.label && { backgroundColor: m.bg, borderColor: m.color }]}
                                    onPress={() => setSelectedMood(m.label)}
                                >
                                    <Ionicons name={m.icon as any} size={32} color={m.color} />
                                    <Text style={[styles.moodLabel, { color: m.color }]}>{m.label}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <TouchableOpacity style={styles.primaryBtn} onPress={() => setActiveModal(null)}>
                            <Text style={styles.primaryBtnText}>{t('logMood')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* 2. Grounding Quest Modal */}
            <Modal visible={activeModal === 'grounding'} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, styles.questModal]}>
                        <View style={styles.questHeader}>
                            <Ionicons name={GROUNDING_QUESTS[groundingStep].icon as any} size={40} color="#82E9FF" />
                            <Text style={styles.questStepTitle}>{GROUNDING_QUESTS[groundingStep].title}</Text>
                        </View>
                        <Text style={styles.questText}>{GROUNDING_QUESTS[groundingStep].quest}</Text>
                        <Text style={styles.questSub}>{t('anchorSenses')}</Text>

                        {groundingStep < 2 ? (
                            <TouchableOpacity style={styles.primaryBtn} onPress={() => setGroundingStep(s => s + 1)}>
                                <Text style={styles.primaryBtnText}>{t('nextItem')}</Text>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity style={styles.primaryBtn} onPress={() => { setActiveModal(null); setGroundingStep(0); }}>
                                <Text style={styles.primaryBtnText}>{t('done')}</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </Modal>

            {/* 3. Stress Reset Modal */}
            <Modal visible={activeModal === 'stress'} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Animated.View style={[styles.stressCircle, { transform: [{ scale: pulseAnim }], borderColor: '#FF8A8A' }]}>
                            <Text style={styles.stressInstruction}>
                                {isResetting ? t('hold') : t('clenchFists')}
                            </Text>
                        </Animated.View>

                        {!isResetting ? (
                            <TouchableOpacity style={[styles.primaryBtn, { backgroundColor: '#FF8A8A' }]} onPress={startStressReset}>
                                <Text style={[styles.primaryBtnText, { color: '#000' }]}>{t('stressReset')}</Text>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity style={styles.secondaryBtn} onPress={() => { setActiveModal(null); setIsResetting(false); pulseAnim.setValue(1); }}>
                                <Text style={styles.secondaryBtnText}>{t('iFeelBetter')}</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </Modal>

            {/* 4. Binaural Modal */}
            <Modal visible={activeModal === 'binaural'} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.binauralHeader}>
                            <Ionicons name="headset" size={48} color="#B0A4F1" />
                            <Text style={styles.modalHeading}>{t('binauralSanctuary')}</Text>
                            <Text style={styles.binauralSub}>{t('playFocusWaves')}</Text>
                        </View>

                        <TouchableOpacity
                            style={[styles.primaryBtn, { backgroundColor: '#B0A4F1' }]}
                            onPress={() => router.push('/moods/calming-exercises')}
                        >
                            <Ionicons name="play" size={20} color="#000" />
                            <Text style={[styles.primaryBtnText, { color: '#000' }]}>{t('playAudio')}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.secondaryBtn} onPress={() => setActiveModal(null)}>
                            <Text style={styles.secondaryBtnText}>{t('done')}</Text>
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
        backgroundColor: 'rgba(255,255,255,0.05)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFF',
    },
    content: {
        padding: 24,
    },
    heroSection: {
        marginBottom: 32,
    },
    heroTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 8,
    },
    heroSub: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.6)',
        lineHeight: 24,
    },
    toolGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
        marginBottom: 30,
    },
    largeTool: {
        width: (width - 48 - 16) / 2,
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 24,
        padding: 24,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
    },
    iconBox: {
        width: 56,
        height: 56,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    toolTitle: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: 'bold',
    },
    arBanner: {
        backgroundColor: 'rgba(255,255,255,0.02)',
        borderRadius: 24,
        padding: 24,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    arInner: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    arText: {
        flex: 1,
        marginLeft: 16,
    },
    arTitle: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    arSub: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 12,
        marginTop: 2,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.85)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#0A0A15',
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        padding: 30,
        paddingBottom: 50,
        alignItems: 'center',
    },
    modalHeading: {
        color: '#FFF',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30,
        textAlign: 'center',
    },
    moodRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 12,
        marginBottom: 40,
    },
    moodItem: {
        width: (width - 60 - 24) / 3,
        aspectRatio: 1,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    moodLabel: {
        fontSize: 11,
        fontWeight: 'bold',
    },
    questModal: {
        minHeight: 400,
        justifyContent: 'center',
    },
    questHeader: {
        alignItems: 'center',
        marginBottom: 30,
    },
    questStepTitle: {
        color: '#82E9FF',
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 10,
        letterSpacing: 2,
    },
    questText: {
        color: '#FFF',
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    questSub: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 14,
        marginBottom: 40,
    },
    stressCircle: {
        width: 250,
        height: 250,
        borderRadius: 125,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 40,
        padding: 40,
    },
    stressInstruction: {
        color: '#FFF',
        fontSize: 18,
        textAlign: 'center',
        lineHeight: 28,
        fontWeight: '600',
    },
    primaryBtn: {
        backgroundColor: '#FFF',
        height: 60,
        width: '100%',
        borderRadius: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
    },
    primaryBtnText: {
        color: '#000',
        fontSize: 16,
        fontWeight: 'bold',
    },
    secondaryBtn: {
        width: '100%',
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
    secondaryBtnText: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 15,
        fontWeight: 'bold',
    },
    binauralHeader: {
        alignItems: 'center',
        marginBottom: 40,
    },
    binauralSub: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 14,
        textAlign: 'center',
        marginTop: -20,
    }
});
