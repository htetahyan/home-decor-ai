// Database types and operations for Product Images table
import { supabase } from '../config/supabase';

export interface ProductImage {
    id: string;
    design_id: string | null;
    user_id: string;
    name: string | null;
    original_image_url: string | null;
    extracted_image_url: string | null;
    position_x: number;
    position_y: number;
    scale: number;
    rotation: number;
    is_visible: boolean;
    created_at: string;
}

export interface CreateProductImageInput {
    design_id?: string;
    user_id: string;
    name?: string;
    original_image_url: string;
    extracted_image_url?: string;
}

export interface UpdateProductImageInput {
    name?: string;
    extracted_image_url?: string;
    position_x?: number;
    position_y?: number;
    scale?: number;
    rotation?: number;
    is_visible?: boolean;
}

/**
 * Add a product image to a design
 */
export async function createProductImage(input: CreateProductImageInput): Promise<ProductImage | null> {
    const { data, error } = await supabase
        .from('product_images')
        .insert({
            design_id: input.design_id || null,
            user_id: input.user_id,
            name: input.name || null,
            original_image_url: input.original_image_url,
            extracted_image_url: input.extracted_image_url || null,
        })
        .select()
        .single();

    if (error) {
        console.error('Error creating product image:', error);
        return null;
    }

    return data;
}

/**
 * Get all product images for a design
 */
export async function getProductImagesByDesign(designId: string): Promise<ProductImage[]> {
    const { data, error } = await supabase
        .from('product_images')
        .select('*')
        .eq('design_id', designId)
        .order('created_at', { ascending: true });

    if (error) {
        console.error('Error fetching product images:', error);
        return [];
    }

    return data || [];
}

/**
 * Get all product images for a user (across all designs)
 */
export async function getProductImagesByUser(userId: string): Promise<ProductImage[]> {
    const { data, error } = await supabase
        .from('product_images')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching user product images:', error);
        return [];
    }

    return data || [];
}

/**
 * Update product image position/scale/rotation (for drag/pinch gestures)
 */
export async function updateProductImageTransform(
    productImageId: string,
    transform: { position_x?: number; position_y?: number; scale?: number; rotation?: number }
): Promise<boolean> {
    const { error } = await supabase
        .from('product_images')
        .update(transform)
        .eq('id', productImageId);

    if (error) {
        console.error('Error updating product image transform:', error);
        return false;
    }

    return true;
}

/**
 * Update product image details
 */
export async function updateProductImage(
    productImageId: string,
    updates: UpdateProductImageInput
): Promise<boolean> {
    const { error } = await supabase
        .from('product_images')
        .update(updates)
        .eq('id', productImageId);

    if (error) {
        console.error('Error updating product image:', error);
        return false;
    }

    return true;
}

/**
 * Attach product image to a design (for adding later)
 */
export async function attachProductToDesign(
    productImageId: string,
    designId: string
): Promise<boolean> {
    const { error } = await supabase
        .from('product_images')
        .update({ design_id: designId })
        .eq('id', productImageId);

    if (error) {
        console.error('Error attaching product to design:', error);
        return false;
    }

    return true;
}

/**
 * Toggle product visibility in design
 */
export async function toggleProductVisibility(
    productImageId: string,
    isVisible: boolean
): Promise<boolean> {
    const { error } = await supabase
        .from('product_images')
        .update({ is_visible: isVisible })
        .eq('id', productImageId);

    if (error) {
        console.error('Error toggling product visibility:', error);
        return false;
    }

    return true;
}

/**
 * Delete a product image
 */
export async function deleteProductImage(productImageId: string): Promise<boolean> {
    const { error } = await supabase
        .from('product_images')
        .delete()
        .eq('id', productImageId);

    if (error) {
        console.error('Error deleting product image:', error);
        return false;
    }

    return true;
}
