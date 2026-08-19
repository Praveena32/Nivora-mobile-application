import { useAuth } from '@/constants/AuthContext';
import Colors from '@/constants/Colors';
import { useLanguage } from '@/constants/LanguageContext';
import { useTheme } from '@/constants/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  FlatList,
  ImageBackground,
  NativeScrollEvent,
  NativeSyntheticEvent,
  PanResponder,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');
const ITEM_WIDTH = width * 0.75 + 16;

const QUICK_ACTIONS = [
  {
    id: 'sos',
    labelKey: 'quickSos',
    icon: 'alert-circle',
    color: '#EF4444',
    route: '/(tabs)/emergency',
  },
  {
    id: 'journal',
    labelKey: 'quickJournal',
    icon: 'create-outline',
    color: '#F59E0B',
    route: '/new-journal',
  },
  {
    id: 'meditation',
    labelKey: 'quickMeditation',
    icon: 'flower-outline',
    color: '#10B981',
    route: '/moods/calm',
  },
  {
    id: 'circle',
    labelKey: 'quickSupportCircle',
    icon: 'people-outline',
    color: '#8B5CF6',
    route: '/moods/support-circle',
  },
  {
    id: 'counselor',
    labelKey: 'quickBookCounselor',
    icon: 'calendar-outline',
    color: '#3B82F6',
    route: '/moods/book-counselor',
  },
];

const MOODS = [
  { label: 'CALM', emoji: '🧘', color: '#4CAF50', target: 'Meditation + Soft Music' },
  { label: 'SAD', emoji: '😢', color: '#2196F3', target: 'SafeHaven + Journaling' },
  { label: 'ANGRY', emoji: '🔥', color: '#F44336', target: 'Breathing + Release Tools' },
  { label: 'FEARFUL', emoji: '🛡️', color: '#FF9800', target: 'Support + Grounding' },
  { label: 'LONELY', emoji: '🤝', color: '#9C27B0', target: 'Buddy Chat + Activities' },
];

const CAROUSEL_DATA = [
  {
    id: '1',
    title: 'Daily Mindfulness',
    text: 'Take 5 minutes to breathe today.',
    icon: 'leaf',
    color: '#4CAF50',
    image: require('../../assets/images/carousel_mindfulness.png')
  },
  {
    id: '2',
    title: 'Safe Space',
    text: 'You are in a completely secure environment.',
    icon: 'shield-half',
    color: '#2196F3',
    image: require('../../assets/images/carousel_safe_space.png')
  },
  {
    id: '3',
    title: 'Community',
    text: 'Connect with others who understand.',
    icon: 'people',
    color: '#9C27B0',
    image: require('../../assets/images/carousel_community.png')
  },
  {
    id: '4',
    title: 'Deep Breathing',
    text: 'Find center with slow, rhythmic breath.',
    icon: 'partly-sunny',
    color: '#00BCD4',
    image: require('../../assets/images/carousel_breathing.png')
  },
  {
    id: '5',
    title: 'Daily Reflection',
    text: 'Review your growth and set intentions.',
    icon: 'sparkles',
    color: '#FFD700',
    image: require('../../assets/images/carousel_reflection.png')
  },
];

const EXTENDED_CAROUSEL = [
  { ...CAROUSEL_DATA[CAROUSEL_DATA.length - 1], id: 'clone-start' },
  ...CAROUSEL_DATA,
  { ...CAROUSEL_DATA[0], id: 'clone-end' },
];

const AFFIRMATIONS = [
  {
    id: '1',
    quote: 'You do not have to control your thoughts; you just have to stop letting them control you.',
    author: 'Dan Millman',
    tag: '✨ Inner Peace',
    color: '#B0A4F1',
  },
  {
    id: '2',
    quote: 'Almost everything will work again if you unplug it for a few minutes, including you.',
    author: 'Anne Lamott',
    tag: '🌿 Self Care',
    color: '#4ADE80',
  },
  {
    id: '3',
    quote: 'Peace comes from within. Do not seek it without.',
    author: 'Buddha',
    tag: '🧘 Mindfulness',
    color: '#38BDF8',
  },
  {
    id: '4',
    quote: 'You are worthy of the quiet moments you need to heal, reflect, and grow.',
    author: 'Nivora Care',
    tag: '💖 Self Compassion',
    color: '#F472B6',
  },
  {
    id: '5',
    quote: 'Breathe. Let go. This very moment is the only one you need to navigate right now.',
    author: 'Mindful Wisdom',
    tag: '🌊 Grounding',
    color: '#2DD4BF',
  },
  {
    id: '6',
    quote: 'Small, gentle steps every day lead to profound emotional resilience.',
    author: 'Wellness Guide',
    tag: '🌱 Growth',
    color: '#FBBF24',
  },
];

const SOUNDSCAPES = [
  {
    id: 'rain',
    name: 'Gentle Rain',
    sub: 'Soft drizzle & rain sounds',
    icon: 'rainy' as const,
    color: '#38BDF8',
    url: 'https://cdn.pixabay.com/download/audio/2021/09/06/audio_823126f582.mp3?filename=rain-and-thunder-nature-sounds-7803.mp3',
  },
  {
    id: 'ocean',
    name: 'Ocean Waves',
    sub: 'Rhythmic calming surf',
    icon: 'water' as const,
    color: '#06B6D4',
    url: 'https://cdn.pixabay.com/download/audio/2022/05/16/audio_c9769854ef.mp3?filename=ocean-waves-ambient-110825.mp3',
  },
  {
    id: 'forest',
    name: 'Deep Forest',
    sub: 'Birds & gentle breeze',
    icon: 'leaf' as const,
    color: '#4ADE80',
    url: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=forest-with-small-river-birds-and-nature-field-recording-6735.mp3',
  },
  {
    id: 'zen',
    name: 'Cosmic Zen',
    sub: '432Hz alpha calm waves',
    icon: 'planet' as const,
    color: '#B0A4F1',
    url: 'https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f792cb.mp3?filename=meditation-soundscape-124707.mp3',
  },
];

const SERVICES = [
  {
    id: '1',
    title: 'SafeHaven',
    subtitle: 'Emotional Safety',
    desc: 'Immediate safety...',
    image: require('../../assets/images/safehaven-bg.png'),
    icon: 'shield-checkmark',
    color: '#E69138'
  },
  {
    id: '2',
    title: 'MindCare',
    subtitle: 'Mental Wellness',
    desc: 'Therapy & meditation',
    image: require('../../assets/images/mindcare-bg.png'),
    icon: 'notifications',
    color: '#76A5AF'
  },
  {
    id: '3',
    title: 'SpeakOut',
    subtitle: 'Incident Support',
    desc: 'Reporting & guidance',
    image: require('../../assets/images/socialsupport_bg.png'),
    icon: 'people',
    color: '#B0A4F1'
  },
  {
    id: '4',
    title: 'CyberGuard',
    subtitle: 'Digital Safety',
    desc: 'Online risk protection',
    image: require('../../assets/images/cybersecurity-bg.png'),
    icon: 'lock-closed',
    color: '#6AA84F'
  },
  {
    id: '5',
    title: 'JusticeLink',
    subtitle: 'Legal Help',
    desc: 'Formal channels',
    image: require('../../assets/images/justicelink-bg.jpg'),
    icon: 'briefcase',
    color: '#A61C00'
  },
];

const FloatingBubble = ({ size, delay, duration, color }: { size: number, delay: number, duration: number, color: string }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startAnimation = () => {
      animatedValue.setValue(0);
      Animated.loop(
        Animated.sequence([
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: duration,
            delay: delay,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(animatedValue, {
            toValue: 0,
            duration: duration,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          })
        ])
      ).start();
    };
    startAnimation();
  }, [animatedValue, delay, duration]);

  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -30 - Math.random() * 50],
  });

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 20 + Math.random() * 30],
  });

  const opacity = animatedValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.05, 0.15, 0.05],
  });

  const scale = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.2],
  });

  const left = Math.random() * width;
  const top = Math.random() * 800;

  return (
    <Animated.View
      style={[
        styles.bubble,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          top,
          left,
          opacity,
          backgroundColor: color,
          transform: [{ translateY }, { translateX }, { scale }],
        },
      ]}
    />
  );
};

const BackgroundAnimation = ({ color }: { color: string }) => (
  <View style={StyleSheet.absoluteFill}>
    <FloatingBubble size={80} delay={0} duration={4000} color={color} />
    <FloatingBubble size={120} delay={1000} duration={6000} color={color} />
    <FloatingBubble size={150} delay={500} duration={5000} color={color} />
    <FloatingBubble size={60} delay={2000} duration={7000} color={color} />
    <FloatingBubble size={100} delay={1500} duration={4500} color={color} />
    <FloatingBubble size={40} delay={3000} duration={8000} color={color} />
  </View>
);

const VoyaChatbot = () => {
  const router = useRouter();
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();
  const floatAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(0)).current;

  // Strict screen boundary constants
  const ICON_SIZE = 56;
  const EDGE_PADDING = 14;
  const minX = EDGE_PADDING;
  const maxX = width - ICON_SIZE - EDGE_PADDING;
  const minY = insets.top + 14;
  const maxY = height - (insets.bottom + 85);

  // Draggable position coordinates across entire screen
  const initialX = maxX;
  const initialY = height - (insets.bottom + 140);
  const pan = useRef(new Animated.ValueXY({ x: initialX, y: initialY })).current;
  const isDraggingRef = useRef(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isDockedOnLeft, setIsDockedOnLeft] = useState(false);
  const dragOffset = useRef({ x: initialX, y: initialY });

  useEffect(() => {
    const defaultX = width - ICON_SIZE - EDGE_PADDING;
    const defaultY = height - (insets.bottom + 140);
    pan.setValue({ x: defaultX, y: defaultY });
    dragOffset.current = { x: defaultX, y: defaultY };
  }, [insets.bottom, insets.top]);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 1500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [floatAnim, pulseAnim]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 3 || Math.abs(gestureState.dy) > 3;
      },
      onPanResponderGrant: () => {
        isDraggingRef.current = false;
        pan.setOffset({
          x: dragOffset.current.x,
          y: dragOffset.current.y,
        });
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: (_, gestureState) => {
        if (Math.abs(gestureState.dx) > 4 || Math.abs(gestureState.dy) > 4) {
          if (!isDraggingRef.current) {
            isDraggingRef.current = true;
            setIsDragging(true);
          }
        }
        // Strict boundary clamping in real-time while dragging (never goes past screen edges)
        const proposedX = dragOffset.current.x + gestureState.dx;
        const proposedY = dragOffset.current.y + gestureState.dy;

        const clampedX = Math.max(minX, Math.min(maxX, proposedX));
        const clampedY = Math.max(minY, Math.min(maxY, proposedY));

        pan.x.setValue(clampedX - dragOffset.current.x);
        pan.y.setValue(clampedY - dragOffset.current.y);
      },
      onPanResponderRelease: (_, gestureState) => {
        pan.flattenOffset();
        const wasDrag = isDraggingRef.current || Math.abs(gestureState.dx) > 4 || Math.abs(gestureState.dy) > 4;
        setIsDragging(false);
        isDraggingRef.current = false;

        if (!wasDrag) {
          router.push('/voya-chat');
          return;
        }

        // Clamp released position strictly within screen
        const releasedX = dragOffset.current.x + gestureState.dx;
        const releasedY = dragOffset.current.y + gestureState.dy;

        const clampedX = Math.max(minX, Math.min(maxX, releasedX));
        const clampedY = Math.max(minY, Math.min(maxY, releasedY));

        // Snap to nearest screen edge (left or right)
        const snapLeft = clampedX < width / 2;
        const finalX = snapLeft ? minX : maxX;
        setIsDockedOnLeft(snapLeft);

        Animated.spring(pan, {
          toValue: { x: finalX, y: clampedY },
          friction: 7,
          tension: 45,
          useNativeDriver: false,
        }).start(() => {
          dragOffset.current = { x: finalX, y: clampedY };
        });
      },
    })
  ).current;

  const translateY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -8],
  });

  const scale = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.06],
  });

  return (
    <Animated.View
      style={[
        styles.voyaContainer,
        {
          transform: [
            { translateX: pan.x },
            { translateY: pan.y },
          ],
        },
      ]}
      {...panResponder.panHandlers}
    >
      {!isDragging && (
        <View style={[
          styles.voyaBubble,
          isDockedOnLeft ? styles.voyaBubbleLeftDock : styles.voyaBubbleRightDock
        ]}>
          <Text style={styles.voyaBubbleText}>{t('hiVoya')}</Text>
          <Text style={styles.voyaBubbleSubtext}>{t('askAnything')}</Text>
          <View style={[
            styles.voyaBubbleTail,
            isDockedOnLeft ? styles.voyaBubbleTailLeft : styles.voyaBubbleTailRight
          ]} />
        </View>
      )}

      <Animated.View style={[
        styles.voyaIconWrapper,
        { transform: [{ translateY }, { scale }] }
      ]}>
        <View style={styles.voyaMainCircle}>
          <Ionicons name="sparkles" size={26} color="#000" />
          <View style={styles.voyaFaceGlow} />
        </View>
        <View style={styles.voyaOuterRing} />
        <View style={styles.voyaGlowEffect} />
      </Animated.View>
    </Animated.View>
  );
};

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme: themeName, isDark } = useTheme();
  const { t } = useLanguage();
  const theme = Colors[themeName];
  const { isGuest, username } = useAuth();

  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(1);
  const autoScrollRef = useRef<any>(null);

  const getItemLayout = (_: any, index: number) => ({
    length: ITEM_WIDTH,
    offset: ITEM_WIDTH * index,
    index,
  });

  const onScrollToIndexFailed = (info: { index: number }) => {
    setTimeout(() => {
      flatListRef.current?.scrollToIndex({ index: info.index, animated: false });
    }, 100);
  };

  useEffect(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToIndex({
        index: 1,
        animated: false,
      });
    }, 100);
  }, []);

  const startAutoScroll = () => {
    stopAutoScroll();
    autoScrollRef.current = setInterval(() => {
      if (flatListRef.current) {
        const nextIndex = currentIndex + 1;
        if (nextIndex < EXTENDED_CAROUSEL.length) {
          flatListRef.current.scrollToIndex({
            index: nextIndex,
            animated: true,
          });
          setCurrentIndex(nextIndex);
        }
      }
    }, 5000);
  };

  const stopAutoScroll = () => {
    if (autoScrollRef.current !== null) {
      clearInterval(autoScrollRef.current);
      autoScrollRef.current = null;
    }
  };

  useEffect(() => {
    startAutoScroll();
    return () => stopAutoScroll();
  }, [currentIndex]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    if (offsetX <= 0) {
      flatListRef.current?.scrollToIndex({
        index: CAROUSEL_DATA.length,
        animated: false,
      });
      setCurrentIndex(CAROUSEL_DATA.length);
    } else if (offsetX >= ITEM_WIDTH * (CAROUSEL_DATA.length + 1)) {
      flatListRef.current?.scrollToIndex({
        index: 1,
        animated: false,
      });
      setCurrentIndex(1);
    }
  };

  // Streak State
  const [streak, setStreak] = useState<number>(3);

  useEffect(() => {
    const loadStreak = async () => {
      try {
        const todayStr = new Date().toDateString();
        const savedDate = await AsyncStorage.getItem('@nivora_last_checkin_date');
        const savedStreak = await AsyncStorage.getItem('@nivora_user_streak');

        let currentStreak = savedStreak ? parseInt(savedStreak, 10) : 3;

        if (!savedDate) {
          await AsyncStorage.setItem('@nivora_last_checkin_date', todayStr);
          await AsyncStorage.setItem('@nivora_user_streak', currentStreak.toString());
        } else if (savedDate !== todayStr) {
          const lastDate = new Date(savedDate);
          const today = new Date(todayStr);
          const diffDays = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));

          if (diffDays === 1) {
            currentStreak += 1;
          } else if (diffDays > 1) {
            currentStreak = 1;
          }
          await AsyncStorage.setItem('@nivora_last_checkin_date', todayStr);
          await AsyncStorage.setItem('@nivora_user_streak', currentStreak.toString());
        }
        setStreak(currentStreak);
      } catch {
        setStreak(3);
      }
    };
    loadStreak();
  }, []);

  const getTimeGreetingData = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      return {
        greeting: t('goodMorning'),
        sub: t('morningSub'),
        icon: 'sunny' as const,
        accentColor: isDark ? '#FFA726' : '#E67E22',
        cardBgLight: 'rgba(255, 255, 255, 0.90)',
        cardBgDark: 'rgba(16, 12, 34, 0.82)',
        badgeBgLight: 'rgba(255, 167, 38, 0.14)',
        badgeBgDark: 'rgba(255, 167, 38, 0.18)',
        badgeBorder: 'rgba(255, 167, 38, 0.35)',
        glowColor: '#FFA726',
      };
    } else if (hour >= 12 && hour < 17) {
      return {
        greeting: t('goodAfternoon'),
        sub: t('afternoonSub'),
        icon: 'partly-sunny' as const,
        accentColor: isDark ? '#38BDF8' : '#0284C7',
        cardBgLight: 'rgba(255, 255, 255, 0.90)',
        cardBgDark: 'rgba(12, 18, 38, 0.82)',
        badgeBgLight: 'rgba(56, 189, 248, 0.14)',
        badgeBgDark: 'rgba(56, 189, 248, 0.18)',
        badgeBorder: 'rgba(56, 189, 248, 0.35)',
        glowColor: '#38BDF8',
      };
    } else {
      return {
        greeting: t('goodEvening'),
        sub: t('eveningSub'),
        icon: 'moon' as const,
        accentColor: isDark ? '#B0A4F1' : '#7868E6',
        cardBgLight: 'rgba(255, 255, 255, 0.90)',
        cardBgDark: 'rgba(18, 12, 38, 0.82)',
        badgeBgLight: 'rgba(120, 104, 230, 0.14)',
        badgeBgDark: 'rgba(176, 164, 241, 0.18)',
        badgeBorder: 'rgba(176, 164, 241, 0.35)',
        glowColor: '#B0A4F1',
      };
    }
  };

  const timeData = getTimeGreetingData();

  const todayFormattedDate = new Date().toLocaleDateString(
    undefined,
    { weekday: 'short', month: 'short', day: 'numeric' }
  );

  // Quick 1-Minute Breathing Widget State
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState<'idle' | 'inhale' | 'hold' | 'exhale'>('idle');
  const [breathingCount, setBreathingCount] = useState(4);
  const breathAnim = useRef(new Animated.Value(1)).current;
  const breathingIntervalRef = useRef<any>(null);

  const stopBreathingSession = () => {
    setIsBreathingActive(false);
    setBreathingPhase('idle');
    setBreathingCount(4);
    if (breathingIntervalRef.current) {
      clearInterval(breathingIntervalRef.current);
      breathingIntervalRef.current = null;
    }
    Animated.timing(breathAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const startBreathingSession = () => {
    setIsBreathingActive(true);
    let currentPhase: 'inhale' | 'hold' | 'exhale' = 'inhale';
    let count = 4;
    setBreathingPhase('inhale');
    setBreathingCount(4);

    Animated.timing(breathAnim, {
      toValue: 1.30,
      duration: 4000,
      easing: Easing.inOut(Easing.sin),
      useNativeDriver: true,
    }).start();

    if (breathingIntervalRef.current) clearInterval(breathingIntervalRef.current);

    breathingIntervalRef.current = setInterval(() => {
      count -= 1;
      if (count <= 0) {
        if (currentPhase === 'inhale') {
          currentPhase = 'hold';
          count = 4;
          setBreathingPhase('hold');
          setBreathingCount(4);
        } else if (currentPhase === 'hold') {
          currentPhase = 'exhale';
          count = 4;
          setBreathingPhase('exhale');
          setBreathingCount(4);
          Animated.timing(breathAnim, {
            toValue: 0.88,
            duration: 4000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }).start();
        } else {
          currentPhase = 'inhale';
          count = 4;
          setBreathingPhase('inhale');
          setBreathingCount(4);
          Animated.timing(breathAnim, {
            toValue: 1.30,
            duration: 4000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }).start();
        }
      } else {
        setBreathingCount(count);
      }
    }, 1000);
  };

  const toggleBreathing = () => {
    if (isBreathingActive) {
      stopBreathingSession();
    } else {
      startBreathingSession();
    }
  };

  useEffect(() => {
    return () => {
      if (breathingIntervalRef.current) {
        clearInterval(breathingIntervalRef.current);
      }
    };
  }, []);

  const getPhaseDisplay = () => {
    if (breathingPhase === 'inhale') {
      return { text: t('inhalePhase'), color: '#38BDF8', emoji: '🫁 Inhale' };
    }
    if (breathingPhase === 'hold') {
      return { text: t('holdPhase'), color: '#B0A4F1', emoji: '✨ Hold' };
    }
    if (breathingPhase === 'exhale') {
      return { text: t('exhalePhase'), color: '#4ADE80', emoji: '🍃 Exhale' };
    }
    return { text: t('tapToBreathe'), color: isDark ? '#B0A4F1' : '#6E5EC7', emoji: '🌬️' };
  };

  const phaseInfo = getPhaseDisplay();

  // Daily Affirmation State
  const [affirmationIndex, setAffirmationIndex] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);
  const quoteFadeAnim = useRef(new Animated.Value(1)).current;
  const quoteRotateAnim = useRef(new Animated.Value(0)).current;

  const currentAffirmation = AFFIRMATIONS[affirmationIndex];

  const handleNextAffirmation = () => {
    quoteRotateAnim.setValue(0);
    Animated.timing(quoteRotateAnim, {
      toValue: 1,
      duration: 450,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();

    Animated.sequence([
      Animated.timing(quoteFadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(quoteFadeAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();

    setAffirmationIndex((prev) => (prev + 1) % AFFIRMATIONS.length);
    setIsFavorited(false);
  };

  const handleToggleFavorite = async () => {
    const newStatus = !isFavorited;
    setIsFavorited(newStatus);
    try {
      if (newStatus) {
        const saved = await AsyncStorage.getItem('@nivora_favorite_quotes');
        const list = saved ? JSON.parse(saved) : [];
        if (!list.includes(currentAffirmation.quote)) {
          list.push(currentAffirmation.quote);
          await AsyncStorage.setItem('@nivora_favorite_quotes', JSON.stringify(list));
        }
      }
    } catch {
      // Ignore storage failure
    }
  };

  const handleShareQuote = async () => {
    try {
      await Share.share({
        message: `"${currentAffirmation.quote}" — ${currentAffirmation.author} (via Nivora Wellness)`,
      });
    } catch {
      // Ignore share cancellation
    }
  };

  // Ambient Soundscapes Player State
  const [activeSoundId, setActiveSoundId] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const soundInstanceRef = useRef<Audio.Sound | null>(null);
  const waveAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isPlayingAudio) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(waveAnim, {
            toValue: 1,
            duration: 800,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(waveAnim, {
            toValue: 0,
            duration: 800,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      waveAnim.setValue(0);
    }
  }, [isPlayingAudio]);

  const handleSoundscapePress = async (track: typeof SOUNDSCAPES[0]) => {
    try {
      if (activeSoundId === track.id) {
        if (isPlayingAudio && soundInstanceRef.current) {
          await soundInstanceRef.current.pauseAsync();
          setIsPlayingAudio(false);
        } else if (!isPlayingAudio && soundInstanceRef.current) {
          await soundInstanceRef.current.playAsync();
          setIsPlayingAudio(true);
        }
        return;
      }

      if (soundInstanceRef.current) {
        await soundInstanceRef.current.unloadAsync();
        soundInstanceRef.current = null;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: true,
        playsInSilentModeIOS: true,
      });

      const { sound } = await Audio.Sound.createAsync(
        { uri: track.url },
        { shouldPlay: true, isLooping: true, volume: 0.85 }
      );

      soundInstanceRef.current = sound;
      setActiveSoundId(track.id);
      setIsPlayingAudio(true);
    } catch (error) {
      console.log('Audio playback error:', error);
    }
  };

  const handleStopAllAudio = async () => {
    if (soundInstanceRef.current) {
      await soundInstanceRef.current.stopAsync();
      await soundInstanceRef.current.unloadAsync();
      soundInstanceRef.current = null;
    }
    setActiveSoundId(null);
    setIsPlayingAudio(false);
  };

  useEffect(() => {
    return () => {
      if (soundInstanceRef.current) {
        soundInstanceRef.current.unloadAsync().catch(() => {});
      }
    };
  }, []);

  const handleCarouselPress = (item: any) => {
    if (item.id === '1' || item.title === 'Daily Mindfulness') {
      router.push('/moods/calming-exercises' as any);
    } else if (item.id === '2' || item.title === 'Safe Space') {
      router.push('/moods/sad' as any);
    } else if (item.id === '3' || item.title === 'Community') {
      router.push('/(tabs)/community' as any);
    } else if (item.id === '4' || item.title === 'Deep Breathing') {
      router.push('/moods/calming-exercises' as any);
    } else if (item.id === '5' || item.title === 'Daily Reflection') {
      router.push('/(tabs)/diary' as any);
    }
  };

  const handleServicePress = (service: any) => {
    if (service.title === 'SafeHaven') {
      router.push('/moods/sad' as any);
    } else if (service.title === 'MindCare') {
      router.push('/moods/mind-care' as any);
    } else if (service.title === 'SpeakOut') {
      router.push('/moods/speak-out' as any);
    } else if (service.title === 'CyberGuard') {
      router.push('/moods/cyber-guard' as any);
    } else if (service.title === 'JusticeLink') {
      router.push('/moods/justice-link' as any);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Peaceful Ambient Wallpaper */}
      <ImageBackground
        source={isDark ? require('../../assets/images/cosmic-sky-bg.jpg') : require('../../assets/images/peaceful-home-bg.jpg')}
        style={StyleSheet.absoluteFillObject}
        resizeMode="cover"
        blurRadius={isDark ? 3 : 2}
      >
        <View style={[StyleSheet.absoluteFill, { backgroundColor: isDark ? 'rgba(7, 6, 20, 0.55)' : 'rgba(255, 255, 255, 0.15)' }]} />
      </ImageBackground>

      <View style={{ height: insets.top, backgroundColor: isDark ? 'rgba(7, 6, 20, 0.5)' : 'rgba(255, 255, 255, 0.35)', width: '100%', position: 'absolute', top: 0, zIndex: 10 }} />

      {isGuest && (
        <TouchableOpacity
          style={[styles.floatingLogin, { top: insets.top + 10, backgroundColor: theme.primary }]}
          onPress={() => router.push('/auth/login')}
          activeOpacity={0.8}
        >
          <View style={styles.loginGlow} />
          <Ionicons name="log-in-outline" size={20} color={isDark ? "#000" : "#FFF"} style={{ marginRight: 6 }} />
          <Text style={[styles.loginButtonText, { color: isDark ? '#000' : '#FFF' }]}>{t('signIn')}</Text>
        </TouchableOpacity>
      )}

      <BackgroundAnimation color={isDark ? '#B0A4F1' : '#7868E6'} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + (isGuest ? 56 : 14) }]}
      >
        {/* 1. Dynamic Time-of-Day Glass Greeting & Wellness Status */}
        <View
          style={[
            styles.dynamicGreetingCard,
            {
              backgroundColor: isDark ? timeData.cardBgDark : timeData.cardBgLight,
              borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(120, 104, 230, 0.22)',
              shadowColor: isDark ? '#000' : timeData.accentColor,
              shadowOpacity: isDark ? 0.35 : 0.14,
            }
          ]}
        >
          {/* Top Status Bar: Date pill & Streak badge */}
          <View style={styles.greetingTopMetaRow}>
            <View
              style={[
                styles.dateMetaPill,
                {
                  backgroundColor: isDark ? 'rgba(255, 255, 255, 0.07)' : 'rgba(240, 238, 255, 0.85)',
                  borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(120, 104, 230, 0.18)',
                }
              ]}
            >
              <Ionicons name="calendar-outline" size={13} color={isDark ? '#B0A4F1' : '#6E5EC7'} style={{ marginRight: 5 }} />
              <Text style={[styles.dateMetaText, { color: isDark ? '#D8D4F8' : '#4E4973' }]}>
                {todayFormattedDate}
              </Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.push('/(tabs)/diary' as any)}
              style={[
                styles.streakMetaPill,
                {
                  backgroundColor: isDark ? 'rgba(255, 152, 0, 0.15)' : 'rgba(255, 152, 0, 0.12)',
                  borderColor: isDark ? 'rgba(255, 152, 0, 0.32)' : 'rgba(255, 152, 0, 0.38)',
                }
              ]}
            >
              <Text style={styles.streakFlameIcon}>🔥</Text>
              <Text style={[styles.streakMetaText, { color: isDark ? '#FFA726' : '#E65100' }]}>
                {streak} {t('dayStreak')}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Main Time Greeting Row */}
          <View style={styles.greetingMainRow}>
            <View style={{ flex: 1, paddingRight: 12 }}>
              <Text style={[styles.greetingMainTitle, { color: isDark ? '#FFFFFF' : '#14121E' }]}>
                {timeData.greeting}
                {username ? `\n${username}` : ''}
              </Text>
              <Text style={[styles.greetingSubTitle, { color: isDark ? '#C5C1E8' : '#5A567D' }]}>
                {timeData.sub}
              </Text>
            </View>

            {/* Time of Day Icon Orb with ambient glow */}
            <View
              style={[
                styles.timeOrbCircle,
                {
                  backgroundColor: isDark ? timeData.badgeBgDark : timeData.badgeBgLight,
                  borderColor: timeData.badgeBorder,
                  shadowColor: timeData.glowColor,
                }
              ]}
            >
              <Ionicons name={timeData.icon as any} size={26} color={timeData.accentColor} />
            </View>
          </View>
        </View>

        {/* Active Music Stop / Control Floating Banner */}
        {(activeSoundId || isPlayingAudio) && (
          <View
            style={[
              styles.activeAudioBanner,
              {
                backgroundColor: isDark ? 'rgba(239, 68, 68, 0.16)' : 'rgba(255, 255, 255, 0.95)',
                borderColor: isDark ? 'rgba(239, 68, 68, 0.45)' : 'rgba(239, 68, 68, 0.35)',
              }
            ]}
          >
            <View style={styles.activeAudioInfo}>
              <View style={styles.activeAudioPulseDot} />
              <Ionicons name="musical-notes" size={16} color="#EF4444" style={{ marginRight: 6 }} />
              <Text style={[styles.activeAudioText, { color: isDark ? '#FFFFFF' : '#14121E' }]} numberOfLines={1}>
                {SOUNDSCAPES.find(s => s.id === activeSoundId)?.name || 'Music Active'}
              </Text>
            </View>

            <View style={styles.activeAudioBtnRow}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  if (soundInstanceRef.current) {
                    if (isPlayingAudio) {
                      soundInstanceRef.current.pauseAsync();
                      setIsPlayingAudio(false);
                    } else {
                      soundInstanceRef.current.playAsync();
                      setIsPlayingAudio(true);
                    }
                  }
                }}
                style={[styles.activeAudioControlBtn, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.12)' : '#F3F4F6' }]}
              >
                <Ionicons name={isPlayingAudio ? "pause" : "play"} size={15} color={isDark ? "#FFFFFF" : "#14121E"} />
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handleStopAllAudio}
                style={styles.activeAudioStopBtn}
              >
                <Ionicons name="stop" size={12} color="#FFFFFF" style={{ marginRight: 4 }} />
                <Text style={styles.activeAudioStopText}>{t('stopAudio')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* 2. Quick Action Speed Dial Bar */}
        <View style={styles.quickActionsSection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickActionsScroll}
          >
            {QUICK_ACTIONS.map((action) => (
              <TouchableOpacity
                key={action.id}
                activeOpacity={0.78}
                onPress={() => router.push(action.route as any)}
                style={[
                  styles.quickActionChip,
                  {
                    backgroundColor: isDark ? 'rgba(18, 12, 38, 0.78)' : 'rgba(255, 255, 255, 0.90)',
                    borderColor: isDark ? (action.color + '45') : (action.color + '35'),
                    shadowColor: isDark ? '#000' : action.color,
                    shadowOpacity: isDark ? 0.25 : 0.10,
                  }
                ]}
              >
                <View style={[styles.quickActionIconBox, { backgroundColor: action.color + '20' }]}>
                  <Ionicons name={action.icon as any} size={15} color={action.color} />
                </View>
                <Text style={[styles.quickActionLabel, { color: isDark ? '#FFFFFF' : '#14121E' }]}>
                  {t(action.labelKey as any)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* 3. Mood Check-in & Dynamic Suggestions */}
        <View style={styles.moodSection}>
          <View style={styles.moodHeaderRow}>
            <Ionicons name="heart-half-outline" size={16} color={theme.primary} style={{ marginRight: 6 }} />
            <Text style={[styles.moodHeaderTitle, { color: isDark ? '#FFFFFF' : '#14121E' }]}>
              {t('howFeeling')}
            </Text>
          </View>

          <View style={styles.moodGrid}>
            {MOODS.map((mood, index) => (
              <TouchableOpacity
                key={index}
                style={styles.moodItem}
                onPress={() => {
                  setSelectedMood(index);
                  router.push(`/moods/${mood.label.toLowerCase()}` as any);
                }}
                activeOpacity={0.75}
              >
                <View style={[
                  styles.emojiCircle3D,
                  { backgroundColor: theme.surfaceSecondary, borderColor: theme.border },
                  selectedMood === index && { backgroundColor: mood.color, borderColor: mood.color, shadowColor: mood.color, shadowOpacity: 0.8, shadowRadius: 15, elevation: 10 }
                ]}>
                  <Text style={styles.emojiText}>{mood.emoji}</Text>
                  <View style={styles.emojiGlow} />
                </View>
                <Text style={[styles.moodLabel, { color: selectedMood === index ? mood.color : theme.textSecondary }]}>{mood.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {selectedMood !== null && (
            <View style={[styles.suggestionBox, { backgroundColor: isDark ? 'rgba(176, 164, 241, 0.12)' : 'rgba(110, 94, 199, 0.08)', borderColor: isDark ? 'rgba(176, 164, 241, 0.35)' : 'rgba(110, 94, 199, 0.25)' }]}>
              <Ionicons name="sparkles" size={18} color={isDark ? "#B0A4F1" : "#6E5EC7"} style={{ marginBottom: 6 }} />
              <Text style={[styles.suggestionTitle, { color: theme.textSecondary }]}>For feeling {MOODS[selectedMood].label}:</Text>
              <Text style={[styles.suggestionText, { color: isDark ? "#B0A4F1" : "#5A48D4" }]}>{MOODS[selectedMood].target}</Text>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: isDark ? "#B0A4F1" : "#6E5EC7" }]}
                onPress={() => router.push(`/moods/${MOODS[selectedMood!].label.toLowerCase()}` as any)}
                activeOpacity={0.8}
              >
                <Text style={[styles.actionButtonText, { color: isDark ? "#000" : "#FFF" }]}>{t('startSession')}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* 4. Featured For You Carousel (Hero Discovery) */}
        <View style={styles.carouselSection}>
          <Text style={[styles.carouselTitle, { color: theme.text }]}>{t('featuredForYou')}</Text>
          <Animated.FlatList
            ref={flatListRef}
            data={EXTENDED_CAROUSEL}
            keyExtractor={(item) => item.id}
            getItemLayout={getItemLayout}
            onScrollToIndexFailed={onScrollToIndexFailed}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={ITEM_WIDTH}
            decelerationRate="fast"
            contentContainerStyle={{ paddingHorizontal: 20 }}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              {
                useNativeDriver: true,
                listener: handleScroll
              }
            )}
            scrollEventThrottle={16}
            onScrollBeginDrag={stopAutoScroll}
            onScrollEndDrag={startAutoScroll}
            renderItem={({ item, index }) => {
              const inputRange = [
                (index - 1) * ITEM_WIDTH,
                index * ITEM_WIDTH,
                (index + 1) * ITEM_WIDTH,
              ];
              const scale = scrollX.interpolate({
                inputRange,
                outputRange: [0.92, 1, 0.92],
                extrapolate: 'clamp',
              });
              const opacity = scrollX.interpolate({
                inputRange,
                outputRange: [0.65, 1, 0.65],
                extrapolate: 'clamp',
              });
              return (
                <Animated.View style={[
                  styles.carouselCard,
                  {
                    backgroundColor: theme.card,
                    borderColor: isDark ? 'rgba(255, 255, 255, 0.15)' : item.color + '45',
                    transform: [{ scale }],
                    opacity,
                    shadowColor: isDark ? '#000' : item.color,
                    shadowOpacity: isDark ? 0.2 : 0.22,
                    shadowRadius: 10,
                    elevation: 6,
                  }
                ]}>
                  <TouchableOpacity
                    style={{ flex: 1 }}
                    activeOpacity={0.88}
                    onPress={() => handleCarouselPress(item)}
                  >
                    <ImageBackground
                      source={item.image}
                      style={styles.carouselCardImage}
                      imageStyle={{ borderRadius: 22, opacity: isDark ? 0.85 : 0.95 }}
                    >
                      <View style={styles.carouselCardOverlay}>
                        <View style={styles.carouselHeaderRow}>
                          <View style={[styles.carouselIconBox, { backgroundColor: isDark ? (item.color + '40') : '#FFFFFF', borderColor: item.color + '80', borderWidth: 1.5 }]}>
                            <Ionicons name={item.icon as any} size={20} color={item.color} />
                          </View>
                          <View style={[styles.exploreChip, { backgroundColor: isDark ? 'rgba(0,0,0,0.48)' : 'rgba(255,255,255,0.60)', borderColor: isDark ? 'rgba(255,255,255,0.20)' : item.color + '60' }]}>
                            <Text style={[styles.exploreChipText, { color: isDark ? '#FFFFFF' : item.color }]}>Explore →</Text>
                          </View>
                        </View>

                        <View style={[styles.carouselTextContainer, { backgroundColor: isDark ? 'rgba(10,8,22,0.50)' : 'rgba(255,255,255,0.58)', borderColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(120,104,230,0.20)' }]}>
                          <Text style={[styles.carouselCardTitle, { color: isDark ? '#FFFFFF' : '#14121E' }]}>{item.title}</Text>
                          <Text style={[styles.carouselCardText, { color: isDark ? '#D8D4F8' : 'rgba(12,10,24,0.85)' }]}>{item.text}</Text>
                        </View>
                      </View>
                    </ImageBackground>
                  </TouchableOpacity>
                </Animated.View>
              );
            }}
          />
        </View>

        {/* 5. Interactive 1-Minute Breathe & Ground Glass Widget */}
        <View
          style={[
            styles.breathingWidgetCard,
            {
              backgroundColor: isDark ? 'rgba(18, 12, 38, 0.78)' : 'rgba(255, 255, 255, 0.90)',
              borderColor: isDark ? 'rgba(176, 164, 241, 0.22)' : 'rgba(120, 104, 230, 0.22)',
              shadowColor: isDark ? '#000' : '#7868E6',
              shadowOpacity: isDark ? 0.35 : 0.12,
            }
          ]}
        >
          <View style={styles.breathingWidgetHeader}>
            <View style={{ flex: 1 }}>
              <View style={styles.breathingTitleRow}>
                <Text style={[styles.breathingWidgetTitle, { color: isDark ? '#FFFFFF' : '#14121E' }]}>
                  {t('breatheAndGround')}
                </Text>
                <View style={[
                  styles.liveIndicatorBadge,
                  {
                    backgroundColor: isBreathingActive
                      ? (isDark ? 'rgba(74, 222, 128, 0.2)' : 'rgba(34, 197, 94, 0.15)')
                      : (isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(120, 104, 230, 0.12)'),
                    borderColor: isBreathingActive ? '#4ADE80' : (isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(120, 104, 230, 0.2)'),
                  }
                ]}>
                  <View style={[
                    styles.liveIndicatorDot,
                    { backgroundColor: isBreathingActive ? '#4ADE80' : '#A09CB8' }
                  ]} />
                  <Text style={[
                    styles.liveIndicatorText,
                    { color: isBreathingActive ? (isDark ? '#4ADE80' : '#16A34A') : (isDark ? '#A09CB8' : '#6A658E') }
                  ]}>
                    {isBreathingActive ? 'Active' : '1 Min'}
                  </Text>
                </View>
              </View>
              <Text style={[styles.breathingWidgetSub, { color: isDark ? '#C5C1E8' : '#5A567D' }]}>
                {t('breatheWidgetSub')}
              </Text>
            </View>
          </View>

          {/* Center Interactive Breathing Orb */}
          <View style={styles.breathingOrbContainer}>
            <View style={[
              styles.breathingOuterHalo,
              {
                borderColor: isBreathingActive
                  ? (breathingPhase === 'inhale' ? '#38BDF8' : breathingPhase === 'hold' ? '#B0A4F1' : '#4ADE80') + '40'
                  : (isDark ? 'rgba(176, 164, 241, 0.15)' : 'rgba(120, 104, 230, 0.15)'),
                backgroundColor: isBreathingActive
                  ? (breathingPhase === 'inhale' ? '#38BDF8' : breathingPhase === 'hold' ? '#B0A4F1' : '#4ADE80') + '12'
                  : (isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(120, 104, 230, 0.04)'),
              }
            ]} />

            <Animated.View
              style={[
                styles.breathingAnimatedSphere,
                {
                  transform: [{ scale: breathAnim }],
                  backgroundColor: isDark
                    ? (isBreathingActive
                        ? (breathingPhase === 'inhale' ? 'rgba(56, 189, 248, 0.28)' : breathingPhase === 'hold' ? 'rgba(176, 164, 241, 0.32)' : 'rgba(74, 222, 128, 0.28)')
                        : 'rgba(176, 164, 241, 0.15)')
                    : (isBreathingActive
                        ? (breathingPhase === 'inhale' ? 'rgba(56, 189, 248, 0.25)' : breathingPhase === 'hold' ? 'rgba(120, 104, 230, 0.28)' : 'rgba(74, 222, 128, 0.25)')
                        : 'rgba(120, 104, 230, 0.12)'),
                  borderColor: isBreathingActive
                    ? (breathingPhase === 'inhale' ? '#38BDF8' : breathingPhase === 'hold' ? '#B0A4F1' : '#4ADE80')
                    : (isDark ? '#B0A4F1' : '#7868E6'),
                  shadowColor: isBreathingActive
                    ? (breathingPhase === 'inhale' ? '#38BDF8' : breathingPhase === 'hold' ? '#B0A4F1' : '#4ADE80')
                    : '#B0A4F1',
                }
              ]}
            >
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={toggleBreathing}
                style={styles.breathingSphereTouch}
              >
                {isBreathingActive ? (
                  <View style={styles.breathingSphereContent}>
                    <Text style={[styles.breathingCountText, { color: isDark ? '#FFFFFF' : '#14121E' }]}>
                      {breathingCount}
                    </Text>
                    <Text style={[styles.breathingPhaseLabel, { color: isDark ? '#FFFFFF' : '#14121E' }]}>
                      {phaseInfo.emoji}
                    </Text>
                  </View>
                ) : (
                  <View style={styles.breathingSphereContent}>
                    <Ionicons name="leaf-outline" size={26} color={isDark ? '#B0A4F1' : '#6E5EC7'} />
                    <Text style={[styles.breathingTapPrompt, { color: isDark ? '#D8D4F8' : '#4E4973' }]}>
                      {t('tapToBreathe')}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </Animated.View>
          </View>

          {/* Action Row */}
          <View style={styles.breathingActionRow}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={toggleBreathing}
              style={[
                styles.breathingToggleButton,
                {
                  backgroundColor: isBreathingActive
                    ? (isDark ? 'rgba(239, 68, 68, 0.18)' : 'rgba(239, 68, 68, 0.12)')
                    : (isDark ? '#B0A4F1' : '#6E5EC7'),
                  borderColor: isBreathingActive ? '#EF4444' : 'transparent',
                  borderWidth: isBreathingActive ? 1 : 0,
                }
              ]}
            >
              <Ionicons
                name={isBreathingActive ? "pause" : "play"}
                size={15}
                color={isBreathingActive ? (isDark ? '#FCA5A5' : '#DC2626') : (isDark ? '#000000' : '#FFFFFF')}
                style={{ marginRight: 6 }}
              />
              <Text style={[
                styles.breathingToggleText,
                {
                  color: isBreathingActive
                    ? (isDark ? '#FCA5A5' : '#DC2626')
                    : (isDark ? '#000000' : '#FFFFFF')
                }
              ]}>
                {isBreathingActive ? t('stopBreathing') : t('startBreathing')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.75}
              onPress={() => router.push('/moods/calming-exercises' as any)}
              style={[
                styles.breathingMoreLink,
                {
                  backgroundColor: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(120, 104, 230, 0.08)',
                  borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(120, 104, 230, 0.18)',
                }
              ]}
            >
              <Text style={[styles.breathingMoreText, { color: isDark ? '#B0A4F1' : '#6E5EC7' }]}>
                {t('fullCalmingTools')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 6. Daily Affirmation & Wisdom Card */}
        <View
          style={[
            styles.affirmationCard,
            {
              backgroundColor: isDark ? 'rgba(18, 12, 38, 0.78)' : 'rgba(255, 255, 255, 0.90)',
              borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(120, 104, 230, 0.22)',
              shadowColor: isDark ? '#000' : currentAffirmation.color,
              shadowOpacity: isDark ? 0.35 : 0.12,
            }
          ]}
        >
          {/* Top Bar: Tag badge & Shuffle button */}
          <View style={styles.affirmationTopRow}>
            <View style={[
              styles.affirmationTagBadge,
              {
                backgroundColor: isDark ? (currentAffirmation.color + '20') : (currentAffirmation.color + '18'),
                borderColor: currentAffirmation.color + '45',
              }
            ]}>
              <Text style={[styles.affirmationTagText, { color: isDark ? '#FFFFFF' : currentAffirmation.color }]}>
                {currentAffirmation.tag}
              </Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.75}
              onPress={handleNextAffirmation}
              style={[
                styles.shuffleBtn,
                {
                  backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(120, 104, 230, 0.10)',
                  borderColor: isDark ? 'rgba(255, 255, 255, 0.10)' : 'rgba(120, 104, 230, 0.20)',
                }
              ]}
            >
              <Animated.View style={{
                transform: [{
                  rotate: quoteRotateAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '360deg'],
                  })
                }]
              }}>
                <Ionicons name="refresh" size={13} color={isDark ? '#B0A4F1' : '#6E5EC7'} />
              </Animated.View>
              <Text style={[styles.shuffleBtnText, { color: isDark ? '#D8D4F8' : '#4E4973' }]}>
                {t('shuffleAffirmation')}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Animated Quote Body */}
          <Animated.View style={[styles.affirmationBody, { opacity: quoteFadeAnim }]}>
            <Text style={[styles.quoteSymbol, { color: currentAffirmation.color + '70' }]}>“</Text>
            <Text style={[styles.affirmationText, { color: isDark ? '#FFFFFF' : '#14121E' }]}>
              {currentAffirmation.quote}
            </Text>
          </Animated.View>

          {/* Bottom Bar: Author and Action Buttons */}
          <View style={styles.affirmationFooterRow}>
            <Text style={[styles.affirmationAuthor, { color: isDark ? '#B0A4F1' : '#6A658E' }]}>
              — {currentAffirmation.author || t('quoteAuthorUnknown')}
            </Text>

            <View style={styles.affirmationActionButtons}>
              <TouchableOpacity
                activeOpacity={0.75}
                onPress={handleToggleFavorite}
                style={[
                  styles.affirmationActionCircle,
                  {
                    backgroundColor: isFavorited
                      ? (isDark ? 'rgba(244, 114, 182, 0.25)' : 'rgba(244, 114, 182, 0.20)')
                      : (isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(120, 104, 230, 0.08)'),
                    borderColor: isFavorited ? '#F472B6' : (isDark ? 'rgba(255, 255, 255, 0.10)' : 'rgba(120, 104, 230, 0.18)'),
                  }
                ]}
              >
                <Ionicons
                  name={isFavorited ? "heart" : "heart-outline"}
                  size={15}
                  color={isFavorited ? "#F472B6" : (isDark ? '#D8D4F8' : '#6E5EC7')}
                />
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.75}
                onPress={handleShareQuote}
                style={[
                  styles.affirmationActionCircle,
                  {
                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(120, 104, 230, 0.08)',
                    borderColor: isDark ? 'rgba(255, 255, 255, 0.10)' : 'rgba(120, 104, 230, 0.18)',
                  }
                ]}
              >
                <Ionicons name="share-social-outline" size={14} color={isDark ? '#D8D4F8' : '#6E5EC7'} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* 7. To Heal From Us (Services Grid) */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('toHealFromUs')}</Text>
        </View>

        <View style={styles.servicesGrid}>
          {SERVICES.map((service, index) => (
            <TouchableOpacity
              key={service.id}
              style={[
                styles.serviceCard,
                {
                  borderColor: isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(120, 104, 230, 0.20)',
                  borderWidth: 1,
                  backgroundColor: theme.card,
                  shadowColor: isDark ? '#000' : service.color,
                  shadowOpacity: isDark ? 0.25 : 0.16,
                  shadowRadius: 8,
                  elevation: 5,
                },
                index === SERVICES.length - 1 && index % 2 === 0 ? styles.fullWidthCard : null
              ]}
              onPress={() => handleServicePress(service)}
              activeOpacity={0.80}
            >
              <ImageBackground
                source={service.image}
                style={styles.cardBg}
                imageStyle={[
                  styles.cardImageStyle,
                  { opacity: isDark ? 0.88 : 0.95 }
                ]}
              >
                <View style={styles.cardTopBadgeRow}>
                  <View style={[styles.cardIconCircle, { backgroundColor: service.color }]}>
                    <Ionicons name={service.icon as any} size={15} color="#fff" />
                  </View>
                  <View style={[
                    styles.cardActionPill,
                    {
                      backgroundColor: isDark ? 'rgba(0, 0, 0, 0.45)' : 'rgba(255, 255, 255, 0.85)',
                      borderColor: isDark ? 'rgba(255, 255, 255, 0.20)' : 'rgba(120, 104, 230, 0.25)',
                    }
                  ]}>
                    <Ionicons name="arrow-forward" size={11} color={isDark ? '#FFF' : service.color} />
                  </View>
                </View>

                <View style={[
                  styles.cardFooter,
                  {
                    backgroundColor: isDark ? 'rgba(10, 7, 24, 0.48)' : 'rgba(255, 255, 255, 0.58)',
                    borderColor: isDark ? 'rgba(255, 255, 255, 0.16)' : 'rgba(120, 104, 230, 0.20)',
                  }
                ]}>
                  <Text style={[styles.cardTitle, { color: isDark ? '#FFFFFF' : '#14121E' }]} numberOfLines={1}>{service.title}</Text>
                  <Text style={[styles.cardSub, { color: isDark ? '#D8D4F8' : '#2D2852' }]} numberOfLines={1}>{service.subtitle}</Text>
                </View>
              </ImageBackground>
            </TouchableOpacity>
          ))}
        </View>

        {/* 8. Ambient Soundscapes 1-Tap Glass Player */}
        <View
          style={[
            styles.soundscapesCard,
            {
              backgroundColor: isDark ? 'rgba(18, 12, 38, 0.78)' : 'rgba(255, 255, 255, 0.90)',
              borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(120, 104, 230, 0.22)',
              shadowColor: isDark ? '#000' : '#38BDF8',
              shadowOpacity: isDark ? 0.35 : 0.12,
            }
          ]}
        >
          {/* Top Row: Title, subtitle & Stop button */}
          <View style={styles.soundscapesHeaderRow}>
            <View style={{ flex: 1, paddingRight: 10 }}>
              <View style={styles.soundscapesTitleFlex}>
                <Ionicons name="headset-outline" size={17} color={isDark ? '#38BDF8' : '#0284C7'} style={{ marginRight: 6 }} />
                <Text style={[styles.soundscapesTitle, { color: isDark ? '#FFFFFF' : '#14121E' }]}>
                  {t('ambientSoundscapes')}
                </Text>
              </View>
              <Text style={[styles.soundscapesSub, { color: isDark ? '#C5C1E8' : '#5A567D' }]}>
                {t('soundscapesSub')}
              </Text>
            </View>

            {activeSoundId && (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleStopAllAudio}
                style={[
                  styles.soundscapeStopBtn,
                  {
                    backgroundColor: isDark ? 'rgba(239, 68, 68, 0.18)' : 'rgba(239, 68, 68, 0.12)',
                    borderColor: '#EF4444',
                  }
                ]}
              >
                <Ionicons name="stop" size={11} color={isDark ? '#FCA5A5' : '#DC2626'} style={{ marginRight: 4 }} />
                <Text style={[styles.soundscapeStopText, { color: isDark ? '#FCA5A5' : '#DC2626' }]}>
                  {t('stopAudio')}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Soundscape Tracks 2-Column Grid */}
          <View style={styles.soundscapesGrid}>
            {SOUNDSCAPES.map((track) => {
              const isCurrent = activeSoundId === track.id;
              const isCurrentPlaying = isCurrent && isPlayingAudio;
              return (
                <TouchableOpacity
                  key={track.id}
                  activeOpacity={0.82}
                  onPress={() => handleSoundscapePress(track)}
                  style={[
                    styles.soundscapePill,
                    {
                      backgroundColor: isCurrent
                        ? (isDark ? track.color + '26' : track.color + '1E')
                        : (isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(240, 238, 255, 0.65)'),
                      borderColor: isCurrent
                        ? track.color
                        : (isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(120, 104, 230, 0.18)'),
                      shadowColor: isCurrent ? track.color : 'transparent',
                      shadowOpacity: isCurrent ? 0.35 : 0,
                      shadowRadius: isCurrent ? 8 : 0,
                    }
                  ]}
                >
                  <View style={[
                    styles.soundscapeIconCircle,
                    {
                      backgroundColor: isCurrent ? track.color : (isDark ? 'rgba(255,255,255,0.08)' : 'rgba(120,104,230,0.12)'),
                    }
                  ]}>
                    <Ionicons
                      name={track.icon}
                      size={16}
                      color={isCurrent ? '#000000' : (isDark ? '#FFFFFF' : '#4E4973')}
                    />
                  </View>

                  <View style={styles.soundscapeTrackDetails}>
                    <Text
                      style={[
                        styles.soundscapeTrackName,
                        { color: isCurrent ? (isDark ? '#FFFFFF' : track.color) : (isDark ? '#FFFFFF' : '#14121E') }
                      ]}
                      numberOfLines={1}
                    >
                      {track.name}
                    </Text>
                    <Text style={[styles.soundscapeTrackSub, { color: isDark ? '#C5C1E8' : '#6A658E' }]} numberOfLines={1}>
                      {isCurrentPlaying ? t('playingSound') : track.sub}
                    </Text>
                  </View>

                  <View style={styles.soundscapePlayAction}>
                    {isCurrentPlaying ? (
                      <Animated.View style={{
                        transform: [{
                          scale: waveAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0.9, 1.25],
                          })
                        }]
                      }}>
                        <Ionicons name="volume-high" size={15} color={track.color} />
                      </Animated.View>
                    ) : (
                      <Ionicons
                        name={isCurrent ? "pause-circle" : "play-circle-outline"}
                        size={18}
                        color={isCurrent ? track.color : (isDark ? '#A09CB8' : '#7868E6')}
                      />
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* 9. Floating Voya AI Companion */}
      <VoyaChatbot />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingBottom: 18,
  },
  bubble: {
    position: 'absolute',
  },
  floatingLogin: {
    position: 'absolute',
    right: 18,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#B0A4F1',
    paddingVertical: 9,
    paddingHorizontal: 18,
    borderRadius: 25,
    zIndex: 100,
    shadowColor: '#B0A4F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
  },
  loginGlow: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 27,
    borderWidth: 2,
    borderColor: 'rgba(176, 164, 241, 0.4)',
  },
  loginButtonText: {
    fontWeight: 'bold',
    fontSize: 13,
  },
  // 1. Dynamic Greeting Card
  dynamicGreetingCard: {
    padding: 18,
    borderRadius: 22,
    borderWidth: 1,
    marginBottom: 24,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 5,
  },
  greetingTopMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  dateMetaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    borderWidth: 1,
  },
  dateMetaText: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  streakMetaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    borderWidth: 1,
  },
  streakFlameIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  streakMetaText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  greetingMainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  greetingMainTitle: {
    fontSize: 23,
    fontWeight: 'bold',
    letterSpacing: -0.3,
    lineHeight: 28,
    marginBottom: 4,
  },
  greetingSubTitle: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
  },
  timeOrbCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 5,
  },
  // 2. Quick Actions
  quickActionsSection: {
    marginBottom: 24,
    marginHorizontal: -18,
  },
  quickActionsScroll: {
    paddingHorizontal: 18,
    gap: 9,
  },
  quickActionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    paddingHorizontal: 13,
    borderRadius: 16,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  quickActionIconBox: {
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 7,
  },
  quickActionLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  // 3. Mood Section
  moodSection: {
    marginBottom: 26,
  },
  moodHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  moodHeaderTitle: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  moodGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  moodItem: {
    alignItems: 'center',
  },
  emojiCircle3D: {
    width: 58,
    height: 58,
    borderRadius: 29,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 6,
  },
  emojiGlow: {
    position: 'absolute',
    top: 4,
    left: 4,
    width: 18,
    height: 9,
    borderRadius: 9,
    backgroundColor: 'rgba(255,255,255,0.2)',
    transform: [{ rotate: '-20deg' }],
  },
  emojiText: {
    fontSize: 25,
  },
  moodLabel: {
    fontSize: 10,
    color: '#666',
    fontWeight: 'bold',
    letterSpacing: 0.4,
  },
  suggestionBox: {
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    marginTop: 14,
    alignItems: 'center',
  },
  suggestionTitle: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 3,
  },
  suggestionText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  actionButton: {
    paddingVertical: 9,
    paddingHorizontal: 18,
    borderRadius: 12,
  },
  actionButtonText: {
    fontWeight: 'bold',
    fontSize: 13,
  },
  // 4. Carousel
  carouselSection: {
    marginBottom: 26,
    marginHorizontal: -18,
  },
  carouselTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    marginLeft: 18,
    marginBottom: 14,
    letterSpacing: 0.4,
  },
  carouselCard: {
    width: width * 0.75,
    height: 180,
    borderRadius: 22,
    marginRight: 16,
    borderWidth: 1,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 4 },
  },
  carouselCardImage: {
    flex: 1,
    padding: 14,
  },
  carouselCardOverlay: {
    flex: 1,
    justifyContent: 'space-between',
  },
  carouselHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  carouselIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  exploreChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
  },
  exploreChipText: {
    fontSize: 11,
    fontWeight: '700',
  },
  carouselTextContainer: {
    padding: 10,
    borderRadius: 14,
    borderWidth: 1,
  },
  carouselCardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  carouselCardText: {
    fontSize: 12,
    lineHeight: 16,
  },
  // 5. Breathing Widget
  breathingWidgetCard: {
    padding: 18,
    borderRadius: 22,
    borderWidth: 1,
    marginBottom: 26,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 5,
  },
  breathingWidgetHeader: {
    marginBottom: 12,
  },
  breathingTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 3,
  },
  breathingWidgetTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: -0.2,
  },
  liveIndicatorBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
  },
  liveIndicatorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  liveIndicatorText: {
    fontSize: 10,
    fontWeight: '700',
  },
  breathingWidgetSub: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
  },
  breathingOrbContainer: {
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 6,
  },
  breathingOuterHalo: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 1.5,
  },
  breathingAnimatedSphere: {
    width: 94,
    height: 94,
    borderRadius: 47,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 12,
    elevation: 7,
  },
  breathingSphereTouch: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  breathingSphereContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  breathingCountText: {
    fontSize: 28,
    fontWeight: '900',
    lineHeight: 32,
  },
  breathingPhaseLabel: {
    fontSize: 10,
    fontWeight: '700',
    marginTop: 2,
    letterSpacing: 0.3,
  },
  breathingTapPrompt: {
    fontSize: 10,
    fontWeight: '700',
    marginTop: 3,
    textAlign: 'center',
  },
  breathingActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    gap: 8,
  },
  breathingToggleButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 12,
  },
  breathingToggleText: {
    fontSize: 12,
    fontWeight: '700',
  },
  breathingMoreLink: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  breathingMoreText: {
    fontSize: 11,
    fontWeight: '700',
  },
  // 6. Affirmation Card
  affirmationCard: {
    padding: 18,
    borderRadius: 22,
    borderWidth: 1,
    marginBottom: 26,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 5,
  },
  affirmationTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  affirmationTagBadge: {
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
  },
  affirmationTagText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  shuffleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  shuffleBtnText: {
    fontSize: 10,
    fontWeight: '600',
    marginLeft: 4,
  },
  affirmationBody: {
    marginVertical: 4,
  },
  quoteSymbol: {
    fontSize: 28,
    fontFamily: 'serif',
    lineHeight: 24,
    marginBottom: -6,
  },
  affirmationText: {
    fontSize: 14,
    fontWeight: '600',
    fontStyle: 'italic',
    lineHeight: 21,
    letterSpacing: 0.2,
  },
  affirmationFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(120, 104, 230, 0.12)',
  },
  affirmationAuthor: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  affirmationActionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  affirmationActionCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // 7. Services Grid
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    letterSpacing: 0.2,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 26,
  },
  serviceCard: {
    width: (width - 36 - 12) / 2,
    height: 170,
    borderRadius: 22,
    overflow: 'hidden',
    marginBottom: 14,
    shadowOffset: { width: 0, height: 3 },
  },
  fullWidthCard: {
    width: '100%',
  },
  cardBg: {
    flex: 1,
    padding: 11,
    justifyContent: 'space-between',
  },
  cardImageStyle: {
    borderRadius: 22,
  },
  cardTopBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardIconCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  cardActionPill: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardFooter: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 12,
    borderWidth: 1,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  cardSub: {
    fontSize: 10,
    fontWeight: '600',
  },
  // 8. Soundscapes Player
  soundscapesCard: {
    padding: 18,
    borderRadius: 22,
    borderWidth: 1,
    marginBottom: 18,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 5,
  },
  soundscapesHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  soundscapesTitleFlex: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  soundscapesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: -0.2,
  },
  soundscapesSub: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
  },
  soundscapeStopBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
  },
  soundscapeStopText: {
    fontSize: 10,
    fontWeight: '700',
  },
  soundscapesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 10,
  },
  soundscapePill: {
    width: '48.5%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  soundscapeIconCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 7,
  },
  soundscapeTrackDetails: {
    flex: 1,
  },
  soundscapeTrackName: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 1,
  },
  soundscapeTrackSub: {
    fontSize: 9,
    fontWeight: '500',
  },
  soundscapePlayAction: {
    marginLeft: 3,
  },
  // 9. Floating Voya Bot
  voyaContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 56,
    height: 56,
    zIndex: 999,
  },
  voyaBubble: {
    position: 'absolute',
    bottom: 62,
    backgroundColor: 'rgba(176, 164, 241, 0.95)',
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#B0A4F1',
    shadowColor: '#B0A4F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 10,
    width: 120,
  },
  voyaBubbleRightDock: {
    right: 0,
  },
  voyaBubbleLeftDock: {
    left: 0,
  },
  voyaBubbleText: {
    color: '#000',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  voyaBubbleSubtext: {
    color: '#000',
    fontSize: 9,
    textAlign: 'center',
    opacity: 0.85,
    marginTop: 1,
  },
  voyaBubbleTail: {
    position: 'absolute',
    bottom: -6,
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 7,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: 'rgba(176, 164, 241, 0.95)',
  },
  voyaBubbleTailRight: {
    right: 20,
  },
  voyaBubbleTailLeft: {
    left: 20,
  },
  voyaIconWrapper: {
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  voyaMainCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#B0A4F1',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    shadowColor: '#B0A4F1',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 18,
    elevation: 12,
  },
  voyaFaceGlow: {
    position: 'absolute',
    top: 4,
    left: 8,
    width: 14,
    height: 7,
    borderRadius: 7,
    backgroundColor: 'rgba(255,255,255,0.4)',
    transform: [{ rotate: '-15deg' }],
  },
  voyaOuterRing: {
    position: 'absolute',
    width: 58,
    height: 58,
    borderRadius: 29,
    borderWidth: 1,
    borderColor: 'rgba(176, 164, 241, 0.5)',
  },
  voyaGlowEffect: {
    position: 'absolute',
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(176, 164, 241, 0.1)',
  },
  activeAudioBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginTop: 12,
    marginBottom: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  activeAudioInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  activeAudioPulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    marginRight: 8,
  },
  activeAudioText: {
    fontSize: 13,
    fontWeight: 'bold',
    flex: 1,
  },
  activeAudioBtnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  activeAudioControlBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeAudioStopBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EF4444',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  activeAudioStopText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
});
