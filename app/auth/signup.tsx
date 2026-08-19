import { useAuth } from '@/constants/AuthContext';
import Colors from '@/constants/Colors';
import { useLanguage } from '@/constants/LanguageContext';
import { useTheme } from '@/constants/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import {
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const SECURITY_IMAGES = [
    { id: '1', emoji: '🏔️', label: 'mountain' },
    { id: '2', emoji: '🌊', label: 'ocean' },
    { id: '3', emoji: '🌳', label: 'forest' },
    { id: '4', emoji: '🌅', label: 'sunset' },
    { id: '5', emoji: '🌙', label: 'moon' },
    { id: '6', emoji: '✨', label: 'sparkles' },
];

export default function SignupScreen() {
    const [step, setStep] = useState(1);
    const [form, setForm] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        pin: '',
        securityImage: '',
        securityQuiz: { question: '', answer: '' },
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);
    const [error, setError] = useState('');

    const { signUp } = useAuth();
    const router = useRouter();
    const { theme: themeName, isDark } = useTheme();
    const theme = Colors[themeName];
    const { t } = useLanguage();
    const insets = useSafeAreaInsets();

    const pinInputRef = useRef<TextInput>(null);
    const questionRef = useRef<TextInput>(null);
    const answerRef = useRef<TextInput>(null);

    const handleSignup = async () => {
        if (!form.securityQuiz.question || !form.securityQuiz.answer) {
            setError(t('completeSecurityQuiz'));
            return;
        }

        try {
            setError('');
            const { confirmPassword, ...signupData } = form;
            await signUp({
                ...signupData,
                isLoggedIn: true,
                isGuest: false,
                isUnlocked: true,
                hasChangedUsername: false,
                hasChangedPassword: false,
                hasCompletedOnboarding: true,
                nivoraId: null, // Initialized by signUp
            });
            router.replace('/(tabs)');
        } catch (err) {
            setError(t('failedCreateAccount'));
            console.error(err);
        }
    };

    const nextStep = () => {
        if (step === 1) {
            if (!form.username || !form.email || !form.password || !form.confirmPassword) {
                setError(t('fillAllFields'));
                return;
            }
            if (form.password !== form.confirmPassword) {
                setError(t('passwordsDoNotMatch'));
                return;
            }
            if (!agreedToPrivacy) {
                setError(t('agreePrivacyPolicy'));
                return;
            }
        } else if (step === 2) {
            if (form.pin.length !== 6) {
                setError(t('enter6DigitPin'));
                return;
            }
            if (!form.securityImage) {
                setError(t('selectSecurityImage'));
                return;
            }
        }
        setError('');
        const nextStepNum = step + 1;
        setStep(nextStepNum);

        // Autofocus next step inputs
        setTimeout(() => {
            if (nextStepNum === 2) pinInputRef.current?.focus();
            if (nextStepNum === 3) questionRef.current?.focus();
        }, 100);
    };
    const prevStep = () => setStep(prev => prev - 1);

    return (
        <View style={[styles.container, { backgroundColor: theme.background, paddingTop: insets.top, paddingBottom: insets.bottom }]}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top : 0}
                style={{ flex: 1 }}
            >
                <ScrollView
                    contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 30 }]}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <TouchableOpacity onPress={() => router.back()} style={[styles.backButton, { backgroundColor: theme.surfaceSecondary, borderColor: theme.border, borderWidth: 1 }]}>
                        <Ionicons name="chevron-back" size={28} color={theme.primary} />
                    </TouchableOpacity>

                    {/* Step indicator */}
                    <View style={styles.stepIndicator}>
                        {[1, 2, 3].map((i) => (
                            <View
                                key={i}
                                style={[
                                    styles.stepDot,
                                    { backgroundColor: theme.border },
                                    i === step && [styles.stepDotActive, { backgroundColor: theme.primary }],
                                    i < step && [styles.stepDotCompleted, { backgroundColor: theme.primary }],
                                ]}
                            />
                        ))}
                    </View>

                    <View style={styles.header}>
                        <Text style={[styles.title, { color: theme.text }]}>
                            {t('createSanctuary')}
                        </Text>
                        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                            {t('secureAccountStep')} {step}/3
                        </Text>
                    </View>

                    {error ? <Text style={styles.compactError}>{error}</Text> : null}

                    {/* Step 1: Basic Info */}
                    {step === 1 && (
                        <View style={styles.stepContainer}>
                            <View style={styles.inputGroup}>
                                <Text style={[styles.miniLabel, { color: theme.textSecondary }]}>{t('uniqueUsernameLabel')}</Text>
                                <View style={[styles.compactWrapper, { backgroundColor: theme.inputBackground, borderColor: theme.border }]}>
                                    <Ionicons name="person-outline" size={18} color={theme.placeholder} style={styles.prefixIcon} />
                                    <TextInput
                                        style={[styles.compactInput, { color: theme.text }]}
                                        placeholder="Enter a safe username"
                                        placeholderTextColor={theme.placeholder}
                                        value={form.username}
                                        onChangeText={text => setForm({ ...form, username: text })}
                                        autoCapitalize="none"
                                    />
                                </View>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={[styles.miniLabel, { color: theme.textSecondary }]}>{t('emailAddress')}</Text>
                                <View style={[styles.compactWrapper, { backgroundColor: theme.inputBackground, borderColor: theme.border }]}>
                                    <Ionicons name="mail-outline" size={18} color={theme.placeholder} style={styles.prefixIcon} />
                                    <TextInput
                                        style={[styles.compactInput, { color: theme.text }]}
                                        placeholder="your@email.com"
                                        placeholderTextColor={theme.placeholder}
                                        value={form.email}
                                        onChangeText={text => setForm({ ...form, email: text })}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                    />
                                </View>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={[styles.miniLabel, { color: theme.textSecondary }]}>{t('password')}</Text>
                                <View style={[styles.compactWrapper, { backgroundColor: theme.inputBackground, borderColor: theme.border }]}>
                                    <Ionicons name="lock-closed-outline" size={18} color={theme.placeholder} style={styles.prefixIcon} />
                                    <TextInput
                                        style={[styles.compactInput, { color: theme.text }]}
                                        placeholder="••••••••"
                                        placeholderTextColor={theme.placeholder}
                                        secureTextEntry={!showPassword}
                                        value={form.password}
                                        onChangeText={text => setForm({ ...form, password: text })}
                                    />
                                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.suffixIcon}>
                                        <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={18} color={theme.placeholder} />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={[styles.miniLabel, { color: theme.textSecondary }]}>{t('confirmPassword')}</Text>
                                <View style={[styles.compactWrapper, { backgroundColor: theme.inputBackground, borderColor: theme.border }]}>
                                    <Ionicons name="lock-closed-outline" size={18} color={theme.placeholder} style={styles.prefixIcon} />
                                    <TextInput
                                        style={[styles.compactInput, { color: theme.text }]}
                                        placeholder="••••••••"
                                        placeholderTextColor={theme.placeholder}
                                        secureTextEntry={!showConfirmPassword}
                                        value={form.confirmPassword}
                                        onChangeText={text => setForm({ ...form, confirmPassword: text })}
                                    />
                                    <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.suffixIcon}>
                                        <Ionicons name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} size={18} color={theme.placeholder} />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <TouchableOpacity
                                style={styles.privacyContainer}
                                onPress={() => setAgreedToPrivacy(!agreedToPrivacy)}
                                activeOpacity={0.8}
                            >
                                <View style={[styles.miniCheckbox, { borderColor: theme.border }, agreedToPrivacy && [styles.checked, { backgroundColor: theme.primary, borderColor: theme.primary }]]}>
                                    {agreedToPrivacy && <Ionicons name="checkmark" size={12} color={isDark ? "#000" : "#FFF"} />}
                                </View>
                                <Text style={[styles.privacyPrompt, { color: theme.textSecondary }]}>
                                    {t('agreePrivacy')} <Text style={[styles.link, { color: theme.primary }]}>{t('privacyPolicy')}</Text>
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={[styles.nextButton, { backgroundColor: theme.primary }]} onPress={nextStep}>
                                <Text style={[styles.nextButtonText, { color: isDark ? '#000' : '#FFF' }]}>{t('continueBtn')}</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {step === 2 && (
                        <View style={styles.stepContainer}>
                            <Text style={[styles.label, { color: theme.text }]}>{t('safetyPinImage')}</Text>
                            <Text style={[styles.description, { color: theme.textSecondary }]}>{t('pinImageDesc')}</Text>

                            <Pressable style={styles.pinGridContainer} onPress={() => pinInputRef.current?.focus()}>
                                <TextInput
                                    ref={pinInputRef}
                                    style={styles.hiddenInput}
                                    keyboardType="numeric"
                                    maxLength={6}
                                    value={form.pin}
                                    onChangeText={text => setForm({ ...form, pin: text })}
                                    autoFocus
                                />
                                {[0, 1, 2, 3, 4, 5].map((index) => (
                                    <View
                                        key={index}
                                        style={[
                                            styles.pinBox,
                                            { backgroundColor: theme.surfaceSecondary, borderColor: theme.border },
                                            form.pin.length === index && [styles.pinBoxActive, { borderColor: theme.primary }],
                                            form.pin.length > index && [styles.pinBoxFilled, { borderColor: theme.primary }]
                                        ]}
                                    >
                                        <Text style={[styles.pinText, { color: theme.text }]}>
                                            {form.pin[index] ? '•' : ''}
                                        </Text>
                                    </View>
                                ))}
                            </Pressable>

                            <Text style={[styles.label, { color: theme.text, marginTop: 25 }]}>{t('chooseSecurityImage')}</Text>
                            <View style={styles.imageGrid}>
                                {SECURITY_IMAGES.map(img => (
                                    <TouchableOpacity
                                        key={img.id}
                                        style={[
                                            styles.imageItem,
                                            { backgroundColor: theme.surfaceSecondary, borderColor: theme.border },
                                            form.securityImage === img.id && [styles.imageItemActive, { borderColor: theme.primary, backgroundColor: isDark ? 'rgba(176,164,241,0.15)' : 'rgba(120,104,230,0.15)' }]
                                        ]}
                                        onPress={() => setForm({ ...form, securityImage: img.id })}
                                    >
                                        <Text style={styles.imageEmoji}>{img.emoji}</Text>
                                        <Text style={[styles.imageLabel, { color: theme.text }]}>{t(img.label as any)}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <View style={styles.buttonRow}>
                                <TouchableOpacity style={[styles.prevButton, { backgroundColor: theme.surfaceSecondary, borderColor: theme.border }]} onPress={prevStep}>
                                    <Text style={[styles.prevButtonText, { color: theme.text }]}>{t('backBtn')}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.nextButton, styles.halfButton, { backgroundColor: theme.primary }]} onPress={nextStep}>
                                    <Text style={[styles.nextButtonText, { color: isDark ? '#000' : '#FFF' }]}>{t('continueBtn')}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}

                    {step === 3 && (
                        <View style={styles.stepContainer}>
                            <Text style={[styles.label, { color: theme.text }]}>{t('securityQuiz')}</Text>
                            <Text style={[styles.description, { color: theme.textSecondary }]}>{t('securityQuizDesc')}</Text>

                            <TextInput
                                ref={questionRef}
                                style={[styles.input, { backgroundColor: theme.inputBackground, borderColor: theme.border, color: theme.text }]}
                                placeholder={t('securityQuestionPlaceholder')}
                                placeholderTextColor={theme.placeholder}
                                value={form.securityQuiz.question}
                                onChangeText={text => setForm({ ...form, securityQuiz: { ...form.securityQuiz, question: text } })}
                                onSubmitEditing={() => answerRef.current?.focus()}
                                blurOnSubmit={false}
                            />
                            <TextInput
                                ref={answerRef}
                                style={[styles.input, { backgroundColor: theme.inputBackground, borderColor: theme.border, color: theme.text }]}
                                placeholder={t('theAnswer')}
                                placeholderTextColor={theme.placeholder}
                                value={form.securityQuiz.answer}
                                onChangeText={text => setForm({ ...form, securityQuiz: { ...form.securityQuiz, answer: text } })}
                            />

                            {error ? <Text style={styles.compactError}>{error}</Text> : null}

                            <View style={styles.buttonRow}>
                                <TouchableOpacity style={[styles.prevButton, { backgroundColor: theme.surfaceSecondary, borderColor: theme.border }]} onPress={prevStep}>
                                    <Text style={[styles.prevButtonText, { color: theme.text }]}>{t('backBtn')}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.signupButton, { backgroundColor: theme.primary }]} onPress={handleSignup}>
                                    <Text style={[styles.signupButtonText, { color: isDark ? '#000' : '#FFF' }]}>{t('completeSignup')}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
        flexGrow: 1,
    },
    stepIndicator: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 16,
    },
    stepDot: {
        width: 24,
        height: 6,
        borderRadius: 3,
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    stepDotActive: {
        width: 32,
    },
    stepDotCompleted: {
        opacity: 0.8,
    },
    backButton: {
        marginBottom: 20,
    },
    header: {
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFF',
    },
    subtitle: {
        fontSize: 14,
        color: 'rgba(176, 164, 241, 0.6)',
        marginTop: 4,
    },
    stepContainer: {
        flex: 1,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 10,
    },
    description: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.6)',
        marginBottom: 20,
    },
    input: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 12,
        padding: 15,
        color: '#FFF',
        fontSize: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(176, 164, 241, 0.2)',
    },
    nextButton: {
        backgroundColor: '#B0A4F1',
        borderRadius: 12,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    nextButtonText: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 15,
    },
    inputGroup: {
        marginBottom: 12,
    },
    miniLabel: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.5)',
        marginBottom: 5,
        marginLeft: 4,
    },
    compactWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 10,
        height: 50,
        borderWidth: 1,
        borderColor: 'rgba(176, 164, 241, 0.1)',
        paddingHorizontal: 12,
    },
    compactInput: {
        flex: 1,
        color: '#FFF',
        fontSize: 14,
        height: '100%',
    },
    prefixIcon: {
        marginRight: 10,
    },
    suffixIcon: {
        marginLeft: 10,
        padding: 5,
    },
    privacyContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        marginBottom: 12,
    },
    miniCheckbox: {
        width: 18,
        height: 18,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: 'rgba(176, 164, 241, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    checked: {
        backgroundColor: '#B0A4F1',
        borderColor: '#B0A4F1',
    },
    privacyPrompt: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.6)',
    },
    link: {
        color: '#B0A4F1',
        fontWeight: 'bold',
    },
    compactError: {
        color: '#FF6B6B',
        fontSize: 12,
        textAlign: 'center',
        marginBottom: 10,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 5, // Drastically reduced
    },
    prevButton: {
        width: '48%', // Standardized
        height: 54,   // Standardized height
        borderRadius: 16,
        justifyContent: 'center', // Centering content for fixed height
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    prevButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
    },
    signupButton: {
        width: '48%', // Standardized
        height: 54,   // Standardized height
        backgroundColor: '#B0A4F1',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    signupButtonText: {
        color: '#000',
        fontWeight: 'bold',
    },
    halfButton: { // Added for Continue button in split rows
        width: '48%',
        height: 54,
        marginTop: 0, // Remove top margin when in row
    },
    imageGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 0, // Removed gap below grid
    },
    imageItem: {
        width: '48%',
        aspectRatio: 1.1, // Slightly wider than tall to save vertical space
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10, // Reduced from 15
        borderWidth: 2,
        borderColor: 'transparent',
    },
    imageItemActive: {
        borderColor: '#B0A4F1',
        backgroundColor: 'rgba(176, 164, 241, 0.1)',
    },
    imageEmoji: {
        fontSize: 52, // Scaled up
        marginBottom: 8,
    },
    imageLabel: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 13,
        fontWeight: '500',
    },
    pinGridContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        marginBottom: 20,
    },
    hiddenInput: {
        position: 'absolute',
        width: 1,
        height: 1,
        opacity: 0,
    },
    pinBox: {
        width: 45,
        height: 55,
        borderRadius: 10,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1,
        borderColor: 'rgba(176, 164, 241, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    pinBoxActive: {
        borderColor: '#B0A4F1',
        backgroundColor: 'rgba(176, 164, 241, 0.1)',
    },
    pinBoxFilled: {
        borderColor: 'rgba(176, 164, 241, 0.5)',
    },
    pinText: {
        color: '#FFF',
        fontSize: 24,
        fontWeight: 'bold',
    },
});
