import React, { useState } from 'react';
import { BackgroundType, BackgroundMood, BackgroundStyle, ImageGenerationOptions } from '../../services/deepai/types';

interface StyleOption {
  value: string;
  label: string;
  description: string;
  suggestedFor?: string[];
}

interface BackgroundTypeSelectorProps {
  value: ImageGenerationOptions;
  onChange: (options: ImageGenerationOptions) => void;
  bookGenre?: string;
  disabled?: boolean;
  className?: string;
}

interface OptionGroupProps {
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

const OptionGroup: React.FC<OptionGroupProps> = ({
  options,
  selectedValue,
  onSelect,
  disabled,
  recommended,
  id,
  labelId
}) => {
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLUListElement>) => {
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
    }
  };

  return (
    <ul
      role="listbox"
      id={id}
      aria-labelledby={labelId}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      onKeyDown={handleKeyDown}
      aria-activedescendant={focusedIndex >= 0 ? `${id}-option-${options[focusedIndex].value}` : undefined}
      tabIndex={disabled ? -1 : 0}
    >
      {options.map((option, index) => {
        const isSelected = option.value === selectedValue;
        const isRecommended = recommended?.includes(option);
        const isFocused = index === focusedIndex;

        return (
          <li
            key={option.value}
            id={`${id}-option-${option.value}`}
            role="option"
            aria-selected={isSelected ? "true" : "false"}
            data-selected={isSelected}
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
          </li>
        );
      })}
    </ul>
  );
};

export const BackgroundTypeSelector: React.FC<BackgroundTypeSelectorProps> = ({
  value,
  onChange,
  bookGenre,
  disabled = false,
  className = ''
}) => {
  const [showCustomPrompt, setShowCustomPrompt] = useState(false);

  const updateOptions = (updates: Partial<ImageGenerationOptions>) => {
    onChange({
      ...value,
      ...updates
    });
  };

  const recommendedTypes = bookGenre
    ? BACKGROUND_TYPES.filter(type => 
        type.suggestedFor?.includes(bookGenre.toLowerCase())
      )
    : [];

  return (
    <div className={`space-y-8 ${className}`}>
      <section>
        <h3 className="text-lg font-semibold mb-4" id="background-type-label">Background Type</h3>
        <OptionGroup
          options={BACKGROUND_TYPES}
          selectedValue={value.backgroundType}
          onSelect={(val) => updateOptions({ backgroundType: val as BackgroundType })}
          disabled={disabled}
          recommended={recommendedTypes}
          id="background-type-list"
          labelId="background-type-label"
        />
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-4" id="mood-label">Mood</h3>
        <OptionGroup
          options={MOODS}
          selectedValue={value.mood}
          onSelect={(val) => updateOptions({ mood: val as BackgroundMood })}
          disabled={disabled}
          id="mood-list"
          labelId="mood-label"
        />
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-4" id="style-label">Art Style</h3>
        <OptionGroup
          options={STYLES}
          selectedValue={value.style}
          onSelect={(val) => updateOptions({ style: val as BackgroundStyle })}
          disabled={disabled}
          id="style-list"
          labelId="style-label"
        />
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold" id="custom-adjustments-label">
            Custom Adjustments
          </h3>
          <button
            onClick={() => setShowCustomPrompt(prev => !prev)}
            className="text-blue-500 hover:text-blue-600 text-sm font-medium"
            aria-expanded={showCustomPrompt ? "true" : "false"}
            aria-controls="custom-prompt-section"
            type="button"
          >
            {showCustomPrompt ? 'Hide' : 'Show'} Custom Prompt
          </button>
        </div>
        
        {showCustomPrompt && (
          <div id="custom-prompt-section" className="space-y-2">
            <label 
              htmlFor="custom-prompt" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Custom Prompt
            </label>
            <textarea
              id="custom-prompt"
              value={value.customPrompt || ''}
              onChange={(e) => updateOptions({ customPrompt: e.target.value })}
              disabled={disabled}
              placeholder="Add specific details or adjustments for the image generation..."
              className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              aria-labelledby="custom-adjustments-label"
            />
            <p className="text-sm text-gray-500">
              Describe additional details or specific elements you'd like to see in the generated image.
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

export default BackgroundTypeSelector;