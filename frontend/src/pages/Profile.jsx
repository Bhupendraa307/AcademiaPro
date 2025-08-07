import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useAuth } from "../components/AuthContext";
import defaultAvatar from "../assets/default-avatar.png";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-hot-toast';

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/profile`;

export default function Profile() {
  const { user, login, loading: authLoading } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", department: "", rollno: "", empid: "", profileImage: "" });
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios.get(API_URL, { headers: { authorization: token } })
      .then(res => {
        setForm(res.data);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!authLoading && !user) navigate("/login");
  }, [user, authLoading, navigate]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setMsg("");
    const token = localStorage.getItem("token");
    try {
      const res = await axios.put(API_URL, { ...form, password: password || undefined }, { headers: { authorization: token } });
      setMsg("Profile updated!");
      login(res.data); // Update context
      setPassword("");
      toast.success("Profile updated!");
    } catch (err) {
      setMsg(err.response?.data?.error || "Update failed");
      toast.error(err.response?.data?.error || "Update failed");
    }
  };

  const handleImageChange = async (e) => {
    if (!e.target.files[0]) return;
    setUploading(true);
    const token = localStorage.getItem("token");
    const data = new FormData();
    data.append("profileImage", e.target.files[0]);
    try {
      const res = await axios.post(`${API_URL}/image`, data, {
        headers: { authorization: token }
      });
      setForm(f => ({ ...f, profileImage: res.data.profileImage }));
      setMsg("Profile image updated!");
      toast.success("Profile image updated!");
    } catch (err) {
      setMsg("Image upload failed");
      toast.error("Image upload failed");
    }
    setUploading(false);
  };

  if (loading || authLoading) return <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-100 via-blue-50 to-purple-100">Loading...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-blue-50 to-purple-100 py-6">
      <div className="w-full max-w-md sm:max-w-xl bg-white p-2 sm:p-4 md:p-8 rounded-2xl shadow-xl border-t-4 border-blue-200 mx-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold mb-4 sm:mb-6 text-blue-700 text-center tracking-tight drop-shadow">My Profile</h1>
        <div className="flex flex-col items-center mb-4 sm:mb-6">
          <div className="relative group">
            <img
              src={form.profileImage && form.profileImage.startsWith('http') ? form.profileImage : defaultAvatar}
              alt="Profile"
              className="w-20 h-20 sm:w-28 sm:h-28 rounded-full border-4 border-blue-300 object-cover shadow-xl transition-transform group-hover:scale-105"
              onError={(e) => {
                e.target.src = defaultAvatar;
              }}
            />
            <button
              className="absolute bottom-2 right-2 bg-blue-600 text-white rounded-full p-2 shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              onClick={() => fileInputRef.current.click()}
              type="button"
              title="Change profile image"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6-6m2 2a2.828 2.828 0 11-4-4 2.828 2.828 0 014 4z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7v6a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h7a2 2 0 012 2z" />
              </svg>
            </button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleImageChange}
              disabled={uploading}
            />
          </div>
          {uploading && <div className="text-xs text-gray-500 mt-2 animate-pulse">Uploading...</div>}
        </div>
        {msg && <div className={`mb-4 text-center px-2 py-2 rounded-lg font-semibold ${msg.includes('fail') || msg.includes('error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{msg}</div>}
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-5 w-full">
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Name</label>
            <input name="name" value={form.name} onChange={handleChange} placeholder="Enter your name" className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 shadow-sm text-base" required />
          </div>
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Email</label>
            <input name="email" value={form.email} onChange={handleChange} placeholder="Enter your email" className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 shadow-sm text-base" required />
          </div>
          {user?.role === "student" && (
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Roll No</label>
              <input name="rollno" value={form.rollno || ""} onChange={handleChange} placeholder="e.g. 2023CS101" className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 shadow-sm text-base" />
            </div>
          )}
          {(user?.role === "faculty" || user?.role === "admin") && (
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Employee ID</label>
              <input name="empid" value={form.empid || ""} onChange={handleChange} placeholder="e.g. EMP01" className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 shadow-sm text-base" />
            </div>
          )}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Department</label>
            <input name="department" value={form.department || ""} onChange={handleChange} placeholder="e.g. Computer Science" className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 shadow-sm text-base" />
          </div>
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Change Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 shadow-sm text-base" placeholder="Leave blank to keep current" />
          </div>
          <button type="submit" className="w-full py-2 sm:py-3 bg-blue-600 text-white rounded-xl font-bold text-base sm:text-lg shadow-md hover:bg-blue-700 transition">Update Profile</button>
        </form>
      </div>
    </div>
  );
}