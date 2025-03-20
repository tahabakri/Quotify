import { BookCard } from './BookCard';
import { useSearch } from '../../contexts/SearchContext';

// Sample data for different filters
const trendingBooks = [
  {
    id: '1',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    coverUrl: 'https://source.unsplash.com/random/800x1200?book,classic&sig=1',
    rating: 4.5,
  },
  {
    id: '2',
    title: '1984',
    author: 'George Orwell',
    coverUrl: 'https://source.unsplash.com/random/800x1200?book,dystopian&sig=2',
    rating: 4.7,
  },
  {
    id: '3',
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    coverUrl: 'https://source.unsplash.com/random/800x1200?book,romance&sig=3',
    rating: 4.6,
  },
  {
    id: '4',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    coverUrl: 'https://source.unsplash.com/random/800x1200?book,drama&sig=4',
    rating: 4.8,
  },
  {
    id: '5',
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    coverUrl: 'https://source.unsplash.com/random/800x1200?book,fantasy&sig=5',
    rating: 4.6,
  },
  {
    id: '6',
    title: 'Dune',
    author: 'Frank Herbert',
    coverUrl: 'https://source.unsplash.com/random/800x1200?book,scifi&sig=6',
    rating: 4.7,
  },
];

interface ResultsGridProps {
  loading?: boolean;
  className?: string;
}

export function ResultsGrid({ loading = false, className = '' }: ResultsGridProps) {
  const handleSave = (id: string) => {
    console.log('Save book:', id);
  };

  const handleQuote = (id: string) => {
    console.log('View quotes:', id);
  };

  const handlePreview = (id: string) => {
    console.log('Preview book:', id);
  };

  if (loading) {
    return (
      <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 ${className}`}>
        {[1, 2, 3, 4, 5, 6].map((index) => (
          <div
            key={index}
            className="bg-gray-100 dark:bg-dark-200 rounded-xl animate-pulse"
            style={{ aspectRatio: '3/4' }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 ${className}`}>
      {sampleBooks.map((book) => (
        <BookCard
          key={book.id}
          book={book}
          onSave={handleSave}
          onQuote={handleQuote}
          onPreview={handlePreview}
        />
      ))}
    </div>
  );
}