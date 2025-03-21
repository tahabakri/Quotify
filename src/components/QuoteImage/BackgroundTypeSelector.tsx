import { Sparkles, Palette, Square } from 'lucide-react';

interface BackgroundTypeSelectorProps {
  value: 'ai' | 'gradient' | 'solid';
  onChange: (type: 'ai' | 'gradient' | 'solid') => void;
  className?: string;
}

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
    <div 
      className={`inline-flex rounded-lg bg-gray-100 dark:bg-gray-800 p-1 ${className}`}
      role="toolbar"
      aria-label="Background type selector"
    >
      {options.map(option => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
            value === option.value
              ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
          aria-label={`${option.label} background type`}
          aria-current={value === option.value ? 'true' : undefined}
        >
          {option.icon}
          <span className="hidden sm:inline">{option.label}</span>
        </button>
      ))}
    </div>
  );
}

export default BackgroundTypeSelector;