import { Globe, Sword, Rocket, FlaskConical } from 'lucide-react';
import { useSearch } from '../../contexts/useSearch';

interface GenreSelectorProps {
  className?: string;
}

const genres = [
  { id: 'history', label: 'History', icon: <Globe className="w-5 h-5" /> },
  { id: 'fantasy', label: 'Fantasy', icon: <Sword className="w-5 h-5" /> },
  { id: 'scifi', label: 'Sci-Fi', icon: <Rocket className="w-5 h-5" /> },
  { id: 'science', label: 'Science', icon: <FlaskConical className="w-5 h-5" /> },
];

export function GenreSelector({ className = '' }: GenreSelectorProps) {
  const { filters, setFilters } = useSearch();
  const selectedGenres = filters.genres || [];

  const handleGenreSelect = (genreId: string) => {
    const newGenres = selectedGenres.includes(genreId)
      ? selectedGenres.filter(id => id !== genreId)
      : [...selectedGenres, genreId];
      
    setFilters({
      ...filters,
      genres: newGenres
    });
  };

  return (
    <div className={className}>
      {genres.map(genre => (
        <button
          key={genre.id}
          onClick={() => handleGenreSelect(genre.id)}
          className={`flex flex-col items-center justify-center p-3 rounded-lg transition-colors ${
            selectedGenres.includes(genre.id)
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400'
              : 'bg-white text-gray-600 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
          }`}
          aria-label={`Select ${genre.label} genre`}
          type="button"
          role="switch"
          aria-checked={(selectedGenres.includes(genre.id)).toString()}
        >
          {genre.icon}
          <span className="text-xs mt-1">{genre.label}</span>
        </button>
      ))}
    </div>
  );
}