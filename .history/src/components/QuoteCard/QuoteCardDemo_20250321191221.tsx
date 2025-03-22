import { useState } from 'react';
import { Quote } from '../../types';
import { 
  QuoteCard, 
  QuoteCardGrid, 
  QuoteCardSkeleton,
  QuoteCardStyleProps,
  QUOTE_CARD_DEFAULTS
} from './';

const DEMO_QUOTE: Quote = {
  id: 'demo-1',
  content: 'The only way to do great work is to love what you do.',
  author: {
    id: 'author-1',
    name: 'Steve Jobs',
    imageUrl: 'https://example.com/steve-jobs.jpg',
  },
  book: {
    id: 'book-1',
    title: 'Steve Jobs: The Biography',
  },
  authorId: 'author-1',
  tags: ['inspiration', 'work', 'passion'],
  likes: 1234,
  shares: 567,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export function QuoteCardDemo() {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  
  const variants: QuoteCardStyleProps['variant'][] = [
    'default',
    'compact',
    'featured'
  ];

  return (
    <div className="space-y-8 p-6">
      <section>
        <h2 className="text-xl font-semibold mb-4">Loading States</h2>
        <div className="space-y-4">
          {/* Single skeleton */}
          <div>
            <h3 className="text-lg mb-2">Single Card Skeleton</h3>
            <QuoteCardSkeleton />
          </div>

          {/* Grid skeleton */}
          <div>
            <h3 className="text-lg mb-2">Loading Grid</h3>
            <QuoteCardGrid count={3} />
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Card Variants</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {variants.map(variant => (
            <QuoteCard
              key={variant}
              quote={DEMO_QUOTE}
              variant={variant}
              liked={liked}
              saved={saved}
              onLike={() => setLiked(prev => !prev)}
              onSave={() => setSaved(prev => !prev)}
              onShare={() => alert('Share clicked')}
            />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Theme Examples</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Default theme */}
          <QuoteCard
            quote={DEMO_QUOTE}
            theme={QUOTE_CARD_DEFAULTS.theme}
          />

          {/* Custom light theme */}
          <QuoteCard
            quote={DEMO_QUOTE}
            theme={{
              backgroundColor: '#f0f9ff',
              textColor: '#0c4a6e',
              accentColor: '#0ea5e9',
            }}
          />

          {/* Custom dark theme */}
          <QuoteCard
            quote={DEMO_QUOTE}
            theme={{
              backgroundColor: '#1e293b',
              textColor: '#f8fafc',
              accentColor: '#38bdf8',
            }}
          />
        </div>
      </section>
    </div>
  );
}