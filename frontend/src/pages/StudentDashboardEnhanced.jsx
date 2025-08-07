import { useAuth } from "../components/AuthContext";
import { 
  AcademicCapIcon, CalendarIcon, CurrencyDollarIcon, ClipboardDocumentListIcon, 
  Bars3Icon, ChevronRightIcon, ChartBarIcon, BellIcon, ClockIcon, 
  UserGroupIcon, BookOpenIcon, TrophyIcon 
} from '@heroicons/react/24/outline';
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { toast } from 'react-hot-toast';
import AnalyticsCard from '../components/AnalyticsCard';

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/student`;

export default function StudentDashboardEnhanced() {
  const { user } = useAuth();
  const [attendance, setAttendance] = useState(null);
  const [results, setResults] = useState([]);
  const [notices, setNotices] = useState([]);
  const [fee, setFee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const token = localStorage.getItem("token");
    const headers = { authorization: token };
    async function fetchData() {
      setLoading(true);
      try {
        const [att, res, not, fe] = await Promise.all([
          axios.get(`${API_URL}/attendance`, { headers }).then(r => r.data),
          axios.get(`${API_URL}/results`, { headers }).then(r => r.data),
          axios.get(`${API_URL}/notices`, { headers }).then(r => r.data),
          axios.get(`${API_URL}/fees`, { headers }).then(r => r.data),
        ]);
        setAttendance(att);
        setResults(res);
        setNotices(not);
        setFee(fe);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        toast.error('Failed to fetch dashboard data.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const overallCGPA = results.length
    ? (results.reduce((sum, r) => sum + (parseFloat(r.cgpa) || 0), 0) / results.length).toFixed(2)
    : "--";

  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <p className="text-indigo-600 font-medium">Loading AcademiaPro...</p>
      </div>
    </div>
  );

  const analyticsData = [
    {
      title: "Attendance Rate",
      value: `${attendance?.percentage ?? 0}%`,
      change: "+2.5%",
      changeType: "increase",
      icon: CalendarIcon,
      color: "text-indigo-600",
      bgColor: "bg-indigo-100"
    },
    {
      title: "Current CGPA",
      value: overallCGPA,
      change: "+0.3",
      changeType: "increase",
      icon: TrophyIcon,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: "Fee Status",
      value: fee?.status ?? "Unknown",
      change: null,
      icon: CurrencyDollarIcon,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100"
    },
    {
      title: "Active Notices",
      value: notices.length,
      change: "+3",
      changeType: "increase",
      icon: BellIcon,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    }
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
      {/* Mobile Menu Button */}
      {!sidebarOpen ? (
        <button
          className="md:hidden fixed top-4 left-4 z-30 bg-white/95 backdrop-blur-md p-3 rounded-full shadow-xl border border-indigo-200"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open sidebar"
        >
          <Bars3Icon className="h-6 w-6 text-indigo-700" />
        </button>
      ) : (
        <button
          className="md:hidden fixed top-4 left-4 z-40 bg-white/95 backdrop-blur-md p-3 rounded-full shadow-xl border border-indigo-200"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar"
        >
          <ChevronRightIcon className="h-6 w-6 text-indigo-700" />
        </button>
      )}

      {/* Enhanced Sidebar */}
      <aside
        className={`
          fixed z-40 top-0 left-0 h-screen md:h-auto min-h-screen w-64 bg-white/95 backdrop-blur-md shadow-2xl p-2 md:p-6 flex flex-col items-center rounded-r-3xl transition-transform duration-300 flex-shrink-0
          md:relative md:translate-x-0 md:flex md:w-64 md:z-auto
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        style={{ maxWidth: '90vw' }}
        aria-label="Sidebar"
      >
        <button
          className="md:hidden absolute top-4 right-4 bg-indigo-100 p-2 rounded-full"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar"
        >
          <ChevronRightIcon className="h-6 w-6 text-indigo-700" />
        </button>
        
        <div className="text-center mb-8">
          <AcademicCapIcon className="h-12 w-12 text-indigo-600 mb-2" />
          <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">AcademiaPro</h2>
          <p className="text-sm text-gray-500">Student Portal</p>
        </div>

        <div className="mb-6 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mb-2">
            <UserGroupIcon className="h-8 w-8 text-indigo-600" />
          </div>
          <div className="font-semibold text-gray-700">{user?.name || "Student"}</div>
          <div className="text-xs text-gray-500">{user?.email}</div>
        </div>

        <nav className="w-full space-y-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 hover:scale-105 ${
              activeTab === 'overview' 
                ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' 
                : 'hover:bg-gray-100 text-gray-700'
            }`}
          >
            <ChartBarIcon className="h-5 w-5" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab('attendance')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 hover:scale-105 ${
              activeTab === 'attendance' 
                ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' 
                : 'hover:bg-gray-100 text-gray-700'
            }`}
          >
            <CalendarIcon className="h-5 w-5" />
            Attendance
          </button>
          <button
            onClick={() => setActiveTab('results')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 hover:scale-105 ${
              activeTab === 'results' 
                ? 'bg-green-100 text-green-700 border border-green-200' 
                : 'hover:bg-gray-100 text-gray-700'
            }`}
          >
            <ClipboardDocumentListIcon className="h-5 w-5" />
            Results
          </button>
          <button
            onClick={() => setActiveTab('notices')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 hover:scale-105 ${
              activeTab === 'notices' 
                ? 'bg-purple-100 text-purple-700 border border-purple-200' 
                : 'hover:bg-gray-100 text-gray-700'
            }`}
          >
            <BellIcon className="h-5 w-5" />
            Notices
          </button>
          <button
            onClick={() => setActiveTab('fees')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 hover:scale-105 ${
              activeTab === 'fees' 
                ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' 
                : 'hover:bg-gray-100 text-gray-700'
            }`}
          >
            <CurrencyDollarIcon className="h-5 w-5" />
            Fees
          </button>
        </nav>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-label="Sidebar overlay"
        />
      )}

      {/* Main Content */}
      <main className="flex-1 p-2 sm:p-4 md:p-10">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Welcome back, {user?.name || "Student"}!
          </h1>
          <p className="text-gray-600">Here's your academic overview for today</p>
        </div>

        {/* Analytics Cards */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {analyticsData.map((data, index) => (
              <AnalyticsCard key={index} {...data} />
            ))}
          </div>
        )}

        {/* Content Sections */}
        <div className="space-y-8">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <ClockIcon className="h-5 w-5 text-indigo-600 mr-2" />
                  Recent Activity
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg">
                    <span className="text-sm text-gray-700">Attendance marked</span>
                    <span className="text-xs text-gray-500">2 hours ago</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="text-sm text-gray-700">New result published</span>
                    <span className="text-xs text-gray-500">1 day ago</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <span className="text-sm text-gray-700">Fee reminder</span>
                    <span className="text-xs text-gray-500">3 days ago</span>
                  </div>
                </div>
              </div>

              <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <BookOpenIcon className="h-5 w-5 text-green-600 mr-2" />
                  Quick Actions
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <button className="p-3 bg-indigo-100 text-indigo-700 rounded-xl hover:bg-indigo-200 transition-colors text-sm font-medium">
                    View Timetable
                  </button>
                  <button className="p-3 bg-green-100 text-green-700 rounded-xl hover:bg-green-200 transition-colors text-sm font-medium">
                    Download Results
                  </button>
                  <button className="p-3 bg-purple-100 text-purple-700 rounded-xl hover:bg-purple-200 transition-colors text-sm font-medium">
                    View Notices
                  </button>
                  <button className="p-3 bg-yellow-100 text-yellow-700 rounded-xl hover:bg-yellow-200 transition-colors text-sm font-medium">
                    Pay Fees
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'attendance' && (
            <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <CalendarIcon className="h-5 w-5 text-indigo-600 mr-2" />
                Attendance Details
              </h3>
              {attendance ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-indigo-50 rounded-xl">
                      <div className="text-2xl font-bold text-indigo-700">{attendance.attended}</div>
                      <div className="text-sm text-gray-600">Classes Attended</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-xl">
                      <div className="text-2xl font-bold text-green-700">{attendance.total}</div>
                      <div className="text-sm text-gray-600">Total Classes</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-xl">
                      <div className="text-2xl font-bold text-purple-700">{attendance.percentage}%</div>
                      <div className="text-sm text-gray-600">Attendance Rate</div>
                    </div>
                  </div>
                  <div className="mt-6">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${attendance.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">No attendance data available.</p>
              )}
            </div>
          )}

          {activeTab === 'results' && (
            <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <ClipboardDocumentListIcon className="h-5 w-5 text-green-600 mr-2" />
                Academic Results
              </h3>
              {results.length ? (
                <div className="space-y-4">
                  {results.map((r, i) => (
                    <div key={i} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">Semester {r.semester}</h4>
                        <span className="text-lg font-bold text-green-600">CGPA: {r.cgpa}</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {r.subjects.map((s, j) => (
                          <div key={j} className="flex justify-between text-sm">
                            <span className="text-gray-600">{s.name}</span>
                            <span className="font-medium">{s.grade} ({s.marks})</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No results available.</p>
              )}
            </div>
          )}

          {activeTab === 'notices' && (
            <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <BellIcon className="h-5 w-5 text-purple-600 mr-2" />
                Notices & Announcements
              </h3>
              {notices.length ? (
                <div className="space-y-4">
                  {notices.map((n, i) => (
                    <div key={i} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">{n.title}</h4>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                          {new Date(n.date).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm">{n.content}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No notices available.</p>
              )}
            </div>
          )}

          {activeTab === 'fees' && (
            <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <CurrencyDollarIcon className="h-5 w-5 text-yellow-600 mr-2" />
                Fee Information
              </h3>
              {fee ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-yellow-50 rounded-xl">
                      <div className="text-2xl font-bold text-yellow-700">{fee.status}</div>
                      <div className="text-sm text-gray-600">Payment Status</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-xl">
                      <div className="text-2xl font-bold text-green-700">₹{fee.amount}</div>
                      <div className="text-sm text-gray-600">Total Amount</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {fee.dueDate && (
                      <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                        <span className="text-sm text-gray-700">Due Date</span>
                        <span className="text-sm font-medium text-red-600">
                          {new Date(fee.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    {fee.lastPaid && (
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <span className="text-sm text-gray-700">Last Paid</span>
                        <span className="text-sm font-medium text-green-600">
                          {new Date(fee.lastPaid).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                  <button className="w-full mt-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 transform hover:scale-105">
                    Pay Fees Now
                  </button>
                </div>
              ) : (
                <p className="text-gray-500">No fee information available.</p>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
