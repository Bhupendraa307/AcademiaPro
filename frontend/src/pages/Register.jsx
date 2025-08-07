import { useState } from "react";
import axios from "axios";
import { toast } from 'react-hot-toast';

const roles = [
  { value: "student", label: "Student" },
  { value: "faculty", label: "Faculty" },
  { value: "admin", label: "Admin" },
];

const departments = [
  "Computer Science",
  "Electronics",
  "Mechanical",
  "Civil",
  "Mathematics",
  "Physics",
  "Chemistry",
  "Other",
];

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth`; // Backend API URL

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    rollno: "",
    empid: "",
    department: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log('API_URL:', API_URL); // Debug log
      console.log('Environment variable:', import.meta.env.VITE_API_URL); // Debug log
      await axios.post(`${API_URL}/register`, form);
      toast.success("Registration successful! You can now log in.");
      setTimeout(() => {
        window.location.href = "/login";
      }, 1000); // 1 second delay
    } catch (err) {
      console.error('Registration error:', err); // Debug log
      toast.error(err.response?.data?.error || "Registration failed. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-4">
      <div className="w-full max-w-md bg-white/95 backdrop-blur-md p-8 rounded-3xl shadow-2xl border-t-8 border-indigo-200 animate-fade-in-up">
        <div className="text-center mb-8">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mb-6 border-2 border-indigo-200">
            <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0v6m0 0c-4.418 0-8-1.79-8-4" />
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">Join AcademiaPro</h1>
          <p className="text-gray-500">Create your account to get started</p>
        </div>
        {/* error && (
          <div className="mb-6 p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-center border border-red-100 animate-fade-in">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        ) */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Full Name</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </span>
              <input
                type="text"
                className="w-full border-2 border-indigo-100 rounded-xl px-10 py-3 text-lg focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition placeholder-gray-400"
                value={form.name}
                onChange={handleChange}
                name="name"
                required
                placeholder="Full Name"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M2.003 5.884L12 13l9.997-7.116A2 2 0 0020 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M22 8.118l-10 7-10-7V20a2 2 0 002 2h16a2 2 0 002-2V8.118z" />
                </svg>
              </span>
              <input
                type="email"
                className="w-full border-2 border-indigo-100 rounded-xl px-10 py-3 text-lg focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition placeholder-gray-400"
                value={form.email}
                onChange={handleChange}
                name="email"
                required
                placeholder="Email Address"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </span>
              <input
                type="password"
                className="w-full border-2 border-indigo-100 rounded-xl px-10 py-3 text-lg focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition placeholder-gray-400"
                value={form.password}
                onChange={handleChange}
                name="password"
                required
                minLength={8}
                placeholder="Password"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Role</label>
            <div className="relative">
              <select
                className="block w-full pl-4 pr-10 py-3 border-2 border-indigo-100 rounded-xl focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 bg-white text-gray-700 text-lg appearance-none transition"
                value={form.role}
                onChange={handleChange}
                name="role"
                required
                style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg fill=\'none\' stroke=\'%236B7280\' stroke-width=\'2\' viewBox=\'0 0 24 24\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' d=\'M19 9l-7 7-7-7\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.5em 1.5em' }}
              >
                <option value="">Select role</option>
                {roles.map((role) => (
                  <option key={role.value} value={role.value}>{role.label}</option>
                ))}
              </select>
            </div>
          </div>
          {form.role === "student" && (
            <div className="space-y-2">
              <label htmlFor="rollno" className="block text-sm font-medium text-gray-700">Roll Number</label>
              <input
                type="text"
                id="rollno"
                name="rollno"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500 bg-white text-gray-700"
                style={{ '--tw-placeholder-opacity': '1' }}
                placeholder="e.g. 2023CS101"
                value={form.rollno}
                onChange={handleChange}
                required
              />
            </div>
          )}

          {(form.role === "student" || form.role === "faculty") && (
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Department</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v4a1 1 0 001 1h3v6a1 1 0 001 1h4a1 1 0 001-1v-6h3a1 1 0 001-1V7a1 1 0 00-1-1H4a1 1 0 00-1 1z" />
                  </svg>
                </span>
                <select
                  className="block w-full pl-10 pr-10 py-3 border-2 border-indigo-100 rounded-xl focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 bg-white text-gray-700 text-lg appearance-none transition"
                  value={form.department}
                  onChange={handleChange}
                  name="department"
                  required
                  style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg fill=\'none\' stroke=\'%236B7280\' stroke-width=\'2\' viewBox=\'0 0 24 24\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' d=\'M19 9l-7 7-7-7\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.5em 1.5em' }}
                >
                  <option value="">Select your department</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {(form.role === "faculty" || form.role === "admin") && (
            <div className="space-y-2">
              <label htmlFor="empid" className="block text-sm font-medium text-gray-700">Employee ID</label>
              <input
                type="text"
                id="empid"
                name="empid"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500 bg-white text-gray-700"
                style={{ '--tw-placeholder-opacity': '1' }}
                placeholder="e.g. EMP2023001"
                value={form.empid}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg rounded-xl shadow-md hover:scale-105 hover:from-indigo-700 hover:to-purple-700 transition-transform duration-150 ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Registering...
              </span>
            ) : 'Register Now'}
          </button>
        </form>
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Already have an account? <a href="/login" className="text-indigo-600 hover:text-indigo-800 font-medium">Sign in</a></p>
        </div>
      </div>
      <style>{`
        .animate-fade-in-up {
          animation: fadeInUp 0.7s cubic-bezier(0.23, 1, 0.32, 1);
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}