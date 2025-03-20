import { Book, Music, Theater, Heart, Brain, Globe, Sword, Rocket, FlaskConical } from 'lucide-react';
import { useState } from 'react';

interface Genre {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface GenreSelectorProps {
  onGenreSelect: (genreId: string) => void;
  className?: string;
}

const genres: Genre[] = [
  { id: 'fiction', label: 'Fiction', icon: <Book className="w-5 h-5" /> },
  { id: 'poetry', label: 'Poetry', icon: <Music className="w-5 h-5" /> },
  { id: 'drama', label: 'Drama', icon: <Theater className="w-5 h-5" /> },
  { id: 'romance', label: 'Romance', icon: <Heart className="w-5 h-5" /> },
  { id: 'philosophy', label: 'Philosophy', icon: <Brain className="w-5 h-5" /> },
  { id: 'history', label: 'History', icon: <Globe className="w-5 h-5" /> },
  { id: 'fantasy', label: 'Fantasy', icon: <Sword className="w-5 h-5" /> },
  { id: 'scifi', label: 'Sci-Fi', icon: <Rocket className="w-5 h-5" /> },
  { id: 'science', label: 'Science', icon: <FlaskConical className="w-5 h-5" /> },
];

export function GenreSelector({ onGenreSelect, className = '' }: GenreSelectorProps) {
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  const toggleGenre = (genreId: string) => {
    setSelectedGenres(prev => {
      const isSelected = prev.includes(genreId);
      const newSelection = isSelected
        ? prev.filter(id => id !== genreId)
        : [...prev, genreId];
      
      onGenreSelect(newSelection.join(','));
      return newSelection;
    });
  };

  return (
    <div className={`grid grid-cols-3 md:grid-cols-9 gap-3 ${className}`}>
      {genres.map(genre => (
        <button
          key={genre.id}
          onClick={() => toggleGenre(genre.id)}
          className={`flex flex-col items-center p-3 rounded-lg transition-all duration-300 ${
            selectedGenres.includes(genre.id)
              ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
              : 'bg-white text-gray-600 hover:bg-gray-50 dark:bg-dark-200 dark:text-gray-300 dark:hover:bg-dark-100'
          }`}
          aria-label={`Select ${genre.label} genre`}
        >
          {genre.icon}
          <span className="text-xs mt-1">{genre.label}</span>
        </button>
      ))}
    </div>
  );
}