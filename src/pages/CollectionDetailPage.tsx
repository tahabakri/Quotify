import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCollectionsStore } from '../store/collections';
import { ErrorMessage } from '../components/common/ErrorMessage';

const CollectionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getCollection, removeFromCollection } = useCollectionsStore();

  const collection = id ? getCollection(id) : undefined;

  if (!collection) {
    return (
      <div className="min-h-screen bg-cream dark:bg-navy-deep">
        <div className="max-w-5xl mx-auto px-4 py-12">
          <ErrorMessage message="Collection not found" />
          <Link
            to="/collections"
            className="mt-4 inline-block font-label text-xs text-primary-500 hover:text-primary-600 uppercase tracking-wider transition-colors"
          >
            ← Back to Collections
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream dark:bg-navy-deep">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <Link
          to="/collections"
          className="font-label text-xs text-primary-500 hover:text-primary-600 uppercase tracking-wider mb-6 inline-block transition-colors"
        >
          ← Back to Collections
        </Link>

        <div className="mb-10">
          <h1 className="font-heading text-4xl text-foreground uppercase">
            {collection.name}
          </h1>
          {collection.description && (
            <p className="font-body text-muted-foreground mt-2">
              {collection.description}
            </p>
          )}
          <p className="font-label text-xs text-muted-foreground uppercase tracking-wider mt-2">
            {collection.quotes.length} quotes
          </p>
        </div>

        {collection.quotes.length > 0 ? (
          <div className="grid gap-4">
            {collection.quotes.map((quote) => (
              <div
                key={quote._id}
                className="bg-white dark:bg-navy-card rounded-card p-6 shadow-sm border border-border card-hover card-border-accent"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <blockquote className="font-quote text-lg text-foreground mb-2">
                      &ldquo;{quote.content}&rdquo;
                    </blockquote>
                    <Link
                      to={`/authors/${quote.authorSlug}`}
                      className="font-label text-xs text-muted-foreground hover:text-primary-500 uppercase tracking-wider transition-colors"
                    >
                      — {quote.author}
                    </Link>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFromCollection(collection.id, quote._id)}
                    className="ml-4 text-muted-foreground hover:text-red-500 font-label text-xs flex-shrink-0 transition-colors"
                    aria-label="Remove from collection"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="font-body text-muted-foreground bg-white dark:bg-navy-card rounded-card p-8 text-center border border-border">
            This collection is empty. Browse quotes and add them here!
          </p>
        )}
      </div>
    </div>
  );
};

export default CollectionDetailPage;
