import { GoogleGenerativeAI } from '@google/generative-ai';

export type QuoteCategory = 'motivational' | 'philosophical' | 'poetic';

const genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY || '');

export async function generateBookQuote(
  bookTitle: string,
  category: QuoteCategory
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `Generate a ${category} quote that captures the essence or theme of the book "${bookTitle}". 
    The quote should be original, meaningful, and reflect the spirit of the book.
    Keep it concise (maximum 2-3 sentences) and impactful.
    Return only the quote text without any additional context or formatting.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error('Error generating quote:', error);
    throw new Error('Failed to generate quote');
  }
}