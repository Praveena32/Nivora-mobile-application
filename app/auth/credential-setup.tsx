import { useAuth } from '@/constants/AuthContext';
import Colors from '@/constants/Colors';
import { useTheme } from '@/constants/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import {
    Dimensions,
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

const SECURITY_IMAGES = [
    { id: '1', emoji: '🏔️', label: 'Mountain' },
    { id: '2', emoji: '🌊', label: 'Ocean' },
    { id: '3', emoji: '🌳', label: 'Forest' },
    { id: '4', emoji: '🌅', label: 'Sunset' },
    { id: '5', emoji: '🌙', label: 'Moon' },
    { id: '6', emoji: '✨', label: 'Sparkles' },
];

export default function CredentialSetupScreen() {
    const [step, setStep] = useState(1);
    const [form, setForm] = useState({
        password: '',
        confirmPassword: '',
        pin: '',
        securityImage: '',
        securityQuiz: { question: '', answer: '' },
    });

    // Verification state
    const [verifyImage, setVerifyImage] = useState('');
    const [verifyAnswer, setVerifyAnswer] = useState('');

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const pinInputRef = useRef<TextInput>(null);

    const {
        securityImage: currentSecImage,
        securityQuiz: currentSecQuiz,
        updateProfile
    } = useAuth();

    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { theme: themeName } = useTheme();
    const theme = Colors[themeName];

    const nextStep = () => {
        setError('');
        if (step === 1) {
            if (verifyImage !== currentSecImage || verifyAnswer.toLowerCase() !== currentSecQuiz?.answer.toLowerCase()) {
                setError('Verification failed. Please check your recovery image and answer.');
                return;
            }
        } else if (step === 2) {
            if (!form.password || !form.confirmPassword) {
                setError('Please fill in all fields.');
                return;
            }
            if (form.password !== form.confirmPassword) {
                setError('Passwords do not match.');
                return;
            }
        } else if (step === 3) {
            if (form.pin.length !== 6) {
                setError('Please enter a 6-digit PIN.');
                return;
            }
            if (!form.securityImage) {
                setError('Please select a security image.');
                return;
            }
        }
        setStep(prev => prev + 1);
    };

    const prevStep = () => {
        setError('');
        setStep(prev => prev - 1);
    };

    const handleUpdate = async () => {
        if (!form.securityQuiz.question || !form.securityQuiz.answer) {
            setError('Please complete the security quiz.');
            return;
        }
        await updateProfile({
            password: form.password,
            pin: form.pin,
            securityImage: form.securityImage,
            securityQuiz: form.securityQuiz,
            hasChangedPassword: true,
        });
        router.back();
    };

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
                        <Text style={styles.title}>
                            {step === 1 ? 'Shield Verification' : 'Update Sanctuary'}
                        </Text>
                        <Text style={styles.subtitle}>
                            {step === 1 ? 'Confirm your current recovery keys' : `Step ${step - 1} of 3`}
                        </Text>
                    </View>

                    {step === 1 && (
                        <View style={styles.stepContainer}>
                            <Text style={styles.label}>Identify Recovery Image</Text>
                            <View style={[styles.imageGrid, { marginBottom: 0 }]}>
                                {SECURITY_IMAGES.map(img => (
                                    <TouchableOpacity
                                        key={img.id}
                                        style={[
                                            styles.imageItem,
                                            {
                                                width: '48%',
                                                aspectRatio: 1.25, // Slightly taller/larger
                                                paddingVertical: 5
                                            },
                                            verifyImage === img.id && styles.imageItemActive
                                        ]}
                                        onPress={() => setVerifyImage(img.id)}
                                    >
                                        <Text style={[styles.imageEmoji, { fontSize: 50, marginBottom: 0 }]}>{img.emoji}</Text>
                                        <Text style={[styles.imageLabel, { fontSize: 11 }]}>{img.label}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <View style={[styles.inputGroup, { marginBottom: 15 }]}>
                                <Text style={styles.miniLabel}>Security Question: {currentSecQuiz?.question}</Text>
                                <View style={styles.compactWrapper}>
                                    <Ionicons name="help-circle-outline" size={18} color="rgba(176, 164, 241, 0.4)" style={styles.prefixIcon} />
                                    <TextInput
                                        style={styles.compactInput}
                                        placeholder="Your answer"
                                        placeholderTextColor="rgba(255,255,255,0.2)"
                                        value={verifyAnswer}
                                        onChangeText={setVerifyAnswer}
                                        autoCapitalize="none"
                                    />
                                </View>
                            </View>

                            {error ? <Text style={styles.compactError}>{error}</Text> : null}

                            <TouchableOpacity style={[styles.nextButton, { height: 44, marginTop: 4 }]} onPress={nextStep}>
                                <Text style={styles.nextButtonText}>Verify & Proceed</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {step === 2 && (
                        <View style={styles.stepContainer}>
                            <View style={styles.inputGroup}>
                                <Text style={styles.miniLabel}>New Password</Text>
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
                                <Text style={styles.miniLabel}>Confirm New Password</Text>
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

                            {error ? <Text style={styles.compactError}>{error}</Text> : null}

                            <View style={styles.buttonRow}>
                                <TouchableOpacity style={styles.prevButton} onPress={prevStep}>
                                    <Text style={styles.prevButtonText}>Back</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.nextButton, styles.halfButton]} onPress={nextStep}>
                                    <Text style={styles.nextButtonText}>Continue</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}

                    {step === 3 && (
                        <View style={styles.stepContainer}>
                            <Text style={styles.label}>Update Safety PIN</Text>
                            <TouchableOpacity
                                style={styles.pinGridContainer}
                                onPress={() => pinInputRef.current?.focus()}
                                activeOpacity={1}
                            >
                                <TextInput
                                    ref={pinInputRef}
                                    style={styles.hiddenInput}
                                    keyboardType="numeric"
                                    maxLength={6}
                                    value={form.pin}
                                    onChangeText={text => setForm({ ...form, pin: text })}
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
                            </TouchableOpacity>

                            <Text style={[styles.label, { marginTop: 20 }]}>New Security Image</Text>
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
                                        <Text style={styles.imageLabel}>{img.label}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            {error ? <Text style={styles.compactError}>{error}</Text> : null}

                            <View style={styles.buttonRow}>
                                <TouchableOpacity style={styles.prevButton} onPress={prevStep}>
                                    <Text style={styles.prevButtonText}>Back</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.nextButton, styles.halfButton]} onPress={nextStep}>
                                    <Text style={styles.nextButtonText}>Continue</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}

                    {step === 4 && (
                        <View style={styles.stepContainer}>
                            <Text style={styles.label}>New Security Quiz</Text>
                            <View style={styles.inputGroup}>
                                <Text style={styles.miniLabel}>Recovery Question</Text>
                                <View style={styles.compactWrapper}>
                                    <TextInput
                                        style={styles.compactInput}
                                        placeholder="e.g. My first pet's name?"
                                        placeholderTextColor="rgba(255,255,255,0.2)"
                                        value={form.securityQuiz.question}
                                        onChangeText={text => setForm({ ...form, securityQuiz: { ...form.securityQuiz, question: text } })}
                                    />
                                </View>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.miniLabel}>Answer</Text>
                                <View style={styles.compactWrapper}>
                                    <TextInput
                                        style={styles.compactInput}
                                        placeholder="Secure answer"
                                        placeholderTextColor="rgba(255,255,255,0.2)"
                                        value={form.securityQuiz.answer}
                                        onChangeText={text => setForm({ ...form, securityQuiz: { ...form.securityQuiz, answer: text } })}
                                        autoCapitalize="none"
                                    />
                                </View>
                            </View>

                            {error ? <Text style={styles.compactError}>{error}</Text> : null}

                            <View style={styles.buttonRow}>
                                <TouchableOpacity style={styles.prevButton} onPress={prevStep}>
                                    <Text style={styles.prevButtonText}>Back</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.signupButton} onPress={handleUpdate}>
                                    <Text style={styles.signupButtonText}>Update All</Text>
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
        padding: 16,
        flexGrow: 1,
    },
    backButton: {
        marginBottom: 10,
    },
    header: {
        marginBottom: 6,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFF',
    },
    subtitle: {
        fontSize: 12,
        color: 'rgba(176, 164, 241, 0.6)',
        marginTop: 2,
    },
    stepContainer: {
        flex: 1,
    },
    label: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 2,
    },
    inputGroup: {
        marginBottom: 4,
    },
    miniLabel: {
        fontSize: 11,
        color: 'rgba(255,255,255,0.5)',
        marginBottom: 1,
        marginLeft: 4,
    },
    compactWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 10,
        height: 42,
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
    imageGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 0,
    },
    imageItem: {
        width: '48%',
        aspectRatio: 1.1,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 4,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    imageItemActive: {
        borderColor: '#B0A4F1',
        backgroundColor: 'rgba(176, 164, 241, 0.1)',
    },
    imageEmoji: {
        fontSize: 52,
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
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 5,
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
    prevButton: {
        width: '48%',
        height: 54,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    prevButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
    },
    signupButton: {
        width: '48%',
        backgroundColor: '#B0A4F1',
        borderRadius: 16,
        height: 54,
        justifyContent: 'center',
        alignItems: 'center',
    },
    signupButtonText: {
        color: '#000',
        fontWeight: 'bold',
    },
    halfButton: {
        width: '48%',
        height: 54,
        marginTop: 0,
    },
    compactError: {
        color: '#FF6B6B',
        fontSize: 12,
        textAlign: 'center',
        marginBottom: 10,
    },
});
