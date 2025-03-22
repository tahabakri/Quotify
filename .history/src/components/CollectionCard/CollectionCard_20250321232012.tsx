import { FiBookmark, FiShare2, FiUser } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { Collection } from '../../types/collection';

interface CollectionCardProps {
  collection: Collection;
  onShare?: () => void;
}

export function CollectionCard({ collection, onShare }: CollectionCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow">
      {/* Collection Cover */}
      <div className="relative h-48 rounded-t-lg overflow-hidden">
        {collection.coverImage ? (
          <img
            src={collection.coverImage}
            alt={collection.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <FiBookmark className="w-12 h-12 text-white opacity-75" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <Link
            to={`/collections/${collection.id}`}
            className="text-xl font-semibold text-white hover:text-blue-200 transition-colors"
          >
            {collection.name}
          </Link>
        </div>
      </div>

      {/* Collection Info */}
      <div className="p-4">
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
          {collection.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FiUser className="text-gray-500 dark:text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {collection.curator.name}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {collection.quoteCount} {collection.quoteCount === 1 ? 'quote' : 'quotes'}
            </div>

            <button
              onClick={onShare}
              className="text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
              aria-label="Share collection"
            >
              <FiShare2 />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}