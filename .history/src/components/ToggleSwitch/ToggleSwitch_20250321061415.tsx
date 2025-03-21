interface ToggleSwitchProps {
  checked: boolean;
  onChange: () => void;
  label: string;
}

export function ToggleSwitch({ checked, onChange, label }: ToggleSwitchProps) {
  return (
    <div className="flex items-center justify-between">
      <label 
        htmlFor={`toggle-${label}`}
        className="text-sm text-gray-700 dark:text-gray-300"
      >
        {label}
      </label>
      <button
        id={`toggle-${label}`}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={`Toggle ${label}`}
        onClick={onChange}
        className={`
          relative inline-flex h-6 w-11 items-center rounded-full
          ${checked ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}
        `}
      >
        <span
          className={`
            inline-block h-4 w-4 transform rounded-full bg-white transition
            ${checked ? 'translate-x-6' : 'translate-x-1'}
          `}
        />
      </button>
    </div>
  );
}