interface ToggleSwitchProps {
  checked: boolean;
  onChange: () => void;
  label: string;
}

export function ToggleSwitch({ checked, onChange, label }: ToggleSwitchProps) {
  const switchId = `toggle-${label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className="flex items-center justify-between">
      <label 
        htmlFor={switchId}
        className="text-sm text-gray-700 dark:text-gray-300"
      >
        {label}
      </label>
      <button
        id={switchId}
        type="button"
        role="switch"
        aria-checked={String(checked) as 'true' | 'false'}
        aria-label={`Toggle ${label}`}
        onClick={onChange}
        className={`
          relative inline-flex h-6 w-11 items-center rounded-full
          ${checked ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          dark:focus:ring-offset-gray-800
        `}
      >
        <span className="sr-only">
          {checked ? `Disable ${label}` : `Enable ${label}`}
        </span>
        <span
          className={`
            inline-block h-4 w-4 transform rounded-full bg-white transition-transform
            ${checked ? 'translate-x-6' : 'translate-x-1'}
          `}
          aria-hidden="true"
        />
      </button>
    </div>
  );
}