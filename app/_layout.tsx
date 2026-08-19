import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';


export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: 'index',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

import { AuthProvider, useAuth } from '@/constants/AuthContext';
import { LanguageProvider } from '@/constants/LanguageContext';
import { ThemeProvider as CustomThemeProvider, useTheme } from '@/constants/ThemeContext';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <CustomThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <RootLayoutNav />
        </AuthProvider>
      </LanguageProvider>
    </CustomThemeProvider>
  );
}

function RootLayoutNav() {
  const { theme } = useTheme();
  const { isLoggedIn, isUnlocked, hasCompletedOnboarding } = useAuth();
  const router = useRouter();

  const segments = useSegments();

  useEffect(() => {
    if (isLoggedIn && !isUnlocked && hasCompletedOnboarding && segments.length > 0) {
      const inAuthGroup = segments[0] === 'auth';
      const isPublicRoute =
        (segments[0] as any) === 'index' ||
        segments[0] === 'onboarding' ||
        segments[0] === 'onboarding2' ||
        (segments[0] === '(tabs)' && segments[1] === 'emergency') ||
        (inAuthGroup && ['login', 'signup', 'credential-setup', 'pin-unlock'].includes(segments[1]));

      if (!isPublicRoute) {
        router.replace('/auth/pin-unlock');
      }
    }
  }, [isLoggedIn, isUnlocked, hasCompletedOnboarding, segments]);

  return (
    <ThemeProvider value={theme === 'dark' ? DarkTheme : DefaultTheme}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding2" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="voya-chat" options={{ title: 'Chat with Voya', headerShown: false }} />
        <Stack.Screen name="new-journal" options={{ title: 'New Journal Entry', headerShown: false }} />
        <Stack.Screen name="personal-info" options={{ title: 'Personal Info', headerShown: false }} />
        <Stack.Screen name="security-privacy" options={{ title: 'Security & Privacy', headerShown: false }} />
        <Stack.Screen name="terms-conditions" options={{ title: 'Terms of Service', headerShown: false }} />
        <Stack.Screen name="privacy-policy" options={{ title: 'Privacy Policy', headerShown: false }} />
        <Stack.Screen name="auth/signup" options={{ headerShown: false }} />
        <Stack.Screen name="auth/language-selection" options={{ headerShown: false }} />
        <Stack.Screen name="auth/login" options={{ headerShown: false }} />
        <Stack.Screen name="auth/pin-unlock" options={{ headerShown: false, gestureEnabled: false }} />
        <Stack.Screen name="auth/credential-setup" options={{ headerShown: false }} />
        <Stack.Screen name="academic-info" options={{ title: 'Project Ownership', headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      </Stack>
    </ThemeProvider>
  );
}
