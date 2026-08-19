import NightSkyBackground from '@/components/NightSkyBackground';
import Colors from '@/constants/Colors';
import { useTheme } from '@/constants/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
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

const THEMATIC_PODS = [
    {
        id: 'academic',
        title: 'Academic Burnout & Pressure',
        desc: 'Exam anxiety, late-night study panic & course stress',
        emoji: '🎓',
        color: '#7868E6',
        darkColor: '#B0A4F1',
        members: 34,
        pinnedVolunteer: 'Dr. Senaratne (Academic Counselor)',
        samplePrompt: '"How are you pacing yourself for exams this week?"',
    },
    {
        id: 'grief',
        title: 'Grief & Heartbreak Sanctuary',
        desc: 'Gentle support for loss, family grief, separation & hurt',
        emoji: '💔',
        color: '#EC4899',
        darkColor: '#F472B6',
        members: 19,
        pinnedVolunteer: 'Niluka (Grief Peer Volunteer)',
        samplePrompt: '"Give yourself permission to feel heavy today."',
    },
    {
        id: 'anxiety',
        title: 'Social Anxiety & Introvert Corner',
        desc: 'Low-pressure sharing at your own pace without expectations',
        emoji: '🌿',
        color: '#10B981',
        darkColor: '#34D399',
        members: 42,
        pinnedVolunteer: 'Kavindi (Mindfulness Facilitator)',
        samplePrompt: '"Take one slow breath before typing anything."',
    },
    {
        id: 'cyber',
        title: 'Cyber-Safety & Harassment Healing',
        desc: 'Safe, confidential space to discuss online abuse & recovery',
        emoji: '🕊️',
        color: '#0EA5E9',
        darkColor: '#38BDF8',
        members: 21,
        pinnedVolunteer: 'CyberGuard Legal Advocate',
        samplePrompt: '"You are believed, respected, and safe here."',
    },
    {
        id: 'purpose',
        title: 'Life Transitions & Career Uncertainty',
        desc: 'Navigating career choices, graduate anxiety & self-doubt',
        emoji: '🧭',
        color: '#F59E0B',
        darkColor: '#FBBF24',
        members: 28,
        pinnedVolunteer: 'Tariq (Career Mentor)',
        samplePrompt: '"Small daily consistency beats sudden perfection."',
    },
];

const INITIAL_BUDDIES = [
    {
        id: '1',
        name: 'Alex',
        username: '@GentleSoul',
        avatar: 'https://i.pravatar.cc/150?u=alex',
        status: 'Online',
        isOnline: true,
        pod: 'Academic Solidarity',
    },
    {
        id: '2',
        name: 'Jordan',
        username: '@PatienceFirst',
        avatar: 'https://i.pravatar.cc/150?u=jordan',
        status: 'Offline',
        isOnline: false,
        pod: 'Social Calm',
    },
];

export default function SupportCircleScreen() {
    const router = useRouter();
    const params = useLocalSearchParams<{ pod?: string }>();
    const insets = useSafeAreaInsets();
    const { theme: themeName, isDark } = useTheme();
    const theme = Colors[themeName];

    const [activeTab, setActiveTab] = useState<'pods' | 'buddies'>('pods');
    const [selectedPodId, setSelectedPodId] = useState<string>(params.pod || 'academic');
    const [buddies, setBuddies] = useState(INITIAL_BUDDIES);
    const [searchQuery, setSearchQuery] = useState('');

    const navigateToChat = (buddy: any) => {
        router.push({
            pathname: '/moods/buddy-chat',
            params: { name: buddy.username, avatar: buddy.avatar }
        } as any);
    };

    const currentPod = THEMATIC_PODS.find(p => p.id === selectedPodId) || THEMATIC_PODS[0];
    const currentPodColor = isDark ? currentPod.darkColor : currentPod.color;

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <NightSkyBackground />
            <View style={{ height: insets.top, backgroundColor: theme.background, width: '100%', position: 'absolute', top: 0, zIndex: 10 }} />

            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={[styles.backButton, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)', borderColor: theme.border }]}
                    activeOpacity={0.75}
                >
                    <Ionicons name="chevron-back" size={24} color={theme.text} />
                </TouchableOpacity>

                <View style={{ alignItems: 'center' }}>
                    <Text style={[styles.headerTitle, { color: theme.text }]}>Safe Support Pods</Text>
                    <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>Moderated Peer Solidarity</Text>
                </View>

                <TouchableOpacity
                    onPress={() => router.push('/moods/volunteer-directory' as any)}
                    style={[styles.volunteerQuickBtn, { backgroundColor: isDark ? 'rgba(16, 185, 129, 0.15)' : 'rgba(16, 185, 129, 0.12)', borderColor: '#10B981' }]}
                    activeOpacity={0.8}
                >
                    <Ionicons name="heart" size={16} color="#10B981" />
                </TouchableOpacity>
            </View>

            {/* Switcher Tabs (Pods vs Buddies) */}
            <View style={styles.tabSwitcherRow}>
                <TouchableOpacity
                    style={[
                        styles.tabSwitcherBtn,
                        activeTab === 'pods'
                            ? { backgroundColor: theme.primary, borderColor: theme.primary }
                            : { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)', borderColor: theme.border }
                    ]}
                    onPress={() => setActiveTab('pods')}
                    activeOpacity={0.8}
                >
                    <Ionicons
                        name="shield-outline"
                        size={14}
                        color={activeTab === 'pods' ? (isDark ? '#000' : '#FFF') : theme.textSecondary}
                        style={{ marginRight: 6 }}
                    />
                    <Text style={[
                        styles.tabSwitcherBtnText,
                        { color: activeTab === 'pods' ? (isDark ? '#000' : '#FFF') : theme.textSecondary }
                    ]}>
                        Anonymous Pods ({THEMATIC_PODS.length})
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.tabSwitcherBtn,
                        activeTab === 'buddies'
                            ? { backgroundColor: theme.primary, borderColor: theme.primary }
                            : { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)', borderColor: theme.border }
                    ]}
                    onPress={() => setActiveTab('buddies')}
                    activeOpacity={0.8}
                >
                    <Ionicons
                        name="people-outline"
                        size={14}
                        color={activeTab === 'buddies' ? (isDark ? '#000' : '#FFF') : theme.textSecondary}
                        style={{ marginRight: 6 }}
                    />
                    <Text style={[
                        styles.tabSwitcherBtnText,
                        { color: activeTab === 'buddies' ? (isDark ? '#000' : '#FFF') : theme.textSecondary }
                    ]}>
                        My Buddies ({buddies.length})
                    </Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[styles.content, { paddingBottom: 24 }]}
            >
                {/* ================================================= */}
                {/* 1. THEMATIC PODS VIEW */}
                {/* ================================================= */}
                {activeTab === 'pods' && (
                    <>
                        {/* Pod Selector Carousel */}
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.podPillScroll}
                        >
                            {THEMATIC_PODS.map((pod) => {
                                const isSelected = selectedPodId === pod.id;
                                const pColor = isDark ? pod.darkColor : pod.color;
                                return (
                                    <TouchableOpacity
                                        key={pod.id}
                                        onPress={() => setSelectedPodId(pod.id)}
                                        style={[
                                            styles.podPill,
                                            {
                                                backgroundColor: isSelected
                                                    ? (pColor + (isDark ? '25' : '15'))
                                                    : (isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(255, 255, 255, 0.85)'),
                                                borderColor: isSelected ? pColor : (isDark ? 'rgba(255, 255, 255, 0.10)' : 'rgba(0, 0, 0, 0.08)'),
                                            }
                                        ]}
                                        activeOpacity={0.8}
                                    >
                                        <Text style={{ fontSize: 14, marginRight: 5 }}>{pod.emoji}</Text>
                                        <Text style={[styles.podPillText, { color: isSelected ? pColor : theme.textSecondary }]}>
                                            {pod.title.split('&')[0].trim()}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>

                        {/* Active Pod Detailed Hero Card */}
                        <View style={[
                            styles.activePodHeroCard,
                            {
                                backgroundColor: isDark ? 'rgba(18, 12, 38, 0.90)' : 'rgba(255, 255, 255, 0.95)',
                                borderColor: isDark ? (currentPodColor + '40') : (currentPodColor + '30'),
                            }
                        ]}>
                            <View style={styles.activePodHeroTop}>
                                <View style={[styles.activePodEmojiCircle, { backgroundColor: currentPodColor + '18' }]}>
                                    <Text style={{ fontSize: 24 }}>{currentPod.emoji}</Text>
                                </View>
                                <View style={{ flex: 1, marginLeft: 12 }}>
                                    <Text style={[styles.activePodTitle, { color: isDark ? '#FFF' : '#14121E' }]}>
                                        {currentPod.title}
                                    </Text>
                                    <Text style={[styles.activePodMembers, { color: currentPodColor }]}>
                                        🟢 {currentPod.members} peers active in this room
                                    </Text>
                                </View>
                            </View>

                            <Text style={[styles.activePodDesc, { color: isDark ? '#C5C1E8' : '#5A567D' }]}>
                                {currentPod.desc}
                            </Text>

                            {/* Pinned Volunteer Guardian */}
                            <View style={[styles.volunteerBadgeBox, { backgroundColor: isDark ? 'rgba(16, 185, 129, 0.12)' : 'rgba(16, 185, 129, 0.08)', borderColor: 'rgba(16, 185, 129, 0.25)' }]}>
                                <Ionicons name="shield-checkmark" size={15} color="#10B981" style={{ marginRight: 6 }} />
                                <Text style={[styles.volunteerBadgeText, { color: isDark ? '#6EE7B7' : '#047857' }]}>
                                    Monitored by: {currentPod.pinnedVolunteer}
                                </Text>
                            </View>

                            {/* Daily Discussion Prompt */}
                            <View style={[styles.promptCard, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : '#F7F6FC', borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(120, 104, 230, 0.15)' }]}>
                                <Text style={[styles.promptLabel, { color: currentPodColor }]}>Today's Grounding Focus:</Text>
                                <Text style={[styles.promptBody, { color: theme.text }]}>{currentPod.samplePrompt}</Text>
                            </View>

                            {/* Join Anonymous Chat Action */}
                            <TouchableOpacity
                                style={[styles.enterPodBtn, { backgroundColor: currentPodColor }]}
                                onPress={() => router.push({
                                    pathname: '/moods/buddy-chat',
                                    params: { name: currentPod.title, avatar: 'https://i.pravatar.cc/150?u=' + currentPod.id }
                                } as any)}
                                activeOpacity={0.85}
                            >
                                <Ionicons name="chatbubbles" size={16} color={isDark ? "#000" : "#FFF"} style={{ marginRight: 6 }} />
                                <Text style={[styles.enterPodBtnText, { color: isDark ? '#000' : '#FFF' }]}>
                                    Enter Pod Anonymously →
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </>
                )}

                {/* ================================================= */}
                {/* 2. MY BUDDIES VIEW */}
                {/* ================================================= */}
                {activeTab === 'buddies' && (
                    <>
                        <View style={[styles.searchBox, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : '#FFFFFF', borderColor: theme.border }]}>
                            <Ionicons name="search" size={18} color={theme.placeholder} />
                            <TextInput
                                style={[styles.searchInput, { color: theme.text }]}
                                placeholder="Search buddies in Nivora..."
                                placeholderTextColor={theme.placeholder}
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                            />
                        </View>

                        <Text style={[styles.buddiesSectionTitle, { color: theme.textSecondary }]}>
                            My Circle ({buddies.length})
                        </Text>

                        {buddies.map(buddy => (
                            <TouchableOpacity
                                key={buddy.id}
                                style={[styles.buddyCard, { backgroundColor: isDark ? 'rgba(18, 12, 38, 0.85)' : '#FFFFFF', borderColor: theme.border }]}
                                onPress={() => navigateToChat(buddy)}
                                activeOpacity={0.8}
                            >
                                <View style={styles.avatarWrapper}>
                                    <Image source={{ uri: buddy.avatar }} style={[styles.avatar, { borderColor: theme.surface }]} />
                                    {buddy.isOnline && <View style={styles.onlineDot} />}
                                </View>
                                <View style={styles.buddyInfo}>
                                    <Text style={[styles.buddyName, { color: theme.text }]}>{buddy.name}</Text>
                                    <Text style={[styles.buddyUsername, { color: theme.textSecondary }]}>{buddy.username}</Text>
                                    <Text style={[styles.buddyPodTag, { color: theme.primary }]}>🔗 {buddy.pod}</Text>
                                </View>
                                <View style={styles.buddyActions}>
                                    <Ionicons name="chatbubble-ellipses" size={22} color={theme.primary} />
                                </View>
                            </TouchableOpacity>
                        ))}
                    </>
                )}
            </ScrollView>
            <View style={{ height: insets.bottom, backgroundColor: theme.background, width: '100%', zIndex: 10 }} />
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
        paddingBottom: 10,
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
    headerTitle: {
        fontSize: 17,
        fontWeight: 'bold',
    },
    headerSubtitle: {
        fontSize: 11,
        fontWeight: '700',
        marginTop: 1,
    },
    volunteerQuickBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
    },
    tabSwitcherRow: {
        flexDirection: 'row',
        paddingHorizontal: 18,
        gap: 10,
        marginBottom: 12,
    },
    tabSwitcherBtn: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 9,
        borderRadius: 14,
        borderWidth: 1,
    },
    tabSwitcherBtnText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    content: {
        paddingHorizontal: 18,
        paddingTop: 6,
    },
    podPillScroll: {
        gap: 8,
        paddingBottom: 12,
    },
    podPill: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 7,
        borderRadius: 14,
        borderWidth: 1,
    },
    podPillText: {
        fontSize: 12,
        fontWeight: '700',
    },
    activePodHeroCard: {
        borderRadius: 24,
        padding: 18,
        borderWidth: 1.5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
    },
    activePodHeroTop: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    activePodEmojiCircle: {
        width: 46,
        height: 46,
        borderRadius: 23,
        justifyContent: 'center',
        alignItems: 'center',
    },
    activePodTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    activePodMembers: {
        fontSize: 11,
        fontWeight: '700',
        marginTop: 2,
    },
    activePodDesc: {
        fontSize: 13,
        lineHeight: 19,
        marginBottom: 14,
    },
    volunteerBadgeBox: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 7,
        borderRadius: 12,
        borderWidth: 1,
        marginBottom: 12,
    },
    volunteerBadgeText: {
        fontSize: 11,
        fontWeight: '700',
    },
    promptCard: {
        borderRadius: 14,
        padding: 12,
        borderWidth: 1,
        marginBottom: 16,
    },
    promptLabel: {
        fontSize: 11,
        fontWeight: '800',
        marginBottom: 3,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    promptBody: {
        fontSize: 12,
        lineHeight: 18,
        fontStyle: 'italic',
    },
    enterPodBtn: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 13,
        borderRadius: 16,
    },
    enterPodBtnText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    // Buddies
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 16,
        borderWidth: 1,
        marginBottom: 16,
        gap: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 13,
    },
    buddiesSectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 10,
    },
    buddyCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        borderRadius: 18,
        borderWidth: 1,
        marginBottom: 10,
    },
    avatarWrapper: {
        position: 'relative',
        marginRight: 12,
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        borderWidth: 2,
    },
    onlineDot: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#10B981',
        borderWidth: 2,
        borderColor: '#FFF',
    },
    buddyInfo: {
        flex: 1,
    },
    buddyName: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    buddyUsername: {
        fontSize: 12,
        marginTop: 1,
    },
    buddyPodTag: {
        fontSize: 10,
        fontWeight: '600',
        marginTop: 3,
    },
    buddyActions: {
        padding: 6,
    },
});
