import React, { useEffect, useState } from 'react';
import { Collection } from '../types/collection';
import CollectionCard from '../components/Collection/CollectionCard';
import CollectionCardSkeleton from '../components/Collection/CollectionCardSkeleton';
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
            },
            {
              id: '3',
              name: 'Love & Relationships',
              description: 'Beautiful quotes about love, romance, and human connections.',
              curatorId: '3',
              curator: {
                id: '3',
                name: 'Heart & Soul',
                imageUrl: '/curator3.jpg'
              },
              isPublic: true,
              isFeatured: false,
              quotes: [],
              quoteCount: 234,
              followers: 2156,
              tags: ['love', 'romance', 'relationships'],
              theme: {
                backgroundColor: '#fff5f5',
                textColor: '#832838'
              },
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            },
            {
              id: '4',
              name: 'Motivational & Inspirational',
              description: 'Empowering quotes to boost your motivation and inspire greatness.',
              curatorId: '4',
              curator: {
                id: '4',
                name: 'Motivation Master',
                imageUrl: '/curator4.jpg'
              },
              isPublic: true,
              isFeatured: true,
              quotes: [],
              quoteCount: 312,
              followers: 3421,
              tags: ['motivation', 'inspiration', 'success'],
              theme: {
                backgroundColor: '#fef9c3',
                textColor: '#854d0e'
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

  if (loading) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="h-8 bg-gray-200 rounded w-48 animate-pulse mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <CollectionCardSkeleton count={4} />
          </div>
        </div>
      </main>
    );
  }

  if (error) return <ErrorMessage message={error} />;

  const featuredCollections = collections.filter(c => c.isFeatured);
  const otherCollections = collections.filter(c => !c.isFeatured);

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Featured Collections */}
      {featuredCollections.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            Featured Collections
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCollections.map(collection => (
              <CollectionCard key={collection.id} collection={collection} />
            ))}
          </div>
        </div>
      )}

      {/* Other Collections */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          All Collections
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {otherCollections.map(collection => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </div>
      </div>

      {collections.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl text-gray-600">No collections found</h3>
        </div>
      )}
    </main>
  );
};

export default CollectionsPage;