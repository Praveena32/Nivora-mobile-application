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
    const { theme: themeName } = useTheme();
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
        <View style={[styles.container, { backgroundColor: '#050510', paddingTop: insets.top, paddingBottom: insets.bottom }]}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="chevron-back" size={28} color="#B0A4F1" />
                    </TouchableOpacity>

                    <View style={styles.header}>
                        <Text style={styles.title}>{t('createSanctuary')}</Text>
                        <Text style={styles.subtitle}>{t('secureAccountStep')} {step}/3</Text>
                    </View>

                    {step === 1 && (
                        <View style={styles.stepContainer}>
                            <View style={styles.inputGroup}>
                                <Text style={styles.miniLabel}>{t('uniqueUsernameLabel')}</Text>
                                <View style={styles.compactWrapper}>
                                    <Ionicons name="person-outline" size={18} color="rgba(176, 164, 241, 0.4)" style={styles.prefixIcon} />
                                    <TextInput
                                        style={styles.compactInput}
                                        placeholder={t('soulSeekerPlaceholder')}
                                        placeholderTextColor="rgba(255,255,255,0.2)"
                                        value={form.username}
                                        onChangeText={text => setForm({ ...form, username: text })}
                                        autoCapitalize="none"
                                    />
                                </View>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.miniLabel}>{t('emailAddress')}</Text>
                                <View style={styles.compactWrapper}>
                                    <Ionicons name="mail-outline" size={18} color="rgba(176, 164, 241, 0.4)" style={styles.prefixIcon} />
                                    <TextInput
                                        style={styles.compactInput}
                                        placeholder="your@email.com"
                                        placeholderTextColor="rgba(255,255,255,0.2)"
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        value={form.email}
                                        onChangeText={text => setForm({ ...form, email: text })}
                                    />
                                </View>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.miniLabel}>{t('password')}</Text>
                                <View style={styles.compactWrapper}>
                                    <Ionicons name="lock-closed-outline" size={18} color="rgba(176, 164, 241, 0.4)" style={styles.prefixIcon} />
                                    <TextInput
                                        style={styles.compactInput}
                                        placeholder="••••••••"
                                        placeholderTextColor="rgba(255,255,255,0.2)"
                                        secureTextEntry={!showPassword}
                                        value={form.password}
                                        onChangeText={text => setForm({ ...form, password: text })}
                                        autoCapitalize="none"
                                    />
                                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.suffixIcon}>
                                        <Ionicons name={showPassword ? "eye-off" : "eye"} size={18} color="rgba(176, 164, 241, 0.4)" />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.miniLabel}>{t('confirmPassword')}</Text>
                                <View style={styles.compactWrapper}>
                                    <Ionicons name="shield-checkmark-outline" size={18} color="rgba(176, 164, 241, 0.4)" style={styles.prefixIcon} />
                                    <TextInput
                                        style={styles.compactInput}
                                        placeholder="••••••••"
                                        placeholderTextColor="rgba(255,255,255,0.2)"
                                        secureTextEntry={!showConfirmPassword}
                                        value={form.confirmPassword}
                                        onChangeText={text => setForm({ ...form, confirmPassword: text })}
                                        autoCapitalize="none"
                                    />
                                    <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.suffixIcon}>
                                        <Ionicons name={showConfirmPassword ? "eye-off" : "eye"} size={18} color="rgba(176, 164, 241, 0.4)" />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <TouchableOpacity
                                style={styles.privacyContainer}
                                activeOpacity={0.7}
                                onPress={() => setAgreedToPrivacy(!agreedToPrivacy)}
                            >
                                <View style={[styles.miniCheckbox, agreedToPrivacy && styles.checked]}>
                                    {agreedToPrivacy && <Ionicons name="checkmark" size={12} color="#000" />}
                                </View>
                                <Text style={styles.privacyPrompt}>
                                    {t('agreePrivacy')} <Text style={styles.link} onPress={() => router.push('/privacy-policy')}>{t('privacyStatement')}</Text>
                                </Text>
                            </TouchableOpacity>

                            {error ? <Text style={styles.compactError}>{error}</Text> : null}

                            <TouchableOpacity style={styles.nextButton} onPress={nextStep}>
                                <Text style={styles.nextButtonText}>{t('continueBtn')}</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {step === 2 && (
                        <View style={styles.stepContainer}>
                            <Text style={styles.label}>{t('safetyPinImage')}</Text>
                            <Text style={styles.description}>{t('pinImageDesc')}</Text>

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
                                            form.pin.length === index && styles.pinBoxActive,
                                            form.pin.length > index && styles.pinBoxFilled
                                        ]}
                                    >
                                        <Text style={styles.pinText}>
                                            {form.pin[index] ? '•' : ''}
                                        </Text>
                                    </View>
                                ))}
                            </Pressable>

                            <Text style={[styles.label, { marginTop: 25 }]}>{t('chooseSecurityImage')}</Text>
                            <View style={styles.imageGrid}>
                                {SECURITY_IMAGES.map(img => (
                                    <TouchableOpacity
                                        key={img.id}
                                        style={[
                                            styles.imageItem,
                                            form.securityImage === img.id && styles.imageItemActive
                                        ]}
                                        onPress={() => setForm({ ...form, securityImage: img.id })}
                                    >
                                        <Text style={styles.imageEmoji}>{img.emoji}</Text>
                                        <Text style={styles.imageLabel}>{t(img.label as any)}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <View style={styles.buttonRow}>
                                <TouchableOpacity style={styles.prevButton} onPress={prevStep}>
                                    <Text style={styles.prevButtonText}>{t('backBtn')}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.nextButton, styles.halfButton]} onPress={nextStep}>
                                    <Text style={styles.nextButtonText}>{t('continueBtn')}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}

                    {step === 3 && (
                        <View style={styles.stepContainer}>
                            <Text style={styles.label}>{t('securityQuiz')}</Text>
                            <Text style={styles.description}>{t('securityQuizDesc')}</Text>

                            <TextInput
                                ref={questionRef}
                                style={styles.input}
                                placeholder={t('securityQuestionPlaceholder')}
                                placeholderTextColor="rgba(255,255,255,0.3)"
                                value={form.securityQuiz.question}
                                onChangeText={text => setForm({ ...form, securityQuiz: { ...form.securityQuiz, question: text } })}
                                onSubmitEditing={() => answerRef.current?.focus()}
                                blurOnSubmit={false}
                            />
                            <TextInput
                                ref={answerRef}
                                style={styles.input}
                                placeholder={t('theAnswer')}
                                placeholderTextColor="rgba(255,255,255,0.3)"
                                value={form.securityQuiz.answer}
                                onChangeText={text => setForm({ ...form, securityQuiz: { ...form.securityQuiz, answer: text } })}
                            />

                            {error ? <Text style={styles.compactError}>{error}</Text> : null}

                            <View style={styles.buttonRow}>
                                <TouchableOpacity style={styles.prevButton} onPress={prevStep}>
                                    <Text style={styles.prevButtonText}>{t('backBtn')}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
                                    <Text style={styles.signupButtonText}>{t('completeSignup')}</Text>
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
