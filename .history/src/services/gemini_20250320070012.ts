import { GoogleGenerativeAI } from '@google/generative-ai';

export type QuoteCategory = 'motivational' | 'philosophical' | 'poetic';
export type QuoteDetail = 'concise' | 'detailed';

export interface GeneratedQuote {
  content: string;
  category: QuoteCategory;
  isDetailed: boolean;
}

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error('VITE_GEMINI_API_KEY environment variable is not set');
}

const genAI = new GoogleGenerativeAI(API_KEY);

export async function generateBookQuotes(
  bookTitle: string,
  author: string,
  category: QuoteCategory,
  detail: QuoteDetail = 'concise',
  count: number = 5
): Promise<GeneratedQuote[]> {
  if (!bookTitle) {
    throw new Error('Book title is required');
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });

    const prompt = `Generate ${count} unique ${category} quotes inspired by the book "${bookTitle}" by ${author}.
    Each quote should be ${detail === 'detailed' ? 'thoughtful and elaborate (3-4 sentences)' : 'concise and impactful (1-2 sentences)'}.
    The quotes should reflect the themes, messages, and emotions of the book.
    Format the response as a list of quotes, one per line.
    Return only the quotes without any additional context or formatting.`;

    const generationConfig = {
      temperature: 0.8,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: detail === 'detailed' ? 500 : 300,
    };

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig,
    });

    const response = await result.response;
    const text = response.text().trim();

    if (!text) {
      throw new Error('Generated quotes are empty');
    }

    // Split the response into individual quotes and format them
    const quotes = text.split('\n')
      .map(quote => quote.trim())
      .filter(quote => quote.length > 0)
      .map(content => ({
        content,
        category,
        isDetailed: detail === 'detailed'
      }));

    if (quotes.length === 0) {
      throw new Error('No valid quotes were generated');
    }

    return quotes;
  } catch (error) {
    console.error('Error details:', {
      error,
      bookTitle,
      author,
      category,
      detail,
      apiKey: API_KEY ? 'present' : 'missing'
    });
    
    if (error instanceof Error) {
      throw new Error(`Failed to generate quotes: ${error.message}`);
    } else {
      throw new Error('Failed to generate quotes: Unknown error');
    }
  }
}