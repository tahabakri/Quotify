import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthorInfo } from '../components/AuthorInfo/AuthorInfo';
import { QuotesList } from '../components/QuotesList/QuotesList';
import { Author } from '../types/author';
import { supabase } from '../services/supabase/client';

export function AuthorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [author, setAuthor] = useState<Author | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  interface AuthorData {
    id: string;
    name: string;
    bio: string | null;
    image_url: string | null;
    notable_works: { id: string; title: string; year?: number }[] | null;
    followers: number;
    quotes_count: number;
    works_count: number;
    nationality: string | null;
    genres: string[] | null;
    website: string | null;
    wikipedia_url: string | null;
    created_at: string;
    updated_at: string;
  }

  const fetchAuthor = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('authors')
        .select(`
          id,
          name,
          bio,
          image_url,
          notable_works,
          followers,
          quotes_count,
          works_count,
          nationality,
          genres,
          website,
          wikipedia_url,
          created_at,
          updated_at
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) throw new Error('Author not found');

      setAuthor({
        id: data.id,
        name: data.name,
        bio: data.bio || '',
        imageUrl: data.image_url,
        notableWorks: data.notable_works || [],
        followers: data.followers || 0,
        quotesCount: data.quotes_count || 0,
        worksCount: data.works_count || 0,
        nationality: data.nationality,
        genres: data.genres || [],
        website: data.website,
        wikipediaUrl: data.wikipedia_url,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch author');
      if (err instanceof Error && err.message === 'Author not found') {
        navigate('/not-found', { replace: true });
      }
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  const handleFollow = async () => {
    if (!author) return;

    try {
      await supabase
        .from('author_followers')
        .upsert([
          {
            author_id: author.id,
            user_id: 'current_user_id', // TODO: Replace with actual user ID
            created_at: new Date().toISOString()
          }
        ]);

      setAuthor((prev: Author | null) =>
        prev ? { ...prev, followers: prev.followers + 1 } : null
      );
    } catch (error) {
      console.error('Error following author:', error);
    }
  };

  useEffect(() => {
    fetchAuthor();
  }, [fetchAuthor]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 animate-pulse">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg h-64 mb-8" />
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg h-48" />
      </div>
    );
  }

  if (error || !author) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-red-500">{error || 'Author not found'}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-12">
        <AuthorInfo
          author={author}
          onFollow={handleFollow}
          isFollowing={false} // TODO: Check if user is following
        />
      </div>

      <QuotesList authorId={author.id} />
    </div>
  );
}