import { GoogleGenerativeAI } from '@google/generative-ai';

export type QuoteCategory = 'motivational' | 'philosophical' | 'poetic';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error('VITE_GEMINI_API_KEY environment variable is not set');
}

const genAI = new GoogleGenerativeAI(API_KEY);

export async function generateBookQuote(
  bookTitle: string,
  category: QuoteCategory
): Promise<string> {
  if (!bookTitle) {
    throw new Error('Book title is required');
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `Generate a ${category} quote that captures the essence or theme of the book "${bookTitle}". 
    The quote should be original, meaningful, and reflect the spirit of the book.
    Keep it concise (maximum 2-3 sentences) and impactful.
    Return only the quote text without any additional context or formatting.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();

    if (!text) {
      throw new Error('Generated quote is empty');
    }

    return text;
  } catch (error) {
    console.error('Error details:', {
      error,
      bookTitle,
      category,
      apiKey: API_KEY ? 'present' : 'missing'
    });
    
    if (error instanceof Error) {
      throw new Error(`Failed to generate quote: ${error.message}`);
    } else {
      throw new Error('Failed to generate quote: Unknown error');
    }
  }
}