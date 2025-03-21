/**
 * DeepAI Image Generator Client
 *
 * This service creates an image from scratch from a text description.
 *
 * cURL Examples:
 *
 * # Example posting a text URL:
 * curl \
 *     -F 'text=YOUR_TEXT_URL' \
 *     -H 'api-key: YOUR_API_KEY' \
 *     https://api.deepai.org/api/text2img
 *
 * # Example posting a local text file:
 * curl \
 *     -F 'text=@path/to/your/file.txt' \
 *     -H 'api-key: YOUR_API_KEY' \
 *     https://api.deepai.org/api/text2img
 *
 * # Example directly sending a text string:
 * curl \
 *     -F 'text=YOUR_TEXT_HERE' \
 *     -H 'api-key: YOUR_API_KEY' \
 *     https://api.deepai.org/api/text2img
 *
 * JavaScript Examples:
 *
 * // Posting a text string:
 * (async function() {
 *     const resp = await fetch('https://api.deepai.org/api/text2img', {
 *         method: 'POST',
 *         headers: {
 *             'Content-Type': 'application/json',
 *             'api-key': 'YOUR_API_KEY'
 *         },
 *         body: JSON.stringify({
 *             text: "YOUR_TEXT_HERE",
 *         })
 *     });
 *
 *     const data = await resp.json();
 *     console.log(data);
 * })();
 */
import type { ImageGenerationOptions, GenerationResult } from './types';

const API_KEY = import.meta.env.VITE_DEEPAI_API_KEY;
const API_ENDPOINT = 'https://api.deepai.org/api/text2img';

export class DeepAIClient {
  private async makeRequest(endpoint: string, body: any) {
    const response = await fetch(`${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': API_KEY,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Failed to generate image');
    }

    return response.json();
  }

  async generateImage(text: string, options: ImageGenerationOptions): Promise<GenerationResult> {
    const { type, style, mood } = options;

    // Adjust prompt based on dark mode theme
    const isDark = mood === 'dark' || document.documentElement.classList.contains('dark');
    const themeAdjustment = isDark ? 
      'dark atmosphere, deep shadows, rich dark colors' : 
      'bright atmosphere, soft lighting, vibrant colors';

    // Build the prompt with style and theme considerations
    const stylePrompt = {
      modern: 'contemporary style, minimalist design',
      classic: 'traditional style, timeless design',
      minimal: 'clean lines, simple composition',
    }[style || 'modern'];

    const fullPrompt = `
      ${text}
      Style: ${stylePrompt}
      Atmosphere: ${themeAdjustment}
      High quality, detailed image
    `.trim();

    try {
      const result = await this.makeRequest(API_ENDPOINT, {
        text: fullPrompt,
        grid_size: 1,
        width: 1024,
        height: 768,
      });

      return {
        imageUrl: result.output_url,
        prompt: fullPrompt,
      };
    } catch (error) {
      console.error('DeepAI generation error:', error);
      throw error;
    }
  }
}

export const deepAiClient = new DeepAIClient();