import React from 'react';

interface CollectionCardSkeletonProps {
  count?: number;
}

const CollectionCardSkeleton: React.FC<CollectionCardSkeletonProps> = ({ count = 8 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="rounded-xl shadow-md overflow-hidden bg-white"
        >
          {/* Image Placeholder */}
          <div className="h-32 bg-gray-200 animate-pulse"></div>

          <div className="p-4">
            {/* Title Placeholder */}
            <div className="flex items-center justify-between mb-2">
              <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              <div className="h-5 bg-gray-200 rounded-full w-16 animate-pulse"></div>
            </div>

            {/* Description Placeholder */}
            <div className="space-y-2 mb-4">
              <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
            </div>

            {/* Stats and Curator Placeholder */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-gray-200 animate-pulse mr-2"></div>
                <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default CollectionCardSkeleton;