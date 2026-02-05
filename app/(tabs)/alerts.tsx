import SanctuaryLock from '@/components/SanctuaryLock';
import { useAuth } from '@/constants/AuthContext';
import Colors from '@/constants/Colors';
import { useLanguage } from '@/constants/LanguageContext';
import { useTheme } from '@/constants/ThemeContext';
import { TranslationKeys } from '@/constants/Translations';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type AlertCategory = 'ALL' | 'SAFETY' | 'WELLNESS' | 'COMMUNITY';

type AlertItem = {
    id: string;
    titleKey: TranslationKeys;
    descriptionKey: TranslationKeys;
    timestamp: string;
    category: Exclude<AlertCategory, 'ALL'>;
    isRead: boolean;
};

const MOCK_ALERTS: AlertItem[] = [
    {
        id: '1',
        titleKey: 'safeSpaceReminder',
        descriptionKey: 'safeSpaceReminderDesc',
        timestamp: '2h ago',
        category: 'WELLNESS',
        isRead: false,
    },
    {
        id: '2',
        titleKey: 'newCommunitySupport',
        descriptionKey: 'newCommunitySupportDesc',
        timestamp: '4h ago',
        category: 'COMMUNITY',
        isRead: true,
    },
    {
        id: '3',
        titleKey: 'safetyCheckIn',
        descriptionKey: 'safetyCheckInDesc',
        timestamp: '1d ago',
        category: 'SAFETY',
        isRead: false,
    },
    {
        id: '4',
        titleKey: 'systemUpdate',
        descriptionKey: 'systemUpdateDesc',
        timestamp: '2d ago',
        category: 'COMMUNITY',
        isRead: true,
    },
    {
        id: '5',
        titleKey: 'eveningCalm',
        descriptionKey: 'eveningCalmDesc',
        timestamp: '2d ago',
        category: 'WELLNESS',
        isRead: true,
    },
];

const CATEGORIES: AlertCategory[] = ['ALL', 'SAFETY', 'WELLNESS', 'COMMUNITY'];

export default function AlertsScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { theme: themeName, isDark } = useTheme();
    const { isGuest } = useAuth();
    const { t } = useLanguage();
    const theme = Colors[themeName];

    if (isGuest) {
        return (
            <SanctuaryLock
                featureName={t('alerts')}
                description={t('alertsLockDesc')}
                icon="notifications-outline"
            />
        );
    }

    const [alerts, setAlerts] = useState<AlertItem[]>(MOCK_ALERTS);
    const [activeCategory, setActiveCategory] = useState<AlertCategory>('ALL');

    const filteredAlerts = alerts.filter(alert =>
        activeCategory === 'ALL' ? true : alert.category === activeCategory
    );

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'SAFETY': return '#F44336';
            case 'WELLNESS': return '#B0A4F1';
            case 'COMMUNITY': return '#2196F3';
            default: return '#666';
        }
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'SAFETY': return 'shield-sharp';
            case 'WELLNESS': return 'leaf-sharp';
            case 'COMMUNITY': return 'people-sharp';
            default: return 'notifications-sharp';
        }
    };

    const clearAll = () => {
        setAlerts([]);
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={{ height: insets.top, backgroundColor: theme.background, width: '100%', position: 'absolute', top: 0, zIndex: 10 }} />
            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
                <View>
                    <Text style={[styles.title, { color: theme.text }]}>{t('alerts')}</Text>
                    <Text style={[styles.subtitle, { color: theme.textSecondary }]}>{t('alertsStayUpdated')}</Text>
                </View>
                <TouchableOpacity onPress={clearAll}>
                    <Text style={styles.clearAllText}>{t('clearAll')}</Text>
                </TouchableOpacity>
            </View>

            {/* Filter Chips */}
            <View style={styles.filterContainer}>
                <FlatList
                    data={CATEGORIES}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => item}
                    contentContainerStyle={styles.filterList}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={[
                                styles.filterChip,
                                { backgroundColor: isDark ? '#111' : '#EEE', borderColor: isDark ? '#222' : '#DDD' },
                                activeCategory === item && styles.activeFilterChip
                            ]}
                            onPress={() => setActiveCategory(item)}
                        >
                            <Text style={[
                                styles.filterText,
                                { color: isDark ? '#888' : '#666' },
                                activeCategory === item && styles.activeFilterText
                            ]}>{t(item === 'ALL' ? 'all' : (item.toLowerCase() + 'Category') as TranslationKeys)}</Text>
                        </TouchableOpacity>
                    )}
                />
            </View>

            {/* Alerts List */}
            <FlatList
                data={filteredAlerts}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.alertsList}
                renderItem={({ item }) => (
                    <View style={[
                        styles.alertCard,
                        { backgroundColor: isDark ? '#111' : '#FFF', borderColor: isDark ? '#222' : '#EEE' },
                        !item.isRead && styles.unreadCard
                    ]}>
                        <View style={[styles.iconBox, { backgroundColor: getCategoryColor(item.category) + (isDark ? '20' : '10') }]}>
                            <Ionicons name={getCategoryIcon(item.category) as any} size={22} color={getCategoryColor(item.category)} />
                        </View>
                        <View style={styles.alertContent}>
                            <View style={styles.alertHeader}>
                                <Text style={[styles.alertTitle, { color: theme.text }]}>{t(item.titleKey)}</Text>
                                <Text style={[styles.alertTime, { color: theme.textSecondary }]}>{item.timestamp}</Text>
                            </View>
                            <Text style={[styles.alertDescription, { color: isDark ? '#888' : '#666' }]}>{t(item.descriptionKey)}</Text>
                        </View>
                        {!item.isRead && <View style={styles.unreadDot} />}
                    </View>
                )}
                initialNumToRender={10}
                maxToRenderPerBatch={10}
                windowSize={5}
                removeClippedSubviews={true}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="notifications-off-outline" size={64} color={isDark ? "#222" : "#DDD"} />
                        <Text style={[styles.emptyText, { color: theme.text }]}>{t('allCaughtUp')}</Text>
                        <Text style={styles.emptySub}>{t('noNewNotifications')}</Text>
                    </View>
                }
            />
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 25,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 14,
        marginTop: 4,
    },
    clearAllText: {
        color: '#B0A4F1',
        fontSize: 14,
        fontWeight: '600',
    },
    filterContainer: {
        marginBottom: 20,
    },
    filterList: {
        paddingHorizontal: 20,
    },
    filterChip: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 10,
        borderWidth: 1,
    },
    activeFilterChip: {
        backgroundColor: '#B0A4F1',
        borderColor: '#B0A4F1',
    },
    filterText: {
        fontSize: 12,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    activeFilterText: {
        color: '#000',
    },
    alertsList: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    alertCard: {
        flexDirection: 'row',
        borderRadius: 20,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        alignItems: 'center',
    },
    unreadCard: {
        borderColor: 'rgba(176, 164, 241, 0.3)',
        backgroundColor: 'rgba(176, 164, 241, 0.05)',
    },
    iconBox: {
        width: 48,
        height: 48,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    alertContent: {
        flex: 1,
    },
    alertHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    alertTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    alertTime: {
        fontSize: 12,
    },
    alertDescription: {
        fontSize: 13,
        lineHeight: 18,
    },
    unreadDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#B0A4F1',
        marginLeft: 10,
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 100,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
    },
    emptySub: {
        color: '#666',
        fontSize: 14,
        marginTop: 8,
    },
});
