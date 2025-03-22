import React from 'react';

const AuthorDetailSkeleton: React.FC = () => {
  return (
    <main className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Author Header */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
          {/* Author Image Skeleton */}
          <div className="w-48 h-48 bg-gray-200 rounded-full animate-pulse shrink-0"></div>
          
          <div className="flex-1">
            {/* Author Name Skeleton */}
            <div className="h-8 bg-gray-200 rounded-lg w-64 mb-4 animate-pulse"></div>
            
            {/* Author Bio Skeleton */}
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6 animate-pulse"></div>
            </div>

            {/* Stats Skeleton */}
            <div className="flex gap-6 mt-6">
              <div className="h-16 w-24 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-16 w-24 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-16 w-24 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid md:grid-cols-3 gap-8">
        {/* Books Section */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="h-6 bg-gray-200 rounded w-32 mb-4 animate-pulse"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((index) => (
                <div key={index} className="flex gap-4">
                  <div className="w-16 h-24 bg-gray-200 rounded animate-pulse"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quotes Section */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="h-6 bg-gray-200 rounded w-48 mb-6 animate-pulse"></div>
            <div className="space-y-6">
              {[1, 2, 3].map((index) => (
                <div key={index} className="border-b pb-6">
                  <div className="h-16 bg-gray-200 rounded mb-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AuthorDetailSkeleton;