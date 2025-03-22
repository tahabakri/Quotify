import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Google Generative AI with your API key
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

interface GeneratedQuote {
  text: string;
  author: {
    id: string;
    name: string;
  };
  book?: {
    id: string;
    title: string;
  };
}

export interface QuoteParams {
  topic?: string;
  author?: string;
  mood?: string;
  genre?: string;
}

export async function generateQuote(params: QuoteParams = {}): Promise<GeneratedQuote> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // Construct the prompt based on parameters
    let prompt = 'Generate an inspiring quote';
    if (params.topic) prompt += ` about ${params.topic}`;
    if (params.mood) prompt += ` with a ${params.mood} mood`;
    if (params.author) prompt += ` by ${params.author}`;
    if (params.genre) prompt += ` from the ${params.genre} genre`;
    
    prompt += `. Return it in JSON format with the following structure: 
    {
      "text": "the quote text",
      "author": {
        "id": "unique-id",
        "name": "author name"
      },
      "book": {
        "id": "book-id",
        "title": "book title"
      }
    }`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const textContent = response.text();
    
    // Parse the JSON response
    const quoteData = JSON.parse(textContent);

    return {
      text: quoteData.text,
      author: {
        id: quoteData.author.id,
        name: quoteData.author.name
      },
      book: quoteData.book ? {
        id: quoteData.book.id,
        title: quoteData.book.title
      } : undefined
    };
  } catch (error) {
    console.error('Error generating quote:', error);
    throw new Error('Failed to generate quote');
  }
}

export async function generateQuoteOfTheDay(): Promise<GeneratedQuote> {
  const topics = [
    'wisdom', 'success', 'happiness', 'courage', 'love',
    'perseverance', 'growth', 'inspiration', 'leadership'
  ];
  
  // Get a random topic
  const randomTopic = topics[Math.floor(Math.random() * topics.length)];
  
  return generateQuote({ topic: randomTopic });
}

export async function generateQuotesBatch(count: number, params: QuoteParams = {}): Promise<GeneratedQuote[]> {
  const quotes = [];
  for (let i = 0; i < count; i++) {
    const quote = await generateQuote(params);
    quotes.push(quote);
  }
  return quotes;
}

export async function generateAuthorQuotes(authorName: string, count: number = 3): Promise<GeneratedQuote[]> {
  return generateQuotesBatch(count, { author: authorName });
}