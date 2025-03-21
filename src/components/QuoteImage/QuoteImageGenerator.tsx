import React, { useState } from 'react';
import { GenerationResult } from '../../services/deepai/types';
import { useNotification } from '../../contexts/NotificationContext';

interface QuoteImageGeneratorProps {
  quote: string;
  onImageGenerated: (image: GenerationResult) => void;
  onError: (error: Error) => void;
}

const QuoteImageGenerator: React.FC<QuoteImageGeneratorProps> = ({
  quote,
  onImageGenerated,
  onError,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { notify } = useNotification();

  // Simulated function to trigger image generation.
  // Replace this with actual API integration.
  const generateImage = async () => {
    setLoading(true);
    notify('info', 'Generating image from your quote...');

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Simulated generated image response
      const simulatedImage: GenerationResult = {
        imageUrl: "https://example.com/generated-image.webp",
        prompt: quote,
        metadata: {
          width: 1024,
          height: 768,
          style: "modern",
          mood: "vibrant"
        }
      };

      onImageGenerated(simulatedImage);
      notify('success', 'Image generated successfully!');
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to generate image');
      notify('error', error.message);
      onError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow bg-white dark:bg-gray-800">
      <h2 className="text-lg font-semibold mb-2">Generate Background Image</h2>
      
      <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded">
        <blockquote className="italic text-gray-700 dark:text-gray-300">
          "{quote}"
        </blockquote>
      </div>

      <p className="mb-4 text-gray-700 dark:text-gray-300">
        Click the button below to generate a background image based on the quote.
      </p>

      <button
        onClick={generateImage}
        disabled={loading}
        className={`
          px-4 py-2 rounded font-medium
          ${loading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
          }
          transition-colors duration-200
          flex items-center justify-center
          min-w-[150px]
        `}
      >
        {loading ? (
          <>
            <span className="animate-spin mr-2">⟳</span>
            Generating...
          </>
        ) : (
          'Generate Image'
        )}
      </button>
    </div>
  );
};

export default QuoteImageGenerator;