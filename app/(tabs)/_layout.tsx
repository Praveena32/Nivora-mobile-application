import Colors from '@/constants/Colors';
import { useLanguage } from '@/constants/LanguageContext';
import { useTheme } from '@/constants/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof Ionicons>['name'];
  color: string;
}) {
  return <Ionicons size={24} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const { theme: themeName, isDark } = useTheme();
  const theme = Colors[themeName];
  const activeColor = '#B0A4F1'; // Lavender accent
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: isDark ? '#666' : '#999',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.background,
          borderTopColor: theme.border,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
          elevation: 0,
          shadowOpacity: 0,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: t('home'),
          tabBarIcon: ({ color }) => <TabBarIcon name="home-sharp" color={color} />,
        }}
      />
      <Tabs.Screen
        name="emergency"
        options={{
          title: t('emergency'),
          tabBarIcon: ({ color }) => <TabBarIcon name="alert-circle-sharp" color={color} />,
        }}
      />
      <Tabs.Screen
        name="alerts"
        options={{
          title: t('alerts'),
          tabBarIcon: ({ color }) => <TabBarIcon name="notifications-sharp" color={color} />,
        }}
      />
      <Tabs.Screen
        name="diary"
        options={{
          title: t('safeSpace'),
          tabBarIcon: ({ color }) => <TabBarIcon name="book-sharp" color={color} />,
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: t('community'),
          tabBarIcon: ({ color }) => <TabBarIcon name="people-sharp" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t('settings'),
          tabBarIcon: ({ color }) => <TabBarIcon name="settings-sharp" color={color} />,
        }}
      />
    </Tabs>
  );
}
