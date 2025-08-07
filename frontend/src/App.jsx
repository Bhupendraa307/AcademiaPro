import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useNavigate
} from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/StudentDashboard";
import FacultyDashboard from "./pages/FacultyDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Profile from "./pages/Profile";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import { AuthProvider, useAuth } from "./components/AuthContext";
import NotificationBell from './components/EnhancedNotificationBell';
import { NotificationProvider } from './components/NotificationContext';
import LogoutModal from './components/LogoutModal';
import defaultAvatar from "./assets/default-avatar.png";
import { useState } from "react";
import { UserGroupIcon, AcademicCapIcon } from '@heroicons/react/24/outline';

function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to={`/${user.role}-dashboard`} />;
  return children;
}

function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/student-dashboard" element={
        <ProtectedRoute role="student"><StudentDashboard /></ProtectedRoute>
      } />
      <Route path="/faculty-dashboard" element={
        <ProtectedRoute role="faculty"><FacultyDashboard /></ProtectedRoute>
      } />
      <Route path="/admin-dashboard" element={
        <ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>
      } />
      <Route path="/profile" element={<Profile />} />
      <Route path="*" element={<Navigate to={user && user.role ? `/${user.role}-dashboard` : "/"} />} />
    </Routes>
  );
}

function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const avatarUrl = user?.profileImage && user.profileImage.startsWith('http') ? user.profileImage : defaultAvatar;
  
  const handleLogoutClick = () => {
    setLogoutModalOpen(true);
    setMenuOpen(false);
  };

  const handleLogoutConfirm = () => {
    logout();
    setLogoutModalOpen(false);
  };

  return (
    <>
      {/* Enhanced branding bar with gradient */}
      <div className="h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 w-full" />
      <nav className="bg-white/95 backdrop-blur-md shadow-xl rounded-b-3xl mb-0 px-4 py-4 transition-all duration-300 border-b border-gray-100" style={{ boxShadow: '0 8px 32px 0 rgba(80, 112, 255, 0.1)' }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent hover:from-indigo-700 hover:to-purple-700 transition-all duration-300">
            <AcademicCapIcon className="h-8 w-8 text-indigo-600" />
            AcademiaPro
          </Link>
          {/* Hamburger for mobile */}
          <button
            className="md:hidden flex justify-center items-center w-10 h-10 focus:outline-none bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100"
            onClick={() => setMenuOpen(m => !m)}
            aria-label="Toggle menu"
          >
            <UserGroupIcon className="h-6 w-6 text-indigo-700" />
          </button>
          {/* Desktop menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="hover:text-indigo-600 font-medium transition-all duration-200 hover:scale-105">Home</Link>
            {!user && <Link to="/login" className="hover:text-indigo-600 font-medium transition-all duration-200 hover:scale-105">Login</Link>}
            {!user && <Link to="/register" className="hover:text-indigo-600 font-medium transition-all duration-200 hover:scale-105">Register</Link>}
            {user && user.role && <Link to={`/${user.role}-dashboard`} className="hover:text-indigo-600 font-medium transition-all duration-200 hover:scale-105">Dashboard</Link>}
            <div className="flex items-center gap-4 ml-2">
              {user && (
                <Link to="/profile" className="hover:text-indigo-600 font-medium transition-all duration-200 flex items-center gap-2 hover:scale-105">
                  <img
                    src={avatarUrl}
                    alt="avatar"
                    className="w-8 h-8 rounded-full border-2 border-indigo-200 shadow-lg object-cover hover:border-indigo-300 transition-all duration-200"
                    onError={(e) => {
                      e.target.src = defaultAvatar;
                    }}
                  />
                  Profile
                </Link>
              )}
              {user && <NotificationBell />}
            </div>
            {user && (
              <button
                onClick={handleLogoutClick}
                className="ml-2 px-4 py-2 bg-gradient-to-r from-red-50 to-pink-50 text-red-600 rounded-xl font-medium hover:from-red-100 hover:to-pink-100 transition-all duration-200 border border-red-200 shadow-md hover:shadow-lg hover:scale-105"
              >
                Logout
              </button>
            )}
          </div>
        </div>
        {/* Enhanced mobile menu dropdown */}
        {menuOpen && (
          <div className="md:hidden flex flex-col gap-4 mt-4 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-6 border border-indigo-100 animate-fade-in-up">
            <Link to="/" className="hover:text-indigo-600 font-medium transition-all duration-200 hover:scale-105" onClick={() => setMenuOpen(false)}>Home</Link>
            {!user && <Link to="/login" className="hover:text-indigo-600 font-medium transition-all duration-200 hover:scale-105" onClick={() => setMenuOpen(false)}>Login</Link>}
            {!user && <Link to="/register" className="hover:text-indigo-600 font-medium transition-all duration-200 hover:scale-105" onClick={() => setMenuOpen(false)}>Register</Link>}
            {user && user.role && <Link to={`/${user.role}-dashboard`} className="hover:text-indigo-600 font-medium transition-all duration-200 hover:scale-105" onClick={() => setMenuOpen(false)}>Dashboard</Link>}
            {user && (
              <Link to="/profile" className="hover:text-indigo-600 font-medium transition-all duration-200 flex items-center gap-2 hover:scale-105" onClick={() => setMenuOpen(false)}>
                <img
                  src={avatarUrl}
                  alt="avatar"
                  className="w-8 h-8 rounded-full border-2 border-indigo-200 shadow-lg object-cover hover:border-indigo-300 transition-all duration-200"
                  onError={(e) => {
                    e.target.src = defaultAvatar;
                  }}
                />
                Profile
              </Link>
            )}
            {user && <div className="mt-2"><NotificationBell /></div>}
            {user && (
              <button
                onClick={handleLogoutClick}
                className="mt-2 px-4 py-2 bg-gradient-to-r from-red-50 to-pink-50 text-red-600 rounded-xl font-medium hover:from-red-100 hover:to-pink-100 transition-all duration-200 border border-red-200 shadow-md hover:shadow-lg hover:scale-105 w-full text-left"
              >
                Logout
              </button>
            )}
          </div>
        )}
      </nav>

      {/* Logout Modal */}
      <LogoutModal
        isOpen={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        onConfirm={handleLogoutConfirm}
      />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
            <Navbar />
            {/* Enhanced separator line */}
            <div className="h-0.5 w-full bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 opacity-80 blur-[2px]" style={{ boxShadow: '0 4px 16px 0 rgba(80,112,255,0.15)' }} />
            <div className="w-full">
              <AppRoutes />
            </div>
          </div>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
