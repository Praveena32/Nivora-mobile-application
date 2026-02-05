import NightSkyBackground from '@/components/NightSkyBackground';
import { useLanguage } from '@/constants/LanguageContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function CommunityScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { t } = useLanguage();

    const COMMUNITY_FEATURES = [
        {
            id: 'meditation',
            title: t('groupMeditation'),
            desc: t('groupMeditationDesc'),
            icon: 'people',
            color: '#B0A4F1',
            gradient: ['#B0A4F1', '#8979E8'],
            route: '/moods/group-meditation'
        } as any,
        {
            id: 'art',
            title: t('collaborativeArt'),
            desc: t('collabArtDesc'),
            icon: 'brush',
            color: '#FFB0B0',
            gradient: ['#FFB0B0', '#FF8E8E'],
            route: '/moods/collaborative-art'
        } as any,
        {
            id: 'forums',
            title: t('supportForums'),
            desc: t('supportForumsDesc'),
            icon: 'chatbubbles',
            color: '#A2D9CE',
            gradient: ['#A2D9CE', '#76D7C4'],
            route: '/moods/support-circle'
        } as any,
    ];

    return (
        <View style={[styles.container, { backgroundColor: '#050510' }]}>
            <NightSkyBackground />

            <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
                <Text style={styles.title}>{t('communityHub')}</Text>
                <Text style={styles.subtitle}>{t('communityHeroSub')}</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t('joinActivity')}</Text>
                    {COMMUNITY_FEATURES.map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            style={styles.featureCard}
                            onPress={() => item.route && router.push(item.route as any)}
                        >
                            <View style={[styles.iconBox, { backgroundColor: item.color + '15' }]}>
                                <Ionicons name={item.icon as any} size={28} color={item.color} />
                            </View>
                            <View style={styles.cardText}>
                                <Text style={styles.cardTitle}>{item.title}</Text>
                                <Text style={styles.cardDesc}>{item.desc}</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.2)" />
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t('meetVolunteers')}</Text>
                    <TouchableOpacity
                        style={styles.volunteerBanner}
                        onPress={() => router.push('/moods/volunteer-directory' as any)}
                    >
                        <View style={styles.volunteerAvatars}>
                            <Image source={{ uri: 'https://i.pravatar.cc/100?u=1' }} style={styles.avatarMini} />
                            <Image source={{ uri: 'https://i.pravatar.cc/100?u=2' }} style={[styles.avatarMini, { marginLeft: -15 }]} />
                            <Image source={{ uri: 'https://i.pravatar.cc/100?u=3' }} style={[styles.avatarMini, { marginLeft: -15 }]} />
                        </View>
                        <View style={styles.bannerInfo}>
                            <Text style={styles.bannerTitle}>{t('talkToPeerVolunteer')}</Text>
                            <Text style={styles.bannerSub}>{t('volunteerBannerSub')}</Text>
                        </View>
                        <Ionicons name="arrow-forward" size={24} color="#B0A4F1" />
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 25,
        paddingBottom: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: '900',
        color: '#FFF',
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.5)',
        marginTop: 4,
    },
    content: {
        padding: 20,
    },
    section: {
        marginBottom: 35,
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
    featureCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 28,
        padding: 20,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    iconBox: {
        width: 56,
        height: 56,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 18,
    },
    cardText: {
        flex: 1,
    },
    cardTitle: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    cardDesc: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 13,
        marginTop: 4,
    },
    volunteerBanner: {
        backgroundColor: 'rgba(176, 164, 241, 0.08)',
        borderRadius: 30,
        padding: 24,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(176, 164, 241, 0.2)',
    },
    volunteerAvatars: {
        flexDirection: 'row',
        marginRight: 15,
    },
    avatarMini: {
        width: 44,
        height: 44,
        borderRadius: 22,
        borderWidth: 3,
        borderColor: '#050510',
    },
    bannerInfo: {
        flex: 1,
    },
    bannerTitle: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    bannerSub: {
        color: 'rgba(176, 164, 241, 0.7)',
        fontSize: 12,
        marginTop: 4,
        lineHeight: 18,
    }
});
