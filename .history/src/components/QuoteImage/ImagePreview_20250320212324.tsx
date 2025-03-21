import React from 'react';
import { GeneratedImage } from '../../services/deepai/types';

interface ImagePreviewProps {
  image: GeneratedImage;
  quote: string;
  onDownload?: () => void;
  onShare?: () => void;
  className?: string;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({
  image,
  quote,
  onDownload,
  onShare,
  className = ''
}) => {
  const handleDownload = async () => {
    try {
      const response = await fetch(image.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `quote-${image.metadata.quoteId}.webp`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      onDownload?.();
    } catch (error) {
      console.error('Failed to download image:', error);
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Quote Image',
          text: quote,
          url: image.url
        });
        onShare?.();
      } else {
        // Fallback for browsers that don't support Web Share API
        await navigator.clipboard.writeText(image.url);
        alert('Image URL copied to clipboard!');
      }
    } catch (error) {
      console.error('Failed to share image:', error);
    }
  };

  return (
    <div className={`rounded-lg overflow-hidden shadow-lg ${className}`}>
      <div className="relative">
        <img
          src={image.url}
          alt="Generated background for quote"
          className="w-full h-auto"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity duration-200">
          <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-end gap-2">
            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-white text-gray-900 rounded hover:bg-gray-100 transition-colors duration-200"
              aria-label="Download image"
            >
              Download
            </button>
            <button
              onClick={handleShare}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200"
              aria-label="Share image"
            >
              Share
            </button>
          </div>
        </div>
      </div>
      <div className="p-4 bg-white dark:bg-gray-800">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          <p>Style: {image.metadata.backgroundType}</p>
          <p>Created: {new Date(image.metadata.timestamp).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
};

export default ImagePreview;