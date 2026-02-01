import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Dimensions,
    FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { theme } from '../styles/theme';

const { width, height } = Dimensions.get('window');

interface OnboardingSlide {
    id: string;
    title: string;
    highlightedWord: string;
    description: string;
}

const slides: OnboardingSlide[] = [
    {
        id: '1',
        title: 'Redesign your room in',
        highlightedWord: 'seconds',
        description: 'Visualize different styles in your real space before you buy a single piece of furniture.',
    },
    {
        id: '2',
        title: 'AI-powered',
        highlightedWord: 'suggestions',
        description: 'Get personalized furniture recommendations that match your style and space.',
    },
    {
        id: '3',
        title: 'Save and share your',
        highlightedWord: 'designs',
        description: 'Keep your favorite redesigns and share them with friends and family.',
    },
];

export const OnboardingScreen: React.FC = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef<FlatList>(null);

    const handleSkip = () => {
        // Navigate to SignUp instead of main app
        navigation.navigate('SignUp');
    };

    const handleGetStarted = () => {
        if (currentIndex < slides.length - 1) {
            flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
        } else {
            handleSkip();
        }
    };

    const renderSlide = ({ item }: { item: OnboardingSlide }) => (
        <View style={styles.slide}>
            {/* Before/After Images */}
            <View style={styles.imagesContainer}>
                {/* Before Image */}
                <View style={styles.imageWrapper}>
                    <View style={styles.imageCard}>
                        <View style={styles.beforeLabel}>
                            <Text style={styles.labelText}>BEFORE</Text>
                        </View>
                        <View style={[styles.placeholderImage, styles.beforeImage]}>
                            <View style={styles.floorLine} />
                        </View>
                    </View>
                </View>

                {/* Merge Icon */}
                <View style={styles.mergeIcon}>
                    <Ionicons name="git-merge" size={20} color={theme.colors.primary} />
                </View>

                {/* After Image */}
                <View style={styles.imageWrapper}>
                    <View style={styles.imageCard}>
                        <View style={styles.afterLabel}>
                            <Text style={styles.labelText}>AFTER</Text>
                        </View>
                        <View style={[styles.placeholderImage, styles.afterImage]}>
                            <View style={styles.roomPreview}>
                                <View style={styles.sofaShape} />
                                <View style={styles.plantShape} />
                            </View>
                        </View>
                    </View>
                </View>
            </View>

            {/* Text Content */}
            <View style={styles.textContent}>
                <Text style={styles.title}>
                    {item.title}{' '}
                    <Text style={styles.highlightedText}>{item.highlightedWord}</Text>
                    {' '}with AI
                </Text>
                <Text style={styles.description}>{item.description}</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Skip Button */}
            <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
                <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>

            {/* Slides */}
            <FlatList
                ref={flatListRef}
                data={slides}
                renderItem={renderSlide}
                keyExtractor={(item) => item.id}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={(event) => {
                    const index = Math.round(event.nativeEvent.contentOffset.x / width);
                    setCurrentIndex(index);
                }}
            />

            {/* Pagination Dots */}
            <View style={styles.pagination}>
                {slides.map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.dot,
                            index === currentIndex && styles.dotActive,
                        ]}
                    />
                ))}
            </View>

            {/* Get Started Button */}
            <TouchableOpacity style={styles.getStartedButton} onPress={handleGetStarted} activeOpacity={0.7}>
                <LinearGradient
                    colors={[theme.colors.primary, '#16A34A']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.buttonGradient}
                >
                    <Text style={styles.buttonText}>Get Started</Text>
                    <Ionicons name="arrow-forward" size={20} color="#fff" />
                </LinearGradient>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    skipButton: {
        position: 'absolute',
        top: 60,
        right: 24,
        zIndex: 10,
    },
    skipText: {
        fontSize: 16,
        color: '#6B7280',
        fontWeight: '500',
    },
    slide: {
        width: width,
        flex: 1,
        paddingHorizontal: 24,
        justifyContent: 'center',
    },
    imagesContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 48,
        marginTop: 80,
    },
    imageWrapper: {
        flex: 1,
    },
    imageCard: {
        backgroundColor: '#F8FAFB',
        borderRadius: 20,
        padding: 8,
        marginHorizontal: 4,
        height: height * 0.35,
        overflow: 'hidden',
    },
    beforeLabel: {
        position: 'absolute',
        top: 16,
        left: 16,
        backgroundColor: '#1F2937',
        borderRadius: 6,
        paddingHorizontal: 10,
        paddingVertical: 4,
        zIndex: 10,
    },
    afterLabel: {
        position: 'absolute',
        top: 16,
        right: 16,
        backgroundColor: theme.colors.primary,
        borderRadius: 6,
        paddingHorizontal: 10,
        paddingVertical: 4,
        zIndex: 10,
    },
    labelText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '700',
    },
    placeholderImage: {
        flex: 1,
        borderRadius: 16,
        overflow: 'hidden',
    },
    beforeImage: {
        backgroundColor: '#E5E7EB',
    },
    afterImage: {
        backgroundColor: '#F3F4F6',
    },
    floorLine: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '40%',
        backgroundColor: '#9CA3AF',
    },
    roomPreview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: 20,
    },
    sofaShape: {
        width: '80%',
        height: 50,
        backgroundColor: '#D1D5DB',
        borderRadius: 8,
    },
    plantShape: {
        position: 'absolute',
        right: 20,
        bottom: 40,
        width: 30,
        height: 60,
        backgroundColor: theme.colors.primary,
        borderRadius: 15,
        opacity: 0.5,
    },
    mergeIcon: {
        position: 'absolute',
        left: '50%',
        marginLeft: -16,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#E8F8EE',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    textContent: {
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#1F2937',
        textAlign: 'center',
        lineHeight: 36,
        marginBottom: 16,
    },
    highlightedText: {
        color: theme.colors.primary,
    },
    description: {
        fontSize: 16,
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 24,
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
        marginBottom: 24,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#E5E7EB',
    },
    dotActive: {
        width: 24,
        backgroundColor: theme.colors.primary,
    },
    getStartedButton: {
        marginHorizontal: 24,
        marginBottom: 50,
    },
    buttonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
        borderRadius: 16,
        gap: 8,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#fff',
    },
});
