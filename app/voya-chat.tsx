import NightSkyBackground from '@/components/NightSkyBackground';
import SanctuaryLock from '@/components/SanctuaryLock';
import { useAuth } from '@/constants/AuthContext';
import { getBackendUrl } from '@/constants/Backend';

// Client-side Multilingual Emotional AI Engine
function getLocalEmotionalResponse(message: string) {
    const text = (message || '').toLowerCase();

    // Check for Sinhala / Singlish
    const isSinhala = /[\u0D80-\u0DFF]/.test(message) || /(mahansi|dukai|bayayi|epa wela|karadarayak|rag|salli|udaw|adanna|hitha|mata|oyata|monawada|kohomada|sthuthi|marenna hithenwa|marenawa|kanna ba|ninda yanne na|palui|thani|adanna hithenwa|adenwa|mage wedanawa|wedanawa|mn mokakd krnna oni|die|lonely)/i.test(text);
    // Check for Tamil / Tanglish
    const isTamil = /[\u0B80-\u0BFF]/.test(message) || /(kavalai|bayam|alugai|udavi|stress|kashtam|ragging|vanakkam|eppadi|nandri)/i.test(text);

    // 0. Emoji Direct Reactions
    if (/(😭|💔|🥺|😔|😢|😞)/.test(text)) {
        if (isSinhala) {
            return {
                text: "ඔබේ හිතේ තියෙන දුක මට ගැඹුරින්ම දැනෙනවා... 🥺💔 ඔබ තනිවෙලා නෑ. මම ඔබ ළඟින්ම ඉන්නවා. අපි එකතු වෙලා මේ අමාරු මොහොත පහු කරමු 🫂✨",
                suggestion: { label: "SafeHaven", route: "/moods/sad" }
            };
        }
        return {
            text: "I can feel the heavy ache in your heart right now... 🥺💔 Please remember you don't have to carry this alone. I'm holding a safe, warm space for you 🫂🤍",
            suggestion: { label: "SafeHaven", route: "/moods/sad" }
        };
    }

    if (/(🌸|✨|🤍|😊|🕊️|🌼|💛|🌿|🫂)/.test(text)) {
        return {
            text: "Sending you the warmest hug and brightest positive energy today! 🌸✨ May your heart feel peaceful, safe, and uplifted 🕊️💛",
            suggestion: undefined
        };
    }

    // 0. HIGH RISK CRISIS: Suicide / Self-Harm Prevention Protocol
    if (/(suicide|suicidal|kill my|end my life|want to die|marenna|marenawa|jeewithe epawela|zindagi mudikka|sagapporen|self harm|cut my|die|poison)/i.test(text)) {
        if (isSinhala) {
            return {
                text: "🚨 ඔබේ ජීවිතය ඉතාමත් වටිනවා! ඔබ තනිවී නැත. කරුණාකර දැනුම් දෙන්න, 1926 (ජාතික මානසික සෞඛ්‍ය සේවාව) හෝ 1333 (සුමිත්‍රයෝ) ඇමතුම් නොමිලේ ලබාගත හැක 🫂❤️.",
                suggestion: { label: "Emergency Support 🆘", route: "/(tabs)/emergency" }
            };
        } else if (isTamil) {
            return {
                text: "🚨 உங்கள் உயிர் மிகவும் மதிப்பானது! நீங்கள் தனியாக இல்லை. தயவுசெய்து 1926 அல்லது 1333 (Sumithrayo) இலவச உதவி எண்களை உடனடியாக தொடர்பு கொள்ளவும் 🫂❤️.",
                suggestion: { label: "Emergency Support 🆘", route: "/(tabs)/emergency" }
            };
        }
        return {
            text: "🚨 Your life is valuable and you are not alone in this pain. Please reach out right now: Call 1926 (National Mental Health Helpline) or 1333 (Sumithrayo Lifeline) for free 24/7 confidential support 🫂❤️.",
            suggestion: { label: "Emergency Support 🆘", route: "/(tabs)/emergency" }
        };
    }

    // 1. Anxiety / Stress / Burnout / Exhaustion
    if (/(stress|tired|exhaust|burnout|overwhelm|anxious|panic|relax|breath|angry|kenthi|mahansi|thehettui|nidimatha|mahansiyi|pressure|kashtam|kavalai|fatigue|sleep)/i.test(text)) {
        if (isSinhala) {
            return {
                text: "ඔබට දැනෙන මහන්සිය සහ පීඩනය මට තේරෙනවා 🌿. ජීවිතේ හැම මොහොතකම දුවන්න ඕනෙ නෑ, දැන් ටිකක් නිදහසේ හුස්මක් අරන් විවේක ගනිමු 🌸. ඔබ ගොඩක් ශක්තිමත් කෙනෙක්! ✨",
                suggestion: { label: "MindCare", route: "/moods/mind-care" }
            };
        } else if (isTamil) {
            return {
                text: "உங்கள் சோர்வும் மன அழுத்தமும் எனக்குப் புரிகிறது 🌿. நீங்கள் தனியாக இல்லை. ஆழமாக சுவாசித்து அமைதி பெறுங்கள் 🌸. நீங்கள் மிகவும் வலிமையானவர்! ✨",
                suggestion: { label: "MindCare", route: "/moods/mind-care" }
            };
        }
        return {
            text: "I hear how exhausted and overwhelmed you are feeling right now 🌿. Remember, rest is not a weakness—it is how your spirit recharges 🌸. You are capable and worthy of a peaceful, vibrant life ✨🤍.",
            suggestion: { label: "MindCare", route: "/moods/mind-care" }
        };
    }

    // 2. Sadness / Grief / Loneliness / Heartbreak
    if (/(sad|cry|alone|lonely|heartbreak|depress|hopeless|hurt|dukai|adanna|thanikama|alugai|valikkuthu|pain|unhappy|broken)/i.test(text)) {
        if (isSinhala) {
            return {
                text: "ඔබේ හිතේ තියෙන දුක සහ තනිකම මට තේරෙනවා 🫂. අඳුරු රැයකට පස්සෙ ලස්සන හිරු උදාවක් එනවා වගේ ඔබේ ජීවිතෙත් ආයෙත් බලාපොරොත්තුවෙන් පිරෙයි 🌸✨. මම ඔබ ළඟින්ම ඉන්නවා 🤍.",
                suggestion: { label: "SafeHaven", route: "/moods/sad" }
            };
        } else if (isTamil) {
            return {
                text: "உங்கள் வேதனையையும் தனிமையையும் நான் உணர்கிறேன் 🫂. கவலைப்படாதீர்கள், இந்த இருள் நீங்கி உங்கள் வாழ்வில் புது வெளிச்சம் பிறக்கும் 🌸✨. நான் எப்போதும் உங்களுடன் இருக்கிறேன் 🤍.",
                suggestion: { label: "SafeHaven", route: "/moods/sad" }
            };
        }
        return {
            text: "I can feel the heavy weight you are carrying 🫂. Even on the darkest days, please remember your story is not over, and joy will find you again 🌸✨. I am right here listening to you 🤍.",
            suggestion: { label: "SafeHaven", route: "/moods/sad" }
        };
    }

    // 3. Bullying / Ragging / Incident Support
    if (/(rag|ragging|bully|harass|threat|campus|senior|scared|baya|bayai|bayam|fear)/i.test(text)) {
        if (isSinhala) {
            return {
                text: "කිසිම කෙනෙකුට ඔබව බියවද්දන්න හෝ හිංසා කරන්න අයිතියක් නෑ 🛡️. ඔබ තනිවෙලා නෑ, මේ ගැන කතා කරන්න සහ ආරක්ෂාව ගන්න අපිට පුළුවන් 🫂.",
                suggestion: { label: "SpeakOut", route: "/moods/speak-out" }
            };
        } else if (isTamil) {
            return {
                text: "யாரும் உங்களை மிரட்டவோ அல்லது துன்புறுத்தவோ உரிமை இல்லை 🛡️. உங்கள் பாதுகாப்பிற்கு நாங்கள் துணையாக இருக்கிறோம். தயங்காமல் பேசுங்கள் 🫂.",
                suggestion: { label: "SpeakOut", route: "/moods/speak-out" }
            };
        }
        return {
            text: "No one has the right to intimidate, bully, or hurt you 🛡️. You are brave, and you do not have to suffer in silence. Let's take action together 🫂.",
            suggestion: { label: "SpeakOut", route: "/moods/speak-out" }
        };
    }

    // 4. Online Scams / Cyber Harassment
    if (/(hack|scam|online|nude|photo|leak|password|whatsapp|facebook|cyber|salli|threat|blackmail)/i.test(text)) {
        if (isSinhala) {
            return {
                text: "ඩිජිටල් තර්ජන හෝ වංචාවන් නිසා බය වෙන්න එපා 🔒. ඔබේ ඩිජිටල් ආරක්ෂාව තහවුරු කරගන්න අපි උදව් කරන්නම් 🛡️✨.",
                suggestion: { label: "CyberGuard", route: "/moods/cyber-guard" }
            };
        }
        return {
            text: "Your privacy and digital safety are top priorities 🔒. Do not panic—there are clear steps to protect yourself and block threats immediately 🛡️✨.",
            suggestion: { label: "CyberGuard", route: "/moods/cyber-guard" }
        };
    }

    // 5. Legal / Rights Violation
    if (/(law|legal|court|police|rights|lawyer|case|complaint|neethi)/i.test(text)) {
        if (isSinhala) {
            return {
                text: "ඔබේ අයිතිවාසිකම් සහ නීතිමය සහාය ලබාගැනීමට ඔබට සම්පූර්ණ අයිතියක් තියෙනවා ⚖️. සාධාරණය වෙනුවෙන් පියවර ගනිමු ✨.",
                suggestion: { label: "JusticeLink", route: "/moods/justice-link" }
            };
        }
        return {
            text: "You have legal rights and formal support channels available to you ⚖️. Let's explore the right legal guidance and protect your rights ✨.",
            suggestion: { label: "JusticeLink", route: "/moods/justice-link" }
        };
    }

    // General Empathetic Greeting / Motivation
    if (isSinhala) {
        return {
            text: "මම වෝයා (Voya) 🌸, ඔබව ඇහුම්කන් දෙන්න සහ ඔබේ හිතට අලුත් ශක්තියක් දෙන්න මම මෙතන ඉන්නවා ✨. අද ඔබේ හිතට කොහොමද දැනෙන්නේ? 🤍",
            suggestion: undefined
        };
    } else if (isTamil) {
        return {
            text: "வணக்கம்! நான் வோயா (Voya) 🌸, உங்கள் மனதை அமைதிப்படுத்தவும் புது உற்சாகம் தரவும் நான் இருக்கிறேன் ✨. இன்று உங்கள் மனம் எப்படி உணர்கிறது? 🤍",
            suggestion: undefined
        };
    }

    return {
        text: "I'm Voya, and I'm right here with you with an open heart 🌸✨. Whatever you're going through, you have the power to create a beautiful, fulfilling life 🤍. Tell me, how are you feeling inside today? 🌿",
        suggestion: undefined
    };
}
import Colors from '@/constants/Colors';
import { useLanguage } from '@/constants/LanguageContext';
import { useTheme } from '@/constants/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
    Animated,
    FlatList,
    ImageBackground,
    Keyboard,
    KeyboardAvoidingView,
    Linking,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const QUICK_EMOJIS = ['😃', '🥀', '😔', '😭', '🥺', '😨', '❤️', '😟', '😞', '😰', '😒', '💔', '🫂', '🌸', '✨', '🤍', '😡', '🌿', '☹️', '🕊️', '🌼', '💛'];

type Message = {
    id: string;
    text: string;
    sender: 'voya' | 'user';
    timestamp: Date;
    suggestion?: {
        label: string;
        route: string;
    };
};

const CHAT_STORAGE_KEY = '@voya_chat_history';

// Crisis Detection Keywords
const CRISIS_KEYWORDS = [
    'suicide', 'kill myself', 'end my life', 'want to die', 'end it all', 'feeling suicidal', 'suicidal thoughts', 'tired of living', 'tired of everything', 'nothing matters', 'nikan epa wela hithennwa', 'marenna hithenawa', 'marenawa', 'nikan epa wela', 'hitha kalakirenwa', 'jeewithaya epa', 'jeewithaya epawela', 'monawatath epa wela',
    'hurting myself', 'self harm', "don't want to live", 'marenna', 'maraena eka hodai', 'marenawa hithanawa', 'maraena eka hithanawa', 'maraenna oni', 'maraenawa hithuna'
];

export default function VoyaChatScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { theme: themeName, isDark } = useTheme();
    const { isGuest } = useAuth();
    const { t } = useLanguage();
    const theme = Colors[themeName];

    // State for Crisis Safety System
    const [showCrisisModal, setShowCrisisModal] = useState(false);
    const [showDeescalationMode, setShowDeescalationMode] = useState(false);
    const [groundingTimer, setGroundingTimer] = useState(60);
    const breathAnim = useRef(new Animated.Value(1)).current;

    if (isGuest) {
        return (
            <SanctuaryLock
                featureName="Voya"
                description="Our AI companion is here to support you in your healing journey. To maintain your privacy and provide personalized care, please create an account."
                icon="sparkles"
            />
        );
    }

    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: t('voyaGreeting'),
            sender: 'voya',
            timestamp: new Date(),
        },
    ]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const flatListRef = useRef<FlatList>(null);
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();
        loadChatHistory();

        const showSub = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
            () => {
                setIsKeyboardOpen(true);
                setTimeout(() => {
                    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
                }, 80);
            }
        );
        const hideSub = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
            () => {
                setIsKeyboardOpen(false);
            }
        );

        return () => {
            showSub.remove();
            hideSub.remove();
        };
    }, []);

    // Breathing Animation for De-escalation Mode
    useEffect(() => {
        if (showDeescalationMode) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(breathAnim, { toValue: 1.4, duration: 4000, useNativeDriver: true }),
                    Animated.timing(breathAnim, { toValue: 1, duration: 4000, useNativeDriver: true })
                ])
            ).start();

            const timer = setInterval(() => {
                setGroundingTimer((prev) => (prev > 0 ? prev - 1 : 0));
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [showDeescalationMode]);

    const loadChatHistory = async () => {
        try {
            const storedHistory = await AsyncStorage.getItem(CHAT_STORAGE_KEY);
            if (storedHistory) {
                const parsedHistory = JSON.parse(storedHistory);
                const historyWithDates = parsedHistory.map((m: any) => ({
                    ...m,
                    timestamp: new Date(m.timestamp)
                }));
                setMessages(historyWithDates);
            }
        } catch (error) {
            console.error('Failed to load chat history:', error);
        }
    };

    const saveChatHistory = async (newMessages: Message[]) => {
        try {
            await AsyncStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(newMessages));
        } catch (error) {
            console.error('❌ Failed to save chat history:', error);
        }
    };

    const clearHistory = async () => {
        try {
            await AsyncStorage.removeItem(CHAT_STORAGE_KEY);
            setMessages([
                {
                    id: '1',
                    text: t('voyaGreeting'),
                    sender: 'voya',
                    timestamp: new Date(),
                },
            ]);
        } catch (error) {
            console.error('Failed to clear chat history:', error);
        }
    };

    const handleSend = async () => {
        if (inputText.trim() === '' || isLoading) return;

        const userMsgText = inputText.trim();
        const lowerInput = userMsgText.toLowerCase();

        // 🚨 CRISIS KEYWORD INTERCEPTOR
        const isCrisisDetected = CRISIS_KEYWORDS.some(keyword => lowerInput.includes(keyword));

        const userMessage: Message = {
            id: Date.now().toString(),
            text: userMsgText,
            sender: 'user',
            timestamp: new Date(),
        };

        const newMessagesOnSend = [...messages, userMessage];

        if (isCrisisDetected) {
            // Trigger Emergency Safety Modal & Supportive Response
            setShowCrisisModal(true);
            const crisisVoyaMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: "I hear how much pain you're in right now, and your life matters deeply. I have opened our 24/7 Lifeline Support for you. You don't have to carry this alone.",
                sender: 'voya',
                timestamp: new Date(),
            };
            const finalCrisisMessages = [...newMessagesOnSend, crisisVoyaMessage];
            setMessages(finalCrisisMessages);
            saveChatHistory(finalCrisisMessages);
            setInputText('');
            return;
        }

        setMessages(newMessagesOnSend);
        saveChatHistory(newMessagesOnSend);
        setInputText('');
        setIsLoading(true);

        try {
            const url = getBackendUrl();
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 6000);

            const response = await fetch(`${url}/voya-chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                signal: controller.signal,
                body: JSON.stringify({
                    message: userMsgText,
                    context: messages.slice(-5).map(m => `${m.sender}: ${m.text}`).join('\n')
                }),
            });
            clearTimeout(timeoutId);

            if (!response.ok) throw new Error(`Server returned ${response.status}`);

            const data = await response.json();
            const voyaMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: data.text || t('voyaResponse_default'),
                sender: 'voya',
                timestamp: new Date(),
                suggestion: data.suggestion
            };

            const finalMessages = [...newMessagesOnSend, voyaMessage];
            setMessages(finalMessages);
            saveChatHistory(finalMessages);
        } catch (error: any) {
            console.warn('Backend fetch failed, using local emotion engine:', error.message);
            const localData = getLocalEmotionalResponse(userMsgText);
            const fallbackMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: localData.text,
                sender: 'voya',
                timestamp: new Date(),
                suggestion: localData.suggestion
            };
            const finalMessages = [...newMessagesOnSend, fallbackMessage];
            setMessages(finalMessages);
            saveChatHistory(finalMessages);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (flatListRef.current && messages.length > 0) {
            setTimeout(() => {
                flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
            }, 100);
        }
    }, [messages]);

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <ImageBackground
                source={isDark ? require('../assets/images/cosmic-sky-bg.jpg') : require('../assets/images/cosmic-light-bg.jpg')}
                style={StyleSheet.absoluteFillObject}
                resizeMode="cover"
                blurRadius={isDark ? 8 : 2}
            >
                <View style={[StyleSheet.absoluteFill, { backgroundColor: isDark ? 'rgba(7, 6, 20, 0.60)' : 'rgba(255, 255, 255, 0.25)' }]} />
            </ImageBackground>
            {isDark && <NightSkyBackground />}

            {/* Header Area */}
            <View style={[styles.header, { paddingTop: Math.max(insets.top, 20), borderBottomColor: theme.border, backgroundColor: isDark ? 'rgba(7, 6, 20, 0.65)' : 'rgba(255, 255, 255, 0.50)' }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
                    <Ionicons name="chevron-back" size={28} color={theme.primary} />
                </TouchableOpacity>
                <View style={styles.headerInfo}>
                    <View style={[styles.voyaIconWrapper, { backgroundColor: theme.primary }]}>
                        <Ionicons name="sparkles" size={16} color={isDark ? "#000" : "#FFF"} />
                    </View>
                    <View>
                        <Text style={[styles.title, { color: theme.text }]}>Voya</Text>
                        <Text style={[styles.subtitle, { color: theme.primary }]}>Virtual Counseling Guide</Text>
                    </View>
                </View>
                <TouchableOpacity onPress={clearHistory} style={styles.headerBtn}>
                    <Ionicons name="trash-outline" size={22} color={theme.textSecondary} />
                </TouchableOpacity>
            </View>

            {/* Main Chat Display with KeyboardAvoidingView */}
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top + 45 : 0}
            >
                <Animated.View style={[styles.contentContainer, { opacity: fadeAnim }]}>
                    <FlatList
                        ref={flatListRef}
                        data={[...messages].reverse()}
                        inverted
                        keyExtractor={(item) => item.id}
                        ListHeaderComponent={isLoading ? (
                            <View style={[styles.bubble, styles.voyaBubble, { backgroundColor: isDark ? theme.surface : 'rgba(255, 255, 255, 0.95)', borderColor: isDark ? theme.border : 'rgba(120, 104, 230, 0.2)', flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 12 }]}>
                                <Ionicons name="sparkles" size={16} color={theme.primary} />
                                <Text style={[styles.msgText, { color: theme.textSecondary, fontSize: 14 }]}>Voya is thinking...</Text>
                            </View>
                        ) : null}
                        renderItem={({ item }) => (
                            <View style={[
                                styles.bubble,
                                item.sender === 'voya'
                                    ? [styles.voyaBubble, { backgroundColor: isDark ? theme.surface : 'rgba(255, 255, 255, 0.95)', borderColor: isDark ? theme.border : 'rgba(120, 104, 230, 0.18)' }]
                                    : [styles.userBubble, { backgroundColor: theme.primary }]
                            ]}>
                                <Text style={[
                                    styles.msgText,
                                    item.sender === 'voya'
                                        ? { color: isDark ? '#FFFFFF' : '#14121E', fontWeight: '500' }
                                        : { color: isDark ? '#000000' : '#FFFFFF', fontWeight: '600' }
                                ]}>{item.text}</Text>

                                {item.suggestion && (
                                    <TouchableOpacity
                                        style={[styles.suggestBtn, { backgroundColor: isDark ? 'rgba(176, 164, 241, 0.15)' : 'rgba(120, 104, 230, 0.10)', borderColor: isDark ? theme.border : 'rgba(120, 104, 230, 0.25)' }]}
                                        onPress={() => router.push(item.suggestion!.route as any)}
                                    >
                                        <View style={[styles.suggestIcon, { backgroundColor: theme.primary }]}>
                                            <Ionicons name="arrow-forward" size={14} color={isDark ? "#000" : "#FFF"} />
                                        </View>
                                        <Text style={[styles.suggestLabel, { color: isDark ? '#FFFFFF' : '#14121E' }]}>Explore {item.suggestion.label}</Text>
                                    </TouchableOpacity>
                                )}
                                <Text style={[styles.time, { color: item.sender === 'voya' ? (isDark ? theme.textSecondary : '#5B5872') : (isDark ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.9)') }]}>
                                    {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </Text>
                            </View>
                        )}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    />

                    {/* Input Area */}
                    <View style={[styles.inputWrapper, { paddingBottom: isKeyboardOpen ? 8 : Math.max(insets.bottom, 12) }]}>
                        {/* Quick Emotion & Emoji Bar */}
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            keyboardShouldPersistTaps="handled"
                            contentContainerStyle={styles.emojiRow}
                        >
                            {QUICK_EMOJIS.map((emoji, idx) => (
                                <TouchableOpacity
                                    key={idx}
                                    style={[styles.emojiChip, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.75)', borderColor: theme.border }]}
                                    onPress={() => setInputText(prev => (prev ? prev + ' ' : '') + emoji)}
                                >
                                    <Text style={{ fontSize: 18 }}>{emoji}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                        <View style={styles.inputBoxContainer}>
                            <View style={[styles.inputBox, { backgroundColor: isDark ? theme.surface : 'rgba(255, 255, 255, 0.95)', borderColor: theme.border }]}>
                                <TextInput
                                    style={[styles.textInput, { color: theme.text, maxHeight: 120 }]}
                                    placeholder={t('voyaPlaceholder')}
                                    placeholderTextColor={theme.placeholder}
                                    value={inputText}
                                    onChangeText={setInputText}
                                    multiline
                                />
                                <TouchableOpacity
                                    style={[
                                        styles.sendBtn,
                                        { backgroundColor: isDark ? theme.primary : '#6E5EC7' },
                                        (!inputText.trim() || isLoading) && { opacity: 60 }
                                    ]}
                                    onPress={handleSend}
                                    disabled={!inputText.trim() || isLoading}
                                >
                                    <Ionicons
                                        name={isLoading ? "sync" : "send"}
                                        size={18}
                                        color={isDark ? "#000" : "#FFF"}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Animated.View>
            </KeyboardAvoidingView>

            {/* 🚨 CRISIS SAFETY LIFELINE MODAL */}
            <Modal
                visible={showCrisisModal}
                transparent
                animationType="slide"
                onRequestClose={() => setShowCrisisModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.crisisHeaderIcon}>
                            <Ionicons name="heart" size={32} color="#FF4D4D" />
                        </View>

                        {!showDeescalationMode ? (
                            <>
                                <Text style={styles.crisisTitle}>We Are Here With You 🤍</Text>
                                <Text style={styles.crisisSubtitle}>
                                    Your life is valuable. Please connect with one of these 24/7 free, anonymous crisis services right now:
                                </Text>

                                {/* 1-Tap Hotline Buttons */}
                                <TouchableOpacity
                                    style={styles.hotlineBtnCall}
                                    onPress={() => Linking.openURL('tel:1333')}
                                >
                                    <Ionicons name="call" size={20} color="#FFF" style={{ marginRight: 8 }} />
                                    <Text style={styles.hotlineBtnText}>Call Suicide Prevention Helpline (1333)</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.hotlineBtnCall, { backgroundColor: '#FF7043' }]}
                                    onPress={() => Linking.openURL('tel:1990')}
                                >
                                    <Ionicons name="medical" size={20} color="#FFF" style={{ marginRight: 8 }} />
                                    <Text style={styles.hotlineBtnText}>Call Suwa Sariya Ambulance (1990)</Text>
                                </TouchableOpacity>

                                {/* ICE Contact Button */}
                                <TouchableOpacity
                                    style={styles.iceBtn}
                                    onPress={() => Linking.openURL('sms:?body=I am experiencing an emergency crisis right now, please reach out to me.')}
                                >
                                    <Ionicons name="chatbubbles" size={20} color="#000" style={{ marginRight: 8 }} />
                                    <Text style={styles.iceBtnText}>Text My Trusted Emergency Contact (ICE)</Text>
                                </TouchableOpacity>

                                {/* Passive Resistance De-escalation Button */}
                                <TouchableOpacity
                                    style={styles.deescalateBtn}
                                    onPress={() => setShowDeescalationMode(true)}
                                >
                                    <Ionicons name="leaf" size={18} color="#B0A4F1" style={{ marginRight: 8 }} />
                                    <Text style={styles.deescalateBtnText}>I don't want to call anyone right now</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.closeCrisisBtn}
                                    onPress={() => setShowCrisisModal(false)}
                                >
                                    <Text style={styles.closeCrisisText}>Return to Chat</Text>
                                </TouchableOpacity>
                            </>
                        ) : (
                            /* PASSIVE DE-ESCALATION GROUNDING MODE */
                            <View style={styles.groundingContainer}>
                                <Text style={styles.groundingTitle}>60-Second Sensory Reset 🧘</Text>
                                <Text style={styles.groundingSubtitle}>
                                    That's okay. You don't have to talk to anyone. Let's just sit together and breathe slowly.
                                </Text>

                                <Animated.View style={[styles.breathCircle, { transform: [{ scale: breathAnim }] }]}>
                                    <Text style={styles.timerText}>{groundingTimer}s</Text>
                                    <Text style={styles.breathText}>Inhale... Exhale...</Text>
                                </Animated.View>

                                <Text style={styles.sensoryPrompt}>
                                    Look around you right now and notice 3 things you can touch. You are safe in this moment.
                                </Text>

                                <TouchableOpacity
                                    style={styles.hotlinePillBtn}
                                    onPress={() => Linking.openURL('tel:1333')}
                                >
                                    <Ionicons name="call" size={16} color="#FFF" style={{ marginRight: 6 }} />
                                    <Text style={styles.hotlinePillText}>Tap to Call 1333 Anytime</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.closeCrisisBtn}
                                    onPress={() => {
                                        setShowDeescalationMode(false);
                                        setShowCrisisModal(false);
                                    }}
                                >
                                    <Text style={styles.closeCrisisText}>I'm Feeling a Little Better</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 15,
        borderBottomWidth: 1,
        zIndex: 10,
    },
    headerBtn: {
        padding: 8,
    },
    headerInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginLeft: 5,
    },
    voyaIconWrapper: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#B0A4F1',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
    },
    subtitle: {
        color: '#B0A4F1',
        fontSize: 11,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    contentContainer: {
        flex: 1,
    },
    listContent: {
        padding: 20,
        paddingTop: 10,
        paddingBottom: 20,
    },
    bubble: {
        maxWidth: '85%',
        padding: 16,
        borderRadius: 22,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    voyaBubble: {
        alignSelf: 'flex-start',
        borderBottomLeftRadius: 4,
        borderWidth: 1,
    },
    userBubble: {
        alignSelf: 'flex-end',
        backgroundColor: '#B0A4F1',
        borderBottomRightRadius: 4,
    },
    msgText: {
        fontSize: 16,
        lineHeight: 23,
    },
    userMsgText: {
        color: '#000',
        fontWeight: '500',
    },
    suggestBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.05)',
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 12,
        marginTop: 12,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.1)',
        alignSelf: 'flex-start',
    },
    suggestIcon: {
        width: 22,
        height: 22,
        borderRadius: 11,
        backgroundColor: '#b0a4f1ff',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    suggestLabel: {
        color: '#000',
        fontSize: 13,
        fontWeight: 'bold',
    },
    time: {
        fontSize: 10,
        marginTop: 6,
        alignSelf: 'flex-end',
        opacity: 0.6,
    },
    inputWrapper: {
        paddingHorizontal: 16,
        paddingTop: 4,
    },
    emojiRow: {
        flexDirection: 'row',
        gap: 8,
        paddingBottom: 4,
        paddingHorizontal: 2,
    },
    emojiChip: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
    },
    inputBoxContainer: {
        width: '100%',
    },
    inputBox: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 26,
        borderWidth: 1.5,
        minHeight: 50,
    },
    textInput: {
        flex: 1,
        fontSize: 15,
        lineHeight: 20,
        paddingTop: Platform.OS === 'ios' ? 8 : 4,
        paddingBottom: Platform.OS === 'ios' ? 8 : 4,
        paddingRight: 8,
        textAlignVertical: 'center',
    },
    sendBtn: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: '#4c4090ff',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 6,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        width: '100%',
        backgroundColor: '#1E1B2E',
        borderRadius: 28,
        padding: 24,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#FF4D4D',
        shadowColor: '#FF4D4D',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 15,
        elevation: 10,
    },
    crisisHeaderIcon: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(255, 77, 77, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    crisisTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#FFF',
        textAlign: 'center',
        marginBottom: 8,
    },
    crisisSubtitle: {
        fontSize: 14,
        color: '#BBB',
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 20,
    },
    hotlineBtnCall: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#E53935',
        width: '100%',
        paddingVertical: 14,
        borderRadius: 16,
        marginBottom: 12,
    },
    hotlineBtnText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: 'bold',
    },
    iceBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#B0A4F1',
        width: '100%',
        paddingVertical: 14,
        borderRadius: 16,
        marginBottom: 12,
    },
    iceBtnText: {
        color: '#000',
        fontSize: 14,
        fontWeight: 'bold',
    },
    deescalateBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(176, 164, 241, 0.15)',
        borderWidth: 1,
        borderColor: '#B0A4F1',
        width: '100%',
        paddingVertical: 12,
        borderRadius: 16,
        marginBottom: 16,
    },
    deescalateBtnText: {
        color: '#B0A4F1',
        fontSize: 13,
        fontWeight: '600',
    },
    closeCrisisBtn: {
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    closeCrisisText: {
        color: '#888',
        fontSize: 13,
        fontWeight: '600',
    },
    groundingContainer: {
        alignItems: 'center',
        width: '100%',
    },
    groundingTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 8,
        textAlign: 'center',
    },
    groundingSubtitle: {
        fontSize: 13,
        color: '#AAA',
        textAlign: 'center',
        marginBottom: 20,
        lineHeight: 18,
    },
    breathCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'rgba(176, 164, 241, 0.25)',
        borderWidth: 2,
        borderColor: '#B0A4F1',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    timerText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFF',
    },
    breathText: {
        fontSize: 11,
        color: '#B0A4F1',
        marginTop: 4,
        fontWeight: '600',
    },
    sensoryPrompt: {
        fontSize: 13,
        color: '#DDD',
        textAlign: 'center',
        lineHeight: 19,
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    hotlinePillBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E53935',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 20,
        marginBottom: 16,
    },
    hotlinePillText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: 'bold',
    },
});

