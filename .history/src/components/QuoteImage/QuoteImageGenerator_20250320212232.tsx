import React, { useState } from 'react';
import { GeneratedImage } from '../../services/deepai/types';

interface QuoteImageGeneratorProps {
  quote: string;
  onImageGenerated: (image: GeneratedImage) => void;
  onError: (error: Error) => void;
}

const QuoteImageGenerator: React.FC<QuoteImageGeneratorProps> = ({
  quote,
  onImageGenerated,
  onError,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Simulated function to trigger image generation.
  // Replace this with actual API integration.
  const generateImage = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Simulated generated image response
      const simulatedImage: GeneratedImage = {
        url: "https://example.com/generated-image.webp",
        metadata: {
          backgroundType: "nature",
          timestamp: new Date().toISOString(),
          quoteId: "simulated-quote-id",
          // You can add more metadata from the generation API here.
        }
      };

      onImageGenerated(simulatedImage);
    } catch (err: any) {
      setErrorMsg("Image generation failed. Please try again.");
      onError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow bg-white dark:bg-gray-800">
      <h2 className="text-lg font-semibold mb-2">Generate Background Image</h2>
      <p className="mb-4 text-gray-700 dark:text-gray-300">
        Click the button below to generate a background image based on the quote.
      </p>
      <button
        onClick={generateImage}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Generating..." : "Generate Image"}
      </button>
      {errorMsg && (
        <div className="mt-4 text-red-600">
          {errorMsg}
        </div>
      )}
    </div>
  );
};

export default QuoteImageGenerator;