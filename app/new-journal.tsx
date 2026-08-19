import NightSkyBackground from '@/components/NightSkyBackground';
import Colors from '@/constants/Colors';
import { useTheme } from '@/constants/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Animated,
    Dimensions,
    Easing,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const MOOD_VIBES = [
    { label: 'Peaceful', emoji: '🧘', color: '#7868E6', darkColor: '#B0A4F1' },
    { label: 'Reflective', emoji: '✨', color: '#16A34A', darkColor: '#4ADE80' },
    { label: 'Growing', emoji: '🌱', color: '#0284C7', darkColor: '#38BDF8' },
    { label: 'Grateful', emoji: '🙏', color: '#D97706', darkColor: '#FBBF24' },
    { label: 'Healing', emoji: '💖', color: '#DB2777', darkColor: '#F472B6' },
];

const JOURNAL_MODES = [
    { id: 'standard', label: 'Reflection', icon: 'create-outline', color: '#7868E6', darkColor: '#B0A4F1' },
    { id: 'burn', label: 'Burn & Let Go', icon: 'flame-outline', color: '#DC2626', darkColor: '#EF4444' },
    { id: 'gratitude', label: 'Gratitude Garden', icon: 'flower-outline', color: '#D97706', darkColor: '#FBBF24' },
    { id: 'somatic', label: 'Body Map', icon: 'body-outline', color: '#0284C7', darkColor: '#38BDF8' },
    { id: 'future', label: 'Future Letter', icon: 'mail-outline', color: '#DB2777', darkColor: '#EC4899' },
];

const BODY_ZONES = [
    { id: 'head', label: 'Head', emoji: '🧠', desc: 'Overthinking & Mental Strain', tip: 'Try a 1-minute slow exhale to relax cranial tension.' },
    { id: 'throat', label: 'Throat', emoji: '🗣️', desc: 'Unspoken Words & Swallowed Feelings', tip: 'Hum softly or drink warm water to open throat constriction.' },
    { id: 'chest', label: 'Chest', emoji: '🫁', desc: 'Heartache, Grief or Anxiety', tip: 'Place your hand over your heart and take 3 deep, grounding breaths.' },
    { id: 'shoulders', label: 'Shoulders', emoji: '🧘', desc: 'Carrying Heavy Burdens & Responsibilities', tip: 'Roll your shoulders backward 5 times and gently drop your posture.' },
    { id: 'stomach', label: 'Stomach', emoji: '🌊', desc: 'Nerves, Fear or Gut Restlessness', tip: 'Place a warm palm on your navel and breathe into your belly.' },
];

const FUTURE_CONDITIONS = [
    { id: 'sad', label: 'When I Feel Sad or Low', icon: 'rainy-outline' },
    { id: '30days', label: 'In 30 Days', icon: 'calendar-outline' },
    { id: 'overwhelmed', label: 'When Feeling Overwhelmed', icon: 'alert-circle-outline' },
    { id: 'celebration', label: 'On My Next Victory', icon: 'trophy-outline' },
];

const DIARY_STORAGE_KEY = '@safe_space_journal';

export default function NewJournalScreen() {
    const router = useRouter();
    const params = useLocalSearchParams<{ mode?: string }>();
    const insets = useSafeAreaInsets();
    const { theme: themeName, isDark } = useTheme();
    const theme = Colors[themeName];

    // Selected Mode
    const [activeMode, setActiveMode] = useState<string>(params.mode || 'standard');

    // Form fields
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [selectedVibe, setSelectedVibe] = useState(0);
    const [gratitude, setGratitude] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    // Micro-Gratitude Garden 3 Prompts
    const [gratitude1, setGratitude1] = useState('');
    const [gratitude2, setGratitude2] = useState('');
    const [gratitude3, setGratitude3] = useState('');

    // Somatic Map state
    const [selectedBodyZone, setSelectedBodyZone] = useState<string>('chest');

    // Future Letter state
    const [selectedFutureTrigger, setSelectedFutureTrigger] = useState<string>('sad');

    // Burn & Release Animation state
    const [burnText, setBurnText] = useState('');
    const [isBurning, setIsBurning] = useState(false);
    const [burnReleased, setBurnReleased] = useState(false);
    const burnAnim = useRef(new Animated.Value(1)).current;
    const flameAnim = useRef(new Animated.Value(0)).current;

    // Voya AI Companion Reflection State
    const [voyaReflection, setVoyaReflection] = useState<string | null>(null);
    const [isReflectingWithVoya, setIsReflectingWithVoya] = useState(false);

    useEffect(() => {
        if (params.mode && JOURNAL_MODES.some(m => m.id === params.mode)) {
            setActiveMode(params.mode);
        }
    }, [params.mode]);

    // Cathartic Burn & Release Execution
    const handleBurnAndRelease = () => {
        if (!burnText.trim()) {
            Alert.alert("Empty Flame", "Type the heavy thought, anger, or worry you wish to release into the cosmos.");
            return;
        }

        setIsBurning(true);

        Animated.parallel([
            Animated.timing(flameAnim, {
                toValue: 1,
                duration: 1800,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: true,
            }),
            Animated.timing(burnAnim, {
                toValue: 0,
                duration: 1800,
                easing: Easing.inOut(Easing.sin),
                useNativeDriver: true,
            }),
        ]).start(() => {
            setBurnText('');
            setIsBurning(false);
            setBurnReleased(true);
            burnAnim.setValue(1);
            flameAnim.setValue(0);
        });
    };

    // Reflect with Voya AI Companion
    const handleReflectWithVoya = () => {
        const contentToAnalyze = activeMode === 'gratitude'
            ? `${gratitude1} ${gratitude2} ${gratitude3}`
            : (activeMode === 'burn' ? burnText : text);

        if (!contentToAnalyze.trim()) {
            Alert.alert("Share Your Heart", "Write a few thoughts first so Voya can reflect with you with compassion.");
            return;
        }

        setIsReflectingWithVoya(true);

        setTimeout(() => {
            let reflection = "";
            if (activeMode === 'gratitude') {
                reflection = "✨ Your heart is noticing the gentle beauty in life. Acknowledging these small victories creates resilient neural pathways of peace.";
            } else if (activeMode === 'burn') {
                reflection = "🕊️ Acknowledging this pain without judgment takes deep courage. Releasing what is beyond your control is the first act of self-love.";
            } else if (activeMode === 'somatic') {
                const zone = BODY_ZONES.find(z => z.id === selectedBodyZone);
                reflection = `🫀 Your body is communicating through your ${zone?.label || 'being'}. Breathe deeply into this space; your feelings are valid, and tension can soften.`;
            } else if (activeMode === 'future') {
                reflection = "💌 This message is an anchor of hope from your present resilience to your future self. Healing is a spiral, not a straight line.";
            } else {
                reflection = "🌱 Thank you for gifting yourself this mindful pause. By putting words to your inner world, you transform overwhelm into clarity.";
            }

            setVoyaReflection(reflection);
            setIsReflectingWithVoya(false);
        }, 800);
    };

    const handleSave = async () => {
        let contentToSave = text.trim();
        let gratitudeToSave = gratitude.trim();
        let defaultTitle = title.trim();

        if (activeMode === 'gratitude') {
            if (!gratitude1.trim() && !gratitude2.trim() && !gratitude3.trim()) {
                Alert.alert("Gratitude Blossoms", "Please share at least one blessing for your garden.");
                return;
            }
            defaultTitle = defaultTitle || "🌸 Gratitude Garden Blossoms";
            contentToSave = `1. ${gratitude1.trim() || 'Noticed a quiet moment of peace'}\n2. ${gratitude2.trim() || 'Found inner strength'}\n3. ${gratitude3.trim() || 'Cherished a kindness'}`;
        } else if (activeMode === 'somatic') {
            const zone = BODY_ZONES.find(z => z.id === selectedBodyZone);
            defaultTitle = defaultTitle || `🫀 Body Scan: ${zone?.label || 'Somatic Awareness'}`;
            contentToSave = `Physical Tension: ${zone?.desc || 'Body Sensations'}\n\nReflection: ${text.trim() || 'Acknowledged bodily sensation with mindfulness.'}\n\nGrounding Tip: ${zone?.tip || ''}`;
        } else if (activeMode === 'future') {
            const cond = FUTURE_CONDITIONS.find(c => c.id === selectedFutureTrigger);
            defaultTitle = defaultTitle || "💌 Note to My Future Self";
            contentToSave = `Unlock Condition: ${cond?.label || 'When needed'}\n\nMessage to Future Self:\n${text.trim()}`;
        } else {
            if (!contentToSave) {
                Alert.alert("Empty Sanctuary", "Please share a few thoughts before saving your sanctuary entry.");
                return;
            }
            defaultTitle = defaultTitle || "Mindful Reflection";
        }

        setIsSaving(true);
        try {
            const vibeObj = MOOD_VIBES[selectedVibe];
            const newEntry = {
                id: Date.now().toString(),
                title: defaultTitle,
                content: contentToSave,
                gratitude: gratitudeToSave,
                date: new Date().toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                }),
                timestamp: Date.now(),
                mood: {
                    label: vibeObj.label,
                    emoji: vibeObj.emoji,
                    color: isDark ? vibeObj.darkColor : vibeObj.color
                },
                mode: activeMode,
                bodyArea: activeMode === 'somatic' ? selectedBodyZone : undefined,
                voyaReflection: voyaReflection || undefined,
            };

            const existing = await AsyncStorage.getItem(DIARY_STORAGE_KEY);
            const entries = existing ? JSON.parse(existing) : [];
            const updated = [newEntry, ...entries];

            await AsyncStorage.setItem(DIARY_STORAGE_KEY, JSON.stringify(updated));
            router.back();
        } catch (error) {
            Alert.alert("Error", "Could not save your thoughts to the sanctuary.");
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <NightSkyBackground />
            <View style={{ height: insets.top, backgroundColor: theme.background, width: '100%', position: 'absolute', top: 0, zIndex: 10 }} />

            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={[styles.backButton, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)', borderColor: theme.border }]}
                    activeOpacity={0.75}
                >
                    <Ionicons name="close" size={24} color={theme.text} />
                </TouchableOpacity>

                <Text style={[styles.headerTitle, { color: theme.text }]}>Journal Sanctuary</Text>

                {activeMode !== 'burn' ? (
                    <TouchableOpacity
                        onPress={handleSave}
                        style={[styles.saveButton, { backgroundColor: theme.primary }, isSaving && { opacity: 0.5 }]}
                        disabled={isSaving}
                        activeOpacity={0.8}
                    >
                        {isSaving ? (
                            <ActivityIndicator size="small" color={isDark ? "#000" : "#FFF"} />
                        ) : (
                            <Text style={[styles.saveText, { color: isDark ? '#000' : '#FFF' }]}>Save</Text>
                        )}
                    </TouchableOpacity>
                ) : (
                    <View style={{ width: 44 }} />
                )}
            </View>

            {/* Mindful Journal Modes Tab Bar */}
            <View style={[styles.modeTabBar, { borderBottomColor: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)' }]}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.modeTabScroll}
                >
                    {JOURNAL_MODES.map((mode) => {
                        const isSelected = activeMode === mode.id;
                        const modeColor = isDark ? mode.darkColor : mode.color;
                        return (
                            <TouchableOpacity
                                key={mode.id}
                                activeOpacity={0.8}
                                onPress={() => {
                                    setActiveMode(mode.id);
                                    setVoyaReflection(null);
                                }}
                                style={[
                                    styles.modeTabChip,
                                    {
                                        backgroundColor: isSelected
                                            ? (modeColor + (isDark ? '25' : '15'))
                                            : (isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.85)'),
                                        borderColor: isSelected ? modeColor : (isDark ? 'rgba(255, 255, 255, 0.10)' : 'rgba(0, 0, 0, 0.08)'),
                                    }
                                ]}
                            >
                                <Ionicons
                                    name={mode.icon as any}
                                    size={14}
                                    color={isSelected ? modeColor : theme.textSecondary}
                                    style={{ marginRight: 6 }}
                                />
                                <Text style={[
                                    styles.modeTabLabel,
                                    { color: isSelected ? modeColor : theme.textSecondary }
                                ]}>
                                    {mode.label}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 60 }]}
                keyboardShouldPersistTaps="handled"
            >
                {/* ================================================= */}
                {/* 1. STANDARD / REFLECTION MODE */}
                {/* ================================================= */}
                {activeMode === 'standard' && (
                    <>
                        {/* Title Input */}
                        <View style={styles.titleSection}>
                            <TextInput
                                style={[styles.titleInput, { color: theme.primary }]}
                                placeholder="Title of your thought..."
                                placeholderTextColor={theme.placeholder}
                                value={title}
                                onChangeText={setTitle}
                                maxLength={60}
                            />
                        </View>

                        {/* Mood Vibe Selector */}
                        <View style={styles.section}>
                            <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>How's your vibe?</Text>
                            <View style={styles.vibeGrid}>
                                {MOOD_VIBES.map((vibe, index) => {
                                    const vibeColor = isDark ? vibe.darkColor : vibe.color;
                                    const isSelected = selectedVibe === index;
                                    return (
                                        <TouchableOpacity
                                            key={index}
                                            style={[
                                                styles.vibeItem,
                                                {
                                                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(255, 255, 255, 0.90)',
                                                    borderColor: isSelected ? vibeColor : (isDark ? 'rgba(255, 255, 255, 0.10)' : 'rgba(0, 0, 0, 0.08)')
                                                },
                                                isSelected && { backgroundColor: vibeColor + (isDark ? '30' : '20'), borderColor: vibeColor }
                                            ]}
                                            onPress={() => setSelectedVibe(index)}
                                            activeOpacity={0.8}
                                        >
                                            <Text style={styles.vibeEmoji}>{vibe.emoji}</Text>
                                            <Text style={[styles.vibeLabel, { color: isSelected ? vibeColor : theme.textSecondary }]}>
                                                {vibe.label}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </View>

                        {/* Writing Area */}
                        <View style={[
                            styles.writingArea,
                            {
                                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.03)' : '#FFFFFF',
                                borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(120, 104, 230, 0.18)'
                            }
                        ]}>
                            <TextInput
                                style={[styles.journalInput, { color: theme.text }]}
                                placeholder="Let your thoughts flow freely here..."
                                placeholderTextColor={theme.placeholder}
                                multiline
                                value={text}
                                onChangeText={setText}
                            />
                        </View>

                        {/* Gratitude Section */}
                        <View style={[
                            styles.gratitudeCard,
                            {
                                backgroundColor: isDark ? 'rgba(176, 164, 241, 0.06)' : 'rgba(120, 104, 230, 0.08)',
                                borderColor: isDark ? 'rgba(176, 164, 241, 0.2)' : 'rgba(120, 104, 230, 0.22)'
                            }
                        ]}>
                            <View style={styles.gratitudeHeader}>
                                <Ionicons name="heart" size={16} color={theme.primary} />
                                <Text style={[styles.gratitudeTitle, { color: theme.primary }]}>One thing I'm grateful for...</Text>
                            </View>
                            <TextInput
                                style={[styles.gratitudeInput, { color: theme.text, borderBottomColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }]}
                                placeholder="Today, I am grateful for..."
                                placeholderTextColor={theme.placeholder}
                                value={gratitude}
                                onChangeText={setGratitude}
                            />
                        </View>
                    </>
                )}

                {/* ================================================= */}
                {/* 2. BURN & LET GO (CATHARTIC DISSOLVE) MODE */}
                {/* ================================================= */}
                {activeMode === 'burn' && (
                    <View style={styles.burnContainer}>
                        <View style={styles.burnHero}>
                            <Ionicons name="flame" size={32} color={isDark ? "#EF4444" : "#DC2626"} />
                            <Text style={[styles.burnTitle, { color: isDark ? '#EF4444' : '#DC2626' }]}>Cathartic Release</Text>
                            <Text style={[styles.burnSub, { color: theme.textSecondary }]}>
                                Write down heavy thoughts, anger, or worries. When you tap Burn, they will dissolve into cosmic stardust without saving a single trace.
                            </Text>
                        </View>

                        {burnReleased ? (
                            <View style={[
                                styles.burnReleasedCard,
                                {
                                    backgroundColor: isDark ? 'rgba(74, 222, 128, 0.10)' : 'rgba(34, 197, 94, 0.12)',
                                    borderColor: isDark ? 'rgba(74, 222, 128, 0.3)' : 'rgba(34, 197, 94, 0.3)'
                                }
                            ]}>
                                <Text style={styles.burnReleasedEmoji}>🕊️✨</Text>
                                <Text style={[styles.burnReleasedTitle, { color: isDark ? '#4ADE80' : '#15803D' }]}>Weight Released</Text>
                                <Text style={[styles.burnReleasedDesc, { color: theme.text }]}>
                                    Your heavy burden has dissolved into the cosmic night. Take a deep breath — this moment is a fresh beginning.
                                </Text>
                                <TouchableOpacity
                                    style={[
                                        styles.burnAnotherBtn,
                                        {
                                            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : '#FFFFFF',
                                            borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.12)'
                                        }
                                    ]}
                                    onPress={() => setBurnReleased(false)}
                                    activeOpacity={0.8}
                                >
                                    <Text style={[styles.burnAnotherBtnText, { color: theme.text }]}>Release Another Thought</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <Animated.View style={{ opacity: burnAnim, transform: [{ scale: burnAnim }] }}>
                                <View style={[
                                    styles.burnInputBox,
                                    {
                                        backgroundColor: isDark ? 'rgba(239, 68, 68, 0.08)' : 'rgba(239, 68, 68, 0.06)',
                                        borderColor: isDark ? 'rgba(239, 68, 68, 0.35)' : 'rgba(239, 68, 68, 0.30)'
                                    }
                                ]}>
                                    <TextInput
                                        style={[styles.burnTextInput, { color: isDark ? '#FECACA' : '#7F1D1D' }]}
                                        placeholder="Type everything that feels heavy, unfair, or painful right now..."
                                        placeholderTextColor={isDark ? "rgba(239, 68, 68, 0.45)" : "rgba(220, 38, 38, 0.5)"}
                                        multiline
                                        value={burnText}
                                        onChangeText={setBurnText}
                                        editable={!isBurning}
                                    />
                                </View>

                                <TouchableOpacity
                                    style={[styles.burnActionBtn, { backgroundColor: isDark ? '#EF4444' : '#DC2626' }, isBurning && { opacity: 0.5 }]}
                                    onPress={handleBurnAndRelease}
                                    disabled={isBurning}
                                    activeOpacity={0.85}
                                >
                                    {isBurning ? (
                                        <ActivityIndicator size="small" color="#FFF" />
                                    ) : (
                                        <>
                                            <Ionicons name="flame" size={18} color="#FFF" style={{ marginRight: 6 }} />
                                            <Text style={styles.burnActionText}>🔥 Burn & Release</Text>
                                        </>
                                    )}
                                </TouchableOpacity>
                            </Animated.View>
                        )}
                    </View>
                )}

                {/* ================================================= */}
                {/* 3. GRATITUDE GARDEN (3-BLOSSOM MICRO-GRATITUDE) */}
                {/* ================================================= */}
                {activeMode === 'gratitude' && (
                    <View style={styles.gratitudeGardenSection}>
                        <View style={styles.gardenHero}>
                            <Text style={styles.gardenHeroEmoji}>🌸🌿</Text>
                            <Text style={[styles.gardenHeroTitle, { color: isDark ? '#FBBF24' : '#D97706' }]}>3-Blossom Garden</Text>
                            <Text style={[styles.gardenHeroSub, { color: theme.textSecondary }]}>
                                Planting small seeds of gratitude rewires the mind toward peace and inner resilience.
                            </Text>
                        </View>

                        <View style={[
                            styles.blossomCard,
                            {
                                backgroundColor: isDark ? 'rgba(251, 191, 36, 0.08)' : 'rgba(255, 255, 255, 0.95)',
                                borderColor: isDark ? 'rgba(251, 191, 36, 0.22)' : 'rgba(245, 158, 11, 0.25)'
                            }
                        ]}>
                            <View style={styles.blossomHeader}>
                                <Text style={[styles.blossomTag, { color: isDark ? '#FBBF24' : '#B45309' }]}>🌸 Blossom 1</Text>
                                <Text style={[styles.blossomPrompt, { color: theme.text }]}>A simple comfort or small joy today...</Text>
                            </View>
                            <TextInput
                                style={[styles.blossomInput, { color: theme.text, borderBottomColor: isDark ? 'rgba(251, 191, 36, 0.2)' : 'rgba(217, 119, 6, 0.2)' }]}
                                placeholder="e.g., A warm cup of tea, gentle sunlight, a good song..."
                                placeholderTextColor={theme.placeholder}
                                value={gratitude1}
                                onChangeText={setGratitude1}
                            />
                        </View>

                        <View style={[
                            styles.blossomCard,
                            {
                                backgroundColor: isDark ? 'rgba(251, 191, 36, 0.08)' : 'rgba(255, 255, 255, 0.95)',
                                borderColor: isDark ? 'rgba(251, 191, 36, 0.22)' : 'rgba(245, 158, 11, 0.25)'
                            }
                        ]}>
                            <View style={styles.blossomHeader}>
                                <Text style={[styles.blossomTag, { color: isDark ? '#FBBF24' : '#B45309' }]}>🌱 Blossom 2</Text>
                                <Text style={[styles.blossomPrompt, { color: theme.text }]}>A moment of personal strength or resilience...</Text>
                            </View>
                            <TextInput
                                style={[styles.blossomInput, { color: theme.text, borderBottomColor: isDark ? 'rgba(251, 191, 36, 0.2)' : 'rgba(217, 119, 6, 0.2)' }]}
                                placeholder="e.g., I paused before reacting, I took a walk when tired..."
                                placeholderTextColor={theme.placeholder}
                                value={gratitude2}
                                onChangeText={setGratitude2}
                            />
                        </View>

                        <View style={[
                            styles.blossomCard,
                            {
                                backgroundColor: isDark ? 'rgba(251, 191, 36, 0.08)' : 'rgba(255, 255, 255, 0.95)',
                                borderColor: isDark ? 'rgba(251, 191, 36, 0.22)' : 'rgba(245, 158, 11, 0.25)'
                            }
                        ]}>
                            <View style={styles.blossomHeader}>
                                <Text style={[styles.blossomTag, { color: isDark ? '#FBBF24' : '#B45309' }]}>💖 Blossom 3</Text>
                                <Text style={[styles.blossomPrompt, { color: theme.text }]}>A kindness, connection, or person I cherish...</Text>
                            </View>
                            <TextInput
                                style={[styles.blossomInput, { color: theme.text, borderBottomColor: isDark ? 'rgba(251, 191, 36, 0.2)' : 'rgba(217, 119, 6, 0.2)' }]}
                                placeholder="e.g., A kind message from a friend, a gentle smile..."
                                placeholderTextColor={theme.placeholder}
                                value={gratitude3}
                                onChangeText={setGratitude3}
                            />
                        </View>
                    </View>
                )}

                {/* ================================================= */}
                {/* 4. SOMATIC BODY MAP JOURNAL */}
                {/* ================================================= */}
                {activeMode === 'somatic' && (
                    <View style={styles.somaticSection}>
                        <View style={styles.somaticHero}>
                            <Ionicons name="body-outline" size={28} color={isDark ? "#38BDF8" : "#0284C7"} />
                            <Text style={[styles.somaticHeroTitle, { color: isDark ? '#38BDF8' : '#0284C7' }]}>Somatic Body Scan</Text>
                            <Text style={[styles.somaticHeroSub, { color: theme.textSecondary }]}>
                                Emotions often speak through the body first. Tap where you feel physical tension right now.
                            </Text>
                        </View>

                        {/* Body Region Selector */}
                        <View style={styles.zoneGrid}>
                            {BODY_ZONES.map((zone) => {
                                const isSelected = selectedBodyZone === zone.id;
                                const zoneColor = isDark ? '#38BDF8' : '#0284C7';
                                return (
                                    <TouchableOpacity
                                        key={zone.id}
                                        activeOpacity={0.8}
                                        onPress={() => setSelectedBodyZone(zone.id)}
                                        style={[
                                            styles.zonePill,
                                            {
                                                backgroundColor: isSelected
                                                    ? (isDark ? 'rgba(56, 189, 248, 0.22)' : 'rgba(2, 132, 199, 0.12)')
                                                    : (isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.90)'),
                                                borderColor: isSelected ? zoneColor : (isDark ? 'rgba(255, 255, 255, 0.10)' : 'rgba(0, 0, 0, 0.08)'),
                                            }
                                        ]}
                                    >
                                        <Text style={styles.zoneEmoji}>{zone.emoji}</Text>
                                        <Text style={[styles.zoneLabel, { color: isSelected ? zoneColor : theme.text }]}>
                                            {zone.label}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>

                        {/* Selected Zone Grounding Box */}
                        {(() => {
                            const current = BODY_ZONES.find(z => z.id === selectedBodyZone);
                            return (
                                <View style={[
                                    styles.somaticTipCard,
                                    {
                                        backgroundColor: isDark ? 'rgba(56, 189, 248, 0.10)' : 'rgba(2, 132, 199, 0.08)',
                                        borderColor: isDark ? 'rgba(56, 189, 248, 0.25)' : 'rgba(2, 132, 199, 0.22)'
                                    }
                                ]}>
                                    <View style={styles.somaticTipHeader}>
                                        <Ionicons name="sparkles" size={15} color={isDark ? "#38BDF8" : "#0284C7"} style={{ marginRight: 6 }} />
                                        <Text style={[styles.somaticTipTitle, { color: isDark ? '#38BDF8' : '#0369A1' }]}>{current?.desc}</Text>
                                    </View>
                                    <Text style={[styles.somaticTipText, { color: theme.text }]}>💡 {current?.tip}</Text>
                                </View>
                            );
                        })()}

                        <View style={[
                            styles.writingArea,
                            {
                                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.03)' : '#FFFFFF',
                                borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(120, 104, 230, 0.18)'
                            }
                        ]}>
                            <TextInput
                                style={[styles.journalInput, { color: theme.text }]}
                                placeholder="Describe what this physical sensation feels like (heavy, sharp, fluttering, tight)..."
                                placeholderTextColor={theme.placeholder}
                                multiline
                                value={text}
                                onChangeText={setText}
                            />
                        </View>
                    </View>
                )}

                {/* ================================================= */}
                {/* 5. LETTER TO FUTURE SELF */}
                {/* ================================================= */}
                {activeMode === 'future' && (
                    <View style={styles.futureSection}>
                        <View style={styles.futureHero}>
                            <Ionicons name="mail-unread-outline" size={30} color={isDark ? "#EC4899" : "#DB2777"} />
                            <Text style={[styles.futureHeroTitle, { color: isDark ? '#EC4899' : '#DB2777' }]}>Time Capsule Letter</Text>
                            <Text style={[styles.futureHeroSub, { color: theme.textSecondary }]}>
                                Write a message of encouragement from your present self to be delivered when you need it most.
                            </Text>
                        </View>

                        <Text style={[styles.futureCondTitle, { color: theme.textSecondary }]}>Deliver this letter to me:</Text>
                        <View style={styles.futureCondGrid}>
                            {FUTURE_CONDITIONS.map((cond) => {
                                const isSelected = selectedFutureTrigger === cond.id;
                                const futureColor = isDark ? '#EC4899' : '#DB2777';
                                return (
                                    <TouchableOpacity
                                        key={cond.id}
                                        activeOpacity={0.8}
                                        onPress={() => setSelectedFutureTrigger(cond.id)}
                                        style={[
                                            styles.futureCondPill,
                                            {
                                                backgroundColor: isSelected
                                                    ? (isDark ? 'rgba(236, 72, 153, 0.22)' : 'rgba(219, 39, 119, 0.12)')
                                                    : (isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.90)'),
                                                borderColor: isSelected ? futureColor : (isDark ? 'rgba(255, 255, 255, 0.10)' : 'rgba(0, 0, 0, 0.08)'),
                                            }
                                        ]}
                                    >
                                        <Ionicons
                                            name={cond.icon as any}
                                            size={14}
                                            color={isSelected ? futureColor : theme.textSecondary}
                                            style={{ marginRight: 6 }}
                                        />
                                        <Text style={[styles.futureCondText, { color: isSelected ? futureColor : theme.text }]}>
                                            {cond.label}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>

                        <View style={[
                            styles.writingArea,
                            {
                                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.03)' : '#FFFFFF',
                                borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(120, 104, 230, 0.18)'
                            }
                        ]}>
                            <TextInput
                                style={[styles.journalInput, { color: theme.text }]}
                                placeholder="Dear Future Me, when you read this, remember that..."
                                placeholderTextColor={theme.placeholder}
                                multiline
                                value={text}
                                onChangeText={setText}
                            />
                        </View>
                    </View>
                )}

                {/* ================================================= */}
                {/* 🤖 VOYA AI COMPANION REFLECTOR BAR */}
                {/* ================================================= */}
                {activeMode !== 'burn' && (
                    <View style={styles.voyaReflectContainer}>
                        <TouchableOpacity
                            style={[styles.voyaReflectBtn, { backgroundColor: theme.primary }]}
                            onPress={handleReflectWithVoya}
                            disabled={isReflectingWithVoya}
                            activeOpacity={0.8}
                        >
                            <Ionicons name="sparkles" size={16} color={isDark ? "#000" : "#FFF"} style={{ marginRight: 6 }} />
                            <Text style={[styles.voyaReflectBtnText, { color: isDark ? '#000' : '#FFF' }]}>
                                {isReflectingWithVoya ? 'Reflecting with Voya...' : '✨ Reflect with Voya AI'}
                            </Text>
                        </TouchableOpacity>

                        {voyaReflection && (
                            <View style={[
                                styles.voyaReflectionCard,
                                {
                                    backgroundColor: isDark ? 'rgba(176, 164, 241, 0.12)' : 'rgba(120, 104, 230, 0.10)',
                                    borderColor: isDark ? 'rgba(176, 164, 241, 0.3)' : 'rgba(120, 104, 230, 0.25)'
                                }
                            ]}>
                                <View style={styles.voyaReflectionHeader}>
                                    <Ionicons name="sparkles-outline" size={15} color={theme.primary} style={{ marginRight: 6 }} />
                                    <Text style={[styles.voyaReflectionTitle, { color: theme.primary }]}>Voya's Compassionate Reflection</Text>
                                </View>
                                <Text style={[styles.voyaReflectionText, { color: theme.text }]}>{voyaReflection}</Text>
                            </View>
                        )}
                    </View>
                )}
            </ScrollView>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 18,
        paddingBottom: 12,
        zIndex: 20,
    },
    backButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    saveButton: {
        paddingVertical: 7,
        paddingHorizontal: 18,
        borderRadius: 14,
        minWidth: 64,
        alignItems: 'center',
    },
    saveText: {
        fontWeight: 'bold',
        fontSize: 13,
    },
    modeTabBar: {
        paddingVertical: 8,
        borderBottomWidth: 1,
    },
    modeTabScroll: {
        paddingHorizontal: 16,
        gap: 8,
    },
    modeTabChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 7,
        borderRadius: 14,
        borderWidth: 1,
    },
    modeTabLabel: {
        fontSize: 12,
        fontWeight: '700',
    },
    scrollContent: {
        padding: 18,
    },
    titleSection: {
        marginBottom: 16,
    },
    titleInput: {
        fontSize: 22,
        fontWeight: 'bold',
        paddingVertical: 8,
    },
    section: {
        marginBottom: 24,
    },
    sectionLabel: {
        fontSize: 11,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1.2,
        marginBottom: 12,
    },
    vibeGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    vibeItem: {
        alignItems: 'center',
        padding: 8,
        borderRadius: 14,
        borderWidth: 1,
        width: (width - 36 - 32) / 5,
    },
    vibeEmoji: {
        fontSize: 20,
        marginBottom: 3,
    },
    vibeLabel: {
        fontSize: 8,
        fontWeight: 'bold',
    },
    writingArea: {
        minHeight: 180,
        marginBottom: 20,
        borderRadius: 20,
        padding: 16,
        borderWidth: 1,
    },
    journalInput: {
        fontSize: 16,
        lineHeight: 24,
        textAlignVertical: 'top',
    },
    gratitudeCard: {
        padding: 16,
        borderRadius: 20,
        borderWidth: 1,
        marginBottom: 20,
    },
    gratitudeHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    gratitudeTitle: {
        fontSize: 13,
        fontWeight: '700',
        marginLeft: 8,
    },
    gratitudeInput: {
        fontSize: 14,
        paddingVertical: 6,
        borderBottomWidth: 1,
    },
    // Burn Section
    burnContainer: {
        paddingTop: 10,
    },
    burnHero: {
        alignItems: 'center',
        marginBottom: 20,
    },
    burnTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 6,
    },
    burnSub: {
        fontSize: 12,
        textAlign: 'center',
        lineHeight: 18,
        marginTop: 6,
        paddingHorizontal: 12,
    },
    burnInputBox: {
        minHeight: 220,
        borderRadius: 20,
        padding: 16,
        borderWidth: 1.5,
        marginBottom: 20,
    },
    burnTextInput: {
        fontSize: 16,
        lineHeight: 24,
        textAlignVertical: 'top',
    },
    burnActionBtn: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 14,
        borderRadius: 16,
        shadowColor: '#EF4444',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 6,
    },
    burnActionText: {
        color: '#FFF',
        fontSize: 15,
        fontWeight: 'bold',
    },
    burnReleasedCard: {
        alignItems: 'center',
        padding: 24,
        borderRadius: 24,
        borderWidth: 1,
        marginTop: 20,
    },
    burnReleasedEmoji: {
        fontSize: 40,
        marginBottom: 10,
    },
    burnReleasedTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    burnReleasedDesc: {
        fontSize: 13,
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 20,
    },
    burnAnotherBtn: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 14,
        borderWidth: 1,
    },
    burnAnotherBtnText: {
        fontSize: 13,
        fontWeight: '700',
    },
    // Gratitude Garden
    gratitudeGardenSection: {
        paddingTop: 10,
    },
    gardenHero: {
        alignItems: 'center',
        marginBottom: 20,
    },
    gardenHeroEmoji: {
        fontSize: 34,
        marginBottom: 4,
    },
    gardenHeroTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    gardenHeroSub: {
        fontSize: 12,
        textAlign: 'center',
        lineHeight: 18,
        marginTop: 4,
    },
    blossomCard: {
        borderRadius: 18,
        padding: 16,
        borderWidth: 1,
        marginBottom: 14,
    },
    blossomHeader: {
        marginBottom: 8,
    },
    blossomTag: {
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 0.5,
        marginBottom: 2,
    },
    blossomPrompt: {
        fontSize: 13,
        fontWeight: '600',
    },
    blossomInput: {
        fontSize: 14,
        paddingVertical: 6,
        borderBottomWidth: 1,
    },
    // Somatic Section
    somaticSection: {
        paddingTop: 10,
    },
    somaticHero: {
        alignItems: 'center',
        marginBottom: 20,
    },
    somaticHeroTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 6,
    },
    somaticHeroSub: {
        fontSize: 12,
        textAlign: 'center',
        lineHeight: 18,
        marginTop: 4,
    },
    zoneGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 16,
    },
    zonePill: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 14,
        borderWidth: 1,
    },
    zoneEmoji: {
        fontSize: 14,
        marginRight: 6,
    },
    zoneLabel: {
        fontSize: 12,
        fontWeight: '700',
    },
    somaticTipCard: {
        borderRadius: 16,
        padding: 14,
        borderWidth: 1,
        marginBottom: 16,
    },
    somaticTipHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    somaticTipTitle: {
        fontSize: 13,
        fontWeight: 'bold',
    },
    somaticTipText: {
        fontSize: 12,
        lineHeight: 18,
    },
    // Future Section
    futureSection: {
        paddingTop: 10,
    },
    futureHero: {
        alignItems: 'center',
        marginBottom: 20,
    },
    futureHeroTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 6,
    },
    futureHeroSub: {
        fontSize: 12,
        textAlign: 'center',
        lineHeight: 18,
        marginTop: 4,
    },
    futureCondTitle: {
        fontSize: 12,
        fontWeight: '700',
        marginBottom: 10,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    futureCondGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 18,
    },
    futureCondPill: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 14,
        borderWidth: 1,
    },
    futureCondText: {
        fontSize: 12,
        fontWeight: '700',
    },
    // Voya Reflector
    voyaReflectContainer: {
        marginTop: 10,
        marginBottom: 20,
    },
    voyaReflectBtn: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10,
        borderRadius: 14,
    },
    voyaReflectBtnText: {
        fontSize: 13,
        fontWeight: 'bold',
    },
    voyaReflectionCard: {
        borderRadius: 18,
        padding: 14,
        borderWidth: 1,
        marginTop: 12,
    },
    voyaReflectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    voyaReflectionTitle: {
        fontSize: 13,
        fontWeight: 'bold',
    },
    voyaReflectionText: {
        fontSize: 13,
        lineHeight: 20,
    },
});
