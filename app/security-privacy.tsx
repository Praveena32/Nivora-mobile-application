import Colors from '@/constants/Colors';
import { useTheme } from '@/constants/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SecurityPrivacyScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { theme: themeName, isDark } = useTheme();
    const theme = Colors[themeName];

    const [biometric, setBiometric] = useState(false);
    const [anonymizedData, setAnonymizedData] = useState(true);

    return (
        <View style={[styles.container, { paddingTop: insets.top, backgroundColor: theme.background }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={28} color="#B0A4F1" />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.text }]}>Security & Privacy</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>App Access</Text>
                    <View style={[styles.settingCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                        <View style={styles.settingInfo}>
                            <Text style={[styles.settingLabel, { color: theme.text }]}>FaceID / Fingerprint</Text>
                            <Text style={[styles.settingDesc, { color: theme.textSecondary }]}>Protect your sanctuary with biometric lock.</Text>
                        </View>
                        <Switch
                            value={biometric}
                            onValueChange={setBiometric}
                            trackColor={{ false: isDark ? '#222' : '#DDD', true: '#B0A4F1' }}
                            thumbColor={biometric ? '#fff' : '#888'}
                        />
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Data & Privacy</Text>
                    <View style={[styles.settingCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                        <View style={styles.settingInfo}>
                            <Text style={[styles.settingLabel, { color: theme.text }]}>Anonymized Logging</Text>
                            <Text style={[styles.settingDesc, { color: theme.textSecondary }]}>Help us improve Voya by sharing anonymous usage data.</Text>
                        </View>
                        <Switch
                            value={anonymizedData}
                            onValueChange={setAnonymizedData}
                            trackColor={{ false: isDark ? '#222' : '#DDD', true: '#B0A4F1' }}
                            thumbColor={anonymizedData ? '#fff' : '#888'}
                        />
                    </View>

                    <TouchableOpacity style={[styles.actionItem, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                        <View style={styles.actionIconBox}>
                            <Ionicons name="trash-outline" size={20} color="#F44336" />
                        </View>
                        <View style={styles.settingInfo}>
                            <Text style={[styles.settingLabel, { color: '#F44336' }]}>Clear Journal Cache</Text>
                            <Text style={[styles.settingDesc, { color: theme.textSecondary }]}>Delete local temporary files. Your entries stay safe.</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={[styles.infoBox, { marginTop: 20, backgroundColor: theme.surface, borderColor: theme.border }]}>
                    <Ionicons name="shield-checkmark" size={24} color="#4CAF50" />
                    <Text style={[styles.infoText, { color: theme.textSecondary }]}>
                        Your safety is our priority. Nivora uses end-to-end encryption for your journal and chat data.
                    </Text>
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
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    backButton: {
        marginRight: 15,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    content: {
        padding: 20,
    },
    section: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        marginBottom: 15,
    },
    settingCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderRadius: 20,
        borderWidth: 1,
    },
    settingInfo: {
        flex: 1,
        paddingRight: 20,
    },
    settingLabel: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    settingDesc: {
        fontSize: 12,
        lineHeight: 18,
    },
    actionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderRadius: 20,
        borderWidth: 1,
        marginTop: 12,
    },
    actionIconBox: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: 'rgba(244, 67, 54, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    infoBox: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderRadius: 20,
        borderWidth: 1,
        gap: 15,
    },
    infoText: {
        flex: 1,
        fontSize: 13,
        lineHeight: 20,
    },
});
