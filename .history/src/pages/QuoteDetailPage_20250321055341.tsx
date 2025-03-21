import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { QuoteView } from '../components/QuoteView/QuoteView';
import { RelatedQuotes } from '../components/RelatedQuotes/RelatedQuotes';
import { TrendingQuote } from '../types/quote';
import { supabase } from '../services/supabase/client';
import { generateImage } from '../services/deepai';

export function QuoteDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [quote, setQuote] = useState<TrendingQuote | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generatingImage, setGeneratingImage] = useState(false);

  const fetchQuote = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('quotes')
        .select(`
          *,
          book:books(title, cover_url),
          author:authors(name, image_url)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) throw new Error('Quote not found');

      setQuote(data as TrendingQuote);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch quote');
      if (err instanceof Error && err.message === 'Quote not found') {
        navigate('/not-found', { replace: true });
      }
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  const handleLike = async () => {
    if (!quote) return;

    try {
      await supabase.rpc('increment_quote_likes', { quote_id: quote.id });
      setQuote(prev => prev ? { ...prev, likes: prev.likes + 1 } : null);
    } catch (error) {
      console.error('Error liking quote:', error);
    }
  };

  const handleShare = async () => {
    if (!quote) return;

    try {
      await navigator.share({
        title: `Quote from ${quote.book.title}`,
        text: quote.content,
        url: window.location.href,
      });
    } catch (error) {
      console.error('Error sharing quote:', error);
    }
  };

  const handleGenerateImage = async () => {
    if (!quote || generatingImage) return;

    try {
      setGeneratingImage(true);
      const imageUrl = await generateImage(quote.content, {
        type: 'artistic',
        style: 'modern',
        mood: document.documentElement.classList.contains('dark') ? 'dark' : 'light'
      });
      
      // Save the generated image URL to the database
      await supabase
        .from('generated_images')
        .insert([
          {
            quote_id: quote.id,
            image_url: imageUrl,
            prompt: quote.content,
          }
        ]);

      // TODO: Show the generated image to the user
      console.log('Generated image:', imageUrl);
    } catch (error) {
      console.error('Error generating image:', error);
    } finally {
      setGeneratingImage(false);
    }
  };

  useEffect(() => {
    fetchQuote();
  }, [fetchQuote]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 animate-pulse">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg h-64 mb-8" />
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg h-48" />
      </div>
    );
  }

  if (error || !quote) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-red-500">{error || 'Quote not found'}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <QuoteView
        quote={quote}
        onLike={handleLike}
        onShare={handleShare}
        onGenerateImage={handleGenerateImage}
      />

      <div className="mt-12">
        <RelatedQuotes
          currentQuoteId={quote.id}
          authorId={quote.authorId}
          bookId={quote.bookId}
        />
      </div>
    </div>
  );
}