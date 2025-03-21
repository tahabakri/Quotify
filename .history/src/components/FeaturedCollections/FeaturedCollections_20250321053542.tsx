import { useEffect, useState } from 'react';
import { Collection } from '../../types/quote';
import { supabase } from '../../services/supabase/client';
import { FiBookOpen } from 'react-icons/fi';

interface FeaturedCollectionsProps {
  limit?: number;
}

export function FeaturedCollections({ limit = 3 }: FeaturedCollectionsProps) {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFeaturedCollections() {
      try {
        const { data, error } = await supabase
          .from('collections')
          .select('*')
          .eq('featured', true)
          .limit(limit);

        if (error) throw error;

        setCollections(data as Collection[]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch collections');
      } finally {
        setLoading(false);
      }
    }

    fetchFeaturedCollections();
  }, [limit]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Placeholder collections */}
        {[
          {
            name: 'Philosophical Wisdom',
            description: 'Deep insights from great thinkers',
            quoteCount: 42
          },
          {
            name: 'Inspiring Women',
            description: 'Powerful quotes by influential women',
            quoteCount: 35
          },
          {
            name: 'Modern Literature',
            description: 'Contemporary literary excellence',
            quoteCount: 28
          }
        ].map((collection, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {collection.name}
              </h3>
              <FiBookOpen className="text-gray-500 dark:text-gray-400" size={20} />
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {collection.description}
            </p>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {collection.quoteCount} quotes
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {collections.map((collection) => (
        <div
          key={collection.id}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {collection.name}
            </h3>
            <FiBookOpen className="text-gray-500 dark:text-gray-400" size={20} />
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {collection.description}
          </p>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {collection.quoteCount} quotes
          </div>
        </div>
      ))}
    </div>
  );
}