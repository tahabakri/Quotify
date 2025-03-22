import { generateAuthor } from './generateAuthor';
import { generateQuotes } from './generateQuote';
import { generateCollections } from './generateCollection';
import { Author } from '../../types/author';
import { Quote } from '../../types/quote';
import { Collection } from '../../types/collection';

export interface GeneratedContent {
  authors: Author[];
  quotes: Quote[];
  collections: Collection[];
}

export async function generateContent(
  authorCount: number = 5,
  quotesPerAuthor: number = 5,
  collectionsCount: number = 3
): Promise<GeneratedContent> {
  // Generate authors
  const authors: Author[] = [];
  for (let i = 0; i < authorCount; i++) {
    const author = await generateAuthor();
    authors.push(author);
  }

  // Generate quotes for each author
  const allQuotes: Quote[] = [];
  for (const author of authors) {
    const authorQuotes = await generateQuotes(author, quotesPerAuthor);
    allQuotes.push(...authorQuotes);
  }

  // Generate collections from all quotes
  const collections = await generateCollections(allQuotes, collectionsCount);

  return {
    authors,
    quotes: allQuotes,
    collections
  };
}

export { generateAuthor, generateQuotes, generateCollections };