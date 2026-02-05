import NightSkyBackground from '@/components/NightSkyBackground';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Dimensions,
    FlatList,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const COUNSELORS = [
    {
        id: '1',
        name: 'Dr. Elena Vance',
        specialty: 'Trauma & Anxiety',
        image: 'https://i.pravatar.cc/150?u=elena',
        bio: 'Helping you find light in the darkest corners of your mind.',
        rating: 4.9,
        availableNow: true,
    },
    {
        id: '2',
        name: 'Marcus Thorne',
        specialty: 'Depression Specialist',
        image: 'https://i.pravatar.cc/150?u=marcus',
        bio: 'Gentle support for heavy hearts.',
        rating: 4.8,
        availableNow: false,
    },
    {
        id: '3',
        name: 'Sarah Jenkins',
        specialty: 'Mindfulness & Stress',
        image: 'https://i.pravatar.cc/150?u=sarah',
        bio: 'Finding peace through presence and awareness.',
        rating: 4.7,
        availableNow: true,
    },
];

const SESSION_TYPES = [
    { id: 'chat', label: 'Chat', icon: 'chatbubbles-outline', color: '#B0A4F1' },
    { id: 'call', label: 'Voice Call', icon: 'call-outline', color: '#4CAF50' },
    { id: 'video', label: 'Video Call', icon: 'videocam-outline', color: '#2196F3' },
];

export default function BookCounselorScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [selectedCounselorId, setSelectedCounselorId] = useState(COUNSELORS[0].id);
    const [selectedType, setSelectedType] = useState('chat');
    const [selectedDate, setSelectedDate] = useState(0);

    const selectedCounselor = COUNSELORS.find(c => c.id === selectedCounselorId);

    const DATES = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() + i);
        return {
            day: date.toLocaleDateString('en-US', { weekday: 'short' }),
            num: date.getDate(),
            full: date.toDateString(),
        };
    });

    return (
        <View style={[styles.container, { backgroundColor: '#050510' }]}>
            <NightSkyBackground />

            <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={28} color="#B0A4F1" />
                </TouchableOpacity>
                <Text style={styles.title}>Professional Support</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.banner}>
                    <Ionicons name="heart-half" size={24} color="#B0A4F1" />
                    <Text style={styles.bannerText}>This is a free volunteering service for our community.</Text>
                </View>

                <Text style={styles.sectionTitle}>Select Counselor</Text>
                <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={COUNSELORS}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.counselorList}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={[
                                styles.counselorCard,
                                selectedCounselorId === item.id && styles.selectedCard
                            ]}
                            onPress={() => setSelectedCounselorId(item.id)}
                        >
                            <View style={styles.avatarWrapper}>
                                <Image source={{ uri: item.image }} style={styles.counselorAvatar} />
                                {item.availableNow && <View style={styles.onlineBadge} />}
                            </View>
                            <Text style={styles.counselorName}>{item.name}</Text>
                            <Text style={styles.counselorSpec}>{item.specialty}</Text>
                            <View style={styles.ratingRow}>
                                <Ionicons name="star" size={12} color="#FFD700" />
                                <Text style={styles.ratingText}>{item.rating}</Text>
                            </View>
                            {item.availableNow && (
                                <View style={styles.activeTag}>
                                    <Text style={styles.activeTagText}>AVAILABLE NOW</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    )}
                />

                <Text style={styles.sectionTitle}>Session Type</Text>
                <View style={styles.typeRow}>
                    {SESSION_TYPES.map(type => (
                        <TouchableOpacity
                            key={type.id}
                            style={[
                                styles.typeBox,
                                selectedType === type.id && { backgroundColor: type.color + '20', borderColor: type.color }
                            ]}
                            onPress={() => setSelectedType(type.id)}
                        >
                            <Ionicons
                                name={type.icon as any}
                                size={24}
                                color={selectedType === type.id ? type.color : 'rgba(255,255,255,0.4)'}
                            />
                            <Text style={[
                                styles.typeLabel,
                                { color: selectedType === type.id ? type.color : 'rgba(255,255,255,0.4)' }
                            ]}>
                                {type.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {selectedCounselor?.availableNow ? (
                    <View style={styles.actionContainer}>
                        <View style={styles.availableBox}>
                            <Text style={styles.availableTitle}>{selectedCounselor.name} is online</Text>
                            <Text style={styles.availableSub}>You can start a live {selectedType} session right now.</Text>
                        </View>
                        <TouchableOpacity
                            style={[styles.bookButton, { backgroundColor: '#4CAF50' }]}
                            onPress={() => router.push({
                                pathname: '/moods/counselor-chat',
                                params: {
                                    name: selectedCounselor.name,
                                    image: selectedCounselor.image,
                                    type: selectedType
                                }
                            } as any)}
                        >
                            <Text style={[styles.bookButtonText, { color: '#FFF' }]}>Start Session Now</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View>
                        <Text style={styles.sectionTitle}>Select Date</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dateRow}>
                            {DATES.map((d, i) => (
                                <TouchableOpacity
                                    key={i}
                                    style={[styles.dateBox, selectedDate === i && styles.selectedDateBox]}
                                    onPress={() => setSelectedDate(i)}
                                >
                                    <Text style={[styles.dateDay, selectedDate === i && styles.selectedDateText]}>{d.day}</Text>
                                    <Text style={[styles.dateNum, selectedDate === i && styles.selectedDateText]}>{d.num}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                        <View style={styles.actionContainer}>
                            <TouchableOpacity
                                style={styles.bookButton}
                                onPress={() => alert('Session scheduled! You will be notified.')}
                            >
                                <Text style={styles.bookButtonText}>Schedule Session</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
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
        fontSize: 22,
        fontWeight: 'bold',
        color: '#FFF',
    },
    content: {
        paddingBottom: 40,
    },
    banner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(176, 164, 241, 0.1)',
        marginHorizontal: 20,
        padding: 15,
        borderRadius: 16,
        gap: 12,
        marginBottom: 10,
    },
    bannerText: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 13,
        flex: 1,
    },
    sectionTitle: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 14,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginTop: 30,
        marginBottom: 16,
        paddingHorizontal: 20,
    },
    counselorList: {
        paddingHorizontal: 20,
        gap: 16,
    },
    counselorCard: {
        width: 160,
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 24,
        padding: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    selectedCard: {
        borderColor: '#B0A4F1',
        backgroundColor: 'rgba(176, 164, 241, 0.05)',
    },
    avatarWrapper: {
        position: 'relative',
        marginBottom: 12,
    },
    counselorAvatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    onlineBadge: {
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
    counselorName: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    counselorSpec: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 12,
        marginBottom: 8,
        textAlign: 'center',
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    ratingText: {
        color: '#FFD700',
        fontSize: 12,
        fontWeight: 'bold',
    },
    activeTag: {
        marginTop: 10,
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 6,
    },
    activeTagText: {
        color: '#4CAF50',
        fontSize: 10,
        fontWeight: '900',
    },
    typeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        gap: 12,
    },
    typeBox: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 20,
        paddingVertical: 20,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    typeLabel: {
        fontSize: 12,
        fontWeight: 'bold',
        marginTop: 8,
    },
    dateRow: {
        paddingHorizontal: 20,
        gap: 12,
    },
    dateBox: {
        width: 60,
        height: 80,
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    selectedDateBox: {
        backgroundColor: '#B0A4F1',
        borderColor: '#B0A4F1',
    },
    dateDay: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 12,
        marginBottom: 4,
    },
    dateNum: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    selectedDateText: {
        color: '#000',
    },
    actionContainer: {
        margin: 20,
        marginTop: 40,
    },
    availableBox: {
        backgroundColor: 'rgba(76, 175, 80, 0.05)',
        padding: 20,
        borderRadius: 24,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(76, 175, 80, 0.1)',
        alignItems: 'center',
    },
    availableTitle: {
        color: '#4CAF50',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    availableSub: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 14,
        textAlign: 'center',
    },
    bookButton: {
        backgroundColor: '#B0A4F1',
        borderRadius: 20,
        paddingVertical: 20,
        alignItems: 'center',
        shadowColor: '#B0A4F1',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
    },
    bookButtonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
