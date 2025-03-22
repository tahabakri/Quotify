import { Link } from 'react-router-dom';

interface CollectionCardProps {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  quotesCount: number;
  color?: string;
}

export const CollectionCard = ({
  id,
  title,
  description,
  imageUrl,
  quotesCount,
  color = 'blue'
}: CollectionCardProps) => {
  const gradientColors = {
    blue: 'from-blue-500 to-purple-600',
    green: 'from-green-500 to-teal-600',
    purple: 'from-purple-500 to-pink-600',
    orange: 'from-orange-500 to-red-600'
  };

  return (
    <Link
      to={`/collections/${id}`}
      className="group block rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="relative h-48">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div 
            className={`w-full h-full bg-gradient-to-br ${gradientColors[color as keyof typeof gradientColors]}`}
          />
        )}
        
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
        
        <div className="absolute inset-0 p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold text-white">{title}</h3>
            <p className="mt-2 text-sm text-gray-100 line-clamp-2">
              {description}
            </p>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-100">
              {quotesCount} quotes
            </span>
            <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity">
              View Collection →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

// Loading skeleton for CollectionCard
export const CollectionCardSkeleton = () => {
  return (
    <div className="rounded-lg overflow-hidden shadow-sm">
      <div className="relative h-48 animate-pulse bg-gray-200 dark:bg-gray-700">
        <div className="absolute inset-0 p-6 flex flex-col justify-between">
          <div>
            <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-2/3 mb-2" />
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full mt-2" />
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mt-1" />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-20" />
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-32" />
          </div>
        </div>
      </div>
    </div>
  );
};