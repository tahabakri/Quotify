import { useEffect, useState } from 'react';
import { CollectionCard } from '../CollectionCard/CollectionCard';
import { Collection } from '../../types/quote';
import { supabase } from '../../services/supabase/client';

interface CollectionsGridProps {
  featured?: boolean;
  userId?: string;
  limit?: number;
}

export function CollectionsGrid({ featured, userId, limit = 12 }: CollectionsGridProps) {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCollections() {
      try {
        setLoading(true);
        
        let query = supabase
          .from('collections')
          .select(`
            *,
            curator:profiles(username),
            quotes:quotes(count)
          `);

        if (featured) {
          query = query.eq('featured', true);
        }

        if (userId) {
          query = query.eq('curator_id', userId);
        }

        query = query.limit(limit);

        const { data, error } = await query;

        if (error) throw error;

        const formattedCollections: Collection[] = data.map(item => ({
          id: item.id,
          name: item.name,
          description: item.description,
          quotes: item.quotes,
          coverImage: item.cover_image,
          curator: item.curator?.username || 'Unknown',
          quoteCount: item.quotes?.length || 0
        }));

        setCollections(formattedCollections);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch collections');
      } finally {
        setLoading(false);
      }
    }

    fetchCollections();
  }, [featured, userId, limit]);

  const handleShare = async (collection: Collection) => {
    try {
      await navigator.share({
        title: collection.name,
        text: collection.description,
        url: `${window.location.origin}/collections/${collection.id}`,
      });
    } catch (error) {
      console.error('Error sharing collection:', error);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse">
        {Array.from({ length: limit }).map((_, i) => (
          <div
            key={i}
            className="bg-gray-100 dark:bg-gray-800 rounded-lg h-64"
          />
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
      <div className="text-center py-12 text-gray-600 dark:text-gray-400">
        {userId ? 'No collections found' : 'No featured collections available'}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {collections.map(collection => (
        <CollectionCard
          key={collection.id}
          collection={collection}
          onShare={() => handleShare(collection)}
        />
      ))}
    </div>
  );
}