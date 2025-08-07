import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export function useNotifications() {
  return useContext(NotificationContext);
}

export function NotificationProvider({ children }) {
  const { user } = useAuth();
  // console.log('NotificationProvider user:', user);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch notifications when user changes
  useEffect(() => {
    if (user?._id) {
      // console.log('Fetching notifications for user:', user);
      setLoading(true);
              axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/notifications/${user._id}`)
        .then(res => {
          // console.log('Fetched notifications:', res.data);
          setNotifications(Array.isArray(res.data) ? res.data : [])
        })
        .catch(err => {
          console.error('Error fetching notifications:', err);
          setNotifications([]);
        })
        .finally(() => setLoading(false));
    }
  }, [user]);

  // Mark as read
  const markAsRead = async (id) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/notifications/read/${id}`);
      setNotifications(prevNotifications => {
        if (!Array.isArray(prevNotifications)) return [];
        return prevNotifications.map(n => n._id === id ? { ...n, read: true } : n);
      });
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount: Array.isArray(notifications) ? notifications.filter(n => !n.read).length : 0,
      markAsRead,
      loading
    }}>
      {children}
    </NotificationContext.Provider>
  );
}