import { useEffect, useState } from 'react';
import { Author } from '../../types/author';
import { supabase } from '../../services/supabase/client';
import { FiUser } from 'react-icons/fi';

interface AuthorsGridProps {
  limit?: number;
}

export function AuthorsGrid({ limit = 8 }: AuthorsGridProps) {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPopularAuthors() {
      try {
        const { data, error } = await supabase
          .from('authors')
          .select('*')
          .order('followers', { ascending: false })
          .limit(limit);

        if (error) throw error;

        setAuthors(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch authors');
      } finally {
        setLoading(false);
      }
    }

    fetchPopularAuthors();
  }, [limit]);

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
        {Array.from({ length: limit }).map((_, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700 mb-3" />
            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  if (authors.length === 0) {
    // Placeholder authors with complete Author type
    const placeholderAuthors: Author[] = [
      {
        id: '1',
        name: "Jane Austen",
        imageUrl: "/images/authors/jane-austen.jpg",
        followers: 125000,
        quotesCount: 500,
        worksCount: 7,
        genres: ["Romance", "Social Commentary"],
        nationality: "British",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '2',
        name: "George Orwell",
        imageUrl: "/images/authors/george-orwell.jpg",
        followers: 98000,
        quotesCount: 450,
        worksCount: 9,
        genres: ["Political Fiction", "Dystopian"],
        nationality: "British",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '3',
        name: "Virginia Woolf",
        imageUrl: "/images/authors/virginia-woolf.jpg",
        followers: 87000,
        quotesCount: 400,
        worksCount: 12,
        genres: ["Modernist", "Fiction"],
        nationality: "British",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '4',
        name: "Ernest Hemingway",
        imageUrl: "/images/authors/ernest-hemingway.jpg",
        followers: 76000,
        quotesCount: 350,
        worksCount: 15,
        genres: ["Literary Fiction", "War Literature"],
        nationality: "American",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '5',
        name: "Oscar Wilde",
        imageUrl: "/images/authors/oscar-wilde.jpg",
        followers: 65000,
        quotesCount: 300,
        worksCount: 8,
        genres: ["Drama", "Poetry"],
        nationality: "Irish",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '6',
        name: "Emily Dickinson",
        imageUrl: "/images/authors/emily-dickinson.jpg",
        followers: 54000,
        quotesCount: 250,
        worksCount: 5,
        genres: ["Poetry"],
        nationality: "American",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '7',
        name: "Franz Kafka",
        imageUrl: "/images/authors/franz-kafka.jpg",
        followers: 43000,
        quotesCount: 200,
        worksCount: 6,
        genres: ["Absurdist Fiction", "Modernist"],
        nationality: "Czech",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '8',
        name: "Maya Angelou",
        imageUrl: "/images/authors/maya-angelou.jpg",
        followers: 32000,
        quotesCount: 150,
        worksCount: 10,
        genres: ["Poetry", "Autobiography"],
        nationality: "American",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    return renderAuthorsGrid(placeholderAuthors.slice(0, limit));
  }

  return renderAuthorsGrid(authors);
}

function renderAuthorsGrid(authors: Author[]) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {authors.map((author) => (
        <div
          key={author.id}
          className="group flex flex-col items-center text-center"
        >
          <div className="relative mb-3">
            {author.imageUrl ? (
              <img
                src={author.imageUrl}
                alt={author.name}
                className="w-20 h-20 rounded-full object-cover group-hover:ring-4 ring-blue-100 dark:ring-blue-900 transition-all"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center group-hover:ring-4 ring-blue-100 dark:ring-blue-900 transition-all">
                <FiUser className="w-8 h-8 text-gray-400 dark:text-gray-600" />
              </div>
            )}
          </div>
          <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {author.name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {author.followers.toLocaleString()} followers
          </p>
        </div>
      ))}
    </div>
  );
}