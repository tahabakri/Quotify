import React from 'react';
import { Star, ChevronDown, ChevronUp } from 'lucide-react';

interface BookStatsProps {
  rating: number;
  ratingsCount?: number;
  className?: string;
}

export function BookStats({ rating, ratingsCount, className = '' }: BookStatsProps) {
  const formattedRating = rating.toFixed(1);
  const ratingPercentage = (rating / 5) * 100;
  
  // Visual representation of rating distribution (similar to Play Store)
  const starBars = [5, 4, 3, 2, 1].map(stars => {
    // Simulate rating distribution when ratingsCount is available
    const percentage = ratingsCount 
      ? ((Math.max(0.1, Math.min(1, (rating - stars + 1.5))) * ratingsCount) / ratingsCount) * 100
      : 0;

    return (
      <div key={stars} className="flex items-center gap-2 text-xs">
        <span className="w-4">{stars}</span>
        <Star className="w-3 h-3 text-yellow-400 fill-current" />
        <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-yellow-400"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  });

  return (
    <div className={`flex flex-col ${className}`}>
      <div className="flex items-center gap-3 mb-2">
        <div className="flex items-center">
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            {formattedRating}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">/5</span>
        </div>
        
        {/* Rating Trend Indicator */}
        {rating > 4.0 && (
          <div className="flex items-center text-green-600 dark:text-green-400">
            <ChevronUp className="w-4 h-4" />
            <span className="text-xs">Trending Up</span>
          </div>
        )}
        {rating < 2.5 && (
          <div className="flex items-center text-red-600 dark:text-red-400">
            <ChevronDown className="w-4 h-4" />
            <span className="text-xs">Low Rating</span>
          </div>
        )}
      </div>

      {ratingsCount ? (
        <>
          <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">
            {ratingsCount.toLocaleString()} total ratings
          </div>
          <div className="space-y-1">
            {starBars}
          </div>
        </>
      ) : (
        <div className="text-sm text-gray-500 dark:text-gray-400">
          No ratings yet
        </div>
      )}
    </div>
  );
}