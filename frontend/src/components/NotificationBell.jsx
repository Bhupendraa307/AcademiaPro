import { useState, useRef, useEffect } from 'react';
import { useNotifications } from './NotificationContext';
import { useAuth } from './AuthContext';

export default function NotificationBell() {
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [modalNotif, setModalNotif] = useState(null);
  const bellRef = useRef();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (bellRef.current && !bellRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Helper to get dashboard notice link by role
  function getDashboardNoticeLink(link) {
    if (!user) return link;
    if (link === '/notices') {
      if (user.role === 'student') return '/student-dashboard#notices';
      if (user.role === 'faculty') return '/faculty-dashboard#notices';
      if (user.role === 'admin') return '/admin-dashboard#notices';
    }
    return link;
  }

  return (
    <div className="relative z-[9999]" ref={bellRef}>
      <button
        className="relative p-2 rounded-full hover:bg-blue-100 transition"
        onClick={() => setOpen(o => !o)}
      >
        <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 font-bold">
            {unreadCount}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-2xl z-[9999] border border-blue-100 animate-fade-in-up">
          <div className="p-4 border-b font-bold text-blue-700">Notifications</div>
          <ul className="max-h-80 overflow-y-auto">
            {notifications.length === 0 && (
              <li className="p-4 text-gray-500 text-center">No notifications</li>
            )}
            {notifications.map(n => (
              <li
                key={n._id}
                className={`px-4 py-3 border-b last:border-b-0 flex items-start gap-2 ${n.read ? 'bg-gray-50' : 'bg-blue-50'}`}
              >
                <div className="flex-1">
                  <div className="font-semibold">{n.title}</div>
                  <div className="text-sm text-gray-600 line-clamp-2">{n.message}</div>
                  <button
                    className="text-blue-600 text-xs hover:underline mt-1"
                    onClick={() => setModalNotif(n)}
                  >
                    View
                  </button>
                  {!n.read && (
                    <button
                      className="ml-2 text-xs text-blue-500 hover:underline"
                      onClick={() => markAsRead(n._id)}
                    >
                      Mark as read
                    </button>
                  )}
                </div>
                <span className="text-xs text-gray-400 mt-1">{new Date(n.createdAt).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-[9998]"
          onClick={() => setOpen(false)}
        />
      )}
      
      {/* Modal for notification details */}
      {modalNotif && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full relative animate-fade-in-up">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl font-bold"
              onClick={() => setModalNotif(null)}
              aria-label="Close"
            >
              &times;
            </button>
            <div className="mb-2 text-lg font-bold text-blue-700">{modalNotif.title}</div>
            <div className="mb-4 text-gray-700 whitespace-pre-line">{modalNotif.message}</div>
            <div className="text-xs text-gray-400">{new Date(modalNotif.createdAt).toLocaleString()}</div>
          </div>
        </div>
      )}
      <style>{`
        .animate-fade-in-up {
          animation: fadeInUp 0.4s cubic-bezier(0.23, 1, 0.32, 1);
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}