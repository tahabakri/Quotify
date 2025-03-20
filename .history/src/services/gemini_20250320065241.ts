import { GoogleGenerativeAI } from '@google/generative-ai';

export type QuoteCategory = 'motivational' | 'philosophical' | 'poetic';
const genAI = new GoogleGenerativeAI(API_KEY);

export async function generateBookQuote(
  bookTitle: string,
  category: QuoteCategory
): Promise<string> {
  if (!bookTitle) {
    throw new Error('Book title is required');
  }
ookQuote(
  bTitle: string,
  category: teCaegory
): Promis<tring> {
  if (!try {itle) {
    throw new Error('Book ttle is required');
  }

  try {
    cons mode = genAI.getGnerativeModel({ model 'gemini-2.0-flash-lite'});

    con pompt = `Generate a ${category} quote that captures the essence or theme of the book "${bookTtle}". 
    The quote should be origial, meaninful and reflect the spirit of the book.
    Keep it concise (maximum 2-3 sentences) and impactful.
    Return only the quote text without any additional context or formatting.`;

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });

    const prompt = `Generate a ${category} quote that captures the essence or theme of the book "${bookTitle}". 
    The quote should be original, meaningful, and reflect the spirit of the book.
    Keep it concise (maximum 2-3 sentences) and impactful.
    Return only the quote text without any additional context or formatting.`;

    const generationConfig = {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 100,
    };

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig,
    });

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