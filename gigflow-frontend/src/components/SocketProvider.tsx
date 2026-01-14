import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { initializeSocket, disconnectSocket, getSocket } from '@/lib/socket';
import { useToast } from '@/hooks/use-toast';

interface Notification {
  id: string;
  type: 'hired' | 'bid_received' | 'general';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

interface SocketContextType {
  notifications: Notification[];
  markAsRead: (id: string) => void;
  clearNotifications: () => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocketNotifications = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocketNotifications must be used within SocketProvider');
  }
  return context;
};

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (user?.id) {
      const socket = initializeSocket(user.id);

      // Listen for hire notifications
      socket.on('hired', (data: { gigTitle: string }) => {
        const notification: Notification = {
          id: Date.now().toString(),
          type: 'hired',
          title: '🎉 Congratulations! You got hired!',
          message: `You have been hired for the gig: "${data.gigTitle}"`,
          timestamp: new Date(),
          read: false,
        };

        setNotifications(prev => [notification, ...prev]);

        // Show toast notification
        toast({
          title: notification.title,
          description: notification.message,
          duration: 8000, // Show longer for important notifications
        });
      });

      // Listen for bid received notifications
      socket.on('bid_received', (data: { gigTitle: string; bidderName: string }) => {
        const notification: Notification = {
          id: Date.now().toString(),
          type: 'bid_received',
          title: '💰 New bid received!',
          message: `${data.bidderName} placed a bid on your gig: "${data.gigTitle}"`,
          timestamp: new Date(),
          read: false,
        };

        setNotifications(prev => [notification, ...prev]);

        toast({
          title: notification.title,
          description: notification.message,
          duration: 6000,
        });
      });

      return () => {
        disconnectSocket();
      };
    } else {
      disconnectSocket();
    }
  }, [user?.id, toast]);

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const value = {
    notifications,
    markAsRead,
    clearNotifications,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};
