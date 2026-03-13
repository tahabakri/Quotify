import React from 'react';
import { useUserPreferences } from '../contexts/UserPreferencesContext';
import { useCollectionsStore } from '../store/collections';

const SettingsPage: React.FC = () => {
  const { preferences, updatePreference } = useUserPreferences();
  const { savedQuotes, likedQuoteIds, collections } = useCollectionsStore();

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all saved data? This cannot be undone.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-cream dark:bg-navy-deep">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="font-heading text-4xl text-foreground mb-10 uppercase">Settings</h1>

        {/* Appearance */}
        <section className="bg-white dark:bg-navy-card rounded-card p-6 shadow-sm border border-border mb-6">
          <h2 className="font-heading text-xl text-foreground mb-6 uppercase">Appearance</h2>

          <div className="mb-6">
            <label className="font-label text-xs text-muted-foreground uppercase tracking-wider block mb-3">
              Theme
            </label>
            <div className="flex space-x-3">
              {(['light', 'dark', 'system'] as const).map((theme) => (
                <button
                  key={theme}
                  type="button"
                  onClick={() => updatePreference('theme', theme)}
                  className={`px-5 py-2 rounded-pill font-label text-xs uppercase tracking-wider transition-all ${
                    preferences.theme === theme
                      ? 'bg-primary-500 text-white shadow-md shadow-primary-500/20'
                      : 'bg-cream dark:bg-navy-deep border border-border text-muted-foreground hover:border-primary-500/40'
                  }`}
                >
                  {theme}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="font-label text-xs text-muted-foreground uppercase tracking-wider block mb-3">
              Font Size
            </label>
            <div className="flex space-x-3">
              {(['small', 'medium', 'large'] as const).map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => updatePreference('fontSize', size)}
                  className={`px-5 py-2 rounded-pill font-label text-xs uppercase tracking-wider transition-all ${
                    preferences.fontSize === size
                      ? 'bg-primary-500 text-white shadow-md shadow-primary-500/20'
                      : 'bg-cream dark:bg-navy-deep border border-border text-muted-foreground hover:border-primary-500/40'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Data Summary */}
        <section className="bg-white dark:bg-navy-card rounded-card p-6 shadow-sm border border-border mb-6">
          <h2 className="font-heading text-xl text-foreground mb-6 uppercase">Your Data</h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="font-heading text-3xl text-primary-500">
                {savedQuotes.length}
              </p>
              <p className="font-label text-xs text-muted-foreground uppercase tracking-wider mt-1">Saved</p>
            </div>
            <div>
              <p className="font-heading text-3xl text-red-500">
                {likedQuoteIds.length}
              </p>
              <p className="font-label text-xs text-muted-foreground uppercase tracking-wider mt-1">Liked</p>
            </div>
            <div>
              <p className="font-heading text-3xl text-gold">
                {collections.length}
              </p>
              <p className="font-label text-xs text-muted-foreground uppercase tracking-wider mt-1">Collections</p>
            </div>
          </div>
        </section>

        {/* Danger Zone */}
        <section className="bg-white dark:bg-navy-card rounded-card p-6 shadow-sm border border-red-200 dark:border-red-900/50">
          <h2 className="font-heading text-xl text-red-500 mb-2 uppercase">Danger Zone</h2>
          <p className="font-body text-sm text-muted-foreground mb-4">
            Clear all locally stored data including saved quotes, collections, and preferences.
          </p>
          <button
            type="button"
            onClick={handleClearData}
            className="px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-pill font-label text-xs uppercase tracking-wider transition-all"
          >
            Clear All Data
          </button>
        </section>
      </div>
    </div>
  );
};

export default SettingsPage;
