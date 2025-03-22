import React from 'react';
import { Link } from 'react-router-dom';
import { Collection } from '../../types/collection';

interface CollectionCardProps {
  collection: Collection;
}

const emojis: { [key: string]: string } = {
  'Historical Wisdom': '🌍',
  'Sci-Fi & Futurism': '🚀',
  'Love & Relationships': '❤️',
  'Motivational & Inspirational': '💡',
  'Philosophy': '🤔',
  'Literature': '📚',
  'Art & Creativity': '🎨',
  'Nature & Environment': '🌿',
};

const CollectionCard: React.FC<CollectionCardProps> = ({ collection }) => {
  const emoji = emojis[collection.name] || '📜';
  const defaultBgColor = '#f3f4f6';
  const defaultTextColor = '#1f2937';

  const style = {
    backgroundColor: collection.theme?.backgroundColor || defaultBgColor,
    color: collection.theme?.textColor || defaultTextColor,
    fontFamily: collection.theme?.fontFamily || 'inherit',
  };

  return (
    <Link
      to={`/collections/${collection.id}`}
      className="block group h-full"
    >
      <div
        className="h-full rounded-xl shadow-md transition-all duration-300 group-hover:shadow-xl overflow-hidden"
        style={style}
      >
        {collection.coverImage ? (
          <div className="h-32 overflow-hidden">
            <img
              src={collection.coverImage}
              alt={collection.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        ) : (
          <div className="h-32 flex items-center justify-center text-6xl bg-opacity-10 bg-gradient-to-br from-current to-transparent">
            {emoji}
          </div>
        )}

        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-semibold">{collection.name}</h3>
            {collection.isFeatured && (
              <span className="bg-yellow-400 text-yellow-900 text-xs px-2 py-1 rounded-full">
                Featured
              </span>
            )}
          </div>
          
          {collection.description && (
            <p className="text-sm mb-4 line-clamp-2 opacity-80">
              {collection.description}
            </p>
          )}

          <div className="flex items-center justify-between text-sm mt-auto">
            <div className="flex items-center space-x-4">
              <span>{collection.quoteCount} quotes</span>
              <span>{collection.followers} followers</span>
            </div>

            {collection.curator && (
              <div className="flex items-center">
                {collection.curator.imageUrl && (
                  <img
                    src={collection.curator.imageUrl}
                    alt={collection.curator.name}
                    className="w-6 h-6 rounded-full mr-2"
                  />
                )}
                <span className="text-xs opacity-75">
                  by {collection.curator.name}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CollectionCard;