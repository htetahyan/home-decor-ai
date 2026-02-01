-- Product images table (furniture/items user uploads to visualize in room)
CREATE TABLE IF NOT EXISTS product_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    design_id UUID REFERENCES designs(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name TEXT,                      -- User-given name like "Blue Sofa"
    original_image_url TEXT,        -- Uploaded product image
    extracted_image_url TEXT,       -- Background-removed version
    position_x FLOAT DEFAULT 0.5,   -- X position in room (0-1 normalized)
    position_y FLOAT DEFAULT 0.5,   -- Y position in room (0-1 normalized)
    scale FLOAT DEFAULT 1.0,        -- Size multiplier
    rotation FLOAT DEFAULT 0,       -- Rotation in degrees
    is_visible BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_product_images_design_id ON product_images(design_id);
CREATE INDEX IF NOT EXISTS idx_product_images_user_id ON product_images(user_id);
