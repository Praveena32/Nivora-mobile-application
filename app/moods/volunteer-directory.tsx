import NightSkyBackground from '@/components/NightSkyBackground';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const VOLUNTEERS = [
    {
        id: '1',
        name: 'Jasper',
        type: 'Peer Supporter',
        image: 'https://i.pravatar.cc/150?u=jasper',
        specialty: 'Anxiety & Work Stress',
        available: true,
        bio: 'I’ve walked this path too. Let’s talk it through together.'
    },
    {
        id: '2',
        name: 'Aria',
        type: 'Community Listener',
        image: 'https://i.pravatar.cc/150?u=aria',
        specialty: 'Relationships & Loneliness',
        available: true,
        bio: 'Here to offer a safe, judgment-free space for your thoughts.'
    },
    {
        id: '3',
        name: 'Kael',
        type: 'Crisis Companion',
        image: 'https://i.pravatar.cc/150?u=kael',
        specialty: 'Grief & Bereavement',
        available: false,
        bio: 'Supporting you through the heavy moments of life.'
    },
];

export default function VolunteerDirectoryScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [filter, setFilter] = useState('All');

    return (
        <View style={[styles.container, { backgroundColor: '#050510' }]}>
            <NightSkyBackground />

            <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={28} color="#B0A4F1" />
                </TouchableOpacity>
                <Text style={styles.title}>Community Volunteers</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.introCard}>
                    <Text style={styles.introTitle}>Trained Community Support</Text>
                    <Text style={styles.introText}>
                        These are verified volunteers from our community who are trained to listen and support.
                        This is a free service—choose someone you feel comfortable with.
                    </Text>
                </View>

                <View style={styles.chipsRow}>
                    {['All', 'Listening', 'Peer Support', 'Crisis'].map(c => (
                        <TouchableOpacity
                            key={c}
                            style={[styles.chip, filter === c && styles.chipActive]}
                            onPress={() => setFilter(c)}
                        >
                            <Text style={[styles.chipText, filter === c && styles.chipTextActive]}>{c}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {VOLUNTEERS.map(item => (
                    <TouchableOpacity
                        key={item.id}
                        style={styles.volunteerCard}
                        onPress={() => router.push({
                            pathname: '/moods/counselor-chat',
                            params: {
                                name: item.name,
                                image: item.image,
                                isVolunteer: 'true'
                            }
                        } as any)}
                    >
                        <View style={styles.cardHeader}>
                            <View style={styles.avatarContainer}>
                                <Image source={{ uri: item.image }} style={styles.avatar} />
                                {item.available && <View style={styles.onlineStatus} />}
                            </View>
                            <View style={styles.nameContainer}>
                                <Text style={styles.vName}>{item.name}</Text>
                                <Text style={styles.vType}>{item.type}</Text>
                            </View>
                            <View style={[styles.statusTag, { backgroundColor: item.available ? 'rgba(76, 175, 80, 0.1)' : 'rgba(255,255,255,0.05)' }]}>
                                <Text style={[styles.statusText, { color: item.available ? '#4CAF50' : '#666' }]}>
                                    {item.available ? 'AVAILABLE' : 'OFFLINE'}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.infoRow}>
                            <Ionicons name="sparkles-outline" size={16} color="#B0A4F1" />
                            <Text style={styles.specText}>{item.specialty}</Text>
                        </View>

                        <Text style={styles.bioText} numberOfLines={2}>{item.bio}</Text>

                        <View style={styles.actionRow}>
                            <Text style={styles.freeLabel}>Free Service</Text>
                            <View style={styles.startBtn}>
                                <Text style={styles.startBtnText}>{item.available ? 'Chat Now' : 'Check Schedule'}</Text>
                                <Ionicons name="arrow-forward" size={16} color="#000" />
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
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
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFF',
    },
    content: {
        padding: 20,
    },
    introCard: {
        backgroundColor: 'rgba(176, 164, 241, 0.1)',
        borderRadius: 24,
        padding: 20,
        marginBottom: 25,
        borderWidth: 1,
        borderColor: 'rgba(176, 164, 241, 0.2)',
    },
    introTitle: {
        color: '#B0A4F1',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    introText: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 13,
        lineHeight: 20,
    },
    chipsRow: {
        flexDirection: 'row',
        marginBottom: 25,
        gap: 10,
    },
    chip: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    chipActive: {
        backgroundColor: '#B0A4F1',
        borderColor: '#B0A4F1',
    },
    chipText: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 13,
        fontWeight: '600',
    },
    chipTextActive: {
        color: '#000',
    },
    volunteerCard: {
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 30,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarContainer: {
        position: 'relative',
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    onlineStatus: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: '#4CAF50',
        borderWidth: 2,
        borderColor: '#050510',
    },
    nameContainer: {
        flex: 1,
        marginLeft: 15,
    },
    vName: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    vType: {
        color: '#B0A4F1',
        fontSize: 12,
        fontWeight: '600',
        marginTop: 2,
    },
    statusTag: {
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 8,
    },
    statusText: {
        fontSize: 10,
        fontWeight: '900',
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.05)',
        marginVertical: 15,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    specText: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 13,
        fontWeight: '500',
    },
    bioText: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 13,
        lineHeight: 18,
        marginBottom: 15,
    },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    freeLabel: {
        color: '#4CAF50',
        fontSize: 12,
        fontWeight: 'bold',
    },
    startBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#B0A4F1',
        paddingVertical: 10,
        paddingHorizontal: 18,
        borderRadius: 15,
        gap: 8,
    },
    startBtnText: {
        color: '#000',
        fontSize: 14,
        fontWeight: 'bold',
    }
});
