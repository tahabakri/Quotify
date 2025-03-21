import React, { useState } from 'react';

interface BookCoverProps {
  url?: string;
  title: string;
  className?: string;
}

export const BookCover: React.FC<BookCoverProps> = ({
  url,
  title,
  className = ''
}) => {
  const [error, setError] = useState(false);

  const fallbackCover = (
    <div 
      className={`flex items-center justify-center bg-gray-200 dark:bg-gray-700 ${className}`}
      title={title}
    >
      <span className="text-gray-500 dark:text-gray-400 text-center p-4 text-sm">
        {title}
      </span>
    </div>
  );

  if (!url || error) {
    return fallbackCover;
  }

  return (
    <img
      src={url}
      alt={`Cover of ${title}`}
      className={className}
      onError={() => setError(true)}
      loading="lazy"
    />
  );
};

export default BookCover;