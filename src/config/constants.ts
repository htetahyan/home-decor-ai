// App Constants

export const APP_CONFIG = {
  name: 'DecorAI',
  version: '1.0.0',
  description: 'AI-Powered Home Decor Assistant',
};

// Free tier limits
export const FREE_TIER = {
  redesignsPerMonth: 3,
  maxImageSize: 5 * 1024 * 1024, // 5MB
};

// Premium tier benefits
export const PREMIUM_TIER = {
  price: 4.99,
  currency: 'USD',
  period: 'month',
};

// AI Furniture suggestions
export const FURNITURE_CATEGORIES = [
  { id: 'sofa', label: 'Sofa', icon: '🛋️', description: 'Comfortable seating options' },
  { id: 'armchair', label: 'Armchair', icon: '🪑', description: 'Accent chairs and recliners' },
  { id: 'coffee_table', label: 'Coffee Table', icon: '🪵', description: 'Center tables for living room' },
  { id: 'lamp', label: 'Lamp', icon: '💡', description: 'Floor and table lamps' },
  { id: 'rug', label: 'Rug', icon: '🟫', description: 'Area rugs and carpets' },
  { id: 'plant', label: 'Plant', icon: '🪴', description: 'Indoor plants and planters' },
  { id: 'bookshelf', label: 'Bookshelf', icon: '📚', description: 'Storage and display shelves' },
  { id: 'artwork', label: 'Artwork', icon: '🖼️', description: 'Wall art and decorations' },
  { id: 'curtains', label: 'Curtains', icon: '🪟', description: 'Window treatments' },
  { id: 'side_table', label: 'Side Table', icon: '🪜', description: 'End tables and nightstands' },
];

// Design styles for premium users
export const DESIGN_STYLES = [
  { id: 'modern', label: 'Modern', description: 'Clean lines and minimalist aesthetic' },
  { id: 'scandinavian', label: 'Scandinavian', description: 'Light, airy, and functional' },
  { id: 'industrial', label: 'Industrial', description: 'Raw materials and urban vibe' },
  { id: 'bohemian', label: 'Bohemian', description: 'Eclectic and colorful' },
  { id: 'minimalist', label: 'Minimalist', description: 'Less is more philosophy' },
  { id: 'traditional', label: 'Traditional', description: 'Classic and timeless elegance' },
  { id: 'mid_century', label: 'Mid-Century Modern', description: 'Retro 50s-60s inspired' },
  { id: 'coastal', label: 'Coastal', description: 'Beach-inspired relaxed feel' },
];

// RevenueCat Product IDs
export const REVENUECAT_PRODUCTS = {
  monthly: 'monthly',
  yearly: 'yearly',
  lifetime: 'lifetime',
  entitlement: 'AI Contract Analyzer',
};

// API Keys placeholder (should be in env vars for production)
export const API_KEYS = {
  // These should be replaced with actual keys from environment variables
  GEMINI_API_KEY: process.env.EXPO_PUBLIC_GEMINI_API_KEY || '',
  SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL || '',
  SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '',
  REVENUECAT_API_KEY: process.env.EXPO_PUBLIC_REVENUECAT_API_KEY || 'test_BhFIDFiPtakgOduTxLokRwBTNrw',
};
