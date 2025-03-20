import React from 'react';

interface BookCoverProps {
  coverUrl: string;
  title: string;
  author: string;
  className?: string;
}

export function BookCover({ coverUrl, title, author, className = '' }: BookCoverProps) {
  const isPlaceholder = coverUrl.includes('placehold.co');

  if (isPlaceholder) {
    return (
      <div 
        className={`relative w-full h-full bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-800 flex flex-col items-center justify-center p-4 text-center ${className}`}
      >
        <div className="absolute inset-0 bg-black/5 dark:bg-white/5" />
        <div className="relative">
          <h4 className="font-bold text-gray-800 dark:text-gray-100 text-lg mb-2 line-clamp-3">
            {title}
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-300 italic">
            by {author}
          </p>
        </div>
      </div>
    );
  }

  return (
    <img
      src={coverUrl}
      alt={`Cover of ${title}`}
      className={`w-full h-full object-cover ${className}`}
    />
  );
}