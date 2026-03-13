import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCollectionsStore } from '../store/collections';

const CollectionsPage: React.FC = () => {
  const { savedQuotes, likedQuoteIds, collections, createCollection, deleteCollection } =
    useCollectionsStore();
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    createCollection(newName.trim(), newDescription.trim() || undefined);
    setNewName('');
    setNewDescription('');
    setShowCreate(false);
  };

  return (
    <div className="min-h-screen bg-cream dark:bg-navy-deep">
      <main className="max-w-5xl mx-auto px-4 py-12">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="font-heading text-4xl text-foreground uppercase">My Collections</h1>
            <p className="font-body text-muted-foreground mt-2">
              Your saved quotes and custom collections
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowCreate(!showCreate)}
            className="px-6 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-pill font-label text-xs uppercase tracking-wider transition-all btn-magnetic"
          >
            New Collection
          </button>
        </div>

        {/* Create Collection Form */}
        {showCreate && (
          <form
            onSubmit={handleCreate}
            className="bg-white dark:bg-navy-card rounded-card p-6 shadow-sm mb-10 border border-border"
          >
            <h3 className="font-heading text-xl text-foreground mb-4 uppercase">Create Collection</h3>
            <input
              type="text"
              placeholder="Collection name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full mb-3 px-4 py-3 rounded-pill border border-border bg-cream/50 dark:bg-navy-deep/50 text-foreground font-body placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500/50 transition-all"
            />
            <textarea
              placeholder="Description (optional)"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              rows={2}
              className="w-full mb-4 px-4 py-3 rounded-[1rem] border border-border bg-cream/50 dark:bg-navy-deep/50 text-foreground font-body placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500/50 transition-all resize-none"
            />
            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={!newName.trim()}
                className="px-6 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-pill font-label text-xs uppercase tracking-wider disabled:opacity-50 transition-all"
              >
                Create
              </button>
              <button
                type="button"
                onClick={() => setShowCreate(false)}
                className="px-6 py-2.5 border border-border rounded-pill font-label text-xs text-muted-foreground uppercase tracking-wider hover:border-primary-500/40 transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Saved Quotes */}
        <section className="mb-12">
          <h2 className="font-heading text-2xl text-foreground mb-6 uppercase">
            Saved Quotes ({savedQuotes.length})
          </h2>
          {savedQuotes.length > 0 ? (
            <div className="grid gap-4">
              {savedQuotes.map((quote) => (
                <div
                  key={quote._id}
                  className="bg-white dark:bg-navy-card rounded-card p-6 shadow-sm border border-border card-hover card-border-accent"
                >
                  <blockquote className="font-quote text-lg text-foreground mb-2">
                    &ldquo;{quote.content}&rdquo;
                  </blockquote>
                  <p className="font-label text-xs text-muted-foreground uppercase tracking-wider">
                    — {quote.author}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="font-body text-muted-foreground bg-white dark:bg-navy-card rounded-card p-8 text-center border border-border">
              No saved quotes yet. Browse quotes and save your favorites!
            </p>
          )}
        </section>

        {/* Liked Quotes Count */}
        <section className="mb-12">
          <div className="bg-white dark:bg-navy-card rounded-card p-6 shadow-sm border border-border">
            <h2 className="font-heading text-xl text-foreground uppercase">Liked Quotes</h2>
            <p className="font-heading text-4xl text-primary-500 mt-2">
              {likedQuoteIds.length}
            </p>
          </div>
        </section>

        {/* Custom Collections */}
        <section>
          <h2 className="font-heading text-2xl text-foreground mb-6 uppercase">
            Collections ({collections.length})
          </h2>
          {collections.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {collections.map((collection) => (
                <div
                  key={collection.id}
                  className="bg-white dark:bg-navy-card rounded-card shadow-sm border border-border overflow-hidden card-hover card-border-accent"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <Link
                        to={`/collections/${collection.id}`}
                        className="font-heading text-lg text-foreground hover:text-primary-500 uppercase transition-colors"
                      >
                        {collection.name}
                      </Link>
                      <button
                        type="button"
                        onClick={() => deleteCollection(collection.id)}
                        className="text-muted-foreground hover:text-red-500 font-label text-xs transition-colors"
                        aria-label="Delete collection"
                      >
                        ✕
                      </button>
                    </div>
                    {collection.description && (
                      <p className="font-body text-sm text-muted-foreground mt-2">
                        {collection.description}
                      </p>
                    )}
                    <p className="font-label text-xs text-muted-foreground uppercase tracking-wider mt-3">
                      {collection.quotes.length} quotes
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="font-body text-muted-foreground bg-white dark:bg-navy-card rounded-card p-8 text-center border border-border">
              No collections yet. Create one to organize your quotes!
            </p>
          )}
        </section>
      </main>
    </div>
  );
};

export default CollectionsPage;
