import NightSkyBackground from '@/components/NightSkyBackground';
import { useLanguage } from '@/constants/LanguageContext';
import { Language } from '@/constants/Translations';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useRef } from 'react';
import {
    Animated,
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const LANGUAGES: { id: Language; label: string; nativeLabel: string; icon: string }[] = [
    { id: 'English', label: 'English', nativeLabel: 'English', icon: 'flag-outline' },
    { id: 'සිංහල', label: 'Sinhala', nativeLabel: 'සිංහල', icon: 'language-outline' },
    { id: 'தமிழ்', label: 'Tamil', nativeLabel: 'தமிழ்', icon: 'text-outline' },
];

export default function LanguageSelectionScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { setLanguage, t, language: currentLanguage } = useLanguage();
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const handleSelectLanguage = (lang: Language) => {
        setLanguage(lang);
        router.push('/auth/signup');
    };

    return (
        <View style={[styles.container, { backgroundColor: '#050510' }]}>
            <NightSkyBackground />

            <View style={[styles.content, { paddingTop: insets.top + 60 }]}>
                <View style={styles.header}>
                    <View style={styles.iconCircle}>
                        <Ionicons name="globe-outline" size={40} color="#B0A4F1" />
                    </View>
                    <Text style={styles.title}>{t('chooseLanguage')}</Text>
                    <Text style={styles.subtitle}>{t('languageSubtitle')}</Text>
                </View>

                <View style={styles.optionsContainer}>
                    {LANGUAGES.map((lang, index) => (
                        <TouchableOpacity
                            key={lang.id}
                            style={[
                                styles.languageCard,
                                currentLanguage === lang.id && styles.activeCard
                            ]}
                            onPress={() => handleSelectLanguage(lang.id)}
                            activeOpacity={0.8}
                        >
                            <View style={[
                                styles.langIconBox,
                                currentLanguage === lang.id && styles.activeIconBox
                            ]}>
                                <Ionicons
                                    name={lang.icon as any}
                                    size={24}
                                    color={currentLanguage === lang.id ? '#000' : '#B0A4F1'}
                                />
                            </View>
                            <View style={styles.langTextContainer}>
                                <Text style={[
                                    styles.langNative,
                                    currentLanguage === lang.id && styles.activeText
                                ]}>
                                    {lang.nativeLabel}
                                </Text>
                                <Text style={styles.langEnglish}>
                                    {lang.label}
                                </Text>
                            </View>
                            {currentLanguage === lang.id && (
                                <Ionicons name="checkmark-circle" size={24} color="#B0A4F1" />
                            )}
                        </TouchableOpacity>
                    ))}
                </View>

                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Text style={styles.backText}>{t('goBack')}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        paddingHorizontal: 25,
        alignItems: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: 50,
    },
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(176, 164, 241, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(176, 164, 241, 0.2)',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFF',
        textAlign: 'center',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.5)',
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    optionsContainer: {
        width: '100%',
        gap: 15,
    },
    languageCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 20,
        padding: 18,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    activeCard: {
        backgroundColor: 'rgba(176, 164, 241, 0.1)',
        borderColor: 'rgba(176, 164, 241, 0.4)',
    },
    langIconBox: {
        width: 48,
        height: 48,
        borderRadius: 14,
        backgroundColor: 'rgba(176, 164, 241, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    activeIconBox: {
        backgroundColor: '#B0A4F1',
    },
    langTextContainer: {
        flex: 1,
    },
    langNative: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFF',
    },
    activeText: {
        color: '#B0A4F1',
    },
    langEnglish: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.4)',
        marginTop: 2,
    },
    backButton: {
        marginTop: 'auto',
        marginBottom: 40,
        padding: 10,
    },
    backText: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 16,
        fontWeight: '500',
    },
});
