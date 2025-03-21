import React, { useEffect } from 'react';

export type NotificationType = 'success' | 'error' | 'info';

interface NotificationProps {
  type: NotificationType;
  message: string;
  onClose: () => void;
  duration?: number;
  className?: string;
}

export const Notification: React.FC<NotificationProps> = ({
  type,
  message,
  onClose,
  duration = 5000,
  className = ''
}) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 dark:bg-green-900/20';
      case 'error':
        return 'bg-red-50 dark:bg-red-900/20';
      case 'info':
        return 'bg-blue-50 dark:bg-blue-900/20';
      default:
        return 'bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const getTextColor = () => {
    switch (type) {
      case 'success':
        return 'text-green-800 dark:text-green-200';
      case 'error':
        return 'text-red-800 dark:text-red-200';
      case 'info':
        return 'text-blue-800 dark:text-blue-200';
      default:
        return 'text-gray-800 dark:text-gray-200';
    }
  };

  const getBorderColor = () => {
    switch (type) {
      case 'success':
        return 'border-green-400 dark:border-green-600';
      case 'error':
        return 'border-red-400 dark:border-red-600';
      case 'info':
        return 'border-blue-400 dark:border-blue-600';
      default:
        return 'border-gray-400 dark:border-gray-600';
    }
  };

  return (
    <div
      className={`
        fixed bottom-4 right-4 z-50
        max-w-sm w-full p-4
        border rounded-lg shadow-lg
        ${getBackgroundColor()}
        ${getBorderColor()}
        ${className}
      `}
      role="alert"
    >
      <div className="flex items-start">
        <div className="flex-1">
          <p className={`text-sm font-medium ${getTextColor()}`}>
            {message}
          </p>
        </div>
        <button
          onClick={onClose}
          className={`
            ml-4 inline-flex flex-shrink-0
            ${getTextColor()}
            hover:opacity-75 focus:outline-none
          `}
          aria-label="Close notification"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Notification;