import { useEffect, useState } from 'react';
import { Collection } from '../../types/quote';
import { supabase } from '../../services/supabase/client';
import { FiBookOpen, FiBookmark } from 'react-icons/fi';

interface FeaturedCollectionsProps {
  limit?: number;
  filter?: 'featured' | 'genre' | 'recent';
}

export function FeaturedCollections({ limit = 3, filter = 'featured' }: FeaturedCollectionsProps) {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCollections() {
      try {
        let query = supabase
          .from('collections')
          .select('*, quotes:quotes(count)');

        // Apply filters
        switch (filter) {
          case 'genre':
            query = query
              .not('genre', 'is', null)
              .order('quotes', { ascending: false });
            break;
          case 'recent':
            query = query.order('created_at', { ascending: false });
            break;
          case 'featured':
          default:
            query = query.eq('featured', true);
            break;
        }

        const { data, error } = await query.limit(limit);

        if (error) throw error;

        setCollections(data as Collection[]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch collections');
      } finally {
        setLoading(false);
      }
    }

    fetchCollections();
  }, [limit, filter]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-pulse">
        {Array.from({ length: limit }).map((_, i) => (
          <div key={i} className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 h-48" />
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

  if (collections.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Placeholder collections */}
        {[
          {
            name: 'Science Fiction',
            description: 'Mind-bending quotes from sci-fi classics',
            quoteCount: 42,
            imageUrl: '/images/collections/scifi.jpg'
          },
          {
            name: 'Romance',
            description: 'Timeless expressions of love',
            quoteCount: 35,
            imageUrl: '/images/collections/romance.jpg'
          },
          {
            name: 'Philosophy',
            description: 'Deep thoughts from great thinkers',
            quoteCount: 28,
            imageUrl: '/images/collections/philosophy.jpg'
          },
          {
            name: 'Poetry',
            description: 'Beautiful verses and lyrical expressions',
            quoteCount: 56,
            imageUrl: '/images/collections/poetry.jpg'
          }
        ].slice(0, limit).map((collection, index) => (
          <div
            key={index}
            className="group relative bg-gradient-to-br from-blue-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-md hover:shadow-lg transition-all p-6 overflow-hidden"
          >
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {collection.name}
                </h3>
                <FiBookmark className="text-gray-400 dark:text-gray-500 group-hover:text-blue-500 transition-colors" size={20} />
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                {collection.description}
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <FiBookOpen />
                <span>{collection.quoteCount} quotes</span>
              </div>
            </div>
            {collection.imageUrl && (
              <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity">
                <img
                  src={collection.imageUrl}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {collections.map((collection) => (
        <div
          key={collection.id}
          className="group relative bg-gradient-to-br from-blue-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-md hover:shadow-lg transition-all p-6 overflow-hidden"
        >
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {collection.name}
              </h3>
              <FiBookmark className="text-gray-400 dark:text-gray-500 group-hover:text-blue-500 transition-colors" size={20} />
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
              {collection.description}
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <FiBookOpen />
              <span>{collection.quoteCount} quotes</span>
            </div>
          </div>
          {collection.imageUrl && (
            <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity">
              <img
                src={collection.imageUrl}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}