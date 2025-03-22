import { useState } from 'react';
import { FiUser, FiBook, FiUsers, FiCheck } from 'react-icons/fi';
import { Author } from '../../types/author';

interface AuthorInfoProps {
  author: Author;
  onFollow?: () => void;
  isFollowing?: boolean;
}

export function AuthorInfo({ author, onFollow, isFollowing = false }: AuthorInfoProps) {
  const [following, setFollowing] = useState(isFollowing);
  const [loading, setLoading] = useState(false);

  const handleFollow = async () => {
    if (loading) return;

    setLoading(true);
    try {
      await onFollow?.();
      setFollowing(prev => !prev);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
        {/* Author Avatar */}
        <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0">
          {author.imageUrl ? (
            <img
              src={author.imageUrl}
              alt={author.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <FiUser className="w-12 h-12 text-gray-400" />
            </div>
          )}
        </div>

        {/* Author Info */}
        <div className="flex-grow">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {author.name}
          </h1>
          {author.bio && (
            <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-2xl">
              {author.bio}
            </p>
          )}
          
          {/* Stats */}
          <div className="flex flex-wrap gap-6 text-sm">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <FiBook className="w-4 h-4" />
              <span>{author.notableWorks?.length || 0} Notable Works</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <FiUsers className="w-4 h-4" />
              <span>{author.followers.toLocaleString()} Followers</span>
            </div>
          </div>
        </div>

        {/* Follow Button */}
        <button
          onClick={handleFollow}
          disabled={loading}
          className={`
            flex items-center gap-2 px-6 py-2 rounded-full text-sm font-medium
            transition-colors
            ${following
              ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
              : 'bg-blue-600 text-white hover:bg-blue-700 dark:hover:bg-blue-500'}
            ${loading ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          {following ? (
            <>
              <FiCheck className="w-4 h-4" />
              <span>Following</span>
            </>
          ) : (
            <>
              <FiUsers className="w-4 h-4" />
              <span>Follow</span>
            </>
          )}
        </button>
      </div>

      {/* Notable Works */}
      {author.notableWorks && author.notableWorks.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Notable Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {author.notableWorks.map((work: { id: string; title: string; year?: number }) => (
              <div
                key={work.id}
                className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
              >
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {work.title} {work.year && `(${work.year})`}
                </h3>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}