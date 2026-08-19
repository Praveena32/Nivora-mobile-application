import NightSkyBackground from '@/components/NightSkyBackground';
import Colors from '@/constants/Colors';
import { useLanguage } from '@/constants/LanguageContext';
import { useTheme } from '@/constants/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
    FlatList,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function JusticeComplaintsChat() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { t } = useLanguage();
    const { theme: themeName, isDark } = useTheme();
    const theme = Colors[themeName];
    const { name, color } = useLocalSearchParams<{ name: string; color: string }>();
    const flatListRef = useRef<FlatList>(null);

    const [messages, setMessages] = useState([
        { id: '1', text: `Hello! I am your ${name || 'Official Complaints'} coordinator. How can I assist you with filing an incident or formal complaint safely today?`, sender: 'other' },
    ]);
    const [inputText, setInputText] = useState('');
    const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

    const activeColor = color || (isDark ? '#B0A4F1' : '#7868E6');

    useEffect(() => {
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

    const sendMessage = () => {
        if (!inputText.trim()) return;
        const newMsg = { id: Date.now().toString(), text: inputText.trim(), sender: 'me' };
        setMessages(prev => [...prev, newMsg]);
        setInputText('');
        setTimeout(() => {
            flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
        }, 80);
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <NightSkyBackground />
            <View style={{ height: insets.top, backgroundColor: theme.background, width: '100%', position: 'absolute', top: 0, zIndex: 10 }} />

            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top + 12, borderBottomColor: theme.border, backgroundColor: isDark ? 'rgba(7, 6, 20, 0.75)' : 'rgba(255, 255, 255, 0.85)' }]}>
                <TouchableOpacity onPress={() => router.back()} style={[styles.backButton, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)', borderColor: theme.border }]}>
                    <Ionicons name="chevron-back" size={24} color={activeColor} />
                </TouchableOpacity>

                <View style={styles.headerInfo}>
                    <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>{name || 'Complaints Liaison'}</Text>
                    <View style={styles.onlineStatus}>
                        <View style={styles.onlineDot} />
                        <Text style={[styles.statusText, { color: isDark ? '#A09CB8' : '#716F8E' }]}>Justice Coordinator (Confidential)</Text>
                    </View>
                </View>

                <TouchableOpacity
                    style={[styles.exitButton, { backgroundColor: 'rgba(239, 68, 68, 0.12)', borderColor: 'rgba(239, 68, 68, 0.35)' }]}
                    onPress={() => router.replace('/')}
                    activeOpacity={0.8}
                >
                    <Ionicons name="exit-outline" size={14} color="#EF4444" style={{ marginRight: 4 }} />
                    <Text style={styles.exitText}>{t('quickExit')}</Text>
                </TouchableOpacity>
            </View>

            {/* Chat Body & Input wrapped in KeyboardAvoidingView */}
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top + 45 : 0}
            >
                <FlatList
                    ref={flatListRef}
                    style={{ flex: 1 }}
                    data={[...messages].reverse()}
                    inverted
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.messageList}
                    keyboardShouldPersistTaps="handled"
                    renderItem={({ item }) => (
                        <View style={[
                            styles.messageWrapper,
                            item.sender === 'me' ? styles.myMessageWrapper : styles.otherMessageWrapper
                        ]}>
                            <View style={[
                                styles.messageBubble,
                                item.sender === 'me'
                                    ? [styles.myBubble, { backgroundColor: activeColor }]
                                    : [styles.otherBubble, { backgroundColor: isDark ? theme.surface : '#FFFFFF', borderColor: theme.border, borderWidth: 1, borderLeftColor: activeColor, borderLeftWidth: 3 }]
                            ]}>
                                <Text style={[
                                    styles.messageText,
                                    item.sender === 'me' ? { color: isDark ? '#000' : '#FFF', fontWeight: '600' } : { color: theme.text }
                                ]}>{item.text}</Text>
                            </View>
                        </View>
                    )}
                />

                {/* Input Area */}
                <View style={[
                    styles.inputContainer,
                    {
                        backgroundColor: isDark ? 'rgba(10, 8, 24, 0.96)' : 'rgba(255, 255, 255, 0.98)',
                        borderTopColor: theme.border,
                        paddingBottom: isKeyboardOpen ? 8 : Math.max(insets.bottom, 12)
                    }
                ]}>
                    <TextInput
                        style={[
                            styles.input,
                            {
                                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : '#F7F6FC',
                                color: theme.text,
                                borderColor: theme.border,
                                borderWidth: 1
                            }
                        ]}
                        placeholder="Type your message securely..."
                        placeholderTextColor={theme.placeholder}
                        value={inputText}
                        onChangeText={setInputText}
                        multiline
                    />
                    <TouchableOpacity
                        style={[
                            styles.sendButton,
                            { backgroundColor: activeColor },
                            !inputText.trim() && { opacity: 0.4 }
                        ]}
                        onPress={sendMessage}
                        disabled={!inputText.trim()}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="send" size={17} color={isDark ? "#000" : "#FFF"} />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 18,
        paddingBottom: 12,
        borderBottomWidth: 1,
        zIndex: 10,
    },
    backButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
    },
    headerInfo: {
        flex: 1,
        marginLeft: 10,
        marginRight: 10,
    },
    title: {
        fontSize: 15,
        fontWeight: 'bold',
    },
    onlineStatus: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2,
    },
    onlineDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#10B981',
        marginRight: 5,
    },
    statusText: {
        fontSize: 10,
        fontWeight: '600',
    },
    exitButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 12,
        borderWidth: 1,
    },
    exitText: {
        color: '#EF4444',
        fontSize: 11,
        fontWeight: 'bold',
    },
    messageList: {
        paddingHorizontal: 18,
        paddingVertical: 14,
    },
    messageWrapper: {
        marginBottom: 12,
        width: '100%',
    },
    myMessageWrapper: {
        alignItems: 'flex-end',
    },
    otherMessageWrapper: {
        alignItems: 'flex-start',
    },
    messageBubble: {
        maxWidth: '82%',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 20,
    },
    myBubble: {
        borderBottomRightRadius: 4,
    },
    otherBubble: {
        borderBottomLeftRadius: 4,
    },
    messageText: {
        fontSize: 15,
        lineHeight: 21,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingTop: 8,
        borderTopWidth: 1,
    },
    input: {
        flex: 1,
        borderRadius: 22,
        paddingHorizontal: 16,
        paddingVertical: Platform.OS === 'ios' ? 10 : 7,
        fontSize: 15,
        maxHeight: 120,
        marginRight: 8,
        textAlignVertical: 'center',
    },
    sendButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    }
});
