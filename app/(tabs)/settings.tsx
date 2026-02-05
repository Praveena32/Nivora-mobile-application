import { useAuth } from '@/constants/AuthContext';
import Colors from '@/constants/Colors';
import { useLanguage } from '@/constants/LanguageContext';
import { useTheme } from '@/constants/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
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
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Language = 'English' | 'සිංහල' | 'தமிழ்';

export default function SettingsScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { theme, toggleTheme, isDark } = useTheme();
    const { language, setLanguage, t } = useLanguage();
    const { username, email, isGuest, signOut, nivoraId: authNivoraId } = useAuth();

    const [notifications, setNotifications] = useState(true);
    const [complaint, setComplaint] = useState('');
    const [tapCount, setTapCount] = useState(0);

    const currentColors = Colors[theme];

    const handleIdTap = () => {
        const newCount = tapCount + 1;
        if (newCount >= 7) {
            setTapCount(0);
            router.push('/academic-info' as any);
        } else {
            setTapCount(newCount);
        }
    };

    const handleLogout = () => {
        Alert.alert(
            'Confirm Logout',
            'Are you sure you want to end your session? Your username or email will be required to log back in.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: async () => {
                        await signOut();
                        router.replace('/onboarding');
                    }
                },
            ]
        );
    };

    const handleSubmitComplaint = () => {
        if (complaint.trim().length < 10) {
            Alert.alert('Message too short', 'Please provide a bit more detail so we can help you better.');
            return;
        }
        Alert.alert('Feedback Received', 'Thank you for helping us improve Nivora. We will look into this immediately.');
        setComplaint('');
    };

    const SettingItem = ({ icon, title, value, onPress, color = '#B0A4F1' }: {
        icon: any,
        title: string,
        value?: string,
        onPress?: () => void,
        color?: string
    }) => (
        <TouchableOpacity
            style={[styles.settingItem, { backgroundColor: isDark ? '#111' : '#F0F0F0', borderColor: isDark ? '#222' : '#E0E0E0' }]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={[styles.iconBox, { backgroundColor: color + '15' }]}>
                <Ionicons name={icon} size={22} color={color} />
            </View>
            <View style={styles.settingContent}>
                <Text style={[styles.settingTitle, { color: currentColors.text }]}>{title}</Text>
                {value && <Text style={styles.settingValue}>{value}</Text>}
            </View>
            <Ionicons name="chevron-forward" size={20} color={isDark ? '#333' : '#CCC'} />
        </TouchableOpacity>
    );

    return (
        <ScrollView
            style={[styles.container, { paddingTop: insets.top + 20, backgroundColor: currentColors.background }]}
            showsVerticalScrollIndicator={false}
        >
            {/* Header */}
            <View style={styles.header}>
                <Text style={[styles.title, { color: currentColors.text }]}>{t('settings')}</Text>
            </View>

            {/* User Account Section */}
            <TouchableOpacity
                activeOpacity={1}
                onPress={handleIdTap}
                style={styles.profileSection}
            >
                <View style={styles.avatarPlaceholder}>
                    <Ionicons name="person" size={40} color={isDark ? "#000" : "#FFF"} />
                    <TouchableOpacity style={[styles.editAvatar, { backgroundColor: isDark ? '#333' : '#666' }]}>
                        <Ionicons name="camera" size={16} color="#fff" />
                    </TouchableOpacity>
                </View>
                <Text style={[styles.userName, { color: currentColors.text }]}>{isGuest ? 'Guest User' : (username || 'Soul Seeker')}</Text>
                <Text style={styles.userEmail}>{isGuest ? 'Sign up to sync data' : (authNivoraId || 'ID Pending...')}</Text>
                {tapCount > 0 && tapCount < 7 && (
                    <Text style={styles.tapHint}>Developer mode in {7 - tapCount}...</Text>
                )}
            </TouchableOpacity>

            {isGuest && (
                <View style={styles.authTabs}>
                    <TouchableOpacity
                        style={[styles.authTab, { backgroundColor: '#B0A4F1' }]}
                        onPress={() => router.push('/auth/signup' as any)}
                    >
                        <Text style={styles.authTabText}>{t('signUp' as any)}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.authTab, { backgroundColor: 'transparent', borderColor: '#B0A4F1', borderWidth: 1 }]}
                        onPress={() => router.push('/auth/login' as any)}
                    >
                        <Text style={[styles.authTabText, { color: '#B0A4F1' }]}>{t('login' as any)}</Text>
                    </TouchableOpacity>
                </View>
            )}

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>{t('account')}</Text>
                <SettingItem icon="person-outline" title={t('personalInfo')} onPress={() => router.push('/personal-info' as any)} />
                <SettingItem icon="lock-closed-outline" title={t('securityCredentials')} onPress={() => router.push('/auth/credential-setup' as any)} />
                <SettingItem
                    icon="school"
                    title={t('projectOwnership')}
                    color="#B0A4F1"
                    onPress={() => router.push('/academic-info' as any)}
                    value={t('verifyIdentity')}
                />
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>{t('preferences')}</Text>

                {/* Theme Toggle */}
                <View style={[styles.settingItem, { backgroundColor: isDark ? '#111' : '#F0F0F0', borderColor: isDark ? '#222' : '#E0E0E0' }]}>
                    <View style={[styles.iconBox, { backgroundColor: '#FFD700' + '15' }]}>
                        <Ionicons name={isDark ? "moon-outline" : "sunny-outline"} size={22} color="#FFD700" />
                    </View>
                    <View style={styles.settingContent}>
                        <Text style={[styles.settingTitle, { color: currentColors.text }]}>{t('darkMode')}</Text>
                        <Text style={styles.settingValue}>{isDark ? t('cozyDark') : t('crispLight')}</Text>
                    </View>
                    <Switch
                        value={isDark}
                        onValueChange={toggleTheme}
                        trackColor={{ false: '#CCC', true: '#B0A4F1' }}
                        thumbColor={isDark ? '#fff' : '#888'}
                    />
                </View>

                {/* Language Selection */}
                <TouchableOpacity
                    style={[styles.settingItem, { backgroundColor: isDark ? '#111' : '#F0F0F0', borderColor: isDark ? '#222' : '#E0E0E0' }]}
                    activeOpacity={0.7}
                >
                    <View style={[styles.iconBox, { backgroundColor: '#2196F3' + '15' }]}>
                        <Ionicons name="language-outline" size={22} color="#2196F3" />
                    </View>
                    <View style={styles.settingContent}>
                        <Text style={[styles.settingTitle, { color: currentColors.text }]}>{t('languageSelection')}</Text>
                        <View style={styles.languageRow}>
                            {['English', 'සිංහල', 'தமிழ்'].map((lang) => (
                                <TouchableOpacity
                                    key={lang}
                                    onPress={() => setLanguage(lang as any)}
                                    style={[styles.langChip, language === lang ? styles.activeLangChip : { backgroundColor: isDark ? '#222' : '#DDD' }]}
                                >
                                    <Text style={[styles.langText, language === lang && styles.activeLangText]}>{lang}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </TouchableOpacity>

                {/* Notification Toggle */}
                <View style={[styles.settingItem, { backgroundColor: isDark ? '#111' : '#F0F0F0', borderColor: isDark ? '#222' : '#E0E0E0' }]}>
                    <View style={[styles.iconBox, { backgroundColor: '#4CAF50' + '15' }]}>
                        <Ionicons name="notifications-outline" size={22} color="#4CAF50" />
                    </View>
                    <View style={styles.settingContent}>
                        <Text style={[styles.settingTitle, { color: currentColors.text }]}>{t('pushNotifications')}</Text>
                        <Text style={styles.settingValue}>{t('enabled')}</Text>
                    </View>
                    <Switch
                        value={notifications}
                        onValueChange={setNotifications}
                        trackColor={{ false: '#CCC', true: '#B0A4F1' }}
                        thumbColor={notifications ? '#fff' : '#888'}
                    />
                </View>
            </View>

            {/* Complain Box Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>{t('supportFeedback')}</Text>
                <View style={[styles.complaintBox, { backgroundColor: isDark ? '#111' : '#F0F0F0', borderColor: isDark ? '#222' : '#E0E0E0' }]}>
                    <Text style={styles.complaintLabel}>{t('complaintBox')}</Text>
                    <TextInput
                        style={[styles.complaintInput, { backgroundColor: isDark ? '#000' : '#FFF', color: currentColors.text, borderColor: isDark ? '#222' : '#E0E0E0' }]}
                        placeholder={t('complaintPlaceholder')}
                        placeholderTextColor="#888"
                        multiline
                        numberOfLines={4}
                        value={complaint}
                        onChangeText={setComplaint}
                    />
                    <TouchableOpacity
                        style={[styles.submitButton, !complaint.trim() && { opacity: 0.5 }]}
                        onPress={handleSubmitComplaint}
                        disabled={!complaint.trim()}
                    >
                        <Text style={styles.submitText}>{t('submitFeedback')}</Text>
                        <Ionicons name="send" size={16} color="#000" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Legal & Logout */}
            <View style={styles.footerSection}>
                <SettingItem icon="document-text-outline" title={t('termsOfService')} color="#666" onPress={() => router.push('/terms-conditions' as any)} />
                <SettingItem icon="shield-checkmark-outline" title={t('privacyPolicy')} color="#666" onPress={() => router.push('/privacy-policy' as any)} />

                {!isGuest && (
                    <TouchableOpacity
                        style={[styles.settingItem, styles.logoutItem, { backgroundColor: 'rgba(244, 67, 54, 0.05)', borderColor: 'rgba(244, 67, 54, 0.2)' }]}
                        activeOpacity={0.7}
                        onPress={handleLogout}
                    >
                        <View style={[styles.iconBox, { backgroundColor: '#F44336' + '15' }]}>
                            <Ionicons name="log-out-outline" size={22} color="#F44336" />
                        </View>
                        <View style={styles.settingContent}>
                            <Text style={[styles.settingTitle, { color: '#F44336' }]}>{t('logout')}</Text>
                        </View>
                    </TouchableOpacity>
                )}
            </View>
            <View style={styles.buildInfo}>
                <Text style={styles.buildText}>{t('academicEdition')} • v1.0.4</Text>
                <Text style={styles.buildSub}>Project Nivora - University Submission 2026</Text>
            </View>

            <View style={{ height: 100 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 20,
        marginBottom: 30,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
    },
    profileSection: {
        alignItems: 'center',
        marginBottom: 40,
    },
    avatarPlaceholder: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#B0A4F1',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },
    authTabs: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        marginBottom: 30,
        gap: 12,
    },
    authTab: {
        flex: 1,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    authTabText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#000',
    },
    editAvatar: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#000',
    },
    userName: {
        fontSize: 22,
        fontWeight: 'bold',
    },
    userEmail: {
        color: '#666',
        fontSize: 14,
        marginTop: 4,
    },
    section: {
        paddingHorizontal: 20,
        marginBottom: 35,
    },
    sectionTitle: {
        color: '#666',
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        marginBottom: 15,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 20,
        marginBottom: 12,
        borderWidth: 1,
    },
    iconBox: {
        width: 44,
        height: 44,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    settingContent: {
        flex: 1,
    },
    settingTitle: {
        fontSize: 16,
        fontWeight: '600',
    },
    settingValue: {
        color: '#888',
        fontSize: 13,
        marginTop: 2,
    },
    languageRow: {
        flexDirection: 'row',
        marginTop: 10,
        gap: 8,
    },
    langChip: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 10,
    },
    activeLangChip: {
        backgroundColor: '#B0A4F1',
    },
    langText: {
        color: '#888',
        fontSize: 11,
        fontWeight: 'bold',
    },
    activeLangText: {
        color: '#000',
    },
    complaintBox: {
        padding: 20,
        borderRadius: 24,
        borderWidth: 1,
    },
    complaintLabel: {
        color: '#B0A4F1',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    complaintInput: {
        fontSize: 14,
        textAlignVertical: 'top',
        minHeight: 100,
        padding: 15,
        borderRadius: 16,
        borderWidth: 1,
    },
    submitButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#B0A4F1',
        paddingVertical: 12,
        borderRadius: 12,
        marginTop: 15,
        gap: 8,
    },
    submitText: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 14,
    },
    logoutItem: {
        // Other logout specific styles
    },
    footerSection: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    buildInfo: {
        alignItems: 'center',
        paddingVertical: 20,
        opacity: 0.4,
    },
    buildText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#888',
    },
    buildSub: {
        fontSize: 10,
        color: '#666',
        marginTop: 4,
    },
    tapHint: {
        fontSize: 10,
        color: '#B0A4F1',
        marginTop: 5,
    }
});
