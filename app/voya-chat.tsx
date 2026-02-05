import SanctuaryLock from '@/components/SanctuaryLock';
import { useAuth } from '@/constants/AuthContext';
import { BACKEND_URL } from '@/constants/Backend';
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
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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

export default function VoyaChatScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { theme: themeName, isDark } = useTheme();
    const { isGuest } = useAuth();
    const { t } = useLanguage();
    const theme = Colors[themeName];

    // State for Dynamic Keyboard Height
    const keyboardHeight = useRef(new Animated.Value(0)).current;

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

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();
        loadChatHistory();

        // Manual Keyboard Listeners for dynamic height
        const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
        const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

        const showSub = Keyboard.addListener(showEvent, (e) => {
            Animated.spring(keyboardHeight, {
                toValue: e.endCoordinates.height,
                useNativeDriver: false,
                friction: 10,
                tension: 40
            }).start();

            // Scroll to end when keyboard appears
            setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true });
            }, 100);
        });

        const hideSub = Keyboard.addListener(hideEvent, () => {
            Animated.spring(keyboardHeight, {
                toValue: 0,
                useNativeDriver: false,
                friction: 10,
                tension: 40
            }).start();
        });

        return () => {
            showSub.remove();
            hideSub.remove();
        };
    }, []);

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
        const userMessage: Message = {
            id: Date.now().toString(),
            text: userMsgText,
            sender: 'user',
            timestamp: new Date(),
        };

        const newMessagesOnSend = [...messages, userMessage];
        setMessages(newMessagesOnSend);
        saveChatHistory(newMessagesOnSend);
        setInputText('');
        setIsLoading(true);

        try {
            const response = await fetch(`${BACKEND_URL}/voya-chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMsgText,
                    context: messages.slice(-5).map(m => `${m.sender}: ${m.text}`).join('\n')
                }),
            });

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
            console.error('FETCH ERROR:', error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: `🛑 Voya Connection Error: ${error.message}`,
                sender: 'voya',
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (flatListRef.current && messages.length > 0) {
            setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true });
            }, 300);
        }
    }, [messages]);

    return (
        <View style={styles.container}>
            <ImageBackground
                source={require('../assets/images/safehaven-bg.png')}
                style={StyleSheet.absoluteFillObject}
                resizeMode="cover"
            >
                <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.7)' }]} />
            </ImageBackground>

            {/* Header Area */}
            <View style={[styles.header, { paddingTop: Math.max(insets.top, 20), borderBottomColor: theme.border }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
                    <Ionicons name="chevron-back" size={28} color="#B0A4F1" />
                </TouchableOpacity>
                <View style={styles.headerInfo}>
                    <View style={styles.voyaIconWrapper}>
                        <Ionicons name="sparkles" size={16} color="#000" />
                    </View>
                    <View>
                        <Text style={[styles.title, { color: theme.text }]}>Voya</Text>
                        <Text style={styles.subtitle}>AI Companion</Text>
                    </View>
                </View>
                <TouchableOpacity onPress={clearHistory} style={styles.headerBtn}>
                    <Ionicons name="trash-outline" size={22} color={theme.textSecondary} />
                </TouchableOpacity>
            </View>

            {/* Main Chat Display */}
            <Animated.View style={[styles.contentContainer, { opacity: fadeAnim }]}>
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={[
                            styles.bubble,
                            item.sender === 'voya' ? [styles.voyaBubble, { backgroundColor: theme.surface, borderColor: theme.border }] : styles.userBubble
                        ]}>
                            <Text style={[
                                styles.msgText,
                                item.sender === 'voya' ? { color: theme.text } : styles.userMsgText
                            ]}>{item.text}</Text>

                            {item.suggestion && (
                                <TouchableOpacity
                                    style={styles.suggestBtn}
                                    onPress={() => router.push(item.suggestion!.route as any)}
                                >
                                    <View style={styles.suggestIcon}>
                                        <Ionicons name="arrow-forward" size={14} color="#000" />
                                    </View>
                                    <Text style={styles.suggestLabel}>Explore {item.suggestion.label}</Text>
                                </TouchableOpacity>
                            )}
                            <Text style={[styles.time, { color: theme.textSecondary }]}>
                                {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </Text>
                        </View>
                    )}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                />

                {/* Input Area (Pinned above spacer) */}
                <View style={[styles.inputWrapper, { paddingBottom: Math.max(insets.bottom, 15) }]}>
                    <View style={styles.inputBoxContainer}>
                        <View style={[styles.inputBox, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                            <TextInput
                                style={[styles.textInput, { color: theme.text, maxHeight: 150 }]}
                                placeholder={t('voyaPlaceholder')}
                                placeholderTextColor="#666"
                                value={inputText}
                                onChangeText={setInputText}
                                multiline
                            />
                            <TouchableOpacity
                                style={[styles.sendBtn, (!inputText.trim() || isLoading) && { opacity: 0.5 }]}
                                onPress={handleSend}
                                disabled={!inputText.trim() || isLoading}
                            >
                                <Ionicons
                                    name={isLoading ? "sync" : "send"}
                                    size={20}
                                    color="#000"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Animated.View>

            {/* THE ONE TRUE SPACER: This pushes the contentContainer up */}
            <Animated.View style={{ height: keyboardHeight }} />
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
        backgroundColor: '#B0A4F1',
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
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    inputBoxContainer: {
        width: '100%',
    },
    inputBox: {
        flexDirection: 'row',
        alignItems: 'flex-end', // Align send button to bottom when text grows
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 28,
        borderWidth: 1,
        minHeight: 56,
    },
    textInput: {
        flex: 1,
        fontSize: 16,
        paddingTop: Platform.OS === 'ios' ? 8 : 4,
        paddingBottom: Platform.OS === 'ios' ? 8 : 4,
        textAlignVertical: 'center',
    },
    sendBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#B0A4F1',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 12,
        marginBottom: 2, // Tiny nudge for alignment
    },
});
