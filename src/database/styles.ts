// Database types and operations for Styles table
import { supabase } from '../config/supabase';

export interface Style {
    id: string;
    name: string;
    description: string | null;
    subtitle: string | null;
    category: string;
    image_url: string;
    is_trending: boolean;
    is_hot: boolean;
    created_at: string;
}

export interface StyleFilters {
    category?: string;
    searchQuery?: string;
    isTrending?: boolean;
}

/**
 * Get all styles with optional filters
 */
export async function getStyles(filters?: StyleFilters): Promise<Style[]> {
    let query = supabase.from('styles').select('*');

    // Apply category filter
    if (filters?.category && filters.category !== 'All') {
        query = query.eq('category', filters.category);
    }

    // Apply search filter
    if (filters?.searchQuery && filters.searchQuery.trim()) {
        query = query.ilike('name', `%${filters.searchQuery}%`);
    }

    // Apply trending filter
    if (filters?.isTrending) {
        query = query.eq('is_trending', true);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching styles:', error);
        return [];
    }

    return data || [];
}

/**
 * Get trending styles
 */
export async function getTrendingStyles(): Promise<Style[]> {
    const { data, error } = await supabase
        .from('styles')
        .select('*')
        .eq('is_trending', true)
        .order('created_at', { ascending: false })
        .limit(5);

    if (error) {
        console.error('Error fetching trending styles:', error);
        return [];
    }

    return data || [];
}

/**
 * Get style by ID
 */
export async function getStyleById(id: string): Promise<Style | null> {
    const { data, error } = await supabase
        .from('styles')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching style:', error);
        return null;
    }

    return data;
}

/**
 * Get unique categories for filter chips
 */
export async function getCategories(): Promise<string[]> {
    const { data, error } = await supabase
        .from('styles')
        .select('category')
        .order('category');

    if (error) {
        console.error('Error fetching categories:', error);
        return ['All'];
    }

    const uniqueCategories = [...new Set(data?.map((d: { category: string }) => d.category) || [])];
    return ['All', ...uniqueCategories];
}
