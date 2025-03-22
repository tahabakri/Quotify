import { GoogleGenerativeAI } from '@google/generative-ai';
import { Quote } from '../../types/quote';
import { Author } from '../../types/author';
import { v4 as uuidv4 } from 'uuid';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

interface GeneratedQuoteData {
  content: string;
  source?: string;
  book?: {
    title: string;
  };
  tags: string[];
}

export async function generateQuote(author: Author): Promise<Quote> {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const genreContext = author.genres?.length 
    ? `who writes in genres: ${author.genres.join(', ')}`
    : '';

  const prompt = `Generate a quote that could be attributed to ${author.name}${genreContext ? ', ' + genreContext : ''}. 
  Provide the response in JSON format:
  {
    "content": "The quote text",
    "source": "Optional source context",
    "book": {
      "title": "Book title if from a book"
    },
    "tags": ["relevant", "thematic", "tags"]
  }
  
  Make the quote feel authentic to the author's style and themes.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  
  // Parse the JSON response
  const quoteData = JSON.parse(text) as GeneratedQuoteData;

  const quote: Quote = {
    id: uuidv4(),
    content: quoteData.content,
    authorId: author.id,
    author: author,
    source: quoteData.source,
    book: quoteData.book ? {
      id: uuidv4(),
      title: quoteData.book.title
    } : undefined,
    tags: quoteData.tags,
    likes: Math.floor(Math.random() * 1000),
    shares: Math.floor(Math.random() * 500),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  return quote;
}

export async function generateQuotes(author: Author, count: number = 5): Promise<Quote[]> {
  const quotes: Quote[] = [];
  
  for (let i = 0; i < count; i++) {
    const quote = await generateQuote(author);
    quotes.push(quote);
  }
  
  return quotes;
}