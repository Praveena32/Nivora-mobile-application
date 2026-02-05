import NightSkyBackground from '@/components/NightSkyBackground';
import { useLanguage } from '@/constants/LanguageContext';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
    FlatList,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function JusticeDirectoryChat() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { t } = useLanguage();
    const { name, color } = useLocalSearchParams<{ name: string; color: string }>();

    const [messages, setMessages] = useState([
        { id: '1', text: `Hello! I am your ${name} specialist. How can I help you connect with NGOs and hotline services today?`, sender: 'other' },
    ]);
    const [inputText, setInputText] = useState('');

    const sendMessage = () => {
        if (!inputText.trim()) return;
        const newMsg = { id: Date.now().toString(), text: inputText, sender: 'me' };
        setMessages([...messages, newMsg]);
        setInputText('');
    };

    return (
        <View style={[styles.container, { backgroundColor: '#050510' }]}>
            <NightSkyBackground />

            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={28} color={color || "#B0A4F1"} />
                </TouchableOpacity>

                <View style={styles.headerInfo}>
                    <Text style={styles.title} numberOfLines={1}>{name}</Text>
                    <View style={styles.onlineStatus}>
                        <View style={styles.onlineDot} />
                        <Text style={styles.statusText}>Justice Coordinator</Text>
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.exitButton}
                    onPress={() => router.replace('/')}
                >
                    <Ionicons name="exit-outline" size={16} color="#FF8A8A" style={{ marginRight: 6 }} />
                    <Text style={styles.exitText}>{t('quickExit')}</Text>
                </TouchableOpacity>
            </View>

            {/* Chat Body */}
            <FlatList
                data={messages}
                keyExtractor={item => item.id}
                contentContainerStyle={[styles.messageList, { paddingBottom: 20 }]}
                renderItem={({ item }) => (
                    <View style={[
                        styles.messageWrapper,
                        item.sender === 'me' ? styles.myMessageWrapper : styles.otherMessageWrapper
                    ]}>
                        <View style={[
                            styles.messageBubble,
                            item.sender === 'me' ? styles.myBubble : [styles.otherBubble, { borderLeftColor: color || '#B0A4F1' }]
                        ]}>
                            <Text style={[
                                styles.messageText,
                                item.sender === 'me' ? styles.myText : styles.otherText
                            ]}>{item.text}</Text>
                        </View>
                    </View>
                )}
            />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            >
                <View style={[styles.inputContainer, { paddingBottom: insets.bottom + 15 }]}>
                    <TextInput
                        style={styles.input}
                        placeholder="Type your message..."
                        placeholderTextColor="rgba(255,255,255,0.3)"
                        value={inputText}
                        onChangeText={setInputText}
                        multiline
                    />
                    <TouchableOpacity
                        style={[styles.sendButton, { backgroundColor: color || '#B0A4F1' }]}
                        onPress={sendMessage}
                    >
                        <Ionicons name="send" size={20} color="#000" />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingBottom: 15,
        backgroundColor: 'rgba(5, 5, 25, 0.8)',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)'
    },
    backButton: { width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.03)', justifyContent: 'center', alignItems: 'center' },
    headerInfo: { flex: 1, marginLeft: 15, marginRight: 10 },
    title: { fontSize: 16, fontWeight: 'bold', color: '#FFF' },
    onlineStatus: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
    onlineDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#4CAF50', marginRight: 6 },
    statusText: { fontSize: 10, color: 'rgba(255,255,255,0.4)', fontWeight: 'bold' },

    exitButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,138,138,0.12)',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,138,138,0.4)',
    },
    exitText: { color: '#FF8A8A', fontSize: 13, fontWeight: 'bold' },

    messageList: { padding: 20 },
    messageWrapper: { marginBottom: 15, width: '100%' },
    myMessageWrapper: { alignItems: 'flex-end' },
    otherMessageWrapper: { alignItems: 'flex-start' },
    messageBubble: { maxWidth: '85%', padding: 15, borderRadius: 20 },
    myBubble: { backgroundColor: 'rgba(255,255,255,0.1)', borderBottomRightRadius: 4 },
    otherBubble: { backgroundColor: 'rgba(255,255,255,0.05)', borderBottomLeftRadius: 4, borderLeftWidth: 3 },
    messageText: { fontSize: 15, lineHeight: 22 },
    myText: { color: '#FFF' },
    otherText: { color: '#FFF' },

    inputContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingHorizontal: 20,
        paddingTop: 15,
        backgroundColor: '#050510',
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.05)',
    },
    input: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 12,
        color: '#FFF',
        fontSize: 15,
        maxHeight: 120,
        marginRight: 10,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)'
    },
    sendButton: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center' }
});
