import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    Animated,
} from 'react-native';
import { CameraView, CameraType, Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

const { width, height } = Dimensions.get('window');

type Mode = 'VIDEO' | 'PHOTO' | 'SCAN';

export const CameraScreen: React.FC = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [type, setType] = useState<CameraType>('back');
    const [mode, setMode] = useState<Mode>('PHOTO');
    const cameraRef = useRef<CameraView>(null);
    const scanLineAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    useEffect(() => {
        // Scanning animation
        Animated.loop(
            Animated.sequence([
                Animated.timing(scanLineAnim, {
                    toValue: 1,
                    duration: 2000,
                    useNativeDriver: true,
                }),
                Animated.timing(scanLineAnim, {
                    toValue: 0,
                    duration: 2000,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, [scanLineAnim]);

    const takePicture = async () => {
        if (cameraRef.current) {
            try {
                const photo = await cameraRef.current.takePictureAsync({
                    quality: 0.8,
                    base64: false,
                });
                navigation.navigate('AIAnalysis', { imageUri: photo.uri });
            } catch (error) {
                console.error('Failed to take picture:', error);
            }
        }
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
        });

        if (!result.canceled && result.assets[0]) {
            navigation.navigate('AIAnalysis', { imageUri: result.assets[0].uri });
        }
    };

    const flipCamera = () => {
        setType((current: CameraType) =>
            current === 'back' ? 'front' : 'back'
        );
    };

    if (hasPermission === null) {
        return (
            <View style={styles.container}>
                <Text style={styles.permissionText}>Requesting camera permission...</Text>
            </View>
        );
    }

    if (hasPermission === false) {
        return (
            <View style={styles.container}>
                <Text style={styles.permissionText}>No access to camera</Text>
                <TouchableOpacity style={styles.permissionButton} onPress={pickImage}>
                    <Text style={styles.permissionButtonText}>Pick from Gallery</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <CameraView style={styles.camera} facing={type} ref={cameraRef}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
                        <Ionicons name="close" size={28} color="#fff" />
                    </TouchableOpacity>
                    <View style={styles.headerCenter}>
                        <Text style={styles.headerSubtitle}>AI SCAN</Text>
                        <Text style={styles.headerTitle}>Align Room</Text>
                    </View>
                    <View style={styles.headerRight}>
                        <TouchableOpacity style={styles.headerIcon}>
                            <Ionicons name="flash" size={24} color="#fff" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.headerIcon}>
                            <Ionicons name="grid" size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Tip Banner */}
                <View style={styles.tipBanner}>
                    <View style={styles.tipIcon}>
                        <Ionicons name="body" size={16} color="#22C55E" />
                    </View>
                    <Text style={styles.tipText}>Keep the floor visible</Text>
                </View>

                {/* Alignment Frame */}
                <View style={styles.alignmentFrame}>
                    {/* Corner brackets */}
                    <View style={[styles.corner, styles.topLeft]} />
                    <View style={[styles.corner, styles.topRight]} />
                    <View style={[styles.corner, styles.bottomLeft]} />
                    <View style={[styles.corner, styles.bottomRight]} />

                    {/* Scan line animation */}
                    <Animated.View
                        style={[
                            styles.scanLine,
                            {
                                transform: [
                                    {
                                        translateY: scanLineAnim.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [0, 200],
                                        }),
                                    },
                                ],
                            },
                        ]}
                    />
                </View>

                {/* Bottom instruction */}
                <View style={styles.instructionContainer}>
                    <Text style={styles.instructionText}>Hold steady for AI analysis</Text>
                </View>

                {/* Mode Selector */}
                <View style={styles.modeSelector}>
                    {(['VIDEO', 'PHOTO', 'SCAN'] as Mode[]).map((m) => (
                        <TouchableOpacity
                            key={m}
                            onPress={() => setMode(m)}
                            style={styles.modeButton}
                        >
                            <Text style={[styles.modeText, mode === m && styles.modeTextActive]}>
                                {m}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Bottom Controls */}
                <View style={styles.controls}>
                    <TouchableOpacity style={styles.galleryButton} onPress={pickImage}>
                        <View style={styles.galleryPreview}>
                            <Ionicons name="images" size={24} color="#fff" />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
                        <View style={styles.captureButtonInner} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.flipButton} onPress={flipCamera}>
                        <Ionicons name="camera-reverse" size={28} color="#fff" />
                    </TouchableOpacity>
                </View>
            </CameraView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    camera: {
        flex: 1,
        width: '100%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 50,
        paddingBottom: 16,
    },
    closeButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerCenter: {
        alignItems: 'center',
    },
    headerSubtitle: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.7)',
        fontWeight: '500',
    },
    headerTitle: {
        fontSize: 18,
        color: '#fff',
        fontWeight: '700',
    },
    headerRight: {
        flexDirection: 'row',
        gap: 12,
    },
    headerIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    tipBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        alignSelf: 'center',
        marginTop: 10,
        gap: 8,
    },
    tipIcon: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: 'rgba(34, 197, 94, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    tipText: {
        color: '#22C55E',
        fontSize: 14,
        fontWeight: '600',
    },
    alignmentFrame: {
        position: 'absolute',
        top: height * 0.2,
        left: width * 0.1,
        width: width * 0.8,
        height: height * 0.4,
    },
    corner: {
        position: 'absolute',
        width: 30,
        height: 30,
        borderColor: '#22C55E',
    },
    topLeft: {
        top: 0,
        left: 0,
        borderTopWidth: 3,
        borderLeftWidth: 3,
        borderTopLeftRadius: 8,
    },
    topRight: {
        top: 0,
        right: 0,
        borderTopWidth: 3,
        borderRightWidth: 3,
        borderTopRightRadius: 8,
    },
    bottomLeft: {
        bottom: 0,
        left: 0,
        borderBottomWidth: 3,
        borderLeftWidth: 3,
        borderBottomLeftRadius: 8,
    },
    bottomRight: {
        bottom: 0,
        right: 0,
        borderBottomWidth: 3,
        borderRightWidth: 3,
        borderBottomRightRadius: 8,
    },
    scanLine: {
        position: 'absolute',
        left: 0,
        right: 0,
        height: 2,
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        top: 0,
    },
    instructionContainer: {
        position: 'absolute',
        bottom: height * 0.28,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    instructionText: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 14,
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 16,
    },
    modeSelector: {
        position: 'absolute',
        bottom: 140,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 32,
    },
    modeButton: {
        paddingVertical: 8,
    },
    modeText: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 14,
        fontWeight: '600',
    },
    modeTextActive: {
        color: '#22C55E',
    },
    controls: {
        position: 'absolute',
        bottom: 40,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 40,
    },
    galleryButton: {
        width: 50,
        height: 50,
    },
    galleryPreview: {
        width: 50,
        height: 50,
        borderRadius: 8,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    captureButton: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#22C55E',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderColor: '#fff',
    },
    captureButtonInner: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#22C55E',
    },
    flipButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    permissionText: {
        color: '#fff',
        fontSize: 16,
        marginBottom: 20,
    },
    permissionButton: {
        backgroundColor: '#22C55E',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    permissionButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});
