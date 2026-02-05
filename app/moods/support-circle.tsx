import NightSkyBackground from '@/components/NightSkyBackground';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const INITIAL_CIRCLE = [
    {
        id: '1',
        name: 'Alex',
        username: '@GentleSoul',
        avatar: 'https://i.pravatar.cc/150?u=alex',
        status: 'Online',
        isOnline: true,
    },
    {
        id: '2',
        name: 'Jordan',
        username: '@PatienceFirst',
        avatar: 'https://i.pravatar.cc/150?u=jordan',
        status: 'Offline',
        isOnline: false,
    },
];

export default function SupportCircleScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [circle, setCircle] = useState(INITIAL_CIRCLE);
    const [searchQuery, setSearchQuery] = useState('');

    const navigateToChat = (buddy: any) => {
        router.push({
            pathname: '/moods/buddy-chat',
            params: { name: buddy.username, avatar: buddy.avatar }
        } as any);
    };

    return (
        <View style={[styles.container, { backgroundColor: '#050510' }]}>
            <NightSkyBackground />

            <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={28} color="#B0A4F1" />
                </TouchableOpacity>
                <Text style={styles.title}>Support Circle</Text>
                <TouchableOpacity style={styles.addButton}>
                    <Ionicons name="person-add" size={24} color="#B0A4F1" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.infoCard}>
                    <Text style={styles.infoTitle}>Your Chosen Buddies</Text>
                    <Text style={styles.infoText}>
                        These are trusted individuals you've chosen to be Part of your safety net.
                        They are fellow Nivora users who have agreed to support you.
                    </Text>
                </View>

                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color="rgba(255,255,255,0.3)" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search buddies in Nivora..."
                        placeholderTextColor="rgba(255,255,255,0.3)"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                <Text style={styles.sectionTitle}>My Circle ({circle.length})</Text>
                {circle.length > 0 ? (
                    circle.map(buddy => (
                        <TouchableOpacity
                            key={buddy.id}
                            style={styles.buddyCard}
                            onPress={() => navigateToChat(buddy)}
                        >
                            <View style={styles.avatarWrapper}>
                                <Image source={{ uri: buddy.avatar }} style={styles.avatar} />
                                {buddy.isOnline && <View style={styles.onlineDot} />}
                            </View>
                            <View style={styles.buddyInfo}>
                                <Text style={styles.buddyName}>{buddy.name}</Text>
                                <Text style={styles.buddyUsername}>{buddy.username}</Text>
                            </View>
                            <View style={styles.buddyActions}>
                                <View style={[styles.statusTag, buddy.isOnline ? styles.onlineTag : styles.offlineTag]}>
                                    <Text style={[styles.statusText, buddy.isOnline ? styles.onlineText : styles.offlineText]}>
                                        {buddy.status}
                                    </Text>
                                </View>
                                <Ionicons name="chatbubble-ellipses" size={24} color="#B0A4F1" />
                            </View>
                        </TouchableOpacity>
                    ))
                ) : (
                    <View style={styles.emptyState}>
                        <Ionicons name="people-outline" size={60} color="rgba(255,255,255,0.1)" />
                        <Text style={styles.emptyText}>Your circle is empty. Add buddies to start building your support net.</Text>
                    </View>
                )}

                <TouchableOpacity style={styles.inviteButton}>
                    <View style={styles.solidBtn}>
                        <Ionicons name="share-social" size={20} color="#000" />
                        <Text style={styles.inviteBtnText}>Invite Friends to Nivora</Text>
                    </View>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

// Re-using styles pattern for consistency
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
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.05)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    addButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.05)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#FFF',
    },
    content: {
        padding: 20,
    },
    infoCard: {
        backgroundColor: 'rgba(176, 164, 241, 0.1)',
        borderRadius: 24,
        padding: 20,
        marginBottom: 25,
        borderWidth: 1,
        borderColor: 'rgba(176, 164, 241, 0.2)',
    },
    infoTitle: {
        color: '#B0A4F1',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    infoText: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 13,
        lineHeight: 20,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 20,
        paddingHorizontal: 15,
        marginBottom: 30,
        height: 54,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    searchInput: {
        flex: 1,
        marginLeft: 10,
        color: '#FFF',
        fontSize: 15,
    },
    sectionTitle: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 14,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        marginBottom: 20,
        marginLeft: 4,
    },
    buddyCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 24,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    avatarWrapper: {
        position: 'relative',
    },
    avatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
    },
    onlineDot: {
        position: 'absolute',
        bottom: 2,
        right: 2,
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: '#4CAF50',
        borderWidth: 2,
        borderColor: '#050510',
    },
    buddyInfo: {
        flex: 1,
        marginLeft: 15,
    },
    buddyName: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    buddyUsername: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 13,
        marginTop: 2,
    },
    buddyActions: {
        alignItems: 'flex-end',
        gap: 8,
    },
    statusTag: {
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 8,
    },
    onlineTag: {
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
    },
    offlineTag: {
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    statusText: {
        fontSize: 10,
        fontWeight: '900',
    },
    onlineText: {
        color: '#4CAF50',
    },
    offlineText: {
        color: 'rgba(255,255,255,0.3)',
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyText: {
        color: 'rgba(255,255,255,0.3)',
        textAlign: 'center',
        marginTop: 15,
        fontSize: 14,
        lineHeight: 20,
    },
    inviteButton: {
        marginTop: 20,
    },
    solidBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 58,
        borderRadius: 20,
        gap: 10,
        backgroundColor: '#B0A4F1',
    },
    inviteBtnText: {
        color: '#000',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

// Since I don't have Expo LinearGradient import, I will use a regular View for now
// or I can try to import it if I'm sure it exists.
// Given typical Expo setup, it's usually expo-linear-gradient.
// I'll adjust the write_to_file to use a fallback View style if it fails.
