-- ============================================
-- Home Decor AI - Complete Database Schema
-- Run this file in Supabase SQL Editor
-- ============================================

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clerk_id TEXT UNIQUE NOT NULL,
    username TEXT,
    email TEXT,
    is_premium BOOLEAN DEFAULT false,
    redesigns_used INTEGER DEFAULT 0,
    redesigns_reset_date TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_users_clerk_id ON users(clerk_id);

-- 2. STYLES TABLE
CREATE TABLE IF NOT EXISTS styles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    subtitle TEXT,
    category TEXT,
    image_url TEXT,
    is_trending BOOLEAN DEFAULT false,
    is_hot BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_styles_category ON styles(category);
CREATE INDEX IF NOT EXISTS idx_styles_trending ON styles(is_trending) WHERE is_trending = true;

-- 3. DESIGNS TABLE
CREATE TABLE IF NOT EXISTS designs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title TEXT,
    room_type TEXT,
    original_image_url TEXT,
    generated_image_url TEXT,
    ai_suggestions JSONB DEFAULT '[]',
    selected_items JSONB DEFAULT '[]',
    style_id UUID REFERENCES styles(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_designs_user_id ON designs(user_id);
CREATE INDEX IF NOT EXISTS idx_designs_status ON designs(status);
CREATE INDEX IF NOT EXISTS idx_designs_created_at ON designs(created_at DESC);

-- Auto-update trigger for designs.updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_designs_updated_at ON designs;
CREATE TRIGGER update_designs_updated_at
    BEFORE UPDATE ON designs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 4. PRODUCT IMAGES TABLE (User-uploaded furniture/items to visualize)
CREATE TABLE IF NOT EXISTS product_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    design_id UUID REFERENCES designs(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name TEXT,
    original_image_url TEXT,
    extracted_image_url TEXT,
    position_x FLOAT DEFAULT 0.5,
    position_y FLOAT DEFAULT 0.5,
    scale FLOAT DEFAULT 1.0,
    rotation FLOAT DEFAULT 0,
    is_visible BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_product_images_design_id ON product_images(design_id);
CREATE INDEX IF NOT EXISTS idx_product_images_user_id ON product_images(user_id);
