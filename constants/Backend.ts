import { Platform } from 'react-native';

export const getBackendUrl = () => {
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.location && window.location.hostname) {
        return `http://${window.location.hostname}:3000`;
    }
    return 'http://192.168.43.51:3000';
};

export const BACKEND_URL = getBackendUrl();
