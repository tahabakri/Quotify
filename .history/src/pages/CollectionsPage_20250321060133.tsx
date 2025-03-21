import { useState } from 'react';
import { FiGrid, FiStar, FiUser, FiPlus } from 'react-icons/fi';
import { CollectionsGrid } from '../components/CollectionsGrid/CollectionsGrid';
import { CreateCollectionModal } from '../components/CreateCollectionModal/CreateCollectionModal';

type CollectionView = 'all' | 'featured' | 'my';

export function CollectionsPage() {
  const [activeView, setActiveView] = useState<CollectionView>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const views: Array<{
    id: CollectionView;
    label: string;
    icon: React.ReactNode;
  }> = [
    { id: 'all', label: 'All Collections', icon: <FiGrid /> },
    { id: 'featured', label: 'Featured', icon: <FiStar /> },
    { id: 'my', label: 'My Collections', icon: <FiUser /> },
  ];

  const handleCreateSuccess = () => {
    // After successful creation, switch to "My Collections" view
    setActiveView('my');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Collections
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Discover curated collections of inspiring quotes
        </p>
      </div>

      {/* View Selector */}
      <div className="flex flex-wrap gap-4 mb-8">
        {views.map(({ id, label, icon }) => (
          <button
            key={id}
            onClick={() => setActiveView(id)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
              transition-colors
              ${
                activeView === id
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              }
            `}
          >
            {icon}
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Collections Grid */}
      {activeView === 'all' && (
        <CollectionsGrid />
      )}

      {activeView === 'featured' && (
        <CollectionsGrid featured />
      )}

      {activeView === 'my' && (
        <div>
          {/* TODO: Replace with actual user ID from auth context */}
          <CollectionsGrid userId="current_user_id" />
        </div>
      )}

      {/* Create Collection Button - Fixed position */}
      <button
        className="fixed bottom-8 right-8 bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
        aria-label="Create new collection"
        onClick={() => setIsCreateModalOpen(true)}
      >
        <FiPlus className="w-6 h-6" />
      </button>

      {/* Create Collection Modal */}
      <CreateCollectionModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
}