import NightSkyBackground from '@/components/NightSkyBackground';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const RECENT_CHATS = [
    {
        id: '1',
        name: '@GentleSoul',
        avatar: 'https://i.pravatar.cc/150?u=1',
        lastMessage: "I'm here if you'd like to talk...",
        time: '2m ago',
        unread: false,
    },
    {
        id: '2',
        name: '@SereneHaze',
        avatar: 'https://i.pravatar.cc/150?u=2',
        lastMessage: 'That meditation session was really helpful.',
        time: '1h ago',
        unread: true,
    },
    {
        id: '3',
        name: '@CalmRiver',
        avatar: 'https://i.pravatar.cc/150?u=3',
        lastMessage: 'Talk to you later!',
        time: 'Yesterday',
        unread: false,
    },
];

export default function ChatHistoryScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const renderChatItem = ({ item }: { item: typeof RECENT_CHATS[0] }) => (
        <TouchableOpacity
            style={styles.chatCard}
            onPress={() => router.push({
                pathname: '/moods/buddy-chat',
                params: { name: item.name, avatar: item.avatar }
            } as any)}
        >
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
            <View style={styles.chatInfo}>
                <View style={styles.chatHeader}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.time}>{item.time}</Text>
                </View>
                <Text
                    style={[styles.lastMessage, item.unread && styles.unreadMessage]}
                    numberOfLines={1}
                >
                    {item.lastMessage}
                </Text>
            </View>
            {item.unread && <View style={styles.unreadDot} />}
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container, { backgroundColor: '#050510' }]}>
            <NightSkyBackground />

            <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={28} color="#B0A4F1" />
                </TouchableOpacity>
                <Text style={styles.title}>Conversations</Text>
                <View style={{ width: 40 }} />
            </View>

            <FlatList
                data={RECENT_CHATS}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                renderItem={renderChatItem}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Ionicons name="chatbubbles-outline" size={64} color="rgba(255,255,255,0.1)" />
                        <Text style={styles.emptyText}>No recent conversations yet.</Text>
                        <Text style={styles.emptySub}>Connect with a buddy to start talking.</Text>
                    </View>
                }
            />
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
        paddingBottom: 20,
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
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#FFF',
    },
    listContent: {
        padding: 20,
    },
    chatCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 24,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    chatInfo: {
        flex: 1,
        marginLeft: 15,
    },
    chatHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFF',
    },
    time: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.4)',
    },
    lastMessage: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.5)',
    },
    unreadMessage: {
        color: '#B0A4F1',
        fontWeight: '500',
    },
    unreadDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#B0A4F1',
        marginLeft: 10,
    },
    emptyState: {
        alignItems: 'center',
        marginTop: 100,
    },
    emptyText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
    },
    emptySub: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 14,
        marginTop: 8,
    }
});
