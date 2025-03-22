import React from 'react';

const QuoteDetailSkeleton: React.FC = () => {
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        {/* Quote Skeleton */}
        <div className="text-center mb-8">
          <div className="h-8 bg-gray-200 rounded-lg w-3/4 mx-auto mb-4 animate-pulse"></div>
          <div className="h-8 bg-gray-200 rounded-lg w-1/2 mx-auto mb-4 animate-pulse"></div>
          <div className="flex justify-center items-center gap-2">
            <div className="h-6 bg-gray-200 rounded-full w-32 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded-full w-4 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded-full w-40 animate-pulse"></div>
          </div>
        </div>

        {/* Image Skeleton */}
        <div className="mb-8">
          <div className="w-full h-64 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>

        {/* Interaction Buttons Skeleton */}
        <div className="flex justify-center gap-4 mb-8">
          {[1, 2, 3].map((index) => (
            <div
              key={index}
              className="h-10 w-24 bg-gray-200 rounded-full animate-pulse"
            ></div>
          ))}
        </div>

        {/* Comments Section Skeleton */}
        <div className="border-t pt-8">
          <div className="h-6 bg-gray-200 rounded w-32 mb-4 animate-pulse"></div>
          
          {/* Comment Form Skeleton */}
          <div className="mb-6">
            <div className="w-full h-24 bg-gray-200 rounded-lg mb-2 animate-pulse"></div>
            <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
          
          {/* Sample Comment Skeletons */}
          {[1, 2].map((index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg mb-4">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 bg-gray-200 rounded-full mr-2 animate-pulse"></div>
                <div>
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-1"></div>
                  <div className="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default QuoteDetailSkeleton;