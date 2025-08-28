# AcademiaPro 🎓

A modern, comprehensive college management system built with the MERN stack to streamline academic operations and enhance productivity for educational institutions.

## 🌟 Features

### 👥 Multi-Role System
- **Students**: View attendance, results, fees, notices, and manage profiles
- **Faculty**: Manage student records, attendance, results, and notices
- **Admin**: Complete system control with user management and analytics

### 📚 Academic Management
- Real-time attendance tracking with automated reports
- Result management with CGPA calculation
- Grade card generation (PDF/Image export)
- Subject-wise performance tracking

### 💰 Financial Management
- Fee status tracking (Paid/Unpaid/Partial)
- Due date management and payment history
- Automated fee notifications

### 📢 Communication System
- Role-based notice board
- Real-time notifications with bell alerts
- Email notifications for important updates

### 📊 Analytics & Reports
- Interactive dashboards for all user roles
- Comprehensive analytics and insights
- Activity logging and audit trails

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express.js framework
- **MongoDB** with Mongoose ODM
- **JWT** authentication with bcrypt password hashing
- **Cloudinary** for image storage
- **Nodemailer** for email services

### Frontend
- **React 19** with modern hooks
- **React Router v7** for navigation
- **Tailwind CSS** for responsive styling
- **Heroicons** for UI icons
- **Axios** for API communication
- **html2canvas + jsPDF** for report generation

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/AcademiaPro.git
   cd AcademiaPro
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

### Environment Configuration

1. **Backend Environment** (`backend/.env`)
   ```env
   MONGO_URI=mongodb://localhost:27017/academiapro
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   
   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   
   # Email Configuration
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   ```

2. **Frontend Environment** (`frontend/.env`)
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

### Running the Application

1. **Start Backend Server**
   ```bash
   cd backend
   npm run dev
   ```

2. **Start Frontend Development Server**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Access the Application**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:5000`

## 📁 Project Structure

```
AcademiaPro/
├── backend/
│   ├── models/          # Database schemas
│   ├── routes/          # API endpoints
│   ├── uploads/         # File storage
│   ├── app.js          # Express app configuration
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/      # Application pages
│   │   ├── assets/     # Static assets
│   │   └── App.jsx     # Main application component
│   └── package.json
└── README.md
```

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password/:token` - Password reset

### Student Operations
- `GET /api/student/attendance` - Get attendance data
- `GET /api/student/results` - Get academic results
- `GET /api/student/notices` - Get notices
- `GET /api/student/fees` - Get fee information

### Admin Operations
- `GET /api/admin/students` - Manage students
- `GET /api/admin/teachers` - Manage faculty
- `GET /api/admin/departments` - Manage departments
- `GET /api/admin/fees` - Manage fees
- `GET /api/admin/notices` - Manage notices

## 🎨 Key Features Demo

### Dashboard Analytics
- Real-time statistics and insights
- Role-based data visualization
- Interactive charts and metrics

### Grade Card Generation
- Professional PDF generation
- Institutional branding
- Downloadable reports

### Notification System
- Real-time bell notifications
- Role-based targeting
- Email integration

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Input validation and sanitization
- CORS protection
- Environment variable security

## 📱 Responsive Design

- Mobile-first approach
- Tailwind CSS responsive utilities
- Touch-friendly navigation
- Optimized for all screen sizes

## 🚀 Deployment

### Production Build

1. **Frontend Build**
   ```bash
   cd frontend
   npm run build
   ```

2. **Backend Production**
   ```bash
   cd backend
   npm start
   ```

### Environment Variables for Production
- Update MongoDB URI for production database
- Set secure JWT secret
- Configure production email settings
- Update Cloudinary credentials

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)
- Email: your.email@example.com

## 🙏 Acknowledgments

- React team for the amazing framework
- MongoDB for the flexible database
- Tailwind CSS for the utility-first styling
- All contributors and supporters

## 📞 Support

If you have any questions or need help with setup, please open an issue or contact the maintainer.

---

⭐ **Star this repository if you found it helpful!**
