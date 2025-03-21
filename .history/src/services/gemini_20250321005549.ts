const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent';

export type QuoteCategory = 'motivational' | 'philosophical' | 'poetic';
export type QuoteDetail = 'concise' | 'detailed';

export interface GeneratedQuote {
  content: string;
  context?: string;
  tags?: string[];
}

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

/**
 * Generates quotes based on a book's title and author
 */
export async function generateBookQuotes(
  bookTitle: string,
  author: string,
  category: QuoteCategory = 'motivational',
  detail: QuoteDetail = 'concise'
): Promise<GeneratedQuote[]> {
  const isDarkMode = document.documentElement.classList.contains('dark');
  
  const prompt = `
    Generate ${detail === 'detailed' ? 'detailed' : 'short and impactful'} quotes from the book "${bookTitle}" by ${author}.
    Focus on ${category} themes.
    The quotes should reflect a ${isDarkMode ? 'deeper, more introspective' : 'brighter, more uplifting'} tone.
    Return them in this JSON format:
    [
      {
        "content": "The actual quote text",
        "context": "Brief context or chapter reference (optional)",
        "tags": ["relevant", "theme", "tags"]
      }
    ]
  `;

  try {
    const response = await fetch(`${API_ENDPOINT}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    if (!response.ok) {
      throw new Error('Failed to generate quotes');
    }

    const data: GeminiResponse = await response.json();
    const generatedText = data.candidates[0]?.content.parts[0]?.text;

    if (!generatedText) {
      throw new Error('No quotes generated');
    }

    // Extract JSON from the response
    const jsonMatch = generatedText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('Invalid response format');
    }

    const quotes: GeneratedQuote[] = JSON.parse(jsonMatch[0]);
    return quotes.map(quote => ({
      ...quote,
      tags: [...(quote.tags || []), category],
    }));
  } catch (error) {
    console.error('Quote generation error:', error);
    throw error;
  }
}

/**
 * Enhances image generation prompts based on the given text
 */
export async function enhanceImagePrompt(
  text: string,
  style: string,
  mood: string
): Promise<string> {
  const prompt = `
    Enhance this text for image generation: "${text}"
    Style: ${style}
    Mood: ${mood}
    Create a detailed visual description that captures the essence of the text
    while maintaining the specified style and mood. Focus on visual elements,
    composition, and atmosphere.
  `;

  try {
    const response = await fetch(`${API_ENDPOINT}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    if (!response.ok) {
      throw new Error('Failed to enhance prompt');
    }

    const data: GeminiResponse = await response.json();
    return data.candidates[0]?.content.parts[0]?.text || text;
  } catch (error) {
    console.error('Prompt enhancement error:', error);
    return text; // Fall back to original text if enhancement fails
  }
}