import NightSkyBackground from '@/components/NightSkyBackground';
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

export default function BuddyChatScreen() {
    const router = useRouter();
    const { name, avatar } = useLocalSearchParams<{ name: string; avatar: string }>();
    const insets = useSafeAreaInsets();
    const [messages, setMessages] = useState([
        { id: '1', text: `Hi! I'm here if you'd like to talk. How is your heart today?`, sender: 'other' },
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

            <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={28} color="#B0A4F1" />
                </TouchableOpacity>
                <View style={styles.headerInfo}>
                    <Text style={styles.title}>{name || 'Buddy'}</Text>
                    <Text style={styles.subtitle}>Online</Text>
                </View>
                <View style={{ width: 40 }} />
            </View>

            <FlatList
                data={messages}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.messageList}
                renderItem={({ item }) => (
                    <View style={[
                        styles.messageWrapper,
                        item.sender === 'me' ? styles.myMessageWrapper : styles.otherMessageWrapper
                    ]}>
                        <View style={[
                            styles.messageBubble,
                            item.sender === 'me' ? styles.myBubble : styles.otherBubble
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
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
                <View style={[styles.inputContainer, { paddingBottom: insets.bottom + 10 }]}>
                    <TextInput
                        style={styles.input}
                        placeholder="Send a gentle message..."
                        placeholderTextColor="rgba(255,255,255,0.3)"
                        value={inputText}
                        onChangeText={setInputText}
                        multiline
                    />
                    <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
                        <Ionicons name="send" size={20} color="#000" />
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
        paddingHorizontal: 20,
        paddingBottom: 15,
        backgroundColor: 'rgba(5, 5, 16, 0.8)',
        zIndex: 10,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.05)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerInfo: {
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFF',
    },
    subtitle: {
        fontSize: 12,
        color: '#4CAF50',
        marginTop: 2,
    },
    messageList: {
        padding: 20,
    },
    messageWrapper: {
        marginBottom: 15,
        width: '100%',
    },
    myMessageWrapper: {
        alignItems: 'flex-end',
    },
    otherMessageWrapper: {
        alignItems: 'flex-start',
    },
    messageBubble: {
        maxWidth: '80%',
        padding: 15,
        borderRadius: 20,
    },
    myBubble: {
        backgroundColor: '#B0A4F1',
        borderBottomRightRadius: 4,
    },
    otherBubble: {
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderBottomLeftRadius: 4,
    },
    messageText: {
        fontSize: 15,
        lineHeight: 20,
    },
    myText: {
        color: '#000',
    },
    otherText: {
        color: '#FFF',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingHorizontal: 20,
        paddingTop: 10,
        backgroundColor: 'rgba(5, 5, 16, 0.95)',
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.05)',
    },
    input: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 24,
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 12,
        color: '#FFF',
        fontSize: 15,
        maxHeight: 120,
        marginRight: 10,
    },
    sendButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#B0A4F1',
        justifyContent: 'center',
        alignItems: 'center',
    }
});
