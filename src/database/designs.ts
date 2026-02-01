// Database types and operations for Designs table
import { supabase } from '../config/supabase';

// AI suggestion item from Gemini analysis
export interface AISuggestion {
    item: string;           // e.g., "sofa", "lamp", "rug"
    confidence: number;     // 0-1 confidence score
    description?: string;   // Optional description
    category?: string;      // e.g., "seating", "lighting", "decor"
}

export type DesignStatus = 'pending' | 'analyzing' | 'generating' | 'completed' | 'failed';
export type RoomType = 'living_room' | 'bedroom' | 'kitchen' | 'bathroom' | 'dining_room' | 'office' | 'other';

export interface Design {
    id: string;
    user_id: string;
    title: string | null;
    room_type: RoomType | null;
    original_image_url: string | null;
    generated_image_url: string | null;
    ai_suggestions: AISuggestion[];      // AI-suggested furniture items
    selected_items: string[];             // User-selected items for redesign
    style_id: string | null;
    status: DesignStatus;
    created_at: string;
    updated_at: string;
}

export interface CreateDesignInput {
    user_id: string;
    title?: string;
    room_type?: RoomType;
    original_image_url?: string;
    generated_image_url?: string;
    ai_suggestions?: AISuggestion[];
    selected_items?: string[];
    style_id?: string;
    status?: DesignStatus;
}

export interface UpdateDesignInput {
    title?: string;
    room_type?: RoomType;
    generated_image_url?: string;
    ai_suggestions?: AISuggestion[];
    selected_items?: string[];
    style_id?: string;
    status?: DesignStatus;
}

/**
 * Create a new design
 */
export async function createDesign(input: CreateDesignInput): Promise<Design | null> {
    const { data, error } = await supabase
        .from('designs')
        .insert({
            user_id: input.user_id,
            title: input.title || null,
            room_type: input.room_type || null,
            original_image_url: input.original_image_url || null,
            generated_image_url: input.generated_image_url || null,
            ai_suggestions: input.ai_suggestions || [],
            selected_items: input.selected_items || [],
            style_id: input.style_id || null,
            status: input.status || 'pending',
        })
        .select()
        .single();

    if (error) {
        console.error('Error creating design:', error);
        return null;
    }

    return data;
}

/**
 * Update design with AI suggestions (after Gemini analysis)
 */
export async function updateDesignSuggestions(
    designId: string,
    suggestions: AISuggestion[]
): Promise<boolean> {
    const { error } = await supabase
        .from('designs')
        .update({
            ai_suggestions: suggestions,
            status: 'analyzing',
            updated_at: new Date().toISOString(),
        })
        .eq('id', designId);

    if (error) {
        console.error('Error updating design suggestions:', error);
        return false;
    }

    return true;
}

/**
 * Update selected items (user checkbox selections)
 */
export async function updateSelectedItems(
    designId: string,
    selectedItems: string[]
): Promise<boolean> {
    const { error } = await supabase
        .from('designs')
        .update({
            selected_items: selectedItems,
            updated_at: new Date().toISOString(),
        })
        .eq('id', designId);

    if (error) {
        console.error('Error updating selected items:', error);
        return false;
    }

    return true;
}

/**
 * Update design after generation complete
 */
export async function updateDesignGenerated(
    designId: string,
    generatedImageUrl: string
): Promise<boolean> {
    const { error } = await supabase
        .from('designs')
        .update({
            generated_image_url: generatedImageUrl,
            status: 'completed',
            updated_at: new Date().toISOString(),
        })
        .eq('id', designId);

    if (error) {
        console.error('Error updating generated design:', error);
        return false;
    }

    return true;
}

/**
 * Update design status
 */
export async function updateDesignStatus(
    designId: string,
    status: DesignStatus
): Promise<boolean> {
    const { error } = await supabase
        .from('designs')
        .update({
            status,
            updated_at: new Date().toISOString(),
        })
        .eq('id', designId);

    if (error) {
        console.error('Error updating design status:', error);
        return false;
    }

    return true;
}

/**
 * Get all designs for a user
 */
export async function getUserDesigns(userId: string): Promise<Design[]> {
    const { data, error } = await supabase
        .from('designs')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching user designs:', error);
        return [];
    }

    return data || [];
}

/**
 * Get a single design by ID
 */
export async function getDesignById(designId: string): Promise<Design | null> {
    const { data, error } = await supabase
        .from('designs')
        .select('*')
        .eq('id', designId)
        .single();

    if (error) {
        console.error('Error fetching design:', error);
        return null;
    }

    return data;
}

/**
 * Delete a design
 */
export async function deleteDesign(designId: string): Promise<boolean> {
    const { error } = await supabase
        .from('designs')
        .delete()
        .eq('id', designId);

    if (error) {
        console.error('Error deleting design:', error);
        return false;
    }

    return true;
}

/**
 * Update design title
 */
export async function updateDesignTitle(designId: string, title: string): Promise<boolean> {
    const { error } = await supabase
        .from('designs')
        .update({
            title,
            updated_at: new Date().toISOString(),
        })
        .eq('id', designId);

    if (error) {
        console.error('Error updating design title:', error);
        return false;
    }

    return true;
}
