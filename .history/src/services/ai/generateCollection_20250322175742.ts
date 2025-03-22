import { GoogleGenerativeAI } from '@google/generative-ai';
import { Collection } from '../../types/collection';
import { Quote } from '../../types/quote';
import { v4 as uuidv4 } from 'uuid';
import { getPlaceholderImages } from './imageUtils';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

interface GeneratedCollectionData {
  name: string;
  description: string;
  tags: string[];
  theme?: {
    backgroundColor: string;
    textColor: string;
    fontFamily?: string;
  };
}

export async function generateCollection(quotes: Quote[]): Promise<Collection> {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  // Create a summary of the quotes to help generate a relevant collection
  const quoteSummary = quotes.map(q => ({
    content: q.content,
    author: q.author.name,
    tags: q.tags
  }));

  const prompt = `Given these quotes:
  ${JSON.stringify(quoteSummary, null, 2)}
  
  Generate a collection theme that would meaningfully group these quotes together.
  Provide the response in JSON format:
  {
    "name": "Collection name",
    "description": "Collection description explaining the theme",
    "tags": ["relevant", "thematic", "tags"],
    "theme": {
      "backgroundColor": "CSS color (optional)",
      "textColor": "CSS color (optional)",
      "fontFamily": "Font family name (optional)"
    }
  }
  
  Make the collection theme cohesive and meaningful to the quotes' content.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  
  // Parse the JSON response
  const collectionData = JSON.parse(text) as GeneratedCollectionData;

  // Generate placeholder images
  const images = getPlaceholderImages(collectionData.name);

  // Create an AI curator identity
  const curatorId = uuidv4();
  const curatorName = `AI Curator ${curatorId.slice(0, 4)}`;
  const curatorImages = getPlaceholderImages(curatorName);

  const collection: Collection = {
    id: uuidv4(),
    name: collectionData.name,
    description: collectionData.description,
    coverImage: images.collectionCover,
    curatorId: curatorId,
    curator: {
      id: curatorId,
      name: curatorName,
      imageUrl: curatorImages.curatorAvatar
    },
    isPublic: true,
    isFeatured: false,
    quotes: quotes,
    quoteCount: quotes.length,
    followers: 0,
    tags: collectionData.tags,
    theme: collectionData.theme,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  return collection;
}

export async function generateCollections(quotes: Quote[], count: number = 3): Promise<Collection[]> {
  const collections: Collection[] = [];
  
  // Split quotes into groups for each collection
  const quotesPerCollection = Math.ceil(quotes.length / count);
  
  for (let i = 0; i < count; i++) {
    const collectionQuotes = quotes.slice(
      i * quotesPerCollection, 
      (i + 1) * quotesPerCollection
    );
    
    if (collectionQuotes.length > 0) {
      const collection = await generateCollection(collectionQuotes);
      collections.push(collection);
    }
  }
  
  return collections;
}