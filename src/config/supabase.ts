import { createClient } from '@supabase/supabase-js';
import { API_KEYS } from './constants';

// Supabase client configuration
const supabaseUrl = API_KEYS.SUPABASE_URL;
const supabaseAnonKey = API_KEYS.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase credentials not configured. Please set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY');
}

export const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseAnonKey || 'placeholder');

// Database types
export interface UserProfile {
    id: string;
    email: string;
    created_at: string;
    is_premium: boolean;
    redesigns_used: number;
    redesigns_reset_date: string;
}

export interface Redesign {
    id: string;
    user_id: string;
    original_image_url: string;
    redesigned_image_url: string | null;
    suggestions: string[];
    style: string;
    created_at: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
}

// Storage bucket names
export const STORAGE_BUCKETS = {
    ROOM_IMAGES: 'room-images',
    REDESIGNED_IMAGES: 'redesigned-images',
};
