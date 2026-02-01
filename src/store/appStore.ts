import { create } from 'zustand';
import { RoomAnalysis, SuggestedItem, RedesignResult } from '../services/geminiService';

interface AppState {
    // User state
    userId: string | null;
    isPremium: boolean;
    redesignsUsed: number;
    redesignsLimit: number;

    // Current redesign session
    originalImageUri: string | null;
    roomAnalysis: RoomAnalysis | null;
    selectedItems: SuggestedItem[];
    selectedStyle: string;
    redesignResult: RedesignResult | null;
    isAnalyzing: boolean;
    isGenerating: boolean;
    error: string | null;

    // Actions
    setUserId: (userId: string | null) => void;
    setPremiumStatus: (isPremium: boolean) => void;
    setRedesignsUsed: (count: number) => void;
    incrementRedesignsUsed: () => void;

    setOriginalImage: (uri: string | null) => void;
    setRoomAnalysis: (analysis: RoomAnalysis | null) => void;
    toggleItemSelection: (itemId: string) => void;
    setSelectedStyle: (style: string) => void;
    setRedesignResult: (result: RedesignResult | null) => void;

    setIsAnalyzing: (isAnalyzing: boolean) => void;
    setIsGenerating: (isGenerating: boolean) => void;
    setError: (error: string | null) => void;

    resetSession: () => void;
    canRedesign: () => boolean;
}

const INITIAL_STATE = {
    userId: null,
    isPremium: false,
    redesignsUsed: 0,
    redesignsLimit: 3,
    originalImageUri: null,
    roomAnalysis: null,
    selectedItems: [],
    selectedStyle: 'modern',
    redesignResult: null,
    isAnalyzing: false,
    isGenerating: false,
    error: null,
};

export const useAppStore = create<AppState>((set, get) => ({
    ...INITIAL_STATE,

    setUserId: (userId) => set({ userId }),

    setPremiumStatus: (isPremium) => set({
        isPremium,
        redesignsLimit: isPremium ? 999999 : 3
    }),

    setRedesignsUsed: (count) => set({ redesignsUsed: count }),

    incrementRedesignsUsed: () => set((state) => ({
        redesignsUsed: state.redesignsUsed + 1
    })),

    setOriginalImage: (uri) => set({
        originalImageUri: uri,
        roomAnalysis: null,
        selectedItems: [],
        redesignResult: null,
        error: null,
    }),

    setRoomAnalysis: (analysis) => set({
        roomAnalysis: analysis,
        selectedItems: analysis?.suggestedAdditions.filter(item => item.selected) || [],
    }),

    toggleItemSelection: (itemId) => set((state) => {
        const { roomAnalysis, selectedItems } = state;
        if (!roomAnalysis) return state;

        const item = roomAnalysis.suggestedAdditions.find(i => i.id === itemId);
        if (!item) return state;

        const isCurrentlySelected = selectedItems.some(i => i.id === itemId);

        let newSelectedItems: SuggestedItem[];
        if (isCurrentlySelected) {
            newSelectedItems = selectedItems.filter(i => i.id !== itemId);
        } else {
            newSelectedItems = [...selectedItems, { ...item, selected: true }];
        }

        return { selectedItems: newSelectedItems };
    }),

    setSelectedStyle: (style) => set({ selectedStyle: style }),

    setRedesignResult: (result) => set({ redesignResult: result }),

    setIsAnalyzing: (isAnalyzing) => set({ isAnalyzing }),

    setIsGenerating: (isGenerating) => set({ isGenerating }),

    setError: (error) => set({ error }),

    resetSession: () => set({
        originalImageUri: null,
        roomAnalysis: null,
        selectedItems: [],
        redesignResult: null,
        isAnalyzing: false,
        isGenerating: false,
        error: null,
    }),

    canRedesign: () => {
        const { isPremium, redesignsUsed, redesignsLimit } = get();
        return isPremium || redesignsUsed < redesignsLimit;
    },
}));
