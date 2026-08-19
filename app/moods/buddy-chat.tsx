import NightSkyBackground from '@/components/NightSkyBackground';
import Colors from '@/constants/Colors';
import { useTheme } from '@/constants/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
    FlatList,
    Image,
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

export default function BuddyChatScreen() {
    const router = useRouter();
    const { name, avatar } = useLocalSearchParams<{ name: string; avatar: string }>();
    const insets = useSafeAreaInsets();
    const { theme: themeName, isDark } = useTheme();
    const theme = Colors[themeName];
    const flatListRef = useRef<FlatList>(null);

    const [messages, setMessages] = useState([
        { id: '1', text: `Hi! I'm here if you'd like to talk. How is your heart today?`, sender: 'other' },
    ]);
    const [inputText, setInputText] = useState('');
    const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

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
                    <Ionicons name="chevron-back" size={24} color={theme.text} />
                </TouchableOpacity>

                <View style={styles.headerInfo}>
                    {avatar ? (
                        <Image source={{ uri: avatar }} style={[styles.headerAvatar, { borderColor: theme.primary, borderWidth: 1.5 }]} />
                    ) : (
                        <View style={[styles.headerAvatar, { backgroundColor: theme.primary, justifyContent: 'center', alignItems: 'center' }]}>
                            <Ionicons name="person" size={18} color={isDark ? "#000" : "#FFF"} />
                        </View>
                    )}
                    <View>
                        <Text style={[styles.title, { color: theme.text }]}>{name || 'Buddy'}</Text>
                        <View style={styles.onlineStatusRow}>
                            <View style={styles.onlineDot} />
                            <Text style={styles.subtitle}>Online & Listening</Text>
                        </View>
                    </View>
                </View>
                <View style={{ width: 36 }} />
            </View>

            {/* Chat Body & Input with KeyboardAvoidingView */}
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
                                    ? [styles.myBubble, { backgroundColor: theme.primary }]
                                    : [styles.otherBubble, { backgroundColor: isDark ? theme.surface : '#FFFFFF', borderColor: theme.border, borderWidth: 1 }]
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
                        placeholder="Send a gentle message..."
                        placeholderTextColor={theme.placeholder}
                        value={inputText}
                        onChangeText={setInputText}
                        multiline
                    />
                    <TouchableOpacity
                        style={[
                            styles.sendButton,
                            { backgroundColor: theme.primary },
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
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        flex: 1,
        marginLeft: 10,
    },
    headerAvatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    onlineStatusRow: {
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
    subtitle: {
        fontSize: 11,
        fontWeight: '600',
        color: '#10B981',
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
