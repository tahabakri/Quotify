import React, { useState, useId } from 'react';
import { BackgroundType, BackgroundMood, BackgroundStyle, ImageGenerationOptions } from '../../services/deepai/types';
import { Sparkles, Palette, Square } from 'lucide-react';

interface StyleOption {
  value: string;
  label: string;
  description: string;
  suggestedFor?: string[];
}

interface BackgroundTypeSelectorProps {
  value: 'ai' | 'gradient' | 'solid';
  onChange: (type: 'ai' | 'gradient' | 'solid') => void;
  className?: string;
}

interface OptionListProps {
  options: StyleOption[];
  selectedValue: string | undefined;
  onSelect: (value: string) => void;
  disabled?: boolean;
  recommended?: StyleOption[];
  id: string;
  labelId: string;
}

const BACKGROUND_TYPES: StyleOption[] = [
  {
    value: 'nature',
    label: 'Nature',
    description: 'Serene landscapes and natural elements',
    suggestedFor: ['romance', 'poetry', 'meditation']
  },
  {
    value: 'abstract',
    label: 'Abstract',
    description: 'Modern and artistic patterns',
    suggestedFor: ['philosophy', 'science', 'psychology']
  },
  {
    value: 'dramatic',
    label: 'Dramatic',
    description: 'Intense and emotional scenes',
    suggestedFor: ['thriller', 'drama', 'horror']
  },
  {
    value: 'romantic',
    label: 'Romantic',
    description: 'Soft, dreamy atmospheres',
    suggestedFor: ['romance', 'poetry']
  },
  {
    value: 'mysterious',
    label: 'Mysterious',
    description: 'Enigmatic and intriguing visuals',
    suggestedFor: ['mystery', 'thriller', 'horror']
  },
  {
    value: 'spiritual',
    label: 'Spiritual',
    description: 'Sacred and contemplative imagery',
    suggestedFor: ['religion', 'philosophy', 'meditation']
  },
  {
    value: 'futuristic',
    label: 'Futuristic',
    description: 'Sci-fi and technological themes',
    suggestedFor: ['science-fiction', 'technology']
  },
  {
    value: 'nostalgic',
    label: 'Nostalgic',
    description: 'Retro and memory-evoking scenes',
    suggestedFor: ['memoir', 'historical-fiction']
  }
];

const MOODS: StyleOption[] = [
  {
    value: 'light',
    label: 'Light',
    description: 'Bright and uplifting atmosphere'
  },
  {
    value: 'dark',
    label: 'Dark',
    description: 'Moody and dramatic atmosphere'
  },
  {
    value: 'vibrant',
    label: 'Vibrant',
    description: 'Bold and energetic colors'
  },
  {
    value: 'muted',
    label: 'Muted',
    description: 'Subtle and understated tones'
  },
  {
    value: 'ethereal',
    label: 'Ethereal',
    description: 'Dreamy and otherworldly feel'
  }
];

const STYLES: StyleOption[] = [
  {
    value: 'watercolor',
    label: 'Watercolor',
    description: 'Soft, flowing artistic style'
  },
  {
    value: 'photography',
    label: 'Photography',
    description: 'Realistic photographic look'
  },
  {
    value: 'digital',
    label: 'Digital Art',
    description: 'Modern digital illustration'
  },
  {
    value: 'sketch',
    label: 'Sketch',
    description: 'Hand-drawn artistic style'
  },
  {
    value: 'oil-painting',
    label: 'Oil Painting',
    description: 'Classical painting style'
  }
];

const OptionList: React.FC<OptionListProps> = ({
  options,
  selectedValue,
  onSelect,
  disabled,
  recommended,
  labelId,
  id
}) => {
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const listboxId = useId();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        e.preventDefault();
        setFocusedIndex(prev =>
          prev >= options.length - 1 ? 0 : prev + 1
        );
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        e.preventDefault();
        setFocusedIndex(prev =>
          prev <= 0 ? options.length - 1 : prev - 1
        );
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (focusedIndex >= 0 && !disabled) {
          onSelect(options[focusedIndex].value);
        }
        break;
      case 'Home':
        e.preventDefault();
        setFocusedIndex(0);
        break;
      case 'End':
        e.preventDefault();
        setFocusedIndex(options.length - 1);
        break;
      default:
        break;
    }
  };

  return (
    <div
      role="listbox"
      aria-controls={listboxId}
      aria-labelledby={labelId}
      className="relative"
      onKeyDown={handleKeyDown}
      tabIndex={disabled ? -1 : 0}
      aria-label="Select an option"
    >
      <div
        id={id}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {options.map((option: StyleOption, index: number) => {
          const isSelected = option.value === selectedValue;
          const isRecommended = recommended?.includes(option);
          const isFocused = index === focusedIndex;

          return (
            <div
              key={option.value}
              role="option"
              {...(isSelected ? { 'aria-selected': 'true' } : { 'aria-selected': 'false' })}
              data-focused={isFocused ? "true" : undefined}
              className={`
                p-4 rounded-lg border-2 transition-all duration-200 relative outline-none
                ${isSelected 
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                  : 'border-gray-200 hover:border-blue-300 dark:border-gray-700'
                }
                ${disabled ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}
                ${isRecommended ? 'ring-2 ring-yellow-400' : ''}
                ${isFocused ? 'ring-2 ring-blue-500' : ''}
              `}
              onClick={() => !disabled && onSelect(option.value)}
              onMouseEnter={() => setFocusedIndex(index)}
              onFocus={() => setFocusedIndex(index)}
            >
              <div className="flex flex-col items-start gap-2">
                <span className="font-medium text-lg">{option.label}</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {option.description}
                </span>
              </div>
              {isRecommended && (
                <span className="absolute top-2 right-2 text-yellow-600 text-sm font-medium">
                  Recommended
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export function BackgroundTypeSelector({ 
  value, 
  onChange, 
  className = '' 
}: BackgroundTypeSelectorProps) {
  const options = [
    { value: 'ai', label: 'AI Generated', icon: <Sparkles className="w-4 h-4" /> },
    { value: 'gradient', label: 'Gradient', icon: <Palette className="w-4 h-4" /> },
    { value: 'solid', label: 'Solid Color', icon: <Square className="w-4 h-4" /> },
  ] as const;

  return (
    <div className={`inline-flex rounded-lg bg-gray-100 dark:bg-gray-800 p-1 ${className}`}>
      {options.map(option => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
            value === option.value
              ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
          aria-pressed={value === option.value}
        >
          {option.icon}
          <span className="hidden sm:inline">{option.label}</span>
        </button>
      ))}
    </div>
  );
}

export default BackgroundTypeSelector;