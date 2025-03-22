import OpenAI from 'openai';
import { Author } from '../../types/author';
import { v4 as uuidv4 } from 'uuid';

const openai = new OpenAI({
  apiKey: process.env.VITE_OPENAI_API_KEY,
});

export async function generateAuthor(): Promise<Author> {
  const prompt = `Generate a random author profile with the following details:
- Name (realistic author name)
- Short biography (1-2 paragraphs)
- 2-3 notable works (books or publications)
- Birth date (YYYY-MM-DD format)
- Death date (if applicable, YYYY-MM-DD format)
- Nationality
- 2-3 literary genres they write in
- A brief description of their writing style and themes`;

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "You are a literary database curator. Generate detailed, realistic author profiles in JSON format."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    response_format: { type: "json_object" },
    temperature: 0.8
  });

  const authorData = JSON.parse(response.choices[0].message.content);

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
    deathDate: authorData.deathDate,
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