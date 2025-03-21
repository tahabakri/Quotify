import React, { useState, useCallback } from 'react';
import { Quote } from '../../services/supabase/types';
import { ImagePreview } from './ImagePreview';
import { BackgroundTypeSelector } from './BackgroundTypeSelector';
import { useImageGeneration } from '../../contexts/ImageGenerationContext';
import { Loader2, Download, Share2 } from 'lucide-react';

interface QuoteImageProps {
  quote: Quote;
  className?: string;
}

export interface ImageGenerationSettings {
  // ...existing code...
}

export function QuoteImage({ quote, className = '' }: QuoteImageProps) {
  const { generateImage, loading, currentImage } = useImageGeneration();
  const [backgroundType, setBackgroundType] = useState<'ai' | 'gradient' | 'solid'>('ai');

  const handleGenerate = useCallback(async () => {
    await generateImage(quote.content, {
      type: backgroundType,
      style: 'modern',
      mood: 'inspirational'
    });
  }, [generateImage, quote.content, backgroundType]);

  const handleDownload = useCallback(async () => {
    if (!currentImage) return;

    const response = await fetch(currentImage);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quote-${quote.id}.png`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }, [currentImage, quote.id]);

  const handleShare = useCallback(async () => {
    if (!currentImage) return;

    try {
      if (navigator.share) {
        const response = await fetch(currentImage);
        const blob = await response.blob();
        const file = new File([blob], 'quote.png', { type: 'image/png' });
        await navigator.share({
          title: 'Share Quote',
          text: quote.content,
          files: [file]
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  }, [currentImage, quote.content]);

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Quote Image Generator
          </h3>
          <BackgroundTypeSelector
            value={backgroundType}
            onChange={setBackgroundType}
          />
        </div>

        <ImagePreview
          quote={quote}
          imageUrl={currentImage}
          loading={loading}
          className="w-full aspect-[3/2] rounded-lg overflow-hidden"
        />

        <div className="flex items-center gap-4">
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="btn-primary flex-1"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Generating...
              </>
            ) : (
              'Generate Image'
            )}
          </button>

          {currentImage && (
            <>
              <button
                onClick={handleDownload}
                className="btn-secondary !p-2"
                aria-label="Download image"
              >
                <Download className="w-4 h-4" />
              </button>

              <button
                onClick={handleShare}
                className="btn-secondary !p-2"
                aria-label="Share image"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default QuoteImage;