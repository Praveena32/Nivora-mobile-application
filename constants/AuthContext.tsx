import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

type AuthState = {
    isLoggedIn: boolean;
    isGuest: boolean;
    isUnlocked: boolean;
    username: string | null;
    email: string | null;
    password: string | null;
    pin: string | null;
    securityImage: string | null;
    securityQuiz: { question: string; answer: string } | null;
    hasChangedUsername: boolean;
    hasChangedPassword: boolean;
    hasCompletedOnboarding: boolean;
    nivoraId: string | null;
};

interface AuthContextType extends AuthState {
    signIn: (userData: Partial<AuthState>) => Promise<void>;
    signUp: (userData: AuthState) => Promise<void>;
    signOut: () => Promise<void>;
    enterAsGuest: () => void;
    unlockApp: (enteredPin: string) => boolean;
    updateProfile: (updates: Partial<AuthState>) => Promise<void>;
    lockApp: () => void;
    completeOnboarding: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = '@nivora_auth_state';

const initialState: AuthState = {
    isLoggedIn: false,
    isGuest: false,
    isUnlocked: false,
    username: null,
    email: null,
    password: null,
    pin: null,
    securityImage: null,
    securityQuiz: null,
    hasChangedUsername: false,
    hasChangedPassword: false,
    hasCompletedOnboarding: false,
    nivoraId: null,
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [state, setState] = useState<AuthState>(initialState);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadAuthState();
    }, []);

    const loadAuthState = async () => {
        try {
            const savedState = await AsyncStorage.getItem(STORAGE_KEY);
            if (savedState) {
                const parsed = JSON.parse(savedState);
                // On app start, if they were logged in, they are LOCKED until PIN entry
                setState({ ...parsed, isUnlocked: false });
            }
        } catch (e) {
            console.error('Failed to load auth state', e);
        } finally {
            setIsLoading(false);
        }
    };

    const saveAuthState = async (newState: AuthState) => {
        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
        } catch (e) {
            console.error('Failed to save auth state', e);
        }
    };

    const signIn = async (userData: Partial<AuthState>) => {
        const newState = { ...state, ...userData, isLoggedIn: true, isGuest: false, isUnlocked: true };
        setState(newState);
        await saveAuthState(newState);
    };

    const signUp = async (userData: AuthState) => {
        const id = `NV-${Math.floor(1000 + Math.random() * 9000)}-${Math.random().toString(36).substring(7).toUpperCase()}`;
        const newState = {
            ...userData,
            isLoggedIn: true,
            isGuest: false,
            isUnlocked: true,
            hasCompletedOnboarding: true,
            nivoraId: id
        };
        setState(newState);
        await saveAuthState(newState);
    };

    const signOut = async () => {
        setState(initialState);
        await AsyncStorage.removeItem(STORAGE_KEY);
    };

    const enterAsGuest = () => {
        setState({ ...initialState, isGuest: true, isUnlocked: true });
    };

    const unlockApp = (enteredPin: string) => {
        if (enteredPin === state.pin) {
            setState((prev) => ({ ...prev, isUnlocked: true }));
            return true;
        }
        return false;
    };

    const updateProfile = async (updates: Partial<AuthState>) => {
        const newState = { ...state, ...updates };
        setState(newState);
        await saveAuthState(newState);
    };

    const lockApp = () => {
        if (state.isLoggedIn) {
            setState((prev) => ({ ...prev, isUnlocked: false }));
        }
    };

    const completeOnboarding = async () => {
        const newState = { ...state, hasCompletedOnboarding: true };
        setState(newState);
        await saveAuthState(newState);
    };

    if (isLoading) return null;

    return (
        <AuthContext.Provider value={{ ...state, signIn, signUp, signOut, enterAsGuest, unlockApp, updateProfile, lockApp, completeOnboarding }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
