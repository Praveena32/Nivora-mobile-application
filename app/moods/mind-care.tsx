import NightSkyBackground from '@/components/NightSkyBackground';
import Colors from '@/constants/Colors';
import { useLanguage } from '@/constants/LanguageContext';
import { useTheme } from '@/constants/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
    Alert,
    Animated,
    Dimensions,
    Easing,
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

const MOOD_OPTIONS = [
    { label: 'Energetic', emoji: '⚡', icon: 'flash-outline', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.12)' },
    { label: 'Calm', emoji: '💧', icon: 'water-outline', color: '#10B981', bg: 'rgba(16, 185, 129, 0.12)' },
    { label: 'Stressed', emoji: '⛈️', icon: 'thunderstorm-outline', color: '#EF4444', bg: 'rgba(239, 68, 68, 0.12)' },
    { label: 'Anxious', emoji: '🌿', icon: 'leaf-outline', color: '#38BDF8', bg: 'rgba(56, 189, 248, 0.12)' },
    { label: 'Peaceful', emoji: '💖', icon: 'heart-outline', color: '#B0A4F1', bg: 'rgba(176, 164, 241, 0.12)' },
];

const BINAURAL_TRACKS = [
    { id: '1', title: '432Hz Alpha Deep Calm', freq: 'Alpha 10Hz', icon: 'pulse-outline', uri: 'https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f792cb.mp3?filename=meditation-soundscape-124707.mp3' },
    { id: '2', title: '528Hz Theta Healing', freq: 'Theta 6Hz', icon: 'sparkles-outline', uri: 'https://cdn.pixabay.com/download/audio/2022/05/16/audio_c9769854ef.mp3?filename=ocean-waves-ambient-110825.mp3' },
    { id: '3', title: 'Gamma Mental Focus', freq: 'Gamma 40Hz', icon: 'planet-outline', uri: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=forest-with-small-river-birds-and-nature-field-recording-6735.mp3' }
];

export default function MindCareScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { theme: themeName, isDark } = useTheme();
    const theme = Colors[themeName];
    const { t } = useLanguage();

    const [selectedMood, setSelectedMood] = useState<string | null>(null);
    const [moodLogSuccess, setMoodLogSuccess] = useState(false);
    const [activeModal, setActiveModal] = useState<'mood' | 'grounding' | 'stress' | 'binaural' | 'ar' | null>(null);

    // Grounding Quest State
    const [groundingStep, setGroundingStep] = useState(0);
    const GROUNDING_QUESTS = [
        { title: t('senseSight'), quest: 'Look around you carefully. Identify 3 distinct objects that bring you a sense of quiet or color.', icon: 'eye-outline', color: '#38BDF8' },
        { title: t('senseTouch'), quest: 'Notice physical touch. Feel your feet resting firmly on the floor or the texture of your sleeves.', icon: 'hand-left-outline', color: '#10B981' },
        { title: t('senseSound'), quest: 'Close your eyes. Listen for 3 subtle ambient sounds in your surroundings.', icon: 'volume-high-outline', color: '#B0A4F1' },
    ];

    // Stress Reset State
    const [isResetting, setIsResetting] = useState(false);
    const [resetPhase, setResetPhase] = useState<'Clench' | 'Hold' | 'Release'>('Clench');
    const pulseAnim = useRef(new Animated.Value(1)).current;

    const startStressReset = () => {
        setIsResetting(true);
        Vibration.vibrate(50);
        setResetPhase('Clench');

        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, { toValue: 1.25, duration: 3000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
                Animated.timing(pulseAnim, { toValue: 1, duration: 4000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
            ])
        ).start();
    };

    // Binaural Audio Player
    const [trackIndex, setTrackIndex] = useState(0);
    const player = useAudioPlayer(BINAURAL_TRACKS[trackIndex]?.uri);
    const audioStatus = useAudioPlayerStatus(player);

    useEffect(() => {
        if (BINAURAL_TRACKS[trackIndex]?.uri) {
            try {
                player.replace({ uri: BINAURAL_TRACKS[trackIndex].uri });
            } catch (e) {
                console.log('Binaural Audio load error:', e);
            }
        }
    }, [trackIndex]);

    const toggleBinauralPlay = () => {
        try {
            if (audioStatus.playing) player.pause();
            else player.play();
        } catch (e) {
            console.log('Binaural toggle error:', e);
        }
    };

    const handleLogMood = () => {
        if (!selectedMood) return;
        Vibration.vibrate(30);
        setMoodLogSuccess(true);
        setTimeout(() => {
            setMoodLogSuccess(false);
            setActiveModal(null);
        }, 1500);
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <NightSkyBackground />
            <View style={{ height: insets.top, backgroundColor: theme.background, width: '100%', position: 'absolute', top: 0, zIndex: 10 }} />

            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top + 12, borderBottomColor: theme.border, backgroundColor: isDark ? 'rgba(7, 6, 20, 0.75)' : 'rgba(255, 255, 255, 0.85)' }]}>
                <TouchableOpacity onPress={() => router.back()} style={[styles.backButton, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)', borderColor: theme.border }]}>
                    <Ionicons name="chevron-back" size={24} color="#76A5AF" />
                </TouchableOpacity>

                <View style={styles.headerTitleGroup}>
                    <Ionicons name="sparkles" size={18} color="#76A5AF" style={{ marginRight: 6 }} />
                    <Text style={[styles.title, { color: theme.text }]}>{t('mindCareHub')}</Text>
                </View>

                <TouchableOpacity
                    style={[styles.historyButton, { backgroundColor: isDark ? 'rgba(118, 165, 175, 0.15)' : 'rgba(118, 165, 175, 0.10)', borderColor: 'rgba(118, 165, 175, 0.3)' }]}
                    onPress={() => router.push('/moods/calming-exercises' as any)}
                >
                    <Ionicons name="fitness-outline" size={18} color="#76A5AF" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={[styles.content, { paddingBottom: 24 }]} showsVerticalScrollIndicator={false}>
                {/* 1. Hero Card */}
                <View style={[styles.heroCard, { backgroundColor: isDark ? 'rgba(118, 165, 175, 0.10)' : 'rgba(118, 165, 175, 0.06)', borderColor: isDark ? 'rgba(118, 165, 175, 0.28)' : 'rgba(118, 165, 175, 0.20)' }]}>
                    <View style={styles.heroBadgeRow}>
                        <View style={[styles.heroBadge, { backgroundColor: 'rgba(118, 165, 175, 0.2)', borderColor: 'rgba(118, 165, 175, 0.4)' }]}>
                            <Ionicons name="shield-checkmark" size={12} color="#76A5AF" style={{ marginRight: 4 }} />
                            <Text style={[styles.heroBadgeText, { color: isDark ? '#B2D8D8' : '#3B6E79' }]}>DAILY WELLNESS SANCTUARY</Text>
                        </View>
                    </View>
                    <Text style={[styles.heroTitle, { color: theme.text }]}>{t('dailyWellness')}</Text>
                    <Text style={[styles.heroSub, { color: theme.textSecondary }]}>{t('mindCareHeroSub')}</Text>
                </View>

                {/* 2. Interactive Wellness Suite Grid */}
                <View style={styles.toolGrid}>
                    <TouchableOpacity
                        style={[styles.largeTool, { backgroundColor: isDark ? theme.card : '#FFFFFF', borderColor: theme.border }]}
                        onPress={() => setActiveModal('mood')}
                        activeOpacity={0.8}
                    >
                        <View style={[styles.iconBox, { backgroundColor: 'rgba(245, 158, 11, 0.15)' }]}>
                            <Ionicons name="happy-outline" size={28} color="#F59E0B" />
                        </View>
                        <Text style={[styles.toolTitle, { color: theme.text }]}>{t('moodCheck')}</Text>
                        <Text style={[styles.toolSub, { color: theme.textSecondary }]}>Log emotional state</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.largeTool, { backgroundColor: isDark ? theme.card : '#FFFFFF', borderColor: theme.border }]}
                        onPress={() => setActiveModal('grounding')}
                        activeOpacity={0.8}
                    >
                        <View style={[styles.iconBox, { backgroundColor: 'rgba(56, 189, 248, 0.15)' }]}>
                            <Ionicons name="compass-outline" size={28} color="#38BDF8" />
                        </View>
                        <Text style={[styles.toolTitle, { color: theme.text }]}>{t('groundingQuest')}</Text>
                        <Text style={[styles.toolSub, { color: theme.textSecondary }]}>3-step sensory anchor</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.largeTool, { backgroundColor: isDark ? theme.card : '#FFFFFF', borderColor: theme.border }]}
                        onPress={() => setActiveModal('stress')}
                        activeOpacity={0.8}
                    >
                        <View style={[styles.iconBox, { backgroundColor: 'rgba(239, 68, 68, 0.15)' }]}>
                            <Ionicons name="refresh-circle-outline" size={28} color="#EF4444" />
                        </View>
                        <Text style={[styles.toolTitle, { color: theme.text }]}>{t('stressReset')}</Text>
                        <Text style={[styles.toolSub, { color: theme.textSecondary }]}>Tension release pulse</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.largeTool, { backgroundColor: isDark ? theme.card : '#FFFFFF', borderColor: theme.border }]}
                        onPress={() => setActiveModal('binaural')}
                        activeOpacity={0.8}
                    >
                        <View style={[styles.iconBox, { backgroundColor: 'rgba(176, 164, 241, 0.15)' }]}>
                            <Ionicons name="headset-outline" size={28} color="#B0A4F1" />
                        </View>
                        <Text style={[styles.toolTitle, { color: theme.text }]}>{t('binauralAudio')}</Text>
                        <Text style={[styles.toolSub, { color: theme.textSecondary }]}>Alpha & Theta waves</Text>
                    </TouchableOpacity>
                </View>

                {/* 3. Spatial Sanctuary Preview Banner */}
                <TouchableOpacity
                    style={[styles.arBanner, { backgroundColor: isDark ? theme.card : '#FFFFFF', borderColor: theme.border }]}
                    onPress={() => setActiveModal('ar')}
                    activeOpacity={0.85}
                >
                    <View style={styles.arInner}>
                        <View style={[styles.arIconBox, { backgroundColor: 'rgba(118, 165, 175, 0.15)' }]}>
                            <Ionicons name="cube-outline" size={24} color="#76A5AF" />
                        </View>
                        <View style={styles.arText}>
                            <Text style={[styles.arTitle, { color: theme.text }]}>{t('arCounselor')}</Text>
                            <Text style={[styles.arSub, { color: theme.textSecondary }]}>Spatial 3D relaxation sanctuary</Text>
                        </View>
                        <View style={[styles.lockPill, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0,0,0,0.05)' }]}>
                            <Ionicons name="lock-closed-outline" size={14} color={theme.textSecondary} />
                        </View>
                    </View>
                </TouchableOpacity>

                {/* 4. Instant AI Counselor Shortcut */}
                <TouchableOpacity
                    style={[styles.voyaBanner, { backgroundColor: theme.primary }]}
                    onPress={() => router.push('/voya-chat')}
                    activeOpacity={0.88}
                >
                    <Ionicons name="sparkles" size={24} color={isDark ? "#000" : "#FFF"} />
                    <View style={styles.voyaTextContainer}>
                        <Text style={[styles.voyaTitle, { color: isDark ? '#000' : '#FFF' }]}>Talk with Voya AI Counselor</Text>
                        <Text style={[styles.voyaSub, { color: isDark ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.85)' }]}>24/7 confidential emotional guidance</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={isDark ? "#000" : "#FFF"} />
                </TouchableOpacity>
            </ScrollView>
            <View style={{ height: insets.bottom, backgroundColor: theme.background, width: '100%', zIndex: 10 }} />

            {/* --- MODALS --- */}

            {/* 1. Mood Check Modal */}
            <Modal visible={activeModal === 'mood'} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: isDark ? '#0B0914' : '#FFFFFF', borderColor: theme.border }]}>
                        <View style={styles.modalHeaderRow}>
                            <Text style={[styles.modalHeading, { color: theme.text }]}>{t('howAreYouNow')}</Text>
                            <TouchableOpacity onPress={() => setActiveModal(null)}>
                                <Ionicons name="close-circle" size={24} color={theme.textSecondary} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.moodRow}>
                            {MOOD_OPTIONS.map((m) => (
                                <TouchableOpacity
                                    key={m.label}
                                    style={[
                                        styles.moodChipItem,
                                        { backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#F9FAFB', borderColor: theme.border },
                                        selectedMood === m.label && { backgroundColor: m.bg, borderColor: m.color, borderWidth: 2 }
                                    ]}
                                    onPress={() => setSelectedMood(m.label)}
                                    activeOpacity={0.8}
                                >
                                    <Text style={{ fontSize: 24 }}>{m.emoji}</Text>
                                    <Text style={[styles.moodLabelText, { color: selectedMood === m.label ? m.color : theme.text }]}>{m.label}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {moodLogSuccess ? (
                            <View style={[styles.successBox, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
                                <Ionicons name="checkmark-circle" size={20} color="#10B981" style={{ marginRight: 6 }} />
                                <Text style={[styles.successText, { color: isDark ? '#A7F3D0' : '#047857' }]}>Mood logged to MindCare Vault!</Text>
                            </View>
                        ) : (
                            <TouchableOpacity
                                style={[styles.primaryBtn, { backgroundColor: selectedMood ? '#76A5AF' : (isDark ? 'rgba(255,255,255,0.1)' : '#E5E7EB') }]}
                                onPress={handleLogMood}
                                disabled={!selectedMood}
                                activeOpacity={0.85}
                            >
                                <Text style={[styles.primaryBtnText, { color: selectedMood ? (isDark ? '#000' : '#FFF') : theme.placeholder }]}>{t('logMood')}</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </Modal>

            {/* 2. Grounding Quest Modal */}
            <Modal visible={activeModal === 'grounding'} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, styles.questModal, { backgroundColor: isDark ? '#0B0914' : '#FFFFFF', borderColor: theme.border }]}>
                        <View style={styles.questHeader}>
                            <View style={[styles.questIconCircle, { backgroundColor: `${GROUNDING_QUESTS[groundingStep].color}18` }]}>
                                <Ionicons name={GROUNDING_QUESTS[groundingStep].icon as any} size={36} color={GROUNDING_QUESTS[groundingStep].color} />
                            </View>
                            <Text style={[styles.questStepTitle, { color: GROUNDING_QUESTS[groundingStep].color }]}>STEP {groundingStep + 1} OF 3 • {GROUNDING_QUESTS[groundingStep].title}</Text>
                        </View>

                        <Text style={[styles.questText, { color: theme.text }]}>{GROUNDING_QUESTS[groundingStep].quest}</Text>
                        <Text style={[styles.questSub, { color: theme.textSecondary }]}>{t('anchorSenses')}</Text>

                        {groundingStep < 2 ? (
                            <TouchableOpacity style={[styles.primaryBtn, { backgroundColor: GROUNDING_QUESTS[groundingStep].color }]} onPress={() => { Vibration.vibrate(20); setGroundingStep(s => s + 1); }}>
                                <Text style={[styles.primaryBtnText, { color: isDark ? '#000' : '#FFF' }]}>{t('nextItem')} →</Text>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity style={[styles.primaryBtn, { backgroundColor: '#10B981' }]} onPress={() => { Vibration.vibrate(40); setActiveModal(null); setGroundingStep(0); }}>
                                <Text style={[styles.primaryBtnText, { color: isDark ? '#000' : '#FFF' }]}>Grounding Complete ✨</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </Modal>

            {/* 3. Stress Reset Modal */}
            <Modal visible={activeModal === 'stress'} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: isDark ? '#0B0914' : '#FFFFFF', borderColor: theme.border }]}>
                        <View style={styles.modalHeaderRow}>
                            <Text style={[styles.modalHeading, { color: theme.text }]}>{t('stressReset')}</Text>
                            <TouchableOpacity onPress={() => { setActiveModal(null); setIsResetting(false); pulseAnim.setValue(1); }}>
                                <Ionicons name="close-circle" size={24} color={theme.textSecondary} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.stressContainer}>
                            <Animated.View style={[styles.stressCircle, { transform: [{ scale: pulseAnim }], borderColor: '#EF4444', backgroundColor: isDark ? 'rgba(239, 68, 68, 0.12)' : 'rgba(239, 68, 68, 0.08)' }]}>
                                <Ionicons name="flame" size={32} color="#EF4444" style={{ marginBottom: 8 }} />
                                <Text style={[styles.stressInstruction, { color: theme.text }]}>
                                    {isResetting ? 'Hold tension... now exhale slowly' : t('clenchFists')}
                                </Text>
                            </Animated.View>
                        </View>

                        {!isResetting ? (
                            <TouchableOpacity style={[styles.primaryBtn, { backgroundColor: '#EF4444' }]} onPress={startStressReset} activeOpacity={0.85}>
                                <Ionicons name="play" size={18} color={isDark ? "#000" : "#FFF"} />
                                <Text style={[styles.primaryBtnText, { color: isDark ? '#000' : '#FFF' }]}>Start Stress Reset</Text>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity style={[styles.primaryBtn, { backgroundColor: '#10B981' }]} onPress={() => { setActiveModal(null); setIsResetting(false); pulseAnim.setValue(1); }}>
                                <Text style={[styles.primaryBtnText, { color: isDark ? '#000' : '#FFF' }]}>{t('iFeelBetter')} ✨</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </Modal>

            {/* 4. Binaural Audio Modal */}
            <Modal visible={activeModal === 'binaural'} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: isDark ? '#0B0914' : '#FFFFFF', borderColor: theme.border }]}>
                        <View style={styles.modalHeaderRow}>
                            <Text style={[styles.modalHeading, { color: theme.text }]}>{t('binauralSanctuary')}</Text>
                            <TouchableOpacity onPress={() => setActiveModal(null)}>
                                <Ionicons name="close-circle" size={24} color={theme.textSecondary} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.binauralTrackList}>
                            {BINAURAL_TRACKS.map((track, idx) => {
                                const isCurrent = trackIndex === idx;
                                return (
                                    <TouchableOpacity
                                        key={track.id}
                                        style={[
                                            styles.binauralItem,
                                            { backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#F9FAFB', borderColor: theme.border },
                                            isCurrent && { borderColor: '#B0A4F1', backgroundColor: isDark ? 'rgba(176, 164, 241, 0.15)' : 'rgba(120, 104, 230, 0.08)' }
                                        ]}
                                        onPress={() => setTrackIndex(idx)}
                                        activeOpacity={0.8}
                                    >
                                        <Ionicons name={track.icon as any} size={22} color={isCurrent ? '#B0A4F1' : theme.textSecondary} />
                                        <View style={{ flex: 1, marginLeft: 12 }}>
                                            <Text style={[styles.binauralTrackTitle, { color: theme.text }]}>{track.title}</Text>
                                            <Text style={[styles.binauralTrackFreq, { color: isCurrent ? '#B0A4F1' : theme.textSecondary }]}>{track.freq}</Text>
                                        </View>
                                        {isCurrent && audioStatus.playing && (
                                            <View style={styles.playingPulseDot} />
                                        )}
                                    </TouchableOpacity>
                                );
                            })}
                        </View>

                        <TouchableOpacity
                            style={[styles.primaryBtn, { backgroundColor: '#B0A4F1' }]}
                            onPress={toggleBinauralPlay}
                            activeOpacity={0.85}
                        >
                            <Ionicons name={audioStatus.playing ? "pause" : "play"} size={20} color={isDark ? "#000" : "#FFF"} />
                            <Text style={[styles.primaryBtnText, { color: isDark ? '#000' : '#FFF' }]}>
                                {audioStatus.playing ? 'Pause Frequency' : 'Play Binaural Audio'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* 5. Spatial AR Preview Modal */}
            <Modal visible={activeModal === 'ar'} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: isDark ? '#0B0914' : '#FFFFFF', borderColor: theme.border }]}>
                        <Ionicons name="cube-outline" size={48} color="#76A5AF" style={{ marginBottom: 12 }} />
                        <Text style={[styles.modalHeading, { color: theme.text, marginBottom: 8 }]}>Spatial 3D Room</Text>
                        <Text style={[styles.arModalDesc, { color: theme.textSecondary }]}>
                            Immersive 3D Spatial Relaxation environments will be unlocked in the upcoming update for your physical space.
                        </Text>
                        <TouchableOpacity style={[styles.primaryBtn, { backgroundColor: '#76A5AF', marginTop: 20 }]} onPress={() => setActiveModal(null)}>
                            <Text style={[styles.primaryBtnText, { color: isDark ? '#000' : '#FFF' }]}>Got It</Text>
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
    historyButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
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
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 6,
    },
    heroSub: {
        fontSize: 13,
        lineHeight: 19,
    },
    toolGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 16,
    },
    largeTool: {
        width: (width - 48) / 2,
        borderRadius: 20,
        padding: 16,
        borderWidth: 1,
    },
    iconBox: {
        width: 48,
        height: 48,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    toolTitle: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    toolSub: {
        fontSize: 11,
        marginTop: 2,
    },
    arBanner: {
        borderRadius: 20,
        padding: 16,
        borderWidth: 1,
        marginBottom: 16,
    },
    arInner: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    arIconBox: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
    arText: {
        flex: 1,
        marginLeft: 12,
    },
    arTitle: {
        fontSize: 15,
        fontWeight: 'bold',
    },
    arSub: {
        fontSize: 12,
        marginTop: 2,
    },
    lockPill: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    voyaBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 20,
    },
    voyaTextContainer: {
        flex: 1,
        marginLeft: 12,
    },
    voyaTitle: {
        fontSize: 15,
        fontWeight: 'bold',
    },
    voyaSub: {
        fontSize: 12,
        marginTop: 2,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.70)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        padding: 24,
        paddingBottom: 36,
        borderWidth: 1,
    },
    modalHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 18,
    },
    modalHeading: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    moodRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginBottom: 20,
    },
    moodChipItem: {
        width: (width - 68) / 3,
        paddingVertical: 14,
        borderRadius: 16,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
    },
    moodLabelText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    successBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderRadius: 16,
    },
    successText: {
        fontSize: 13,
        fontWeight: 'bold',
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
    questModal: {
        alignItems: 'center',
    },
    questHeader: {
        alignItems: 'center',
        marginBottom: 14,
    },
    questIconCircle: {
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    questStepTitle: {
        fontSize: 11,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    questText: {
        fontSize: 17,
        fontWeight: 'bold',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 8,
    },
    questSub: {
        fontSize: 12,
        textAlign: 'center',
        marginBottom: 24,
    },
    stressContainer: {
        alignItems: 'center',
        marginVertical: 16,
    },
    stressCircle: {
        width: 170,
        height: 170,
        borderRadius: 85,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    stressInstruction: {
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
        lineHeight: 20,
    },
    binauralTrackList: {
        gap: 10,
        marginBottom: 20,
    },
    binauralItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        borderRadius: 16,
        borderWidth: 1,
    },
    binauralTrackTitle: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    binauralTrackFreq: {
        fontSize: 11,
        marginTop: 2,
    },
    playingPulseDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#B0A4F1',
    },
    arModalDesc: {
        fontSize: 13,
        lineHeight: 20,
        textAlign: 'center',
    }
});
