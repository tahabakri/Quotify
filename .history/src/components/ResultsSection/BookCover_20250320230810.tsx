import { useState } from 'react';
import { Book } from 'lucide-react';

interface BookCoverProps {
  coverUrl: string | null;
  title: string;
  className?: string;
}

export function BookCover({ coverUrl, title, className = '' }: BookCoverProps) {
  const [imageError, setImageError] = useState(false);

  if (!coverUrl || imageError) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 ${className}`}
        role="img"
        aria-label={`Cover for ${title}`}
      >
        <Book className="w-8 h-8" />
      </div>
    );
  }

  return (
    <img
      src={coverUrl}
      alt={`Cover for ${title}`}
      className={`object-cover bg-gray-100 dark:bg-gray-800 ${className}`}
      onError={() => setImageError(true)}
      loading="lazy"
    />
  );
}

export default BookCover;