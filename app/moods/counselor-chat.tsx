import NightSkyBackground from '@/components/NightSkyBackground';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
    FlatList,
    Image,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function CounselorChatScreen() {
    const router = useRouter();
    const { name, image, type } = useLocalSearchParams<{ name: string; image: string; type: string }>();
    const insets = useSafeAreaInsets();

    const [messages, setMessages] = useState([
        { id: '1', text: `Hello, I'm ${name?.split(' ')?.[0] || 'your coordinator'}. How can I support you today?`, sender: 'other' },
    ]);
    const [inputText, setInputText] = useState('');

    const sendMessage = () => {
        if (!inputText.trim()) return;
        const newMsg = { id: Date.now().toString(), text: inputText, sender: 'me' };
        setMessages([...messages, newMsg]);
        setInputText('');
    };

    const handleCall = (callType: 'voice' | 'video') => {
        Alert.alert(
            `${callType === 'voice' ? 'Voice' : 'Video'} Call`,
            `Starting a ${callType} session with ${name}...`,
            [{ text: 'End Session', style: 'destructive' }]
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: '#050510' }]}>
            <NightSkyBackground />

            <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={28} color="#B0A4F1" />
                </TouchableOpacity>

                <View style={styles.headerInfo}>
                    <Image source={{ uri: image }} style={styles.headerAvatar} />
                    <View>
                        <Text style={styles.title}>{name}</Text>
                        <Text style={styles.subtitle}>Volunteer Person</Text>
                    </View>
                </View>

                <View style={styles.headerActions}>
                    <TouchableOpacity style={styles.actionIcon} onPress={() => handleCall('voice')}>
                        <Ionicons name="call" size={22} color="#4CAF50" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionIcon} onPress={() => handleCall('video')}>
                        <Ionicons name="videocam" size={22} color="#2196F3" />
                    </TouchableOpacity>
                </View>
            </View>

            <FlatList
                style={{ flex: 1 }}
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
                        placeholder="Share what's on your mind..."
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
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 10,
    },
    headerAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFF',
    },
    subtitle: {
        fontSize: 11,
        color: '#B0A4F1',
    },
    headerActions: {
        flexDirection: 'row',
        gap: 15,
    },
    actionIcon: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: 'rgba(255,255,255,0.05)',
        justifyContent: 'center',
        alignItems: 'center',
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
        maxWidth: '85%',
        padding: 15,
        borderRadius: 22,
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
        lineHeight: 22,
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
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#B0A4F1',
        justifyContent: 'center',
        alignItems: 'center',
    }
});
