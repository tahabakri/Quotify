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
      <div className="relative inline-block">
        <input
          type="checkbox"
          id={switchId}
          checked={checked}
          onChange={onChange}
          className="sr-only"
        />
        <label
          htmlFor={switchId}
          className={`
            block w-11 h-6 rounded-full cursor-pointer transition-colors
            ${checked ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}
            focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2
            dark:focus-within:ring-offset-gray-800
          `}
        >
          <span className="sr-only">
            {checked ? `Disable ${label}` : `Enable ${label}`}
          </span>
          <span
            className={`
              block h-4 w-4 mt-1 ml-1 rounded-full bg-white transition-transform
              ${checked ? 'transform translate-x-5' : ''}
            `}
          />
        </label>
      </div>
    </div>
  );
}