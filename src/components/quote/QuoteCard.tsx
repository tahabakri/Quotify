import { Link } from 'react-router-dom';

interface QuoteCardProps {
  content: string;
  author: {
    id: string;
    name: string;
  };
  book?: {
    id: string;
    title: string;
  };
  isQuoteOfTheDay?: boolean;
}

export const QuoteCard = ({ content, author, book, isQuoteOfTheDay }: QuoteCardProps) => {
  return (
    <div
      className={`
        p-8 rounded-card shadow-sm border bg-white dark:bg-navy-card
        card-hover card-border-accent
        ${isQuoteOfTheDay
          ? 'border-gold/30 dark:border-gold/20'
          : 'border-white/50 dark:border-white/5'}
      `}
    >
      {isQuoteOfTheDay && (
        <div className="flex items-center gap-2 mb-5">
          <span className="text-gold text-lg">&#9733;</span>
          <span className="font-label text-gold">Quote of the Day</span>
        </div>
      )}

      <blockquote className="space-y-5">
        <p className="font-quote text-xl md:text-2xl text-foreground leading-relaxed">
          &ldquo;{content}&rdquo;
        </p>

        <footer className="flex items-start justify-between pt-2">
          <div className="flex-1">
            <Link
              to={`/authors/${author.id}`}
              className="font-heading text-sm tracking-wider text-foreground hover:text-primary-500 transition-colors"
            >
              {author.name}
            </Link>
            {book && (
              <Link
                to={`/books/${book.id}`}
                className="block mt-1 font-body text-sm text-muted-foreground hover:text-primary-500 transition-colors"
              >
                {book.title}
              </Link>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              className="p-2 text-muted-foreground hover:text-primary-500 transition-colors"
              aria-label="Like quote"
            >
              <span>&#10084;</span>
            </button>
            <button
              type="button"
              className="p-2 text-muted-foreground hover:text-primary-500 transition-colors"
              aria-label="Share quote"
            >
              <span>&#8599;</span>
            </button>
          </div>
        </footer>
      </blockquote>
    </div>
  );
};

export const QuoteCardSkeleton = () => {
  return (
    <div className="p-8 rounded-card shadow-sm border border-border bg-white dark:bg-navy-card">
      <div className="space-y-4 animate-pulse">
        <div className="h-5 bg-muted rounded-full w-3/4" />
        <div className="h-5 bg-muted rounded-full w-full" />
        <div className="h-5 bg-muted rounded-full w-2/3" />
        <div className="flex justify-between items-center pt-4">
          <div>
            <div className="h-4 bg-muted rounded-full w-24 mb-2" />
            <div className="h-3 bg-muted rounded-full w-32" />
          </div>
          <div className="flex gap-2">
            <div className="h-8 w-8 bg-muted rounded-full" />
            <div className="h-8 w-8 bg-muted rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};
