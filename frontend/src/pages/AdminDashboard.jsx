import { useEffect, useState } from 'react';
import axios from 'axios';
import { UserGroupIcon, AcademicCapIcon, ClipboardDocumentListIcon, BuildingOffice2Icon, PlusCircleIcon, TrashIcon, PencilIcon, ArrowDownTrayIcon, KeyIcon, UserIcon, Bars3Icon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin`;

export default function AdminDashboard() {
  const [departments, setDepartments] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [reports, setReports] = useState({});
  const [newDept, setNewDept] = useState({ name: '' });
  const [editDept, setEditDept] = useState(null);
  const [newTeacher, setNewTeacher] = useState({ name: '', email: '', password: '', empid: '', department: '' });
  const [editTeacher, setEditTeacher] = useState(null);
  const [newStudent, setNewStudent] = useState({ name: '', email: '', password: '', rollno: '', department: '' });
  const [editStudent, setEditStudent] = useState(null);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetUserId, setResetUserId] = useState(null);
  const [resetRole, setResetRole] = useState('');
  const [resetPassword, setResetPassword] = useState('');
  const [showHeadsPopover, setShowHeadsPopover] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');
  const headers = { headers: { authorization: token } };

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = () => {
    setLoading(true);
    axios.get(`${API_URL}/departments`, headers)
      .then(res => setDepartments(Array.isArray(res.data) ? res.data : []))
      .catch(() => {
        toast.error('Failed to fetch departments.');
        setDepartments([]);
      });
    axios.get(`${API_URL}/teachers`, headers)
      .then(res => setTeachers(Array.isArray(res.data) ? res.data : []))
      .catch(() => {
        toast.error('Failed to fetch teachers.');
        setTeachers([]);
      });
    axios.get(`${API_URL}/students`, headers)
      .then(res => setStudents(Array.isArray(res.data) ? res.data : []))
      .catch(() => {
        toast.error('Failed to fetch students.');
        setStudents([]);
      });
    axios.get(`${API_URL}/reports`, headers)
      .then(res => setReports(res.data))
      .catch(() => {
        toast.error('Failed to fetch reports.');
        setReports({});
      });
    setLoading(false);
  };

  // Department CRUD
  const handleAddDept = e => {
    e.preventDefault();
    axios.post(`${API_URL}/departments`, newDept, headers).then(() => {
      setNewDept({ name: '' });
      fetchAll();
      fetchLogs();
      toast.success('Department added!');
    }).catch(() => toast.error('Failed to add department.'));
  };
  const handleEditDept = e => {
    e.preventDefault();
    axios.put(`${API_URL}/departments/${editDept._id}`, editDept, headers).then(() => {
      setEditDept(null);
      fetchAll();
      fetchLogs();
      toast.success('Department updated!');
    }).catch(() => toast.error('Failed to update department.'));
  };
  const handleDeleteDept = id => {
    axios.delete(`${API_URL}/departments/${id}`, headers).then(() => {
      fetchAll();
      fetchLogs();
      toast.success('Department deleted!');
    }).catch(() => toast.error('Failed to delete department.'));
  };

  // Teacher CRUD
  const handleAddTeacher = e => {
    e.preventDefault();
    axios.post(`${API_URL}/teachers`, newTeacher, headers).then(() => {
      setNewTeacher({ name: '', email: '', password: '', empid: '', department: '' });
      fetchAll();
      fetchLogs();
      toast.success('Teacher added!');
    }).catch(() => toast.error('Failed to add teacher.'));
  };
  const handleEditTeacher = e => {
    e.preventDefault();
    axios.put(`${API_URL}/teachers/${editTeacher._id}`, editTeacher, headers).then(() => {
      setEditTeacher(null);
      fetchAll();
      fetchLogs();
      toast.success('Teacher updated!');
    }).catch(() => toast.error('Failed to update teacher.'));
  };
  const handleDeleteTeacher = id => {
    axios.delete(`${API_URL}/teachers/${id}`, headers).then(() => {
      fetchAll();
      fetchLogs();
      toast.success('Teacher deleted!');
    }).catch(() => toast.error('Failed to delete teacher.'));
  };

  // Student CRUD
  const handleAddStudent = e => {
    e.preventDefault();
    axios.post(`${API_URL}/students`, newStudent, headers).then(() => {
      setNewStudent({ name: '', email: '', password: '', rollno: '', department: '' });
      fetchAll();
      fetchLogs();
      toast.success('Student added!');
    }).catch(() => toast.error('Failed to add student.'));
  };
  const handleEditStudent = e => {
    e.preventDefault();
    axios.put(`${API_URL}/students/${editStudent._id}`, editStudent, headers).then(() => {
      setEditStudent(null);
      fetchAll();
      fetchLogs();
      toast.success('Student updated!');
    }).catch(() => toast.error('Failed to update student.'));
  };
  const handleDeleteStudent = id => {
    axios.delete(`${API_URL}/students/${id}`, headers).then(() => {
      fetchAll();
      fetchLogs();
      toast.success('Student deleted!');
    }).catch(() => toast.error('Failed to delete student.'));
  };

  const handleResetPassword = (userId, role) => {
    setResetUserId(userId);
    setResetRole(role);
    setShowResetModal(true);
    setResetPassword('');
  };
  const submitResetPassword = () => {
    if (!resetPassword) return;
    axios.put(`${API_URL}/reset-password/${resetUserId}`, { password: resetPassword }, headers)
      .then(() => {
        alert("Password reset!");
        setShowResetModal(false);
        setResetUserId(null);
        setResetRole('');
        setResetPassword('');
        fetchLogs();
        toast.success('Password reset!');
      }).catch(() => toast.error('Failed to reset password.'));
  };

  const exportCSV = (data, filename) => {
    const csv = [
      Object.keys(data[0]).join(','),
      ...data.map(row => Object.values(row).join(','))
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const [logs, setLogs] = useState([]);
  const fetchLogs = () => {
    axios.get(`${API_URL}/logs`, headers).then(res => setLogs(res.data));
  };
  useEffect(() => { fetchLogs(); }, []);

  // Fees section
  const [fees, setFees] = useState([]);
  const [newFee, setNewFee] = useState({ student: '', amount: '', status: 'Unpaid', dueDate: '' });
  const [editFee, setEditFee] = useState(null);

  const [notices, setNotices] = useState([]);
  const [newNotice, setNewNotice] = useState({ title: '', content: '', forRole: 'all' });
  const [editNotice, setEditNotice] = useState(null);

  // Fetch all fees and notices
  const fetchFees = () => axios.get(`${API_URL}/fees`, headers).then(res => setFees(res.data));
  const fetchNotices = () => axios.get(`${API_URL}/notices`, headers).then(res => setNotices(res.data));

  // Add, edit, delete handlers for fees
  const handleAddFee = e => {
    e.preventDefault();
    axios.post(`${API_URL}/fees`, newFee, headers).then(() => {
      setNewFee({ student: '', amount: '', status: 'Unpaid', dueDate: '' });
      fetchFees();
      toast.success('Fee added!');
    }).catch(() => toast.error('Failed to add fee.'));
  };
  const handleEditFee = e => {
    e.preventDefault();
    axios.put(`${API_URL}/fees/${editFee._id}`, editFee, headers).then(() => {
      setEditFee(null);
      fetchFees();
      toast.success('Fee updated!');
    }).catch(() => toast.error('Failed to update fee.'));
  };
  const handleDeleteFee = id => {
    axios.delete(`${API_URL}/fees/${id}`, headers).then(fetchFees).then(() => {
      toast.success('Fee deleted!');
    }).catch(() => toast.error('Failed to delete fee.'));
  };

  // Add, edit, delete handlers for notices
  const handleAddNotice = e => {
    e.preventDefault();
    axios.post(`${API_URL}/notices`, newNotice, headers).then(() => {
      setNewNotice({ title: '', content: '', forRole: 'all' });
      fetchNotices();
      toast.success('Notice added!');
    }).catch(() => toast.error('Failed to add notice.'));
  };
  const handleEditNotice = e => {
    e.preventDefault();
    axios.put(`${API_URL}/notices/${editNotice._id}`, editNotice, headers).then(() => {
      setEditNotice(null);
      fetchNotices();
      toast.success('Notice updated!');
    }).catch(() => toast.error('Failed to update notice.'));
  };
  const handleDeleteNotice = id => {
    axios.delete(`${API_URL}/notices/${id}`, headers).then(fetchNotices).then(() => {
      toast.success('Notice deleted!');
    }).catch(() => toast.error('Failed to delete notice.'));
  };

  // In useEffect, also fetch fees and notices
  useEffect(() => {
    fetchAll();
    fetchLogs();
    fetchFees();
    fetchNotices();
  }, []);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
      {/* Hamburger or Arrow for mobile */}
      {!sidebarOpen ? (
        <button
          className="md:hidden fixed top-4 left-4 z-30 bg-white p-2 rounded-full shadow-lg border border-blue-100"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open sidebar"
        >
          <Bars3Icon className="h-7 w-7 text-blue-700" />
        </button>
      ) : (
        <button
          className="md:hidden fixed top-4 left-4 z-40 bg-white p-2 rounded-full shadow-lg border border-blue-100"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar"
        >
          <ChevronRightIcon className="h-7 w-7 text-blue-700" />
        </button>
      )}
      {/* Sidebar */}
      <aside
        className={`
          fixed z-40 top-0 left-0 h-screen md:h-auto min-h-screen w-64 bg-white shadow-lg p-2 md:p-6 flex flex-col items-center rounded-r-3xl transition-transform duration-300 flex-shrink-0
          md:relative md:translate-x-0 md:flex md:w-64 md:z-auto
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        style={{ maxWidth: '90vw' }}
        aria-label="Sidebar"
      >
        {/* Close button for mobile */}
        <button
          className="md:hidden absolute top-4 right-4 bg-blue-100 p-1 rounded-full"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar"
        >
          <ChevronRightIcon className="h-6 w-6 text-blue-700" />
        </button>
        <UserGroupIcon className="h-12 w-12 text-blue-600 mb-2" />
        <h2 className="text-xl font-bold mb-2 text-blue-700">Admin</h2>
        <div className="mb-6 text-center">
          <div className="font-semibold text-gray-700">Admin User</div>
          <div className="text-xs text-gray-500">admin@college.edu</div>
        </div>
        <ul className="space-y-3 w-full">
          <li>
            <a href="#departments" className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-100 text-gray-700 text-base font-medium transition">
              <BuildingOffice2Icon className="h-5 w-5 text-blue-500" /> Departments
            </a>
          </li>
          <li>
            <a href="#teachers" className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-green-100 text-gray-700 text-base font-medium transition">
              <AcademicCapIcon className="h-5 w-5 text-green-500" /> Teachers
            </a>
          </li>
          <li>
            <a href="#students" className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-purple-100 text-gray-700 text-base font-medium transition">
              <UserGroupIcon className="h-5 w-5 text-purple-500" /> Students
            </a>
          </li>
          <li>
            <a href="#reports" className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-yellow-100 text-gray-700 text-base font-medium transition">
              <ClipboardDocumentListIcon className="h-5 w-5 text-yellow-500" /> Reports
            </a>
          </li>
          <li>
            <button type="button" onClick={() => setShowHeadsPopover(true)} className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-50 text-left text-gray-700 text-base font-medium transition">
              <UserIcon className="h-5 w-5 text-blue-400" /> Head of Departments
            </button>
          </li>
        </ul>
      </aside>
      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-label="Sidebar overlay"
        />
      )}
      {/* Main Content */}
      <main className="flex-1 p-2 sm:p-4 md:p-10">
        {loading && <div className="flex justify-center items-center h-32"><svg className="animate-spin h-8 w-8 text-blue-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg></div>}
        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4 md:mb-8">Welcome to AcademiaPro, Admin User!</h1>
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-10">
          <div className="bg-white rounded-xl shadow p-4 md:p-6 flex items-center gap-3 md:gap-4 border-b-4 border-blue-200">
            <BuildingOffice2Icon className="h-7 w-7 md:h-8 md:w-8 text-blue-500" />
            <div>
              <div className="text-xl md:text-2xl font-bold text-blue-700">{reports.totalDepartments || 0}</div>
              <div className="text-gray-500 text-xs md:text-sm">Departments</div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-4 md:p-6 flex items-center gap-3 md:gap-4 border-b-4 border-green-200">
            <AcademicCapIcon className="h-7 w-7 md:h-8 md:w-8 text-green-500" />
            <div>
              <div className="text-xl md:text-2xl font-bold text-green-700">{reports.totalTeachers || 0}</div>
              <div className="text-gray-500 text-xs md:text-sm">Teachers</div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-4 md:p-6 flex items-center gap-3 md:gap-4 border-b-4 border-purple-200">
            <ClipboardDocumentListIcon className="h-7 w-7 md:h-8 md:w-8 text-purple-500" />
            <div>
              <div className="text-xl md:text-2xl font-bold text-purple-700">{reports.totalStudents || 0}</div>
              <div className="text-gray-500 text-xs md:text-sm">Students</div>
            </div>
          </div>
        </div>
        {/* Departments Section */}
        <section id="departments" className="mb-6 md:mb-10">
          <h2 className="text-lg md:text-xl font-semibold mb-2 md:mb-4 text-blue-700 border-l-4 border-blue-400 pl-2 flex items-center justify-between">
            Departments
            <button onClick={() => exportCSV(departments, 'departments.csv')} className="ml-4 flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 font-semibold shadow transition text-xs md:text-sm">
              <ArrowDownTrayIcon className="h-4 w-4" /> Export
            </button>
          </h2>
          <div className="bg-white p-4 md:p-6 rounded-xl shadow mb-4 overflow-x-auto">
            <div className="overflow-x-auto w-full">
              <form onSubmit={editDept ? handleEditDept : handleAddDept} className="flex flex-col sm:flex-row flex-wrap gap-2 mb-4 w-full">
                <input type="text" placeholder="Department Name" className="border rounded px-2 py-1 flex-1 min-w-[120px]" value={editDept ? editDept.name : newDept.name} onChange={e => editDept ? setEditDept({ ...editDept, name: e.target.value }) : setNewDept({ ...newDept, name: e.target.value })} required />
                <select
                  className="border rounded px-2 py-1 min-w-[100px]"
                  value={editDept ? (editDept.head || '') : (newDept.head || '')}
                  onChange={e => editDept ? setEditDept({ ...editDept, head: e.target.value }) : setNewDept({ ...newDept, head: e.target.value })}
                >
                  <option value="">--Select Head--</option>
                  {Array.isArray(teachers) && teachers.map(t => (
                    <option key={t._id} value={t._id}>{t.name}</option>
                  ))}
                </select>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-1">
                  <PlusCircleIcon className="h-5 w-5" /> {editDept ? 'Update' : 'Add'}
                </button>
                {editDept && <button type="button" className="ml-2 text-gray-500" onClick={() => setEditDept(null)}>Cancel</button>}
              </form>
            </div>
            <ul>
              {(!Array.isArray(departments) || departments.length === 0) && <div className="text-gray-400 text-center py-4">No departments found.</div>}
              {Array.isArray(departments) && departments.map(d => (
                <li key={d._id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b py-2 w-full">
                  <span>{d.name}</span>
                  <div className="flex gap-4">
                    <button className="text-blue-600 flex items-center gap-1 px-2 py-1 rounded hover:bg-blue-50" onClick={() => setEditDept(d)}><PencilIcon className="h-4 w-4" />Edit</button>
                    <button className="text-red-600 flex items-center gap-1 px-2 py-1 rounded hover:bg-red-50" onClick={() => handleDeleteDept(d._id)}><TrashIcon className="h-4 w-4" />Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
        {/* Teachers Section */}
        <section id="teachers" className="mb-6 md:mb-10">
          <h2 className="text-lg md:text-xl font-semibold mb-2 md:mb-4 text-green-700 border-l-4 border-green-400 pl-2 flex items-center justify-between">
            Teachers
            <button onClick={() => exportCSV(teachers, 'teachers.csv')} className="ml-4 flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 font-semibold shadow transition text-xs md:text-sm">
              <ArrowDownTrayIcon className="h-4 w-4" /> Export
            </button>
          </h2>
          <div className="bg-white p-4 md:p-6 rounded-xl shadow mb-4 overflow-x-auto">
            <div className="overflow-x-auto w-full">
              <form onSubmit={editTeacher ? handleEditTeacher : handleAddTeacher} className="grid grid-cols-1 sm:grid-cols-5 gap-2 mb-4 w-full">
                <input type="text" placeholder="Name" className="border rounded px-2 py-1" value={editTeacher ? editTeacher.name : newTeacher.name} onChange={e => editTeacher ? setEditTeacher({ ...editTeacher, name: e.target.value }) : setNewTeacher({ ...newTeacher, name: e.target.value })} required />
                <input type="email" placeholder="Email" className="border rounded px-2 py-1" value={editTeacher ? editTeacher.email : newTeacher.email} onChange={e => editTeacher ? setEditTeacher({ ...editTeacher, email: e.target.value }) : setNewTeacher({ ...newTeacher, email: e.target.value })} required />
                <input type="text" placeholder="EmpID" className="border rounded px-2 py-1" value={editTeacher ? editTeacher.empid : newTeacher.empid} onChange={e => editTeacher ? setEditTeacher({ ...editTeacher, empid: e.target.value }) : setNewTeacher({ ...newTeacher, empid: e.target.value })} required />
                <input type="text" placeholder="Department" className="border rounded px-2 py-1" value={editTeacher ? editTeacher.department : newTeacher.department} onChange={e => editTeacher ? setEditTeacher({ ...editTeacher, department: e.target.value }) : setNewTeacher({ ...newTeacher, department: e.target.value })} required />
                {!editTeacher && <input type="password" placeholder="Password" className="border rounded px-2 py-1" value={newTeacher.password} onChange={e => setNewTeacher({ ...newTeacher, password: e.target.value })} required />}
                <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-1 col-span-1">
                  <PlusCircleIcon className="h-5 w-5" /> {editTeacher ? 'Update' : 'Add'}
                </button>
                {editTeacher && <button type="button" className="ml-2 text-gray-500 col-span-1" onClick={() => setEditTeacher(null)}>Cancel</button>}
              </form>
            </div>
            <ul>
              {(!Array.isArray(teachers) || teachers.length === 0) && <div className="text-gray-400 text-center py-4">No teachers found.</div>}
              {Array.isArray(teachers) && teachers.map(t => (
                <li key={t._id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b py-2 w-full">
                  <span>{t.name} ({t.email})</span>
                  <div className="flex gap-4">
                    <button className="text-blue-600 flex items-center gap-1 px-2 py-1 rounded hover:bg-blue-50" onClick={() => setEditTeacher(t)}><PencilIcon className="h-4 w-4" />Edit</button>
                    <button className="text-red-600 flex items-center gap-1 px-2 py-1 rounded hover:bg-red-50" onClick={() => handleDeleteTeacher(t._id)}><TrashIcon className="h-4 w-4" />Delete</button>
                    <button className="text-orange-600 flex items-center gap-1 px-2 py-1 rounded hover:bg-orange-50" onClick={() => handleResetPassword(t._id, 'teacher')}><KeyIcon className="h-4 w-4" />Reset Password</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
        {/* Students Section */}
        <section id="students" className="mb-6 md:mb-10">
          <h2 className="text-lg md:text-xl font-semibold mb-2 md:mb-4 text-purple-700 border-l-4 border-purple-400 pl-2 flex items-center justify-between">
            Students
            <button onClick={() => exportCSV(students, 'students.csv')} className="ml-4 flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 font-semibold shadow transition text-xs md:text-sm">
              <ArrowDownTrayIcon className="h-4 w-4" /> Export
            </button>
          </h2>
          <div className="bg-white p-4 md:p-6 rounded-xl shadow mb-4 overflow-x-auto">
            <div className="overflow-x-auto w-full">
              <form onSubmit={editStudent ? handleEditStudent : handleAddStudent} className="grid grid-cols-1 sm:grid-cols-5 gap-2 mb-4 w-full">
                <input type="text" placeholder="Name" className="border rounded px-2 py-1" value={editStudent ? editStudent.name : newStudent.name} onChange={e => editStudent ? setEditStudent({ ...editStudent, name: e.target.value }) : setNewStudent({ ...newStudent, name: e.target.value })} required />
                <input type="email" placeholder="Email" className="border rounded px-2 py-1" value={editStudent ? editStudent.email : newStudent.email} onChange={e => editStudent ? setEditStudent({ ...editStudent, email: e.target.value }) : setNewStudent({ ...newStudent, email: e.target.value })} required />
                <input type="text" placeholder="Roll No" className="border rounded px-2 py-1" value={editStudent ? editStudent.rollno : newStudent.rollno} onChange={e => editStudent ? setEditStudent({ ...editStudent, rollno: e.target.value }) : setNewStudent({ ...newStudent, rollno: e.target.value })} required />
                <input type="text" placeholder="Department" className="border rounded px-2 py-1" value={editStudent ? editStudent.department : newStudent.department} onChange={e => editStudent ? setEditStudent({ ...editStudent, department: e.target.value }) : setNewStudent({ ...newStudent, department: e.target.value })} required />
                {!editStudent && <input type="password" placeholder="Password" className="border rounded px-2 py-1" value={newStudent.password} onChange={e => setNewStudent({ ...newStudent, password: e.target.value })} required />}
                <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 flex items-center gap-1 col-span-1">
                  <PlusCircleIcon className="h-5 w-5" /> {editStudent ? 'Update' : 'Add'}
                </button>
                {editStudent && <button type="button" className="ml-2 text-gray-500 col-span-1" onClick={() => setEditStudent(null)}>Cancel</button>}
              </form>
            </div>
            <ul>
              {(!Array.isArray(students) || students.length === 0) && <div className="text-gray-400 text-center py-4">No students found.</div>}
              {Array.isArray(students) && students.map(s => (
                <li key={s._id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b py-2 w-full">
                  <span>{s.name} ({s.email})</span>
                  <div className="flex gap-4">
                    <button className="text-blue-600 flex items-center gap-1 px-2 py-1 rounded hover:bg-blue-50" onClick={() => setEditStudent(s)}><PencilIcon className="h-4 w-4" />Edit</button>
                    <button className="text-red-600 flex items-center gap-1 px-2 py-1 rounded hover:bg-red-50" onClick={() => handleDeleteStudent(s._id)}><TrashIcon className="h-4 w-4" />Delete</button>
                    <button className="text-orange-600 flex items-center gap-1 px-2 py-1 rounded hover:bg-orange-50" onClick={() => handleResetPassword(s._id, 'student')}><KeyIcon className="h-4 w-4" />Reset Password</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
        {/* Fees Section */}
        <section id="fees" className="mb-6 md:mb-10">
          <h2 className="text-lg md:text-xl font-semibold mb-2 md:mb-4 text-yellow-700 border-l-4 border-yellow-400 pl-2 flex items-center justify-between">
            Fees
            <button onClick={() => exportCSV(fees, 'fees.csv')} className="ml-4 flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 font-semibold shadow transition text-xs md:text-sm">
              <ArrowDownTrayIcon className="h-4 w-4" /> Export
            </button>
          </h2>
          <div className="bg-white p-4 md:p-6 rounded-xl shadow mb-4 overflow-x-auto">
            <div className="overflow-x-auto w-full">
              <form onSubmit={editFee ? handleEditFee : handleAddFee} className="flex flex-col sm:flex-row flex-wrap gap-2 mb-4 w-full">
                <select className="border rounded px-2 py-1" value={editFee ? editFee.student : newFee.student} onChange={e => editFee ? setEditFee({ ...editFee, student: e.target.value }) : setNewFee({ ...newFee, student: e.target.value })} required>
                  <option value="">--Select Student--</option>
                  {Array.isArray(students) && students.map(s => <option key={s._id} value={s._id}>{s.name} ({s.rollno})</option>)}
                </select>
                <input type="number" placeholder="Amount" className="border rounded px-2 py-1" value={editFee ? editFee.amount : newFee.amount} onChange={e => editFee ? setEditFee({ ...editFee, amount: e.target.value }) : setNewFee({ ...newFee, amount: e.target.value })} required />
                <select className="border rounded px-2 py-1" value={editFee ? editFee.status : newFee.status} onChange={e => editFee ? setEditFee({ ...editFee, status: e.target.value }) : setNewFee({ ...newFee, status: e.target.value })} required>
                  <option value="Unpaid">Unpaid</option>
                  <option value="Paid">Paid</option>
                  <option value="Partial">Partial</option>
                </select>
                <input type="date" placeholder="Due Date" className="border rounded px-2 py-1" value={editFee ? (editFee.dueDate ? editFee.dueDate.substring(0,10) : '') : newFee.dueDate} onChange={e => editFee ? setEditFee({ ...editFee, dueDate: e.target.value }) : setNewFee({ ...newFee, dueDate: e.target.value })} />
                <button type="submit" className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 flex items-center gap-1">
                  <PlusCircleIcon className="h-5 w-5" /> {editFee ? 'Update' : 'Add'}
                </button>
                {editFee && <button type="button" className="ml-2 text-gray-500" onClick={() => setEditFee(null)}>Cancel</button>}
              </form>
            </div>
            <ul>
              {(!Array.isArray(fees) || fees.length === 0) && <div className="text-gray-400 text-center py-4">No fees found.</div>}
              {Array.isArray(fees) && fees.map(f => (
                <li key={f._id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b py-2 w-full">
                  <span>{f.student?.name} ({f.student?.rollno}) - ₹{f.amount} - <b>{f.status}</b> {f.dueDate && `(Due: ${new Date(f.dueDate).toLocaleDateString()})`}</span>
                  <div className="flex gap-4">
                    <button className="text-blue-600 flex items-center gap-1 px-2 py-1 rounded hover:bg-blue-50" onClick={() => setEditFee(f)}><PencilIcon className="h-4 w-4" />Edit</button>
                    <button className="text-red-600 flex items-center gap-1 px-2 py-1 rounded hover:bg-red-50" onClick={() => handleDeleteFee(f._id)}><TrashIcon className="h-4 w-4" />Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
        {/* Notices Section */}
        <section id="notices" className="mb-6 md:mb-10">
          <h2 className="text-lg md:text-xl font-semibold mb-2 md:mb-4 text-indigo-700 border-l-4 border-indigo-400 pl-2 flex items-center justify-between">
            Notices
            <button onClick={() => exportCSV(notices, 'notices.csv')} className="ml-4 flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 font-semibold shadow transition text-xs md:text-sm">
              <ArrowDownTrayIcon className="h-4 w-4" /> Export
            </button>
          </h2>
          <div className="bg-white p-4 md:p-6 rounded-xl shadow mb-4 overflow-x-auto">
            <div className="overflow-x-auto w-full">
              <form onSubmit={editNotice ? handleEditNotice : handleAddNotice} className="flex flex-col sm:flex-row flex-wrap gap-2 mb-4 w-full">
                <input type="text" placeholder="Title" className="border rounded px-2 py-1" value={editNotice ? editNotice.title : newNotice.title} onChange={e => editNotice ? setEditNotice({ ...editNotice, title: e.target.value }) : setNewNotice({ ...newNotice, title: e.target.value })} required />
                <input type="text" placeholder="Content" className="border rounded px-2 py-1" value={editNotice ? editNotice.content : newNotice.content} onChange={e => editNotice ? setEditNotice({ ...editNotice, content: e.target.value }) : setNewNotice({ ...newNotice, content: e.target.value })} required />
                <select className="border rounded px-2 py-1" value={editNotice ? editNotice.forRole : newNotice.forRole} onChange={e => editNotice ? setEditNotice({ ...editNotice, forRole: e.target.value }) : setNewNotice({ ...newNotice, forRole: e.target.value })} required>
                  <option value="all">All</option>
                  <option value="student">Students</option>
                  <option value="faculty">Faculty</option>
                  <option value="admin">Admins</option>
                </select>
                <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 flex items-center gap-1">
                  <PlusCircleIcon className="h-5 w-5" /> {editNotice ? 'Update' : 'Add'}
                </button>
                {editNotice && <button type="button" className="ml-2 text-gray-500" onClick={() => setEditNotice(null)}>Cancel</button>}
              </form>
            </div>
            <ul>
              {(!Array.isArray(notices) || notices.length === 0) && <div className="text-gray-400 text-center py-4">No notices found.</div>}
              {Array.isArray(notices) && notices.map(n => (
                <li key={n._id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b py-2 w-full">
                  <span><b>{n.title}</b> - {n.content} <span className="text-xs text-gray-500">({n.forRole})</span></span>
                  <div className="flex gap-4">
                    <button className="text-blue-600 flex items-center gap-1 px-2 py-1 rounded hover:bg-blue-50" onClick={() => setEditNotice(n)}><PencilIcon className="h-4 w-4" />Edit</button>
                    <button className="text-red-600 flex items-center gap-1 px-2 py-1 rounded hover:bg-red-50" onClick={() => handleDeleteNotice(n._id)}><TrashIcon className="h-4 w-4" />Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
        {/* Reports Section */}
        <section id="reports">
          <h2 className="text-lg md:text-xl font-semibold mb-2 md:mb-4 text-yellow-700 border-l-4 border-yellow-400 pl-2">Reports</h2>
          <div className="bg-white p-4 md:p-6 rounded-xl shadow overflow-x-auto">
            <ul>
              <li>Total Departments: <b>{reports.totalDepartments || 0}</b></li>
              <li>Total Teachers: <b>{reports.totalTeachers || 0}</b></li>
              <li>Total Students: <b>{reports.totalStudents || 0}</b></li>
            </ul>
          </div>
        </section>
        {/* Activity Logs Section */}
        <section id="logs">
          <h2 className="text-lg md:text-xl font-semibold mb-2 md:mb-4 text-gray-700 border-l-4 border-gray-400 pl-2">Activity Logs</h2>
          <div className="bg-white p-4 md:p-6 rounded-xl shadow overflow-x-auto">
            <ul>
              {(!Array.isArray(logs) || logs.length === 0) && <li className="text-gray-400">No activity logs yet.</li>}
              {Array.isArray(logs) && logs.map((log, i) => (
                <li key={i}>
                  {new Date(log.time).toLocaleString()}: {log.action} {log.admin && `by ${log.admin.name}`}
                </li>
              ))}
            </ul>
          </div>
        </section>
        {/* Reset Password Modal */}
        {showResetModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-sm">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><KeyIcon className="h-5 w-5 text-orange-500" />Reset Password</h3>
              <input
                type="password"
                className="w-full border rounded px-3 py-2 mb-4"
                placeholder="Enter new password"
                value={resetPassword}
                onChange={e => setResetPassword(e.target.value)}
              />
              <div className="flex justify-end gap-2">
                <button className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300" onClick={() => setShowResetModal(false)}>Cancel</button>
                <button className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600" onClick={submitResetPassword}>Reset</button>
              </div>
            </div>
          </div>
        )}
        {/* Head of Departments Popover/Modal */}
        {showHeadsPopover && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
              <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-2xl" onClick={() => setShowHeadsPopover(false)}>&times;</button>
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><UserIcon className="h-5 w-5 text-blue-500" />Head of Departments</h3>
              <ul>
                {(!Array.isArray(departments) || departments.filter(d => d.head && d.head.name).length === 0) && (
                  <li className="text-gray-500">No department heads assigned.</li>
                )}
                {Array.isArray(departments) && departments.filter(d => d.head && d.head.name).map((d, i) => (
                  <li key={i} className="mb-2 flex items-center gap-2">
                    <UserIcon className="h-4 w-4 text-blue-400" />
                    <span className="font-semibold text-blue-700">{d.head.name}</span>
                    <span className="text-gray-500">({d.name})</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}