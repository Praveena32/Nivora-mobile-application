import NightSkyBackground from '@/components/NightSkyBackground';
import { BACKEND_URL } from '@/constants/Backend';
import { useLanguage } from '@/constants/LanguageContext';
import { Ionicons } from '@expo/vector-icons';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const BUDDIES = [
    { id: '1', name: '@GentleSoul', avatar: 'https://i.pravatar.cc/150?u=1' },
    { id: '2', name: '@SereneHaze', avatar: 'https://i.pravatar.cc/150?u=2' },
    { id: '3', name: '@CalmRiver', avatar: 'https://i.pravatar.cc/150?u=3' },
];

export default function LonelyScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { t } = useLanguage();
    const [media, setMedia] = useState<any[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    const player = useAudioPlayer(media[currentIndex]?.url);
    const status = useAudioPlayerStatus(player);

    useEffect(() => {
        fetchMedia();
    }, []);

    useEffect(() => {
        if (media[currentIndex]?.url) {
            player.replace({ uri: media[currentIndex].url });
        }
    }, [currentIndex, media]);

    const fetchMedia = async () => {
        try {
            const response = await fetch(`${BACKEND_URL}/media?category=lonely`);
            const data = await response.json();
            setMedia(data);
        } catch (error) {
            console.error('Fetch Error:', error);
        }
    };

    const togglePlay = () => {
        if (status.playing) player.pause();
        else player.play();
    };

    return (
        <View style={[styles.container, { backgroundColor: '#050510' }]}>
            <NightSkyBackground />

            <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={28} color="#B0A4F1" />
                </TouchableOpacity>
                <Text style={styles.title}>{t('buddyConnection')}</Text>
                <TouchableOpacity
                    style={styles.historyButton}
                    onPress={() => router.push('/moods/chat-history' as any)}
                >
                    <Ionicons name="chatbubbles-outline" size={24} color="#B0A4F1" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.heroCard}>
                    <Text style={styles.heroTitle}>{t('youAreNotAlone')}</Text>
                    <Text style={styles.heroDesc}>{t('lonelyHeroDesc')}</Text>

                    {media.length > 0 && (
                        <TouchableOpacity style={styles.playerBar} onPress={togglePlay}>
                            <Ionicons name={status.playing ? "pause" : "play"} size={24} color="#B0A4F1" />
                            <Text style={styles.playerText}>{media[currentIndex].title}</Text>
                            <View style={[styles.statusDot, status.playing && styles.dotActive]} />
                        </TouchableOpacity>
                    )}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t('availableBuddies')}</Text>
                    <Text style={styles.sectionSubtitle}>{t('readyForChat')}</Text>

                    <View style={styles.buddyList}>
                        {BUDDIES.map(buddy => (
                            <View key={buddy.id} style={styles.buddyCard}>
                                <Image source={{ uri: buddy.avatar }} style={styles.avatar} />
                                <Text style={styles.buddyName}>{buddy.name}</Text>
                                <TouchableOpacity
                                    style={styles.connectButton}
                                    onPress={() => router.push({
                                        pathname: '/moods/buddy-chat',
                                        params: { name: buddy.name, avatar: buddy.avatar }
                                    } as any)}
                                >
                                    <Text style={styles.connectButtonText}>{t('sayHi')}</Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                </View>

                <View style={styles.activityBox}>
                    <Text style={styles.activityTitle}>{t('sharedActivities')}</Text>
                    <TouchableOpacity
                        style={styles.activityItem}
                        onPress={() => router.push('/moods/group-meditation' as any)}
                    >
                        <View style={styles.activityIcon}>
                            <Ionicons name="people-outline" size={24} color="#FFF" />
                        </View>
                        <View style={styles.activityText}>
                            <Text style={styles.activityLabel}>{t('groupMeditation')}</Text>
                            <Text style={styles.activityTime}>{t('startingIn5')}</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.3)" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.activityItem}
                        onPress={() => router.push('/moods/collaborative-art' as any)}
                    >
                        <View style={styles.activityIcon}>
                            <Ionicons name="color-palette-outline" size={24} color="#FFF" />
                        </View>
                        <View style={styles.activityText}>
                            <Text style={styles.activityLabel}>{t('collaborativeArt')}</Text>
                            <Text style={styles.activityTime}>{t('activeNow')}</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.3)" />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={styles.voyaSupport}
                    onPress={() => router.push('/voya-chat')}
                >
                    <View style={styles.voyaSupportInner}>
                        <Ionicons name="sparkles" size={24} color="#000" />
                        <View style={styles.voyaSupportText}>
                            <Text style={styles.voyaSupportLabel}>{t('notReadyForPeople')}</Text>
                            <Text style={styles.voyaSupportSub}>{t('talkToVoyaAnytime')}</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#000" />
                    </View>
                </TouchableOpacity>

                <View style={{ height: 40 + insets.bottom }} />
            </ScrollView >
        </View >
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
    historyButton: {
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
        padding: 24,
    },
    heroCard: {
        backgroundColor: 'rgba(176, 164, 241, 0.1)',
        borderRadius: 32,
        padding: 30,
        borderWidth: 1,
        borderColor: 'rgba(176, 164, 241, 0.2)',
        marginBottom: 30,
    },
    heroTitle: {
        color: '#FFF',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    heroDesc: {
        color: 'rgba(176, 164, 241, 0.7)',
        fontSize: 14,
        lineHeight: 20,
    },
    section: {
        marginBottom: 30,
    },
    sectionTitle: {
        color: '#FFF',
        fontSize: 20,
        fontWeight: 'bold',
    },
    sectionSubtitle: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 14,
        marginBottom: 20,
    },
    buddyList: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    buddyCard: {
        width: (width - 48 - 30) / 3,
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 24,
        padding: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginBottom: 10,
    },
    buddyName: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    connectButton: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 10,
    },
    connectButtonText: {
        color: '#B0A4F1',
        fontSize: 12,
        fontWeight: 'bold',
    },
    activityBox: {
        width: '100%',
        marginBottom: 30,
    },
    activityTitle: {
        color: '#FFF',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    activityItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 20,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    activityIcon: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.05)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    activityText: {
        flex: 1,
    },
    activityLabel: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    activityTime: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 12,
        marginTop: 2,
    },
    voyaSupport: {
        backgroundColor: '#B0A4F1',
        borderRadius: 24,
        padding: 20,
        shadowColor: '#B0A4F1',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 8,
    },
    voyaSupportInner: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    voyaSupportText: {
        flex: 1,
        marginLeft: 15,
    },
    voyaSupportLabel: {
        color: '#000',
        fontSize: 16,
        fontWeight: 'bold',
    },
    voyaSupportSub: {
        color: 'rgba(0,0,0,0.6)',
        fontSize: 12,
    },
    playerBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 16,
        padding: 12,
        marginTop: 15,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    playerText: {
        color: '#B0A4F1',
        marginLeft: 12,
        flex: 1,
        fontSize: 14,
        fontWeight: '500',
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    dotActive: {
        backgroundColor: '#4CAF50',
        shadowColor: '#4CAF50',
        shadowRadius: 5,
        shadowOpacity: 0.8,
    }
});
