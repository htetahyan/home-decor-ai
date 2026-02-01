-- Styles table (design styles for room redesign)
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

-- Index for category filtering
CREATE INDEX IF NOT EXISTS idx_styles_category ON styles(category);
CREATE INDEX IF NOT EXISTS idx_styles_trending ON styles(is_trending) WHERE is_trending = true;
