import Colors from '@/constants/Colors';
import { useTheme } from '@/constants/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function PersonalInfoScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { theme: themeName, isDark } = useTheme();
    const theme = Colors[themeName];

    const [displayName, setDisplayName] = useState('Soul Seeker');
    const [username, setUsername] = useState('soul_seeker_99');
    const [email, setEmail] = useState('soul@example.com');
    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = () => {
        if (isEditing) {
            if (displayName.trim() === '') setDisplayName('Soul Seeker');
            if (username.trim() === '') setUsername('soul_seeker_99');
            // email validation could be added here
        }
        setIsEditing(!isEditing);
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top, backgroundColor: theme.background }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={28} color="#B0A4F1" />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.text }]}>Personal Information</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={[styles.infoCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                    <Text style={[styles.label, { color: theme.textSecondary }]}>Display Name</Text>
                    {isEditing ? (
                        <TextInput
                            style={styles.editInput}
                            value={displayName}
                            onChangeText={setDisplayName}
                            autoFocus
                            placeholder="Enter your soul name..."
                            placeholderTextColor="#444"
                            maxLength={20}
                        />
                    ) : (
                        <Text style={[styles.value, { color: theme.text }]}>{displayName}</Text>
                    )}
                    <Text style={[styles.hint, { color: isDark ? '#444' : '#888' }]}>Visible only to Voya and you.</Text>
                </View>

                <View style={[styles.infoCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                    <Text style={[styles.label, { color: theme.textSecondary }]}>Username</Text>
                    {isEditing ? (
                        <TextInput
                            style={styles.editInput}
                            value={username}
                            onChangeText={setUsername}
                            placeholder="Enter username..."
                            placeholderTextColor="#444"
                            maxLength={20}
                        />
                    ) : (
                        <Text style={[styles.value, { color: theme.text }]}>@{username}</Text>
                    )}
                    <Text style={[styles.hint, { color: isDark ? '#444' : '#888' }]}>Your unique handle for logging in.</Text>
                </View>

                <View style={[styles.infoCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                    <Text style={[styles.label, { color: theme.textSecondary }]}>Recovery Email</Text>
                    {isEditing ? (
                        <TextInput
                            style={styles.editInput}
                            value={email}
                            onChangeText={setEmail}
                            placeholder="recovery@example.com"
                            placeholderTextColor="#444"
                            keyboardType="email-address"
                        />
                    ) : (
                        <Text style={[styles.value, { color: theme.text }]}>{email}</Text>
                    )}
                    <Text style={[styles.hint, { color: isDark ? '#444' : '#888' }]}>Used strictly for account recovery purpose.</Text>
                </View>

                <View style={[styles.infoCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                    <Text style={[styles.label, { color: theme.textSecondary }]}>Account Type</Text>
                    <Text style={[styles.value, { color: theme.text }]}>Secured Sanctuary</Text>
                    <Text style={[styles.hint, { color: isDark ? '#444' : '#888' }]}>Linked to your recovery email for safety.</Text>
                </View>

                <TouchableOpacity
                    style={[
                        styles.actionButton,
                        { backgroundColor: isDark ? '#111' : '#FFF', borderColor: theme.border },
                        isEditing && styles.saveButton
                    ]}
                    onPress={toggleEdit}
                >
                    <Text style={[styles.actionButtonText, { color: isEditing ? '#000' : (isDark ? '#FFF' : '#333') }]}>
                        {isEditing ? 'Save Account Details' : 'Edit Account Details'}
                    </Text>
                </TouchableOpacity>
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
    infoCard: {
        padding: 20,
        borderRadius: 20,
        borderWidth: 1,
        marginBottom: 20,
    },
    label: {
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 8,
    },
    value: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 8,
    },
    editInput: {
        color: '#B0A4F1',
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 8,
        padding: 0,
        borderBottomWidth: 1,
        borderBottomColor: '#B0A4F1',
    },
    hint: {
        fontSize: 12,
        lineHeight: 18,
    },
    actionButton: {
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
        marginTop: 10,
        borderWidth: 1,
    },
    saveButton: {
        backgroundColor: '#B0A4F1',
        borderColor: '#B0A4F1',
    },
    actionButtonText: {
        fontWeight: 'bold',
        fontSize: 16,
    },
});
