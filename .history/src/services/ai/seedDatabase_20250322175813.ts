import { generateContent } from './index';
import { supabase } from '../supabase/client';

interface SeedResult {
  authorCount: number;
  quoteCount: number;
  collectionCount: number;
  errors?: {
    type: string;
    count: number;
    examples: string[];
  }[];
}

export async function seedDatabaseWithAIContent(
  authorCount: number = 10,
  quotesPerAuthor: number = 10,
  collectionsCount: number = 5
): Promise<SeedResult> {
  const errors: SeedResult['errors'] = [];
  let errorCount = 0;

  try {
    console.log('Generating AI content...');
    const content = await generateContent(authorCount, quotesPerAuthor, collectionsCount);
    
    // Track image loading errors
    const imageErrors: string[] = [];
    const trackImageError = (url: string) => {
      imageErrors.push(url);
      errorCount++;
    };

    // Add error listeners for images
    content.authors.forEach(author => {
      if (author.imageUrl) {
        const img = new Image();
        img.onerror = () => trackImageError(author.imageUrl!);
        img.src = author.imageUrl;
      }
      author.notableWorks?.forEach(work => {
        if (work.imageUrl) {
          const img = new Image();
          img.onerror = () => trackImageError(work.imageUrl!);
          img.src = work.imageUrl;
        }
      });
    });

    content.collections.forEach(collection => {
      if (collection.coverImage) {
        const img = new Image();
        img.onerror = () => trackImageError(collection.coverImage!);
        img.src = collection.coverImage;
      }
      if (collection.curator.imageUrl) {
        const img = new Image();
        img.onerror = () => trackImageError(collection.curator.imageUrl!);
        img.src = collection.curator.imageUrl;
      }
    });

    if (imageErrors.length > 0) {
      errors.push({
        type: 'image_loading',
        count: imageErrors.length,
        examples: imageErrors.slice(0, 5) // Show first 5 examples
      });
    }

    console.log('Inserting authors...');
    const { error: authorsError } = await supabase
      .from('authors')
      .insert(content.authors);
    
    if (authorsError) {
      errors.push({
        type: 'database_authors',
        count: 1,
        examples: [authorsError.message]
      });
      throw authorsError;
    }

    console.log('Inserting quotes...');
    const { error: quotesError } = await supabase
      .from('quotes')
      .insert(content.quotes);
    
    if (quotesError) {
      errors.push({
        type: 'database_quotes',
        count: 1,
        examples: [quotesError.message]
      });
      throw quotesError;
    }

    console.log('Inserting collections...');
    const { error: collectionsError } = await supabase
      .from('collections')
      .insert(content.collections);
    
    if (collectionsError) {
      errors.push({
        type: 'database_collections',
        count: 1,
        examples: [collectionsError.message]
      });
      throw collectionsError;
    }

    // Insert collection_quotes relationships
    const collectionQuotes = content.collections.flatMap(collection =>
      collection.quotes.map(quote => ({
        collection_id: collection.id,
        quote_id: quote.id
      }))
    );

    console.log('Inserting collection-quote relationships...');
    const { error: relationshipsError } = await supabase
      .from('collection_quotes')
      .insert(collectionQuotes);
    
    if (relationshipsError) {
      errors.push({
        type: 'database_relationships',
        count: 1,
        examples: [relationshipsError.message]
      });
      throw relationshipsError;
    }

    console.log('Database seeded successfully!');
    const result: SeedResult = {
      authorCount: content.authors.length,
      quoteCount: content.quotes.length,
      collectionCount: content.collections.length
    };

    if (errors.length > 0) {
      result.errors = errors;
    }

    return result;

  } catch (error) {
    console.error('Error seeding database:', error);
    errors.push({
      type: 'unexpected_error',
      count: 1,
      examples: [error instanceof Error ? error.message : 'Unknown error']
    });
    
    return {
      authorCount: 0,
      quoteCount: 0,
      collectionCount: 0,
      errors
    };
  }
}