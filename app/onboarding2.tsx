import { Text, View } from '@/components/Themed';
import { useAuth } from '@/constants/AuthContext';
import Colors from '@/constants/Colors';
import { useLanguage } from '@/constants/LanguageContext';
import { useTheme } from '@/constants/ThemeContext';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    Image,
    ImageBackground,
    PanResponder,
    StyleSheet
} from 'react-native';

const { width, height } = Dimensions.get('window');

// Constants for the slider
const SLIDER_WIDTH = width * 0.9;
const HEART_SIZE = 160; // Enlarged for 3D impact
const TRACK_HEIGHT = 80; // "Bridge" height
const INITIAL_X = 0; // Starts on Left
const TARGET_X = SLIDER_WIDTH - HEART_SIZE; // Ends on Right

export default function OnboardingScreen2() {
    const router = useRouter();
    const { enterAsGuest, completeOnboarding, isLoggedIn } = useAuth();
    const { theme: themeName, isDark } = useTheme();
    const theme = Colors[themeName];
    const { t } = useLanguage();

    const panX = useRef(new Animated.Value(INITIAL_X)).current;
    const bumpAnim = useRef(new Animated.Value(1)).current;
    const healScaleAnim = useRef(new Animated.Value(1)).current;
    const centerAnim = useRef(new Animated.Value(0)).current; // For moving joined heart to center
    const blastAnim = useRef(new Animated.Value(0)).current; // For party pop effect
    const [dragging, setDragging] = useState(false);
    const [healed, setHealed] = useState(false);

    useEffect(() => {
        const animation = Animated.loop(
            Animated.sequence([
                Animated.timing(bumpAnim, {
                    toValue: 1.15,
                    duration: 600,
                    useNativeDriver: false,
                }),
                Animated.timing(bumpAnim, {
                    toValue: 1.0,
                    duration: 600,
                    useNativeDriver: false,
                }),
            ])
        );
        if (!dragging && !healed) animation.start();
        else animation.stop();
        return () => animation.stop();
    }, [dragging, healed]);

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderGrant: () => setDragging(true),
            onPanResponderMove: (evt, gestureState) => {
                let newX = INITIAL_X + gestureState.dx;
                if (newX < INITIAL_X) newX = INITIAL_X;
                if (newX > TARGET_X) newX = TARGET_X;
                panX.setValue(newX);
            },
            onPanResponderRelease: (evt, gestureState) => {
                setDragging(false);
                if (gestureState.dx > (SLIDER_WIDTH * 0.4)) {
                    Animated.spring(panX, {
                        toValue: TARGET_X,
                        useNativeDriver: false,
                        friction: 4,
                    }).start(() => {
                        setHealed(true);
                        // Sequence: Move to center + scale up, then blast, then leave
                        Animated.sequence([
                            Animated.parallel([
                                Animated.spring(healScaleAnim, {
                                    toValue: 1.5,
                                    friction: 3,
                                    tension: 40,
                                    useNativeDriver: false,
                                }),
                                Animated.timing(centerAnim, {
                                    toValue: -(SLIDER_WIDTH - HEART_SIZE) / 2, // Move from right to center
                                    duration: 800,
                                    useNativeDriver: false,
                                })
                            ]),
                            // Blast / Party Pop effect
                            Animated.timing(blastAnim, {
                                toValue: 1,
                                duration: 500,
                                useNativeDriver: false,
                            }),
                            Animated.delay(500),
                        ]).start(async () => {
                            await completeOnboarding();
                            if (isLoggedIn) {
                                router.replace('/auth/pin-unlock');
                            } else {
                                enterAsGuest();
                                router.replace('/(tabs)');
                            }
                        });
                    });
                } else {
                    Animated.spring(panX, {
                        toValue: INITIAL_X,
                        useNativeDriver: false,
                    }).start();
                }
            },
        })
    ).current;

    const bridgeWidth = panX.interpolate({
        inputRange: [INITIAL_X, TARGET_X],
        outputRange: [TARGET_X, 0],
        extrapolate: 'clamp',
    });
    const bridgeLeft = panX.interpolate({
        inputRange: [INITIAL_X, TARGET_X],
        outputRange: [HEART_SIZE / 2, TARGET_X + HEART_SIZE / 2],
        extrapolate: 'clamp',
    });

    return (
        <View style={styles.container}>
            <ImageBackground
                source={require('../assets/images/onboarding-bg2.jpg')}
                style={styles.backgroundImage}
                resizeMode="cover"
            >
                <View style={[styles.overlay, { backgroundColor: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)' }]}>
                    <View style={[styles.contentBox, { backgroundColor: isDark ? 'rgba(0,0,0,0.9)' : 'rgba(0,0,0,0.85)' }]}>
                        <Text style={styles.title}>{t('safeHere')}</Text>
                        <Text style={styles.title}>{t('valuedHere')}</Text>
                        <View style={styles.subContent}>
                            <Text style={styles.description}>{t('navigateLifeTogether')}</Text>
                            <Text style={styles.description}>{t('oneStep')}</Text>
                            <Text style={styles.description}>{t('oneThought')}</Text>
                            <Text style={styles.description}>{t('oneBreath')}</Text>
                        </View>
                    </View>

                    <View style={styles.sliderContainer}>
                        {!healed && (
                            <Animated.View
                                style={[
                                    styles.sliderTrack,
                                    {
                                        width: bridgeWidth,
                                        left: bridgeLeft,
                                        opacity: panX.interpolate({
                                            inputRange: [TARGET_X - 50, TARGET_X],
                                            outputRange: [1, 0],
                                            extrapolate: 'clamp'
                                        })
                                    }
                                ]}
                            >
                                <Text style={styles.dragText} numberOfLines={1}>{t('dragToHeal')}</Text>
                            </Animated.View>
                        )}

                        <Animated.View style={{
                            transform: [
                                { scale: healScaleAnim },
                                { translateX: centerAnim }
                            ],
                            width: SLIDER_WIDTH,
                            height: HEART_SIZE,
                            backgroundColor: 'transparent',
                            justifyContent: 'center'
                        }}>
                            {/* BLAST EFFECT RING */}
                            <Animated.View
                                style={[
                                    styles.blastRing,
                                    {
                                        transform: [{
                                            scale: blastAnim.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: [0.5, 3]
                                            })
                                        }],
                                        opacity: blastAnim.interpolate({
                                            inputRange: [0, 0.2, 1],
                                            outputRange: [0, 1, 0]
                                        }),
                                        left: TARGET_X + HEART_SIZE / 2 - 50, // Centered on the joined heart
                                    }
                                ]}
                            />

                            {/* FIXED PIECE (Right Half) on the Right */}
                            <View style={[styles.heartContainer, { left: TARGET_X }]}>
                                <View style={styles.heartMaskRight}>
                                    <Image
                                        source={require('../assets/images/broken-heart.png')}
                                        style={styles.heartImageFixedRight}
                                    />
                                </View>
                            </View>

                            {/* DRAGGABLE PIECE (Left Half) starts on the Left */}
                            <Animated.View
                                style={[
                                    styles.heartContainer,
                                    {
                                        transform: [
                                            { translateX: panX },
                                            { scale: !dragging && !healed ? bumpAnim : 1 }
                                        ],
                                        zIndex: 10,
                                        position: 'absolute',
                                        left: 0,
                                    }
                                ]}
                                {...(healed ? {} : panResponder.panHandlers)}
                            >
                                <View style={styles.heartMaskLeft}>
                                    <Image
                                        source={require('../assets/images/broken-heart.png')}
                                        style={styles.heartImageDraggableLeft}
                                    />
                                </View>
                            </Animated.View>
                        </Animated.View>
                    </View>
                </View>
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backgroundImage: {
        flex: 1,
        width: width,
        height: height,
    },
    overlay: {
        flex: 1,
        justifyContent: 'space-between',
        paddingVertical: 100,
        alignItems: 'center',
    },
    contentBox: {
        width: width * 0.9,
        padding: 30,
        borderRadius: 50,
        borderTopLeftRadius: 100,
        borderBottomRightRadius: 100,
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
    },
    subContent: {
        marginTop: 20,
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    description: {
        fontSize: 18,
        color: '#FFFFFF',
        textAlign: 'center',
        lineHeight: 28,
        fontWeight: '500',
    },
    sliderContainer: {
        width: SLIDER_WIDTH,
        height: HEART_SIZE,
        justifyContent: 'center',
        backgroundColor: 'transparent',
        marginBottom: 50,
    },
    sliderTrack: {
        height: TRACK_HEIGHT,
        backgroundColor: 'rgba(134, 146, 247, 0.4)',
        position: 'absolute',
        top: (HEART_SIZE - TRACK_HEIGHT) / 2,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        zIndex: 1,
    },
    dragText: {
        color: '#FFFFFF',
        fontSize: 22,
        fontWeight: '900',
        letterSpacing: 2,
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowRadius: 10,
        width: SLIDER_WIDTH - HEART_SIZE,
        textAlign: 'center',
    },
    heartContainer: {
        position: 'absolute',
        width: HEART_SIZE,
        height: HEART_SIZE,
        backgroundColor: 'transparent',
        zIndex: 10,
    },
    blastRing: {
        position: 'absolute',
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: '#FFD700', // Gold/Party color
        backgroundColor: 'rgba(255, 215, 0, 0.3)',
        zIndex: 5,
    },
    heartMaskLeft: {
        width: HEART_SIZE / 2,
        height: HEART_SIZE,
        overflow: 'hidden',
        backgroundColor: 'transparent',
    },
    heartMaskRight: {
        width: HEART_SIZE / 2,
        height: HEART_SIZE,
        overflow: 'hidden',
        marginLeft: HEART_SIZE / 2,
        backgroundColor: 'transparent',
    },
    heartImageDraggableLeft: {
        width: HEART_SIZE,
        height: HEART_SIZE,
        resizeMode: 'contain',
    },
    heartImageFixedRight: {
        width: HEART_SIZE,
        height: HEART_SIZE,
        resizeMode: 'contain',
        marginLeft: -HEART_SIZE / 2,
    },
});
