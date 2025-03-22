import React, { useEffect, useState } from 'react';
import { Collection } from '../types/collection';
import { CollectionCard, CollectionCardSkeleton } from '../components/collection/CollectionCard';
import { ErrorMessage } from '../components/common/ErrorMessage';

const CollectionsPage: React.FC = () => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        setLoading(true);
        setError(null);
        // TODO: Replace with actual API call
        const response = await new Promise<Collection[]>((resolve) =>
          setTimeout(() => resolve([
            {
              id: '1',
              name: 'Historical Wisdom',
              description: 'Timeless quotes from great thinkers and leaders throughout history.',
              curatorId: '1',
              curator: {
                id: '1',
                name: 'History Buff',
                imageUrl: '/curator1.jpg'
              },
              isPublic: true,
              isFeatured: true,
              quotes: [],
              quoteCount: 156,
              followers: 1234,
              tags: ['history', 'wisdom', 'philosophy'],
              theme: {
                backgroundColor: '#f8f5e6',
                textColor: '#2c1810'
              },
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            },
            {
              id: '2',
              name: 'Sci-Fi & Futurism',
              description: 'Visionary quotes about technology, space exploration, and the future of humanity.',
              curatorId: '2',
              curator: {
                id: '2',
                name: 'Future Vision',
                imageUrl: '/curator2.jpg'
              },
              isPublic: true,
              isFeatured: true,
              quotes: [],
              quoteCount: 98,
              followers: 856,
              tags: ['sci-fi', 'technology', 'future'],
              theme: {
                backgroundColor: '#1a1a2e',
                textColor: '#e1e1ff'
              },
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }
          ]), 1500)
        );
        setCollections(response);
      } catch (err) {
        setError('Failed to load collections. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorMessage message={error} />
      </div>
    );
  }

  const featuredCollections = collections.filter(c => c.isFeatured);
  const otherCollections = collections.filter(c => !c.isFeatured);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Quote Collections
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Explore curated collections of inspiring quotes, organized by themes, topics, and more.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <CollectionCardSkeleton count={6} />
          </div>
        ) : (
          <>
            {/* Featured Collections */}
            {featuredCollections.length > 0 && (
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                  Featured Collections
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featuredCollections.map(collection => (
                    <CollectionCard key={collection.id} collection={collection} />
                  ))}
                </div>
              </section>
            )}

            {/* All Collections */}
            {otherCollections.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                  All Collections
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {otherCollections.map(collection => (
                    <CollectionCard key={collection.id} collection={collection} />
                  ))}
                </div>
              </section>
            )}

            {collections.length === 0 && (
              <div className="text-center py-12">
                <h3 className="text-xl text-gray-600 dark:text-gray-400">
                  No collections found
                </h3>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default CollectionsPage;