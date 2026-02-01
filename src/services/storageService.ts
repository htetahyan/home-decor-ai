import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import { supabase, STORAGE_BUCKETS } from '../config/supabase';
import { decode } from 'base64-arraybuffer';

// For file operations, we'll use fetch API and blob handling
// This avoids the deprecated expo-file-system methods

// Upload image to Supabase storage
export async function uploadImage(
    imageUri: string,
    bucket: string,
    userId: string
): Promise<{ success: boolean; url?: string; error?: string }> {
    try {
        // Fetch the image and convert to blob
        const response = await fetch(imageUri);
        const blob = await response.blob();

        // Convert blob to base64
        const base64 = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                // Remove the data URL prefix
                const base64Data = result.split(',')[1];
                resolve(base64Data);
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });

        // Generate unique filename
        const fileName = `${userId}/${Date.now()}.jpg`;

        // Upload to Supabase
        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(fileName, decode(base64), {
                contentType: 'image/jpeg',
                upsert: false,
            });

        if (error) {
            throw error;
        }

        // Get public URL
        const { data: urlData } = supabase.storage
            .from(bucket)
            .getPublicUrl(fileName);

        return { success: true, url: urlData.publicUrl };
    } catch (error: any) {
        console.error('Upload error:', error);
        return { success: false, error: error.message || 'Upload failed' };
    }
}

// Download image from URL - returns the URL directly for React Native Image
export async function downloadImage(url: string): Promise<{ success: boolean; localUri?: string; error?: string }> {
    try {
        // In React Native, we can often use the URL directly
        // For caching, expo-image handles this automatically
        return { success: true, localUri: url };
    } catch (error: any) {
        console.error('Download error:', error);
        return { success: false, error: error.message || 'Download failed' };
    }
}

// Save image to device gallery
export async function saveToGallery(imageUri: string): Promise<{ success: boolean; error?: string }> {
    try {
        // Request permissions
        const { status } = await MediaLibrary.requestPermissionsAsync();

        if (status !== 'granted') {
            return { success: false, error: 'Permission denied to save images' };
        }

        // Save to gallery
        const asset = await MediaLibrary.createAssetAsync(imageUri);

        // Create album if it doesn't exist
        const album = await MediaLibrary.getAlbumAsync('DecorAI');
        if (album === null) {
            await MediaLibrary.createAlbumAsync('DecorAI', asset, false);
        } else {
            await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
        }

        return { success: true };
    } catch (error: any) {
        console.error('Save to gallery error:', error);
        return { success: false, error: error.message || 'Failed to save image' };
    }
}

// Share image
export async function shareImage(imageUri: string): Promise<{ success: boolean; error?: string }> {
    try {
        const isAvailable = await Sharing.isAvailableAsync();

        if (!isAvailable) {
            return { success: false, error: 'Sharing is not available on this device' };
        }

        await Sharing.shareAsync(imageUri, {
            mimeType: 'image/jpeg',
            dialogTitle: 'Share your redesigned room',
        });

        return { success: true };
    } catch (error: any) {
        console.error('Share error:', error);
        return { success: false, error: error.message || 'Failed to share' };
    }
}

// Get image as base64 for AI processing
export async function getImageBase64(imageUri: string): Promise<string> {
    const response = await fetch(imageUri);
    const blob = await response.blob();

    return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const result = reader.result as string;
            const base64Data = result.split(',')[1];
            resolve(base64Data);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}
