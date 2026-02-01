import { GoogleGenerativeAI } from '@google/generative-ai';
import { API_KEYS, FURNITURE_CATEGORIES, DESIGN_STYLES } from '../config/constants';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(API_KEYS.GEMINI_API_KEY);

export interface RoomAnalysis {
    roomType: string;
    currentFurniture: string[];
    suggestedAdditions: SuggestedItem[];
    colorPalette: string[];
    overallStyle: string;
    improvements: string[];
}

export interface SuggestedItem {
    id: string;
    category: string;
    label: string;
    icon: string;
    description: string;
    placement: string;
    priority: 'high' | 'medium' | 'low';
    selected: boolean;
}

export interface RedesignResult {
    success: boolean;
    description: string;
    visualPrompt: string;
    selectedItems: SuggestedItem[];
    styleApplied: string;
}

/**
 * Convert local image URI to base64 for Gemini API
 */
async function imageUriToBase64(imageUri: string): Promise<string> {
    try {
        const response = await fetch(imageUri);
        if (!response.ok) {
            throw new Error(`Failed to fetch image: ${response.status}`);
        }
        const blob = await response.blob();

        return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                if (!result) {
                    reject(new Error('FileReader returned empty result'));
                    return;
                }
                // Remove data URL prefix (e.g., "data:image/jpeg;base64,")
                const base64Data = result.split(',')[1];
                if (!base64Data) {
                    reject(new Error('Failed to extract base64 data'));
                    return;
                }
                resolve(base64Data);
            };
            reader.onerror = () => reject(new Error('FileReader error'));
            reader.readAsDataURL(blob);
        });
    } catch (error) {
        console.error('imageUriToBase64 error:', error);
        throw error;
    }
}

/**
 * Analyze room image using Gemini Vision API
 * Returns real AI analysis - NO MOCK DATA
 */
export async function analyzeRoomImage(imageUri: string): Promise<RoomAnalysis> {
    console.log('analyzeRoomImage: Starting analysis for:', imageUri);

    // Validate API key
    if (!API_KEYS.GEMINI_API_KEY) {
        throw new Error('GEMINI_API_KEY not configured. Please add EXPO_PUBLIC_GEMINI_API_KEY to .env');
    }

    console.log('analyzeRoomImage: API key present, length:', API_KEYS.GEMINI_API_KEY.length);

    // Step 1: Convert image to base64
    console.log('analyzeRoomImage: Converting image to base64...');
    const base64Image = await imageUriToBase64(imageUri);
    console.log('analyzeRoomImage: Base64 conversion successful, length:', base64Image.length);

    // Step 2: Get the generative model
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `You are an expert interior designer AI. Analyze this room image carefully and provide detailed, SPECIFIC furniture and decor suggestions based on what you actually see in the image.

IMPORTANT: Look at the ACTUAL room in the image. Describe what furniture is REALLY there, not generic examples.

Respond ONLY with a valid JSON object in this exact format (no markdown, no code blocks):
{
  "roomType": "identify the actual room type you see",
  "currentFurniture": ["list SPECIFIC furniture you can see in THIS image"],
  "colorPalette": ["main colors VISIBLE in this specific room"],
  "overallStyle": "identify the design style of THIS room",
  "suggestedAdditions": [
    {
      "category": "one of: sofa, armchair, coffee_table, lamp, rug, plant, bookshelf, artwork, curtains, side_table",
      "placement": "where in THIS room it should go",
      "priority": "high/medium/low",
      "reason": "why this would improve THIS specific room"
    }
  ],
  "improvements": ["specific improvements for THIS room"]
}

Be SPECIFIC. What do you actually SEE in this room? What furniture would ACTUALLY improve it?`;

    // Step 3: Call Gemini API
    console.log('analyzeRoomImage: Calling Gemini API...');

    const result = await model.generateContent([
        prompt,
        {
            inlineData: {
                mimeType: 'image/jpeg',
                data: base64Image,
            },
        },
    ]);

    const responseText = result.response.text();
    console.log('analyzeRoomImage: Gemini response received, length:', responseText.length);
    console.log('analyzeRoomImage: Raw response:', responseText.substring(0, 500));

    // Step 4: Parse response
    let cleanedResponse = responseText
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();

    let analysisData;
    try {
        analysisData = JSON.parse(cleanedResponse);
    } catch (parseError) {
        console.error('analyzeRoomImage: JSON parse error:', parseError);
        console.error('analyzeRoomImage: Response was:', cleanedResponse);
        throw new Error('Failed to parse AI response. The AI returned invalid JSON.');
    }

    // Step 5: Map suggestions to our format
    const suggestedAdditions: SuggestedItem[] = (analysisData.suggestedAdditions || []).map((suggestion: any, index: number) => {
        const categoryInfo = FURNITURE_CATEGORIES.find(c => c.id === suggestion.category) || {
            id: suggestion.category,
            label: suggestion.category.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
            icon: '🏠',
            description: suggestion.reason || 'Décor item',
        };

        return {
            id: `${suggestion.category}_${index}`,
            category: suggestion.category,
            label: categoryInfo.label,
            icon: categoryInfo.icon,
            description: suggestion.reason || categoryInfo.description,
            placement: suggestion.placement || 'In the room',
            priority: suggestion.priority || 'medium',
            selected: suggestion.priority === 'high',
        };
    });

    const analysis: RoomAnalysis = {
        roomType: analysisData.roomType || 'Room',
        currentFurniture: analysisData.currentFurniture || [],
        suggestedAdditions,
        colorPalette: analysisData.colorPalette || [],
        overallStyle: analysisData.overallStyle || 'Modern',
        improvements: analysisData.improvements || [],
    };

    console.log('analyzeRoomImage: Analysis complete:', {
        roomType: analysis.roomType,
        furnitureCount: analysis.currentFurniture.length,
        suggestionsCount: analysis.suggestedAdditions.length,
    });

    return analysis;
}

/**
 * Generate redesign prompt based on selected items
 */
export async function generateRedesignPrompt(
    imageUri: string,
    selectedItems: SuggestedItem[],
    designStyle: string
): Promise<RedesignResult> {
    if (!API_KEYS.GEMINI_API_KEY) {
        throw new Error('GEMINI_API_KEY not configured');
    }

    const base64Image = await imageUriToBase64(imageUri);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const selectedItemsText = selectedItems
        .map(item => `- ${item.label}: ${item.placement}`)
        .join('\n');

    const styleInfo = DESIGN_STYLES.find(s => s.id === designStyle);
    const styleName = styleInfo?.label || 'Modern';

    const prompt = `You are an expert interior designer. Based on this room image, the user wants to add the following items with a ${styleName} style:

${selectedItemsText}

Provide a detailed description of how the redesigned room would look with these additions. Include:
1. Specific furniture/item recommendations (brand-agnostic descriptions with colors, materials, sizes)
2. Exact placement within the room
3. How they complement the existing room

Also provide a visual prompt that could be used to generate an image of the redesigned room.

Respond ONLY with valid JSON (no markdown):
{
  "description": "Detailed paragraph describing the redesigned room",
  "visualPrompt": "Detailed prompt for image generation of the redesigned room",
  "recommendations": [
    {
      "item": "item name",
      "details": "specific details about the item",
      "placement": "where in the room"
    }
  ]
}`;

    const result = await model.generateContent([
        prompt,
        {
            inlineData: {
                mimeType: 'image/jpeg',
                data: base64Image,
            },
        },
    ]);

    const responseText = result.response.text();
    let cleanedResponse = responseText
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();

    const data = JSON.parse(cleanedResponse);

    return {
        success: true,
        description: data.description,
        visualPrompt: data.visualPrompt,
        selectedItems,
        styleApplied: styleName,
    };
}
