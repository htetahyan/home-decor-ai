-- Designs table (user room redesign projects)
CREATE TABLE IF NOT EXISTS designs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title TEXT,
    room_type TEXT, -- 'living_room', 'bedroom', 'kitchen', 'bathroom', 'dining_room', 'office', 'other'
    original_image_url TEXT,
    generated_image_url TEXT,
    ai_suggestions JSONB DEFAULT '[]', -- [{"item": "sofa", "confidence": 0.9, "description": "...", "category": "seating"}]
    selected_items JSONB DEFAULT '[]', -- ["sofa", "lamp", "rug"]
    style_id UUID REFERENCES styles(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'pending', -- 'pending', 'analyzing', 'generating', 'completed', 'failed'
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_designs_user_id ON designs(user_id);
CREATE INDEX IF NOT EXISTS idx_designs_status ON designs(status);
CREATE INDEX IF NOT EXISTS idx_designs_created_at ON designs(created_at DESC);

-- Trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_designs_updated_at
    BEFORE UPDATE ON designs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
