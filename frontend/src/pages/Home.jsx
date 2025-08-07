import { AcademicCapIcon, UserGroupIcon, CalendarIcon, CurrencyDollarIcon, ClipboardDocumentListIcon, ArrowRightIcon, ChartBarIcon, BellIcon, CogIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

const features = [
  {
    name: "Student Records",
    icon: UserGroupIcon,
    desc: "Comprehensive student profiles with academic history, documents, and progress tracking.",
    color: "bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-600"
  },
  {
    name: "Attendance",
    icon: CalendarIcon,
    desc: "Real-time attendance tracking with automated reports and notifications.",
    color: "bg-gradient-to-br from-purple-100 to-pink-100 text-purple-600"
  },
  {
    name: "Fees Management",
    icon: CurrencyDollarIcon,
    desc: "Secure payment processing with receipts, due reminders, and financial reports.",
    color: "bg-gradient-to-br from-green-100 to-emerald-100 text-green-600"
  },
  {
    name: "Timetable Scheduling",
    icon: ClipboardDocumentListIcon,
    desc: "Smart scheduling with conflict detection and mobile-friendly views.",
    color: "bg-gradient-to-br from-orange-100 to-red-100 text-orange-600"
  },
  {
    name: "Notices & Events",
    icon: BellIcon,
    desc: "Instant notifications for important announcements and campus events.",
    color: "bg-gradient-to-br from-pink-100 to-rose-100 text-pink-600"
  },
  {
    name: "Analytics Dashboard",
    icon: ChartBarIcon,
    desc: "Advanced analytics and insights for better decision making.",
    color: "bg-gradient-to-br from-blue-100 to-cyan-100 text-blue-600"
  },
];

const stats = [
  { number: "10,000+", label: "Students" },
  { number: "500+", label: "Faculty" },
  { number: "50+", label: "Departments" },
  { number: "99.9%", label: "Uptime" },
];

export default function Home() {
  return (
    <div className="bg-white">
      {/* Enhanced Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 opacity-90"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full p-6 shadow-2xl mb-8 border border-indigo-200">
              <AcademicCapIcon className="h-16 w-16 text-indigo-600" />
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 mb-6">
              <span className="block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">AcademiaPro</span>
              <span className="block text-gray-800">Next-Gen College Management</span>
            </h1>
            <p className="mt-8 max-w-2xl mx-auto text-xl text-gray-600 leading-relaxed">
              A modern, intelligent platform designed to revolutionize academic operations with cutting-edge technology and seamless user experience.
            </p>
            <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="/login"
                className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-semibold rounded-2xl shadow-2xl text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
              >
                Get Started
                <ArrowRightIcon className="ml-3 -mr-1 h-6 w-6" />
              </a>
              <a
                href="/register"
                className="inline-flex items-center px-8 py-4 border-2 border-indigo-200 text-lg font-semibold rounded-2xl text-indigo-700 bg-white hover:bg-indigo-50 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Create Account
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-12 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-indigo-100 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Features Section */}
      <div className="py-16 sm:py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl mb-6">
              Everything you need in one platform
            </h2>
            <p className="mt-6 max-w-3xl mx-auto text-xl text-gray-600 leading-relaxed">
              Designed to streamline college administration and enhance productivity with modern technology
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div 
                key={feature.name} 
                className="group pt-8 pb-6 px-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-indigo-200 transform hover:-translate-y-2"
              >
                <div className={`inline-flex items-center justify-center rounded-2xl p-4 mb-6 ${feature.color} group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="h-10 w-10" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.name}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced CTA Section */}
      <div className="bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        <div className="relative max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-20 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <div className="lg:w-1/2">
            <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl mb-6">
              <span className="block">Ready to transform your institution?</span>
              <span className="block text-indigo-200">Start using AcademiaPro today.</span>
            </h2>
            <p className="text-xl text-indigo-100 mb-8">
              Join thousands of educational institutions already using our platform to streamline their operations.
            </p>
          </div>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-2xl shadow-2xl">
              <a
                href="/register"
                className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-semibold rounded-2xl text-indigo-700 bg-white hover:bg-indigo-50 transition-all duration-300 transform hover:scale-105"
              >
                Get started
                <ArrowRightIcon className="ml-3 -mr-1 h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <AcademicCapIcon className="h-8 w-8 text-indigo-400 mr-3" />
              <span className="text-2xl font-bold text-white">AcademiaPro</span>
            </div>
            <p className="text-gray-400 mb-6">
              Empowering educational institutions with modern technology
            </p>
            <div className="flex justify-center space-x-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Support</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}