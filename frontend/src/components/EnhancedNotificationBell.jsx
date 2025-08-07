import React, { useState, useEffect, useRef } from 'react';
import { BellIcon } from '@heroicons/react/24/outline';
import { useAuth } from './AuthContext';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const EnhancedNotificationBell = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const bellRef = useRef();

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/notifications/${user._id}`, {
        headers: { authorization: token }
      });
      setNotifications(response.data);
      setUnreadCount(response.data.filter(n => !n.read).length);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      if (!notificationId) {
        toast.error('Notification ID not found');
        return;
      }
      
      const token = localStorage.getItem('token');
      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/notifications/read/${notificationId}`, {}, {
        headers: { authorization: token }
      });
      setNotifications(prev => 
        prev.map(n => n._id === notificationId ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error('Failed to mark notification as read');
    }
  };

  const markAllAsRead = async () => {
    try {
      if (!user || !user._id) {
        toast.error('User not found');
        return;
      }
      
      const token = localStorage.getItem('token');
      const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/notifications/mark-all-read/${user._id}`, {}, {
        headers: { authorization: token }
      });
      
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
      toast.success('All notifications marked as read');
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast.error('Failed to mark all notifications as read');
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (bellRef.current && !bellRef.current.contains(e.target)) setIsOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="relative z-[9999]" ref={bellRef}>
      <button
        className="relative p-2 rounded-full hover:bg-blue-100 transition"
        onClick={() => setIsOpen(!isOpen)}
      >
        <BellIcon className="h-6 w-6 text-blue-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-2xl z-[9999] border border-blue-100 animate-fade-in-up">
          <div className="p-4 border-b font-bold text-blue-700">
            <div className="flex items-center justify-between">
              <span>Notifications</span>
              {unreadCount > 0 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    markAllAsRead();
                  }}
                  className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  Mark all as read
                </button>
              )}
            </div>
          </div>
          <ul className="max-h-80 overflow-y-auto">
            {loading ? (
              <li className="p-4 text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="text-sm text-gray-500 mt-2">Loading notifications...</p>
              </li>
            ) : notifications.length === 0 ? (
              <li className="p-4 text-gray-500 text-center">No notifications</li>
            ) : (
              notifications.map(n => (
                <li
                  key={n._id}
                  className={`px-4 py-3 border-b last:border-b-0 flex items-start gap-2 ${
                    n.read ? 'bg-gray-50' : 'bg-blue-50'
                  }`}
                >
                  <div className="flex-1">
                    <div className="font-semibold">{n.title}</div>
                    <div className="text-sm text-gray-600 line-clamp-2">{n.message}</div>
                    {!n.read && (
                      <button
                        className="text-xs text-blue-500 hover:underline mt-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(n._id);
                        }}
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                  <span className="text-xs text-gray-400 mt-1">{new Date(n.createdAt).toLocaleString()}</span>
                </li>
              ))
            )}
          </ul>
          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-100 bg-gray-50">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(false);
                }}
                className="w-full text-center text-sm text-gray-600 hover:text-gray-800 font-medium"
              >
                View all notifications
              </button>
            </div>
          )}
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[9998]"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default EnhancedNotificationBell;
