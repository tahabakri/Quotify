import { generateContent } from './index';
import { supabase } from '../supabase/client';

export async function seedDatabaseWithAIContent(
  authorCount: number = 10,
  quotesPerAuthor: number = 10,
  collectionsCount: number = 5
) {
  try {
    console.log('Generating AI content...');
    const content = await generateContent(authorCount, quotesPerAuthor, collectionsCount);
    
    console.log('Inserting authors...');
    const { error: authorsError } = await supabase
      .from('authors')
      .insert(content.authors);
    
    if (authorsError) throw authorsError;

    console.log('Inserting quotes...');
    const { error: quotesError } = await supabase
      .from('quotes')
      .insert(content.quotes);
    
    if (quotesError) throw quotesError;

    console.log('Inserting collections...');
    const { error: collectionsError } = await supabase
      .from('collections')
      .insert(content.collections);
    
    if (collectionsError) throw collectionsError;

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
    
    if (relationshipsError) throw relationshipsError;

    console.log('Database seeded successfully!');
    return {
      authorCount: content.authors.length,
      quoteCount: content.quotes.length,
      collectionCount: content.collections.length
    };
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

// Example usage in development:
// if (import.meta.env.DEV) {
//   seedDatabaseWithAIContent()
//     .then(console.log)
//     .catch(console.error);
// }