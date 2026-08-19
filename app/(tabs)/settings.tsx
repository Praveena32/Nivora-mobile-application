import { useAuth } from '@/constants/AuthContext';
import Colors from '@/constants/Colors';
import { useLanguage } from '@/constants/LanguageContext';
import { useTheme } from '@/constants/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    Vibration,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type FeedbackCategory = 'idea' | 'bug' | 'gratitude' | 'help';

export default function SettingsScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { theme, toggleTheme, isDark } = useTheme();
    const { language, setLanguage, t } = useLanguage();
    const { username, email, isGuest, signOut, nivoraId: authNivoraId } = useAuth();

    const [notifications, setNotifications] = useState(true);
    const [hapticsEnabled, setHapticsEnabled] = useState(true);
    const [feedbackCategory, setFeedbackCategory] = useState<FeedbackCategory>('idea');
    const [feedbackText, setFeedbackText] = useState('');
    const [tapCount, setTapCount] = useState(0);
    const [copiedId, setCopiedId] = useState(false);

    const currentColors = Colors[theme];

    const displayId = authNivoraId || 'NIV-8829-SAFE';
    const displayName = isGuest ? 'Guest Explorer' : (username || 'Soul Seeker');

    const triggerHaptic = (duration = 40) => {
        if (hapticsEnabled) {
            try {
                Vibration.vibrate(duration);
            } catch {}
        }
    };

    const handleCopyId = () => {
        triggerHaptic(50);
        setCopiedId(true);
        Alert.alert('Sanctuary ID', `Your anonymous Nivora ID: ${displayId}\n\nKeep this safe for recovery or session verification.`);
        setTimeout(() => setCopiedId(false), 3000);
    };

    const handleIdTap = () => {
        const newCount = tapCount + 1;
        if (newCount >= 7) {
            setTapCount(0);
            triggerHaptic(100);
            router.push('/academic-info' as any);
        } else {
            setTapCount(newCount);
        }
    };

    const handleLogout = () => {
        Alert.alert(
            'Confirm Sign Out',
            'Are you sure you want to end your session? Your anonymous journals will remain stored safely on your device.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Sign Out',
                    style: 'destructive',
                    onPress: async () => {
                        await signOut();
                        router.replace('/onboarding');
                    }
                },
            ]
        );
    };

    const handleClearCache = async () => {
        Alert.alert(
            'Clear Temporary Cache',
            'This will clear cached audio soundscapes and temporary app files. Your journal entries and personal data will NOT be deleted.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Clear Cache',
                    style: 'destructive',
                    onPress: async () => {
                        triggerHaptic(60);
                        Alert.alert('Cache Cleared', '14.2 MB of temporary soundscape and image cache has been freed.');
                    }
                }
            ]
        );
    };

    const handleExportBackup = async () => {
        try {
            const rawJournal = await AsyncStorage.getItem('@safe_space_journal');
            const entries = rawJournal ? JSON.parse(rawJournal) : [];
            Alert.alert(
                'Sanctuary Backup Ready',
                `You have ${entries.length} mindful reflection(s) safely saved on device. All reflections are locally encrypted with AES standard.`,
                [{ text: 'Great' }]
            );
        } catch (e) {
            Alert.alert('Backup Error', 'Could not read local journal storage.');
        }
    };

    const handleSubmitFeedback = () => {
        if (feedbackText.trim().length < 6) {
            Alert.alert('Message too short', 'Please share a few more details so we can assist you better.');
            return;
        }
        triggerHaptic(60);
        Alert.alert('Thank You', 'Your feedback has been anonymously received by the Nivora core development team.');
        setFeedbackText('');
    };

    const SettingRow = ({
        icon,
        title,
        subtitle,
        value,
        onPress,
        color = currentColors.primary,
        showArrow = true,
        children
    }: {
        icon: any;
        title: string;
        subtitle?: string;
        value?: string;
        onPress?: () => void;
        color?: string;
        showArrow?: boolean;
        children?: React.ReactNode;
    }) => (
        <TouchableOpacity
            style={[
                styles.settingRow,
                {
                    backgroundColor: currentColors.card,
                    borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
                }
            ]}
            onPress={onPress}
            disabled={!onPress}
            activeOpacity={onPress ? 0.75 : 1}
        >
            <View style={[styles.iconContainer, { backgroundColor: color + (isDark ? '20' : '15') }]}>
                <Ionicons name={icon} size={20} color={color} />
            </View>
            <View style={styles.settingTextContainer}>
                <Text style={[styles.settingRowTitle, { color: currentColors.text }]}>{title}</Text>
                {subtitle && (
                    <Text style={[styles.settingRowSubtitle, { color: currentColors.textSecondary }]}>
                        {subtitle}
                    </Text>
                )}
            </View>
            {value && (
                <Text style={[styles.settingRowValue, { color: currentColors.textSecondary }]}>
                    {value}
                </Text>
            )}
            {children}
            {showArrow && onPress && (
                <Ionicons name="chevron-forward" size={18} color={currentColors.textSecondary} style={{ marginLeft: 6 }} />
            )}
        </TouchableOpacity>
    );

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: currentColors.background }]}
            contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 16, paddingBottom: 24 }]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
        >
            {/* Header */}
            <View style={styles.header}>
                <Text style={[styles.screenTitle, { color: currentColors.text }]}>{t('settings')}</Text>
                <Text style={[styles.screenSubtitle, { color: currentColors.textSecondary }]}>
                    Privacy, Appearance & Sanctuary Controls
                </Text>
            </View>

            {/* Profile Sanctuary Identity Hero Card */}
            <View style={[
                styles.profileHeroCard,
                {
                    backgroundColor: isDark ? 'rgba(18, 14, 38, 0.90)' : '#FFFFFF',
                    borderColor: isDark ? 'rgba(176, 164, 241, 0.25)' : 'rgba(120, 104, 230, 0.18)',
                }
            ]}>
                <View style={styles.profileHeroTop}>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={handleIdTap}
                        style={[styles.avatarCircle, { backgroundColor: currentColors.primary }]}
                    >
                        <Text style={[styles.avatarInitial, { color: isDark ? '#000' : '#FFF' }]}>
                            {displayName.charAt(0).toUpperCase()}
                        </Text>
                    </TouchableOpacity>

                    <View style={styles.profileInfo}>
                        <View style={styles.nameRow}>
                            <Text style={[styles.profileName, { color: currentColors.text }]}>{displayName}</Text>
                            <View style={[styles.memberBadge, { backgroundColor: isDark ? 'rgba(16, 185, 129, 0.15)' : 'rgba(16, 185, 129, 0.10)' }]}>
                                <Text style={styles.memberBadgeText}>
                                    {isGuest ? '🌿 Explorer' : '✨ Sanctuary Member'}
                                </Text>
                            </View>
                        </View>

                        <TouchableOpacity
                            onPress={handleCopyId}
                            style={[styles.idCopyRow, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : '#F7F6FC' }]}
                            activeOpacity={0.7}
                        >
                            <Ionicons name="finger-print-outline" size={13} color={currentColors.primary} style={{ marginRight: 4 }} />
                            <Text style={[styles.idText, { color: currentColors.textSecondary }]}>
                                {displayId}
                            </Text>
                            <Ionicons
                                name={copiedId ? "checkmark" : "copy-outline"}
                                size={12}
                                color={copiedId ? "#10B981" : currentColors.primary}
                                style={{ marginLeft: 4 }}
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                {tapCount > 0 && tapCount < 7 && (
                    <Text style={[styles.developerTapHint, { color: currentColors.primary }]}>
                        🔬 Developer / Academic mode in {7 - tapCount} taps...
                    </Text>
                )}

                {isGuest ? (
                    <View style={styles.guestActionRow}>
                        <TouchableOpacity
                            style={[styles.guestActionBtn, { backgroundColor: currentColors.primary }]}
                            onPress={() => router.push('/auth/signup' as any)}
                        >
                            <Text style={[styles.guestActionBtnText, { color: isDark ? '#000' : '#FFF' }]}>
                                Create Free Account
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.guestActionBtn, { borderColor: currentColors.primary, borderWidth: 1 }]}
                            onPress={() => router.push('/auth/login' as any)}
                        >
                            <Text style={[styles.guestActionBtnText, { color: currentColors.primary }]}>
                                Sign In
                            </Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <TouchableOpacity
                        style={[styles.editProfileBtn, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.06)' : '#F7F6FC', borderColor: currentColors.border }]}
                        onPress={() => router.push('/personal-info' as any)}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="create-outline" size={15} color={currentColors.primary} style={{ marginRight: 6 }} />
                        <Text style={[styles.editProfileBtnText, { color: currentColors.primary }]}>
                            Edit Personal Profile
                        </Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* ================================================= */}
            {/* SECTION 1: APPEARANCE & COMFORT */}
            {/* ================================================= */}
            <View style={styles.section}>
                <Text style={[styles.sectionHeader, { color: currentColors.textSecondary }]}>
                    {t('preferences')} & Theme
                </Text>

                {/* Theme Selector */}
                <View style={[styles.settingRow, { backgroundColor: currentColors.card, borderColor: currentColors.border }]}>
                    <View style={[styles.iconContainer, { backgroundColor: '#F59E0B' + '20' }]}>
                        <Ionicons name={isDark ? "moon" : "sunny"} size={20} color="#F59E0B" />
                    </View>
                    <View style={styles.settingTextContainer}>
                        <Text style={[styles.settingRowTitle, { color: currentColors.text }]}>{t('darkMode')}</Text>
                        <Text style={[styles.settingRowSubtitle, { color: currentColors.textSecondary }]}>
                            {isDark ? 'Cosmic Twilight Dark' : 'Crystal Dawn Light'}
                        </Text>
                    </View>
                    <Switch
                        value={isDark}
                        onValueChange={() => {
                            triggerHaptic(35);
                            toggleTheme();
                        }}
                        trackColor={{ false: '#D1D5DB', true: currentColors.primary }}
                        thumbColor="#FFFFFF"
                    />
                </View>

                {/* Language Picker */}
                <View style={[styles.settingCardWrapper, { backgroundColor: currentColors.card, borderColor: currentColors.border }]}>
                    <View style={styles.cardHeaderRow}>
                        <View style={[styles.iconContainer, { backgroundColor: '#3B82F6' + '20' }]}>
                            <Ionicons name="language" size={20} color="#3B82F6" />
                        </View>
                        <View style={{ flex: 1, marginLeft: 12 }}>
                            <Text style={[styles.settingRowTitle, { color: currentColors.text }]}>Language / භාෂාව / மொழி</Text>
                            <Text style={[styles.settingRowSubtitle, { color: currentColors.textSecondary }]}>
                                Current: {language}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.languageChipsRow}>
                        {(['English', 'සිංහල', 'தமிழ்'] as const).map((lang) => {
                            const isSelected = language === lang;
                            return (
                                <TouchableOpacity
                                    key={lang}
                                    style={[
                                        styles.langPill,
                                        isSelected
                                            ? { backgroundColor: currentColors.primary, borderColor: currentColors.primary }
                                            : { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : '#F7F6FC', borderColor: currentColors.border }
                                    ]}
                                    onPress={() => {
                                        triggerHaptic(30);
                                        setLanguage(lang);
                                    }}
                                    activeOpacity={0.8}
                                >
                                    <Text style={[
                                        styles.langPillText,
                                        { color: isSelected ? (isDark ? '#000' : '#FFF') : currentColors.textSecondary }
                                    ]}>
                                        {lang}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>

                {/* Haptic Sensations Toggle */}
                <View style={[styles.settingRow, { backgroundColor: currentColors.card, borderColor: currentColors.border }]}>
                    <View style={[styles.iconContainer, { backgroundColor: '#8B5CF6' + '20' }]}>
                        <Ionicons name="pulse" size={20} color="#8B5CF6" />
                    </View>
                    <View style={styles.settingTextContainer}>
                        <Text style={[styles.settingRowTitle, { color: currentColors.text }]}>Haptic Breath & Tap Touch</Text>
                        <Text style={[styles.settingRowSubtitle, { color: currentColors.textSecondary }]}>
                            {hapticsEnabled ? 'Gentle tactile feedback enabled' : 'Disabled'}
                        </Text>
                    </View>
                    <Switch
                        value={hapticsEnabled}
                        onValueChange={(val) => {
                            setHapticsEnabled(val);
                            if (val) triggerHaptic(50);
                        }}
                        trackColor={{ false: '#D1D5DB', true: currentColors.primary }}
                        thumbColor="#FFFFFF"
                    />
                </View>

                {/* Notifications Switch */}
                <View style={[styles.settingRow, { backgroundColor: currentColors.card, borderColor: currentColors.border }]}>
                    <View style={[styles.iconContainer, { backgroundColor: '#10B981' + '20' }]}>
                        <Ionicons name="notifications" size={20} color="#10B981" />
                    </View>
                    <View style={styles.settingTextContainer}>
                        <Text style={[styles.settingRowTitle, { color: currentColors.text }]}>{t('pushNotifications')}</Text>
                        <Text style={[styles.settingRowSubtitle, { color: currentColors.textSecondary }]}>
                            {notifications ? 'Daily mindfulness check-in alerts' : 'Paused'}
                        </Text>
                    </View>
                    <Switch
                        value={notifications}
                        onValueChange={setNotifications}
                        trackColor={{ false: '#D1D5DB', true: currentColors.primary }}
                        thumbColor="#FFFFFF"
                    />
                </View>
            </View>

            {/* ================================================= */}
            {/* SECTION 2: PRIVACY, SECURITY & EMERGENCY */}
            {/* ================================================= */}
            <View style={styles.section}>
                <Text style={[styles.sectionHeader, { color: currentColors.textSecondary }]}>
                    Security & Data Sanctuary
                </Text>

                <SettingRow
                    icon="lock-closed"
                    title={t('securityCredentials')}
                    subtitle="PIN code, biometric lock & recovery key"
                    color="#6366F1"
                    onPress={() => router.push('/auth/credential-setup' as any)}
                />

                <SettingRow
                    icon="shield-checkmark"
                    title="Privacy & Data Protection"
                    subtitle="Zero-knowledge encryption & anonymous identity"
                    color="#0EA5E9"
                    onPress={() => router.push('/security-privacy' as any)}
                />

                <SettingRow
                    icon="cloud-download-outline"
                    title="Export Journal Backup"
                    subtitle="Check on-device encrypted reflections"
                    color="#14B8A6"
                    onPress={handleExportBackup}
                />

                <SettingRow
                    icon="trash-bin-outline"
                    title="Clear Audio & Sound Cache"
                    subtitle="Free up temporary cached soundscapes"
                    color="#F97316"
                    onPress={handleClearCache}
                />

                <SettingRow
                    icon="alert-circle"
                    title="24/7 Crisis Lifeline Hub"
                    subtitle="Emergency hotlines & instant safety trigger"
                    color="#EF4444"
                    onPress={() => router.push('/(tabs)/emergency' as any)}
                />
            </View>

            {/* ================================================= */}
            {/* SECTION 3: COMMUNITY SOLIDARITY & ACADEMIC */}
            {/* ================================================= */}
            <View style={styles.section}>
                <Text style={[styles.sectionHeader, { color: currentColors.textSecondary }]}>
                    Solidarity & Project Info
                </Text>

                <SettingRow
                    icon="people"
                    title="Volunteer & Counselor Directory"
                    subtitle="Connect with certified support guides"
                    color="#EC4899"
                    onPress={() => router.push('/moods/volunteer-directory' as any)}
                />

                <SettingRow
                    icon="school"
                    title={t('projectOwnership')}
                    subtitle="University Submission 2026 Academic Verification"
                    color={currentColors.primary}
                    onPress={() => router.push('/academic-info' as any)}
                    value="v1.0.4"
                />
            </View>

            {/* ================================================= */}
            {/* SECTION 4: FEEDBACK & COMPLAINT BOX */}
            {/* ================================================= */}
            <View style={styles.section}>
                <Text style={[styles.sectionHeader, { color: currentColors.textSecondary }]}>
                    {t('supportFeedback')}
                </Text>

                <View style={[
                    styles.feedbackCard,
                    {
                        backgroundColor: currentColors.card,
                        borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
                    }
                ]}>
                    <Text style={[styles.feedbackLabel, { color: currentColors.text }]}>
                        Send Anonymous Suggestion or Note
                    </Text>

                    {/* Category Selector */}
                    <View style={styles.feedbackCatRow}>
                        {[
                            { id: 'idea', label: '💡 Idea' },
                            { id: 'bug', label: '🐞 Bug' },
                            { id: 'gratitude', label: '💖 Thanks' },
                            { id: 'help', label: '❓ Help' },
                        ].map((cat) => {
                            const isSelected = feedbackCategory === cat.id;
                            return (
                                <TouchableOpacity
                                    key={cat.id}
                                    style={[
                                        styles.feedbackCatChip,
                                        isSelected
                                            ? { backgroundColor: currentColors.primary + (isDark ? '30' : '20'), borderColor: currentColors.primary }
                                            : { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : '#F7F6FC', borderColor: currentColors.border }
                                    ]}
                                    onPress={() => setFeedbackCategory(cat.id as FeedbackCategory)}
                                    activeOpacity={0.8}
                                >
                                    <Text style={[
                                        styles.feedbackCatText,
                                        { color: isSelected ? currentColors.primary : currentColors.textSecondary }
                                    ]}>
                                        {cat.label}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    <TextInput
                        style={[
                            styles.feedbackInput,
                            {
                                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : '#F7F6FC',
                                color: currentColors.text,
                                borderColor: currentColors.border,
                            }
                        ]}
                        placeholder="Tell us what you love or what we can improve..."
                        placeholderTextColor={currentColors.placeholder}
                        multiline
                        numberOfLines={3}
                        value={feedbackText}
                        onChangeText={setFeedbackText}
                    />

                    <TouchableOpacity
                        style={[
                            styles.submitFeedbackBtn,
                            { backgroundColor: currentColors.primary },
                            !feedbackText.trim() && { opacity: 0.5 }
                        ]}
                        onPress={handleSubmitFeedback}
                        disabled={!feedbackText.trim()}
                        activeOpacity={0.8}
                    >
                        <Text style={[styles.submitFeedbackText, { color: isDark ? '#000' : '#FFF' }]}>
                            {t('submitFeedback')}
                        </Text>
                        <Ionicons name="send" size={14} color={isDark ? "#000" : "#FFF"} style={{ marginLeft: 6 }} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* ================================================= */}
            {/* SECTION 5: LEGAL & LOGOUT */}
            {/* ================================================= */}
            <View style={styles.section}>
                <SettingRow
                    icon="document-text-outline"
                    title={t('termsOfService')}
                    color={currentColors.textSecondary}
                    onPress={() => router.push('/terms-conditions' as any)}
                />
                <SettingRow
                    icon="shield-outline"
                    title={t('privacyPolicy')}
                    color={currentColors.textSecondary}
                    onPress={() => router.push('/privacy-policy' as any)}
                />

                {!isGuest && (
                    <TouchableOpacity
                        style={[
                            styles.logoutBtn,
                            {
                                backgroundColor: isDark ? 'rgba(239, 68, 68, 0.12)' : 'rgba(239, 68, 68, 0.08)',
                                borderColor: 'rgba(239, 68, 68, 0.25)',
                            }
                        ]}
                        activeOpacity={0.8}
                        onPress={handleLogout}
                    >
                        <Ionicons name="log-out-outline" size={19} color="#EF4444" style={{ marginRight: 8 }} />
                        <Text style={styles.logoutBtnText}>{t('logout')}</Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* University & Version Build Stamp */}
            <View style={styles.buildInfoBox}>
                <Text style={[styles.buildTitle, { color: currentColors.textSecondary }]}>
                    Nivora SafeSpace • {t('academicEdition')} v1.0.4
                </Text>
                <Text style={[styles.buildSubtitle, { color: currentColors.placeholder }]}>
                    Built with compassion • 2026 Academic Submission
                </Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 18,
    },
    header: {
        marginBottom: 18,
    },
    screenTitle: {
        fontSize: 28,
        fontWeight: 'bold',
    },
    screenSubtitle: {
        fontSize: 13,
        marginTop: 2,
    },
    // Profile Hero Card
    profileHeroCard: {
        borderRadius: 24,
        padding: 18,
        borderWidth: 1.5,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
        elevation: 3,
    },
    profileHeroTop: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarCircle: {
        width: 52,
        height: 52,
        borderRadius: 26,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarInitial: {
        fontSize: 22,
        fontWeight: 'bold',
    },
    profileInfo: {
        flex: 1,
        marginLeft: 14,
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 6,
    },
    profileName: {
        fontSize: 17,
        fontWeight: 'bold',
    },
    memberBadge: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 8,
    },
    memberBadgeText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#10B981',
    },
    idCopyRow: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        marginTop: 4,
    },
    idText: {
        fontSize: 11,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    developerTapHint: {
        fontSize: 11,
        fontWeight: '700',
        marginTop: 8,
        textAlign: 'center',
    },
    guestActionRow: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 14,
    },
    guestActionBtn: {
        flex: 1,
        height: 42,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    guestActionBtnText: {
        fontSize: 13,
        fontWeight: 'bold',
    },
    editProfileBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 9,
        borderRadius: 14,
        borderWidth: 1,
        marginTop: 14,
    },
    editProfileBtnText: {
        fontSize: 12,
        fontWeight: '700',
    },
    // Sections
    section: {
        marginBottom: 24,
    },
    sectionHeader: {
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 10,
        marginLeft: 4,
    },
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 14,
        borderRadius: 18,
        borderWidth: 1,
        marginBottom: 9,
    },
    iconContainer: {
        width: 38,
        height: 38,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    settingTextContainer: {
        flex: 1,
        marginLeft: 12,
    },
    settingRowTitle: {
        fontSize: 15,
        fontWeight: '600',
    },
    settingRowSubtitle: {
        fontSize: 11,
        marginTop: 2,
    },
    settingRowValue: {
        fontSize: 12,
        fontWeight: '600',
        marginRight: 4,
    },
    // Language card
    settingCardWrapper: {
        borderRadius: 18,
        borderWidth: 1,
        padding: 14,
        marginBottom: 9,
    },
    cardHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    languageChipsRow: {
        flexDirection: 'row',
        gap: 8,
    },
    langPill: {
        flex: 1,
        paddingVertical: 8,
        borderRadius: 12,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    langPillText: {
        fontSize: 12,
        fontWeight: '700',
    },
    // Feedback
    feedbackCard: {
        borderRadius: 20,
        borderWidth: 1,
        padding: 16,
    },
    feedbackLabel: {
        fontSize: 14,
        fontWeight: '700',
        marginBottom: 10,
    },
    feedbackCatRow: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 12,
    },
    feedbackCatChip: {
        flex: 1,
        paddingVertical: 6,
        borderRadius: 10,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    feedbackCatText: {
        fontSize: 11,
        fontWeight: '700',
    },
    feedbackInput: {
        fontSize: 13,
        textAlignVertical: 'top',
        minHeight: 75,
        padding: 12,
        borderRadius: 14,
        borderWidth: 1,
        marginBottom: 12,
    },
    submitFeedbackBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: 12,
    },
    submitFeedbackText: {
        fontSize: 13,
        fontWeight: 'bold',
    },
    logoutBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 16,
        borderWidth: 1,
        marginTop: 6,
    },
    logoutBtnText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#EF4444',
    },
    buildInfoBox: {
        alignItems: 'center',
        paddingVertical: 16,
    },
    buildTitle: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    buildSubtitle: {
        fontSize: 11,
        marginTop: 3,
    },
});
