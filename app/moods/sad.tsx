import NightSkyBackground from '@/components/NightSkyBackground';
import { BACKEND_URL } from '@/constants/Backend';
import { useLanguage } from '@/constants/LanguageContext';
import { Ionicons } from '@expo/vector-icons';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function SafeHavenScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { t } = useLanguage();
    const [ventText, setVentText] = useState('');
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
            const response = await fetch(`${BACKEND_URL}/media?category=sad`);
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

    const SUPPORT_CARDS = [
        {
            title: t('messageSupportCircle'),
            icon: 'people-outline',
            color: '#B0A4F1',
            route: '/(tabs)/community'
        },
        {
            title: t('talkToVolunteer'),
            icon: 'heart-outline',
            color: '#FF8A8A',
            route: '/moods/counselor-chat'
        },
        {
            title: t('bookCounselor'),
            icon: 'calendar-outline',
            color: '#82E9FF',
            route: '/moods/counselor-chat'
        },
        {
            title: t('guidedCalming'),
            icon: 'leaf-outline',
            color: '#A7FF82',
            route: '/moods/calming-exercises'
        }
    ];

    return (
        <View style={[styles.container, { backgroundColor: '#050510' }]}>
            <NightSkyBackground />

            <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={28} color="#B0A4F1" />
                </TouchableOpacity>
                <Text style={styles.title}>{t('safeHavenTitle')}</Text>
                <View style={{ width: 44 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.heroCard}>
                    <Text style={styles.heroTitle}>{t('emotionalSafety')}</Text>
                    <Text style={styles.heroDesc}>{t('safeHavenHeroDesc')}</Text>

                    {media.length > 0 && (
                        <TouchableOpacity style={styles.playerBar} onPress={togglePlay}>
                            <Ionicons name={status.playing ? "pause" : "play"} size={24} color="#FFF" />
                            <Text style={styles.playerText}>{media[currentIndex].title}</Text>
                            <View style={styles.liveIndicator}>
                                <View style={[styles.liveDot, status.playing && styles.dotPulsing]} />
                            </View>
                        </TouchableOpacity>
                    )}
                </View>

                <View style={styles.supportGrid}>
                    {SUPPORT_CARDS.map((card, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.supportCard}
                            onPress={() => router.push(card.route as any)}
                        >
                            <View style={[styles.iconCircle, { backgroundColor: card.color + '15' }]}>
                                <Ionicons name={card.icon as any} size={24} color={card.color} />
                            </View>
                            <Text style={styles.cardLabel}>{card.title}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <TouchableOpacity
                    style={styles.voyaCard}
                    onPress={() => router.push('/voya-chat')}
                >
                    <View style={styles.voyaCardInner}>
                        <Ionicons name="sparkles" size={28} color="#000" />
                        <View style={styles.voyaTextContainer}>
                            <Text style={styles.voyaLabel}>{t('instantAiSupport')}</Text>
                            <Text style={styles.voyaSub}>{t('voyaRedirect')}</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={24} color="#000" />
                    </View>
                </TouchableOpacity>

                <View style={styles.journalSnip}>
                    <Text style={styles.snipTitle}>{t('ventHeart')}</Text>
                    <TextInput
                        style={styles.miniJournal}
                        placeholder={t('ventPlaceholder')}
                        placeholderTextColor="rgba(255,255,255,0.3)"
                        multiline
                        value={ventText}
                        onChangeText={setVentText}
                    />
                </View>
            </ScrollView>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
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
        padding: 24,
        paddingBottom: 40,
    },
    heroCard: {
        backgroundColor: 'rgba(33, 150, 243, 0.1)',
        borderRadius: 32,
        padding: 30,
        borderWidth: 1,
        borderColor: 'rgba(33, 150, 243, 0.2)',
        marginBottom: 30,
    },
    heroTitle: {
        color: '#FFF',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    heroDesc: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 14,
        lineHeight: 20,
    },
    supportGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 16,
        marginBottom: 30,
    },
    supportCard: {
        width: (SCREEN_WIDTH - 48 - 16) / 2,
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 24,
        padding: 20,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    iconCircle: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    cardLabel: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
        lineHeight: 18,
    },
    voyaCard: {
        backgroundColor: '#B0A4F1',
        borderRadius: 28,
        padding: 24,
        marginBottom: 30,
    },
    voyaCardInner: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    voyaTextContainer: {
        flex: 1,
        marginLeft: 15,
    },
    voyaLabel: {
        color: '#000',
        fontSize: 18,
        fontWeight: 'bold',
    },
    voyaSub: {
        color: 'rgba(0,0,0,0.6)',
        fontSize: 13,
    },
    journalSnip: {
        backgroundColor: 'rgba(255,255,255,0.02)',
        borderRadius: 24,
        padding: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    snipTitle: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 12,
        textTransform: 'uppercase',
    },
    miniJournal: {
        color: '#FFF',
        fontSize: 16,
        minHeight: 100,
        textAlignVertical: 'top',
    },
    playerBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 15,
        padding: 12,
        marginTop: 15,
    },
    playerText: {
        color: '#FFF',
        marginLeft: 10,
        flex: 1,
        fontSize: 14,
        fontWeight: '500',
    },
    liveIndicator: {
        width: 10,
        height: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    liveDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: 'rgba(255,255,255,0.3)',
    },
    dotPulsing: {
        backgroundColor: '#FF8A8A',
        shadowColor: '#FF8A8A',
        shadowRadius: 5,
        shadowOpacity: 0.8,
    }
});
