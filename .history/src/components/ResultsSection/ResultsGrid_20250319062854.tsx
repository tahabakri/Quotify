import React, { useState } from 'react';
import { useSearch } from '../../contexts/useSearch';
import { BookCard } from './BookCard';

// Define book interface
interface Book {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  rating: number;
}

// Sample data for different filters
const trendingBooks: Book[] = [
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
];

const latestBooks: Book[] = [
  {
    id: '3',
    title: 'The Midnight Library',
    author: 'Matt Haig',
    coverUrl: 'https://source.unsplash.com/random/800x1200?book,library&sig=3',
    rating: 4.6,
  },
  {
    id: '4',
    title: 'Project Hail Mary',
    author: 'Andy Weir',
    coverUrl: 'https://source.unsplash.com/random/800x1200?book,space&sig=4',
    rating: 4.8,
  },
];

const genreBooks: Record<string, Book[]> = {
  fiction: [
    {
      id: '5',
      title: 'The Silent Patient',
      author: 'Alex Michaelides',
      coverUrl: 'https://source.unsplash.com/random/800x1200?book,mystery&sig=5',
      rating: 4.6,
    },
  ],
  scifi: [
    {
      id: '6',
      title: 'Dune',
      author: 'Frank Herbert',
      coverUrl: 'https://source.unsplash.com/random/800x1200?book,scifi&sig=6',
      rating: 4.7,
    },
  ],
};

interface ResultsGridProps {
  loading?: boolean;
  className?: string;
}

export function ResultsGrid({ className = '' }: ResultsGridProps) {
  const { loading, selectedFilter, selectedGenres } = useSearch();

  const handleSave = (id: string) => {
    console.log('Save book:', id);
  };

  const handleQuote = (id: string) => {
    console.log('View quotes:', id);
  };

  const handlePreview = (id: string) => {
    console.log('Preview book:', id);
  };

  const getDisplayedBooks = () => {
    if (selectedFilter === 'trending') return trendingBooks;
    if (selectedFilter === 'latest') return latestBooks;
    if (selectedFilter === 'genre' && selectedGenres.length > 0) {
      return selectedGenres.flatMap((genre: string) => genreBooks[genre] || []);
    }
    return trendingBooks; // Default to trending
  };

  if (loading) {
    return (
      <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 ${className}`}>
        {[1, 2, 3, 4, 5, 6].map((index) => (
          <div
            key={index}
            className="bg-gray-100 dark:bg-dark-200 rounded-xl animate-pulse aspect-[3/4]"
          />
        ))}
      </div>
    );
  }

  const displayedBooks = getDisplayedBooks();

  return (
    <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 ${className}`}>
      {displayedBooks.map((book: Book) => (
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