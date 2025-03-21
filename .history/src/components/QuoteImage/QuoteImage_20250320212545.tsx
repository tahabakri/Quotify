import React, { useState } from 'react';
import { BackgroundType, BackgroundMood, BackgroundStyle } from '../../services/deepai/types';
import { useQuoteImage } from '../../contexts/ImageGenerationContext';
import BackgroundTypeSelector from './BackgroundTypeSelector';
import QuoteImageGenerator from './QuoteImageGenerator';
import ImagePreview from './ImagePreview';

interface QuoteImageProps {
  quote: string;
  quoteId: string;
  className?: string;
}

interface ImageGenerationSettings {
  backgroundType: BackgroundType;
  mood?: BackgroundMood;
  style?: BackgroundStyle;
  customPrompt?: string;
}

export const QuoteImage: React.FC<QuoteImageProps> = ({
  quote,
  quoteId,
  className = ''
}) => {
  const [settings, setSettings] = useState<ImageGenerationSettings>({
    backgroundType: 'nature'
  });

  const { image, loading, error, generateQuoteImage } = useQuoteImage(quoteId);

  const handleGenerate = async () => {
    // Construct prompt from settings
    const prompt = [
      `Create a ${settings.mood || 'balanced'} ${settings.backgroundType} background`,
      settings.style && `in ${settings.style} style`,
      'that captures the essence of this quote:',
      quote,
      settings.customPrompt
    ].filter(Boolean).join(' ');

    await generateQuoteImage(prompt);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Image Generation Settings</h2>
        <BackgroundTypeSelector
          value={{
            backgroundType: settings.backgroundType,
            mood: settings.mood,
            style: settings.style,
            customPrompt: settings.customPrompt
          }}
          onChange={setSettings}
        />
      </div>

      {!image && (
        <QuoteImageGenerator
          quote={quote}
          onImageGenerated={() => {/* Image will be handled by context */}}
          onError={(err) => console.error('Image generation failed:', err)}
        />
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg">
          {error.message}
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-3">Generating image...</span>
        </div>
      )}

      {image && (
        <div className="relative">
          <ImagePreview
            image={image}
            quote={quote}
            onDownload={() => {
              // Analytics tracking could be added here
              console.log('Image downloaded');
            }}
            onShare={() => {
              // Analytics tracking could be added here
              console.log('Image shared');
            }}
          />
          <button
            onClick={handleGenerate}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200"
          >
            Regenerate Image
          </button>
        </div>
      )}
    </div>
  );
};

export default QuoteImage;