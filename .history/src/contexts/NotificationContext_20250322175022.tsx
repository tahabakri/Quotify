import { createContext, useContext, useState, useCallback } from 'react';
import { Notification } from '../components/common/Notification';
import { createPortal } from 'react-dom';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

interface NotificationData {
  id: string;
  type: NotificationType;
  message: string;
  duration?: number;
}

interface NotificationContextType {
  notify: (type: NotificationType, message: string, duration?: number) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);

  const notify = useCallback((type: NotificationType, message: string, duration = 5000) => {
    const id = Date.now().toString();
    const notification: NotificationData = { id, type, message, duration };
    
    setNotifications(prev => [...prev, notification]);

    if (duration > 0) {
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== id));
      }, duration);
    }
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  return (
    <NotificationContext.Provider value={{ notify, clearAll }}>
      {children}
      {createPortal(
        <div 
          aria-live="polite" 
          aria-atomic="true"
          className="fixed bottom-0 right-0 p-4 space-y-4 z-50 max-w-md w-full pointer-events-none"
        >
          {notifications.map(notification => (
            <div key={notification.id} className="pointer-events-auto">
              <Notification
                id={notification.id}
                type={notification.type}
                message={notification.message}
                onDismiss={removeNotification}
                duration={notification.duration}
              />
            </div>
          ))}
        </div>,
        document.body
      )}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}