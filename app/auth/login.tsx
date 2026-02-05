import { useAuth } from '@/constants/AuthContext';
import Colors from '@/constants/Colors';
import { useLanguage } from '@/constants/LanguageContext';
import { useTheme } from '@/constants/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function LoginScreen() {
    const [loginMethod, setLoginMethod] = useState<'password' | 'pin'>('password');
    const [form, setForm] = useState({
        username: '',
        password: '',
        pin: '',
    });

    const [showPassword, setShowPassword] = useState(false);

    const { signIn } = useAuth();
    const router = useRouter();
    const { theme: themeName } = useTheme();
    const theme = Colors[themeName];
    const { t } = useLanguage();
    const insets = useSafeAreaInsets();

    const slideAnim = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(slideAnim, {
                toValue: loginMethod === 'password' ? 0 : 1,
                duration: 300,
                useNativeDriver: false,
            }),
            Animated.sequence([
                Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
                Animated.timing(fadeAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
            ])
        ]).start();
    }, [loginMethod]);

    const handleLogin = async () => {
        if (loginMethod === 'password') {
            await signIn({
                username: form.username,
                password: form.password,
            });
        } else {
            await signIn({
                username: form.username,
                pin: form.pin,
            });
        }
        router.replace('/(tabs)');
    };

    const tabTranslateX = slideAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [4, (width - 48) / 2],
    });

    return (
        <View style={[styles.container, { backgroundColor: '#050510', paddingTop: insets.top, paddingBottom: insets.bottom }]}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="chevron-back" size={28} color="#B0A4F1" />
                    </TouchableOpacity>

                    <View style={styles.header}>
                        <Text style={styles.title}>{t('welcomeBackTitle')}</Text>
                        <Text style={styles.subtitle}>{t('enterSanctuaryKeys')}</Text>
                    </View>

                    <View style={styles.methodSelector}>
                        <Animated.View style={[styles.activeIndicator, { transform: [{ translateX: tabTranslateX }] }]} />
                        <TouchableOpacity
                            style={styles.methodTab}
                            onPress={() => setLoginMethod('password')}
                            activeOpacity={1}
                        >
                            <Text style={[styles.methodText, loginMethod === 'password' && styles.activeMethodText]}>{t('password')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.methodTab}
                            onPress={() => setLoginMethod('pin')}
                            activeOpacity={1}
                        >
                            <Text style={[styles.methodText, loginMethod === 'pin' && styles.activeMethodText]}>{t('safetyPin')}</Text>
                        </TouchableOpacity>
                    </View>

                    <Animated.View style={[styles.formWrapper, { opacity: fadeAnim }]}>
                        {loginMethod === 'password' ? (
                            <View style={styles.formGroup}>
                                <View style={styles.inputGroup}>
                                    <Text style={styles.miniLabel}>{t('username')}</Text>
                                    <View style={styles.compactWrapper}>
                                        <Ionicons name="person-outline" size={18} color="rgba(176, 164, 241, 0.4)" style={styles.prefixIcon} />
                                        <TextInput
                                            style={styles.compactInput}
                                            placeholder={t('yourIdentity')}
                                            placeholderTextColor="rgba(255,255,255,0.2)"
                                            value={form.username}
                                            onChangeText={text => setForm({ ...form, username: text })}
                                            autoCapitalize="none"
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
                                        />
                                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.suffixIcon}>
                                            <Ionicons name={showPassword ? "eye-off" : "eye"} size={18} color="rgba(176, 164, 241, 0.4)" />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        ) : (
                            <View style={styles.formGroup}>
                                <Text style={styles.label}>{t('enterSafetyPin')}</Text>
                                <View style={styles.pinGridContainer}>
                                    <TextInput
                                        style={styles.hiddenInput}
                                        keyboardType="numeric"
                                        maxLength={6}
                                        secureTextEntry
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
                                </View>
                                <Text style={styles.pinHint}>{t('pinHint')}</Text>
                            </View>
                        )}
                    </Animated.View>

                    <TouchableOpacity style={styles.loginButton} onPress={handleLogin} activeOpacity={0.8}>
                        <Text style={styles.loginButtonText}>{t('enterSanctuary')}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.forgotLink} onPress={() => router.push('/auth/credential-setup' as any)}>
                        <Text style={styles.forgotText}>{t('problemsEntering')}<Text style={styles.recoverText}>{t('recoverAccount')}</Text></Text>
                    </TouchableOpacity>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>{t('newToNivora')}</Text>
                        <TouchableOpacity onPress={() => router.push('/auth/language-selection' as any)}>
                            <Text style={styles.signupLinkText}>{t('signUp')}</Text>
                        </TouchableOpacity>
                    </View>
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
        padding: 24,
        flexGrow: 1,
    },
    backButton: {
        marginBottom: 20,
    },
    header: {
        marginBottom: 30,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFF',
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(176, 164, 241, 0.6)',
        marginTop: 4,
    },
    methodSelector: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 20,
        padding: 4,
        marginBottom: 30,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    activeIndicator: {
        position: 'absolute',
        top: 4,
        bottom: 4,
        width: (width - 56) / 2,
        backgroundColor: '#B0A4F1',
        borderRadius: 16,
    },
    methodTab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        zIndex: 1,
    },
    methodText: {
        color: 'rgba(255,255,255,0.4)',
        fontWeight: 'bold',
        fontSize: 14,
    },
    activeMethodText: {
        color: '#000',
    },
    formWrapper: {
        flex: 1,
    },
    formGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 15,
        textAlign: 'center',
    },
    inputGroup: {
        marginBottom: 15,
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
        borderRadius: 12,
        height: 50,
        borderWidth: 1,
        borderColor: 'rgba(176, 164, 241, 0.1)',
        paddingHorizontal: 16,
    },
    compactInput: {
        flex: 1,
        color: '#FFF',
        fontSize: 15,
        height: '100%',
    },
    prefixIcon: {
        marginRight: 12,
    },
    suffixIcon: {
        marginLeft: 12,
        padding: 5,
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
        borderRadius: 12,
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
    pinHint: {
        color: 'rgba(176, 164, 241, 0.5)',
        fontSize: 13,
        textAlign: 'center',
        marginTop: 10,
    },
    loginButton: {
        backgroundColor: '#B0A4F1',
        borderRadius: 16,
        height: 54,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    loginButtonText: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 16,
    },
    forgotLink: {
        alignItems: 'center',
        marginTop: 30,
    },
    forgotText: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 14,
    },
    recoverText: {
        color: '#B0A4F1',
        fontWeight: '600',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 40,
        marginBottom: 20,
    },
    footerText: {
        color: 'rgba(255,255,255,0.5)',
    },
    signupLinkText: {
        color: '#B0A4F1',
        fontWeight: 'bold',
    },
});
