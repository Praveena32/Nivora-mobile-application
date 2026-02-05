import { useAuth } from '@/constants/AuthContext';
import Colors from '@/constants/Colors';
import { useLanguage } from '@/constants/LanguageContext';
import { useTheme } from '@/constants/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    FlatList,
    Linking,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TranslationKeys } from '@/constants/Translations';

const EMERGENCY_CONTACTS: { id: string; nameKey: TranslationKeys; number: string; categoryKey: TranslationKeys; icon: string; color: string }[] = [
    { id: '1', nameKey: 'policeEmergency', number: '119', categoryKey: 'securityCategory', icon: 'shield-sharp', color: '#F44336' },
    { id: '2', nameKey: 'ambulanceFire', number: '110', categoryKey: 'medicalCategory', icon: 'medical-sharp', color: '#4CAF50' },
    { id: '3', nameKey: 'suicidePrevention', number: '1333', categoryKey: 'helplineCategory', icon: 'heart-sharp', color: '#B0A4F1' },
    { id: '4', nameKey: 'domesticViolence', number: '1938', categoryKey: 'helplineCategory', icon: 'hand-left-sharp', color: '#FF9800' },
    { id: '5', nameKey: 'childHelp', number: '1929', categoryKey: 'helplineCategory', icon: 'happy-sharp', color: '#2196F3' },
    { id: '6', nameKey: 'nationalMentalHealth', number: '1926', categoryKey: 'medicalCategory', icon: 'fitness-sharp', color: '#9C27B0' },
    { id: '7', nameKey: 'suwaSariya', number: '1990', categoryKey: 'medicalCategory', icon: 'medical-sharp', color: '#E91E63' },
    { id: '8', nameKey: 'raggingComplaint', number: '1997', categoryKey: 'helplineCategory', icon: 'hand-left-sharp', color: '#FF5722' },
    { id: '9', nameKey: 'cyberCrimeUnit', number: '101', categoryKey: 'securityCategory', icon: 'laptop-sharp', color: '#3F51B5' },
];

export default function EmergencyScreen() {
    const router = useRouter();
    const { isUnlocked, isLoggedIn } = useAuth();
    const { t } = useLanguage();
    const insets = useSafeAreaInsets();
    const { theme: themeName, isDark } = useTheme();
    const theme = Colors[themeName];

    const [searchQuery, setSearchQuery] = useState('');

    const filteredContacts = EMERGENCY_CONTACTS.filter(contact => {
        const translatedName = t(contact.nameKey).toLowerCase();
        const translatedCategory = t(contact.categoryKey).toLowerCase();
        return translatedName.includes(searchQuery.toLowerCase()) ||
            translatedCategory.includes(searchQuery.toLowerCase());
    });

    const handleCall = (number: string) => {
        Linking.openURL(`tel:${number}`);
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={{ height: insets.top, backgroundColor: theme.background, width: '100%', position: 'absolute', top: 0, zIndex: 10 }} />
            <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
                <View style={styles.headerTop}>
                    <View>
                        <Text style={[styles.title, { color: theme.text }]}>{t('emergencySupport')}</Text>
                        <Text style={styles.subtitle}>{t('helpTapAway')}</Text>
                    </View>
                    <TouchableOpacity
                        style={[styles.closeButton, { backgroundColor: isDark ? '#1A1A1A' : '#F0F0F0' }]}
                        onPress={() => {
                            if (!isLoggedIn) {
                                router.replace('/onboarding');
                            } else if (!isUnlocked) {
                                router.replace('/auth/pin-unlock');
                            } else {
                                router.replace('/(tabs)');
                            }
                        }}
                    >
                        <Ionicons name="home-outline" size={24} color="#B0A4F1" />
                        <Text style={styles.closeText}>{(!isLoggedIn || !isUnlocked) ? t('home') : t('done')}</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={[styles.searchContainer, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
                <TextInput
                    style={[styles.searchInput, { color: theme.text }]}
                    placeholder={t('searchPlaceholder')}
                    placeholderTextColor="#666"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            <FlatList
                data={filteredContacts}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={[styles.contactCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
                        onPress={() => handleCall(item.number)}
                        activeOpacity={0.7}
                    >
                        <View style={[styles.iconBox, { backgroundColor: item.color + (isDark ? '20' : '10') }]}>
                            <Ionicons name={item.icon as any} size={24} color={item.color} />
                        </View>
                        <View style={styles.contactInfo}>
                            <Text style={[styles.contactName, { color: theme.text }]}>{t(item.nameKey)}</Text>
                            <Text style={[styles.contactCategory, { color: theme.textSecondary }]}>{t(item.categoryKey).toUpperCase()}</Text>
                        </View>
                        <View style={styles.numberBox}>
                            <Text style={[styles.contactNumber, { color: item.color }]}>{item.number}</Text>
                            <Ionicons name="call-sharp" size={18} color={item.color} />
                        </View>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="search-outline" size={64} color={isDark ? "#222" : "#DDD"} />
                        <Text style={[styles.emptyText, { color: theme.textSecondary }]}>{t('noContacts')}</Text>
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
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    closeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
        gap: 6,
    },
    closeText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#B0A4F1',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 16,
        color: '#B0A4F1',
        opacity: 0.8,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 20,
        paddingHorizontal: 15,
        borderRadius: 12,
        height: 50,
        marginBottom: 20,
        borderWidth: 1,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    contactCard: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
    },
    iconBox: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    contactInfo: {
        flex: 1,
    },
    contactName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    contactCategory: {
        fontSize: 10,
        fontWeight: 'bold',
        marginTop: 2,
        letterSpacing: 1,
    },
    numberBox: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    contactNumber: {
        fontSize: 16,
        fontWeight: 'bold',
        marginRight: 8,
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 100,
    },
    emptyText: {
        marginTop: 10,
        fontSize: 16,
    },
});
