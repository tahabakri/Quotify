import { GoogleGenerativeAI } from '@google/generative-ai';
import { Author } from '../../types/author';
import { v4 as uuidv4 } from 'uuid';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

interface GeneratedAuthorData {
  name: string;
  biography: string;
  notableWorks: {
    title: string;
    year: number;
  }[];
  birthDate: string;
  deathDate: string | null;
  nationality: string;
  genres: string[];
}

export async function generateAuthor(): Promise<Author> {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `Generate a random author profile with the following details in JSON format:
{
  "name": "Author's full name",
  "biography": "1-2 paragraphs biography",
  "notableWorks": [
    {
      "title": "Work title",
      "year": publication year
    }
  ],
  "birthDate": "YYYY-MM-DD",
  "deathDate": "YYYY-MM-DD" (optional, null if still alive),
  "nationality": "Author's nationality",
  "genres": ["genre1", "genre2"]
}`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  
  // Parse the JSON response
  const authorData = JSON.parse(text) as GeneratedAuthorData;

  const author: Author = {
    id: uuidv4(),
    name: authorData.name,
    bio: authorData.biography,
    notableWorks: authorData.notableWorks.map(work => ({
      id: uuidv4(),
      title: work.title,
      year: work.year,
    })),
    birthDate: authorData.birthDate,
    deathDate: authorData.deathDate || undefined,
    nationality: authorData.nationality,
    genres: authorData.genres,
    followers: Math.floor(Math.random() * 10000),
    quotesCount: Math.floor(Math.random() * 100),
    worksCount: authorData.notableWorks.length,
    wikipediaUrl: `https://wikipedia.org/wiki/${authorData.name.replace(/\s+/g, '_')}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  return author;
}