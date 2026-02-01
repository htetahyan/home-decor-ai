// Replicate AI Service for Image Generation
// Uses google/nano-banana model for room redesign generation

const REPLICATE_API_URL = 'https://api.replicate.com/v1';

interface ReplicatePrediction {
    id: string;
    status: 'starting' | 'processing' | 'succeeded' | 'failed' | 'canceled';
    output?: string[];
    error?: string;
    urls?: {
        get: string;
        cancel: string;
    };
}

interface GenerateImageInput {
    prompt: string;
    imageUrls: string[]; // Public URLs of input images
}

/**
 * Get Replicate API token from environment
 */
function getApiToken(): string {
    const token = process.env.EXPO_PUBLIC_REPLICATE_API_TOKEN;
    if (!token) {
        throw new Error('REPLICATE_API_TOKEN not configured');
    }
    return token;
}

/**
 * Create a prediction with Replicate's redesign model
 */
export async function createImagePrediction(input: GenerateImageInput): Promise<ReplicatePrediction> {
    const token = getApiToken();

    // Using a more reliable model for interior design
    // fotor-ai/interior-design or jagermesh/controlnet-hough are good choices
    const model = 'jagermesh/controlnet-hough:854e9619a941216d3f28d844c8d5570b5550a241';

    const response = await fetch(`${REPLICATE_API_URL}/predictions`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            version: '854e9619a941216d3f28d844c8d5570b5550a241',
            input: {
                image: input.imageUrls[0],
                prompt: input.prompt,
                num_samples: 1,
                image_resolution: '512',
                ddim_steps: 20,
                scale: 9,
                eta: 0,
                a_prompt: 'best quality, extremely detailed, interior design, cinematic photo, 8k uhd, photorealistic',
                n_prompt: 'longbody, lowres, bad anatomy, bad hands, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality',
            },
        }),
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Replicate API error: ${response.status} - ${error}`);
    }

    return response.json();
}

/**
 * Poll for prediction result (if not using Prefer: wait)
 */
export async function getPredictionStatus(predictionId: string): Promise<ReplicatePrediction> {
    const token = getApiToken();

    const response = await fetch(`${REPLICATE_API_URL}/predictions/${predictionId}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to get prediction status: ${response.status}`);
    }

    return response.json();
}

/**
 * Wait for prediction to complete with polling
 */
export async function waitForPrediction(
    predictionId: string,
    maxWaitMs: number = 120000,
    pollIntervalMs: number = 2000
): Promise<ReplicatePrediction> {
    const startTime = Date.now();

    while (Date.now() - startTime < maxWaitMs) {
        const prediction = await getPredictionStatus(predictionId);

        if (prediction.status === 'succeeded') {
            return prediction;
        }

        if (prediction.status === 'failed' || prediction.status === 'canceled') {
            throw new Error(prediction.error || 'Prediction failed');
        }

        // Wait before polling again
        await new Promise(resolve => setTimeout(resolve, pollIntervalMs));
    }

    throw new Error('Prediction timed out');
}

/**
 * Generate a redesigned room image
 * @param roomImageUrl - Public URL of the original room image
 * @param prompt - Description of desired changes
 * @param styleImageUrl - Optional style reference image URL
 */
export async function generateRedesignedRoom(
    roomImageUrl: string,
    prompt: string,
    styleImageUrl?: string
): Promise<{ success: boolean; imageUrl?: string; error?: string }> {
    try {
        const imageUrls = styleImageUrl
            ? [roomImageUrl, styleImageUrl]
            : [roomImageUrl];

        const prediction = await createImagePrediction({
            prompt,
            imageUrls,
        });

        // If status is already succeeded (due to Prefer: wait header)
        if (prediction.status === 'succeeded' && prediction.output?.length) {
            return {
                success: true,
                imageUrl: prediction.output[0],
            };
        }

        // Otherwise poll for result
        if (prediction.id) {
            const result = await waitForPrediction(prediction.id);
            if (result.output?.length) {
                return {
                    success: true,
                    imageUrl: result.output[0],
                };
            }
        }

        return {
            success: false,
            error: 'No output generated',
        };
    } catch (error: any) {
        console.error('Replicate generation error:', error);
        return {
            success: false,
            error: error.message || 'Image generation failed',
        };
    }
}

/**
 * Build a detailed prompt for room redesign
 */
export function buildRedesignPrompt(
    roomType: string,
    style: string,
    selectedItems: string[],
    improvements: string[]
): string {
    const itemsList = selectedItems.join(', ');
    const tipsText = improvements.length > 0
        ? `Additional improvements: ${improvements.join('. ')}.`
        : '';

    return `Redesign this ${roomType} in a ${style} style. Add the following furniture and decor: ${itemsList}. Make the scene look natural and professionally designed with proper lighting and composition. ${tipsText}`;
}
