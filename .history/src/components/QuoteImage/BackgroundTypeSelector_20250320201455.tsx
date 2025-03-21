import React from 'react';
import { BackgroundType } from '../../services/deepai/types';

const BACKGROUND_TYPES: { value: BackgroundType; label: string; description: string }[] = [
  {
    value: 'nature',
    label: 'Nature',
    description: 'Serene landscapes and natural elements'
  },
  {
    value: 'abstract',
    label: 'Abstract',
    description: 'Modern and artistic patterns'
  },
  {
    value: 'cityscape',
    label: 'Cityscape',
    description: 'Urban environments and architecture'
  },
  {
    value: 'vintage',
    label: 'Vintage',
    description: 'Classic and retro aesthetics'
  },
  {
    value: 'fantasy',
    label: 'Fantasy',
    description: 'Magical and ethereal scenes'
  },
  {
    value: 'minimalist',
    label: 'Minimalist',
    description: 'Clean and simple designs'
  }
];

interface BackgroundTypeSelectorProps {
  value: BackgroundType;
  onChange: (type: BackgroundType) => void;
  disabled?: boolean;
  className?: string;
}

export const BackgroundTypeSelector: React.FC<BackgroundTypeSelectorProps> = ({
  value,
  onChange,
  disabled = false,
  className = ''
}) => {
  return (
    <div 
      className={`space-y-4 ${className}`}
      role="radiogroup"
      aria-label="Select background style"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {BACKGROUND_TYPES.map((type) => (
          <button
            key={type.value}
            onClick={() => onChange(type.value)}
            disabled={disabled}
            className={`
              p-4 rounded-lg border-2 transition-all duration-200 
              ${value === type.value 
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                : 'border-gray-200 hover:border-blue-300 dark:border-gray-700'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
            role="radio"
            aria-checked={value === type.value}
            aria-label={type.label}
          >
            <div className="flex flex-col items-start gap-2">
              <span className="font-medium text-lg">{type.label}</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {type.description}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BackgroundTypeSelector;