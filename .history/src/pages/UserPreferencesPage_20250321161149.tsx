import { useUserPreferences } from '../contexts/UserPreferencesContext';
import { FiMoon, FiSun, FiMonitor, FiType, FiBell, FiEye, FiFilter } from 'react-icons/fi';
import type { UserPreferences } from '../types/preferences';
import { ToggleSwitch } from '../components/ToggleSwitch/ToggleSwitch';

export function UserPreferencesPage() {
  const { preferences, updatePreference, updateNestedPreference, isLoading } = useUserPreferences();

  const themeOptions: Array<{ value: UserPreferences['theme']; label: string; icon: React.ReactNode }> = [
    { value: 'light', label: 'Light', icon: <FiSun /> },
    { value: 'dark', label: 'Dark', icon: <FiMoon /> },
    { value: 'system', label: 'System', icon: <FiMonitor /> },
  ];

  const fontSizeOptions: Array<{ value: UserPreferences['fontSize']; label: string }> = [
    { value: 'small', label: 'Small' },
    { value: 'medium', label: 'Medium' },
    { value: 'large', label: 'Large' },
  ];

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 animate-pulse">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg h-96" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        User Preferences
      </h1>

      <div className="space-y-8">
        {/* Appearance Section */}
        <section className="bg-white dark:bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <FiEye />
            <span>Appearance</span>
          </h2>

          <div className="space-y-6">
            {/* Theme Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Theme
              </label>
              <div className="flex gap-4">
                {themeOptions.map(({ value, label, icon }) => (
                  <button
                    key={value}
                    onClick={() => updatePreference('theme', value)}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-lg
                      ${preferences.theme === value
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'}
                    `}
                    aria-current={preferences.theme === value ? 'true' : 'false'}
                  >
                    {icon}
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Font Size Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Font Size
              </label>
              <div className="flex gap-4">
                {fontSizeOptions.map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => updatePreference('fontSize', value)}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-lg
                      ${preferences.fontSize === value
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'}
                    `}
                    aria-current={preferences.fontSize === value ? 'true' : 'false'}
                  >
                    <FiType />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Notifications Section */}
        <section className="bg-white dark:bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <FiBell />
            <span>Notifications</span>
          </h2>

          <div className="space-y-4">
            <ToggleSwitch
              checked={preferences.showNotifications}
              onChange={() => updatePreference('showNotifications', !preferences.showNotifications)}
              label="Show Notifications"
            />

            <ToggleSwitch
              checked={preferences.emailDigest}
              onChange={() => updatePreference('emailDigest', !preferences.emailDigest)}
              label="Email Digest"
            />
          </div>
        </section>

        {/* Content Filters Section */}
        <section className="bg-white dark:bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <FiFilter />
            <span>Content Filters</span>
          </h2>

          <div className="space-y-4">
            {Object.entries(preferences.contentFilters).map(([key, value]) => {
              const label = key.replace(/([A-Z])/g, ' $1').toLowerCase();
              return typeof value === 'boolean' ? (
                <ToggleSwitch
                  key={key}
                  checked={value}
                  onChange={() => updateNestedPreference('contentFilters', key as any, !value)}
                  label={label}
                />
              ) : null;
            })}
          </div>
        </section>

        {/* Display Options */}
        <section className="bg-white dark:bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <FiEye />
            <span>Display Options</span>
          </h2>

          <div className="space-y-4">
            {Object.entries(preferences.displayOptions).map(([key, value]) => {
              const label = key.replace(/([A-Z])/g, ' $1').toLowerCase();
              return typeof value === 'boolean' ? (
                <ToggleSwitch
                  key={key}
                  checked={value}
                  onChange={() => updateNestedPreference('displayOptions', key as any, !value)}
                  label={label}
                />
              ) : null;
            })}
          </div>
        </section>
      </div>
    </div>
  );
}