import React, { useState } from 'react';
import { BackgroundType, BackgroundMood, BackgroundStyle, ImageGenerationOptions } from '../../services/deepai/types';

interface StyleOption {
  value: string;
  label: string;
  description: string;
  suggestedFor?: string[];
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

interface BackgroundTypeSelectorProps {
  value: ImageGenerationOptions;
  onChange: (options: ImageGenerationOptions) => void;
  bookGenre?: string;
  disabled?: boolean;
  className?: string;
}

const OptionButton: React.FC<{
  option: StyleOption;
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
  recommended?: boolean;
}> = ({ option, selected, onClick, disabled, recommended }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`
      p-4 rounded-lg border-2 transition-all duration-200 relative
      ${selected 
        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
        : 'border-gray-200 hover:border-blue-300 dark:border-gray-700'
      }
      ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      ${recommended ? 'ring-2 ring-yellow-400' : ''}
    `}
    role="option"
    aria-selected={selected}
  >
    <div className="flex flex-col items-start gap-2">
      <span className="font-medium text-lg">{option.label}</span>
      <span className="text-sm text-gray-600 dark:text-gray-400">
        {option.description}
      </span>
    </div>
    {recommended && (
      <span className="absolute top-2 right-2 text-yellow-600 text-sm font-medium">
        Recommended
      </span>
    )}
  </button>
);

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
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Background Type</h3>
        <div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          role="listbox"
          aria-label="Select background type"
        >
          {BACKGROUND_TYPES.map((type) => (
            <OptionButton
              key={type.value}
              option={type}
              selected={value.backgroundType === type.value}
              onClick={() => updateOptions({ backgroundType: type.value as BackgroundType })}
              disabled={disabled}
              recommended={recommendedTypes.includes(type)}
            />
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Mood</h3>
        <div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          role="listbox"
          aria-label="Select mood"
        >
          {MOODS.map((mood) => (
            <OptionButton
              key={mood.value}
              option={mood}
              selected={value.mood === mood.value}
              onClick={() => updateOptions({ mood: mood.value as BackgroundMood })}
              disabled={disabled}
            />
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Art Style</h3>
        <div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          role="listbox"
          aria-label="Select art style"
        >
          {STYLES.map((style) => (
            <OptionButton
              key={style.value}
              option={style}
              selected={value.style === style.value}
              onClick={() => updateOptions({ style: style.value as BackgroundStyle })}
              disabled={disabled}
            />
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Custom Adjustments</h3>
          <button
            onClick={() => setShowCustomPrompt(!showCustomPrompt)}
            className="text-blue-500 hover:text-blue-600 text-sm font-medium"
          >
            {showCustomPrompt ? 'Hide' : 'Show'} Custom Prompt
          </button>
        </div>
        
        {showCustomPrompt && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Custom Prompt
            </label>
            <textarea
              value={value.customPrompt || ''}
              onChange={(e) => updateOptions({ customPrompt: e.target.value })}
              disabled={disabled}
              placeholder="Add specific details or adjustments for the image generation..."
              className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              rows={3}
            />
            <p className="text-sm text-gray-500">
              Describe additional details or specific elements you'd like to see in the generated image.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BackgroundTypeSelector;