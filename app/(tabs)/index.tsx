import { useAuth } from '@/constants/AuthContext';
import Colors from '@/constants/Colors';
import { useLanguage } from '@/constants/LanguageContext';
import { useTheme } from '@/constants/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
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
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width * 0.75 + 20;

const MOODS = [
  { label: 'CALM', emoji: '🧘', color: '#4CAF50', target: 'Meditation + Soft Music' },
  { label: 'SAD', emoji: '😢', color: '#2196F3', target: 'SafeHaven + Journaling' },
  { label: 'ANGRY', emoji: '🔥', color: '#F44336', target: 'Breathing + Release Tools' },
  { label: 'FEARFUL', emoji: '🛡️', color: '#FF9800', target: 'Support + Grounding' },
  { label: 'LONELY', emoji: '🤝', color: '#9C27B0', target: 'Buddy Chat + Activities' },
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
    <FloatingBubble size={200} delay={4000} duration={10000} color={color} />
    <FloatingBubble size={140} delay={2000} duration={12000} color={color} />
  </View>
);

const VoyaChatbot = () => {
  const router = useRouter();
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();
  const floatAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(0)).current;

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

  const translateY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  });

  const scale = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.05],
  });

  return (
    <View style={[styles.voyaContainer, { bottom: 20 + insets.bottom }]}>
      <View style={styles.voyaBubble}>
        <Text style={styles.voyaBubbleText}>{t('hiVoya')}</Text>
        <Text style={styles.voyaBubbleSubtext}>{t('askAnything')}</Text>
        <View style={styles.voyaBubbleTail} />
      </View>

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => router.push('/voya-chat')}
      >
        <Animated.View style={[
          styles.voyaIconWrapper,
          { transform: [{ translateY }, { scale }] }
        ]}>
          <View style={styles.voyaMainCircle}>
            <Ionicons name="sparkles" size={28} color="#000" />
            <View style={styles.voyaFaceGlow} />
          </View>
          <View style={styles.voyaOuterRing} />
          <View style={styles.voyaGlowEffect} />
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme: themeName, isDark } = useTheme();
  const { t } = useLanguage();
  const theme = Colors[themeName];

  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(1);
  const autoScrollRef = useRef<any>(null);

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

  const { isGuest } = useAuth();

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
      <View style={{ height: insets.top, backgroundColor: theme.background, width: '100%', position: 'absolute', top: 0, zIndex: 10 }} />

      {isGuest && (
        <TouchableOpacity
          style={[styles.floatingLogin, { top: insets.top + 10 }]}
          onPress={() => router.push('/auth/login')}
          activeOpacity={0.8}
        >
          <View style={styles.loginGlow} />
          <Ionicons name="log-in-outline" size={20} color="#000" style={{ marginRight: 6 }} />
          <Text style={styles.loginButtonText}>{t('signIn')}</Text>
        </TouchableOpacity>
      )}

      <BackgroundAnimation color={isDark ? '#B0A4F1' : '#8A4FFF'} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 20 }]}
      >
        <View style={styles.welcomeSection}>
          <Text style={[styles.welcomeMain, { color: theme.text }]}>{t('welcomeBack')}</Text>
          <Text style={styles.howFeeling}>{t('howFeeling')}</Text>
        </View>

        <View style={styles.moodGrid}>
          {MOODS.map((mood, index) => (
            <TouchableOpacity
              key={index}
              style={styles.moodItem}
              onPress={() => setSelectedMood(index)}
            >
              <View style={[
                styles.emojiCircle3D,
                { backgroundColor: isDark ? '#111' : '#EEE', borderColor: isDark ? '#222' : '#DDD' },
                selectedMood === index && { backgroundColor: mood.color, shadowColor: mood.color, shadowOpacity: 0.8, shadowRadius: 15, elevation: 10 }
              ]}>
                <Text style={styles.emojiText}>{mood.emoji}</Text>
                <View style={styles.emojiGlow} />
              </View>
              <Text style={[styles.moodLabel, selectedMood === index && { color: mood.color }]}>{mood.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {selectedMood !== null && (
          <View style={[styles.suggestionBox, { backgroundColor: isDark ? 'rgba(176, 164, 241, 0.1)' : 'rgba(138, 79, 255, 0.05)', borderColor: isDark ? 'rgba(176, 164, 241, 0.3)' : 'rgba(138, 79, 255, 0.2)' }]}>
            <Ionicons name="sparkles" size={20} color={isDark ? "#B0A4F1" : "#8A4FFF"} style={{ marginBottom: 10 }} />
            <Text style={[styles.suggestionTitle, { color: theme.text }]}>For feeling {MOODS[selectedMood].label}:</Text>
            <Text style={[styles.suggestionText, { color: isDark ? "#B0A4F1" : "#8A4FFF" }]}>{MOODS[selectedMood].target}</Text>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: isDark ? "#B0A4F1" : "#8A4FFF" }]}
              onPress={() => router.push(`/moods/${MOODS[selectedMood!].label.toLowerCase()}` as any)}
            >
              <Text style={[styles.actionButtonText, { color: isDark ? "#000" : "#FFF" }]}>{t('startSession')}</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.carouselSection}>
          <Text style={[styles.carouselTitle, { color: theme.text }]}>{t('featuredForYou')}</Text>
          <Animated.FlatList
            ref={flatListRef}
            data={EXTENDED_CAROUSEL}
            keyExtractor={(item) => item.id}
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
                outputRange: [0.9, 1, 0.9],
                extrapolate: 'clamp',
              });
              const opacity = scrollX.interpolate({
                inputRange,
                outputRange: [0.6, 1, 0.6],
                extrapolate: 'clamp',
              });
              return (
                <Animated.View style={[styles.carouselCard, { backgroundColor: isDark ? '#111' : '#FFF', borderColor: isDark ? '#222' : '#EEE', transform: [{ scale }], opacity }]}>
                  <ImageBackground
                    source={item.image}
                    style={styles.carouselCardImage}
                    imageStyle={{ borderRadius: 24, opacity: isDark ? 0.4 : 0.6 }}
                  >
                    <View style={styles.carouselCardOverlay}>
                      <View style={[styles.carouselIconBox, { backgroundColor: item.color + '40' }]}>
                        <Ionicons name={item.icon as any} size={24} color={item.color} />
                      </View>
                      <View>
                        <Text style={[styles.carouselCardTitle, { color: isDark ? '#fff' : '#000' }]}>{item.title}</Text>
                        <Text style={[styles.carouselCardText, { color: isDark ? '#888' : '#444' }]}>{item.text}</Text>
                      </View>
                    </View>
                  </ImageBackground>
                </Animated.View>
              );
            }}
          />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('toHealFromUs')}</Text>
        </View>

        <View style={styles.servicesGrid}>
          {SERVICES.map((service, index) => (
            <TouchableOpacity
              key={service.id}
              style={[
                styles.serviceCard,
                index === SERVICES.length - 1 && index % 2 === 0 ? styles.fullWidthCard : null
              ]}
              onPress={() => handleServicePress(service)}
              activeOpacity={0.8}
            >
              <ImageBackground
                source={service.image}
                style={styles.cardBg}
                imageStyle={styles.cardImageStyle}
              >
                <View style={[styles.cardOverlay, { backgroundColor: isDark ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.2)' }]}>
                  <View style={[styles.cardIconCircle, { backgroundColor: service.color }]}>
                    <Ionicons name={service.icon as any} size={18} color="#fff" />
                  </View>
                  <View>
                    <Text style={[styles.cardTitle, { color: isDark ? '#fff' : '#000' }]}>{service.title}</Text>
                    <Text style={[styles.cardSub, { color: isDark ? '#fff' : '#444' }]}>{service.subtitle}</Text>
                  </View>
                </View>
              </ImageBackground>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
      <VoyaChatbot />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 110, // Optimized space for Voya and bottom bar
  },
  floatingLogin: {
    position: 'absolute',
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#B0A4F1',
    paddingVertical: 10,
    paddingHorizontal: 20,
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
    color: '#000',
    fontWeight: 'bold',
    fontSize: 14,
  },
  welcomeSection: {
    marginBottom: 20,
  },
  bubble: {
    position: 'absolute',
  },
  welcomeMain: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  howFeeling: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#B0A4F1',
  },
  moodGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  moodItem: {
    alignItems: 'center',
  },
  emojiCircle3D: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  emojiGlow: {
    position: 'absolute',
    top: 4,
    left: 4,
    width: 20,
    height: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    transform: [{ rotate: '-20deg' }],
  },
  emojiText: {
    fontSize: 28,
  },
  moodLabel: {
    fontSize: 10,
    color: '#666',
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  suggestionBox: {
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    marginBottom: 40,
    alignItems: 'center',
  },
  suggestionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  suggestionText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  actionButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  actionButtonText: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  carouselSection: {
    marginBottom: 40,
  },
  carouselTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 20,
    marginBottom: 15,
    letterSpacing: 0.5,
  },
  carouselCard: {
    width: width * 0.75,
    height: 180,
    borderRadius: 24,
    marginRight: 20,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  carouselCardImage: {
    flex: 1,
    padding: 24,
  },
  carouselCardOverlay: {
    flex: 1,
    justifyContent: 'space-between',
  },
  carouselIconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  carouselCardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  carouselCardText: {
    fontSize: 14,
    lineHeight: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  serviceCard: {
    width: (width - 50) / 2,
    height: 180,
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 15,
  },
  fullWidthCard: {
    width: '100%',
  },
  cardBg: {
    flex: 1,
  },
  cardImageStyle: {
    borderRadius: 24,
  },
  cardOverlay: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  cardIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardSub: {
    fontSize: 12,
    opacity: 0.8,
  },
  voyaContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    alignItems: 'center',
    zIndex: 100,
  },
  voyaBubble: {
    backgroundColor: 'rgba(176, 164, 241, 0.9)',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#B0A4F1',
    shadowColor: '#B0A4F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
    width: 140,
  },
  voyaBubbleText: {
    color: '#000',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  voyaBubbleSubtext: {
    color: '#000',
    fontSize: 10,
    textAlign: 'center',
    opacity: 0.8,
    marginTop: 2,
  },
  voyaBubbleTail: {
    position: 'absolute',
    bottom: -8,
    right: 40,
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: 'rgba(176, 164, 241, 0.9)',
  },
  voyaIconWrapper: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  voyaMainCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#B0A4F1',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    shadowColor: '#B0A4F1',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 15,
  },
  voyaFaceGlow: {
    position: 'absolute',
    top: 5,
    left: 10,
    width: 15,
    height: 8,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.4)',
    transform: [{ rotate: '-15deg' }],
  },
  voyaOuterRing: {
    position: 'absolute',
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: 'rgba(176, 164, 241, 0.5)',
  },
  voyaGlowEffect: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(176, 164, 241, 0.1)',
  },
  guestBanner: {
    position: 'absolute',
    left: 20,
    right: 20,
    backgroundColor: '#B0A4F1',
    padding: 10,
    borderRadius: 12,
    alignItems: 'center',
    zIndex: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  guestBannerText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
