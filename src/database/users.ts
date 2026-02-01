// Database types and operations for Users table
import { supabase } from '../config/supabase';

export interface User {
    id: string;
    clerk_id: string;
    username: string;
    email: string | null;
    created_at: string;
}

export interface CreateUserInput {
    clerk_id: string;
    username: string;
    email?: string;
}

/**
 * Create or update a user in the database (synced with Clerk)
 */
export async function upsertUser(input: CreateUserInput): Promise<User | null> {
    const { data, error } = await supabase
        .from('users')
        .upsert(
            {
                clerk_id: input.clerk_id,
                username: input.username,
                email: input.email || null,
            },
            { onConflict: 'clerk_id' }
        )
        .select()
        .single();

    if (error) {
        console.error('Error upserting user:', error);
        return null;
    }

    return data;
}

/**
 * Get user by Clerk ID
 */
export async function getUserByClerkId(clerkId: string): Promise<User | null> {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('clerk_id', clerkId)
        .single();

    if (error) {
        console.error('Error fetching user:', error);
        return null;
    }

    return data;
}

/**
 * Generate a random guest username
 */
export function generateGuestUsername(): string {
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    return `guest_user_${randomSuffix}`;
}
