import { Link } from 'react-router-dom';
import { Collection } from '../../types/collection';

interface CollectionCardProps {
  collection: Collection;
}

export const CollectionCard = ({ collection }: CollectionCardProps) => {
  const {
    id,
    name,
    description,
    curator,
    quoteCount,
    theme
  } = collection;

  return (
    <Link
      to={`/collections/${id}`}
      className="group block rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="relative h-48">
        <div 
          className="w-full h-full"
          style={{ 
            backgroundColor: theme?.backgroundColor || '#1a1a2e',
            color: theme?.textColor || '#ffffff'
          }}
        />
        
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
        
        <div className="absolute inset-0 p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold text-white">{name}</h3>
            <p className="mt-2 text-sm text-gray-100 line-clamp-2">
              {description}
            </p>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {curator.imageUrl && (
                <img
                  src={curator.imageUrl}
                  alt={curator.name}
                  className="w-6 h-6 rounded-full"
                />
              )}
              <span className="text-sm text-gray-100">
                {quoteCount} quotes
              </span>
            </div>
            <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity">
              View Collection →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

interface CollectionCardSkeletonProps {
  count?: number;
}

export const CollectionCardSkeleton = ({ count = 1 }: CollectionCardSkeletonProps) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="rounded-lg overflow-hidden shadow-sm">
          <div className="relative h-48 animate-pulse bg-gray-200 dark:bg-gray-700">
            <div className="absolute inset-0 p-6 flex flex-col justify-between">
              <div>
                <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-2/3 mb-2" />
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full mt-2" />
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mt-1" />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-600" />
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-20" />
                </div>
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-32" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};