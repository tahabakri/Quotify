import { Notification } from './Notification';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../store/auth';

export const NotificationContainer = () => {
  const { notifications, dismissNotification } = useAuth();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {notifications.map((notification, index) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{
              duration: 0.2,
              delay: index * 0.05, // Staggered animation
            }}
            className="pointer-events-auto"
          >
            <Notification
              id={notification.id}
              type={notification.type}
              message={notification.message}
              duration={notification.duration}
              onDismiss={dismissNotification}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};