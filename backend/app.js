// const express = require('express');
// const cors = require('cors');
// const mongoose = require('mongoose');
// require('dotenv').config();
// require('./models/Attendance');
// require('./models/Result');
// require('./models/Notice');
// require('./models/Fee');
// require('./models/Notification');

// const authRoutes = require('./routes/auth');
// const studentRoutes = require('./routes/student');
// const facultyRoutes = require('./routes/faculty');
// const adminRoutes = require('./routes/admin');
// const profileRoutes = require('./routes/profile');
// const notificationRoutes = require('./routes/notification');

// // const app = express();
// // // app.use(cors());
 

// app.use(cors({
//     origin: "https://academia-pro-jet.vercel.app", // your Vercel URL
//     origin:"https://academiapro-fyr0.onrender.com"
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     credentials: true
// }));


// app.use(express.json());

// // Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/student', studentRoutes);
// app.use('/api/faculty', facultyRoutes);
// app.use('/api/admin', adminRoutes);
// app.use('/api/profile', profileRoutes);
// app.use('/api/notifications', notificationRoutes);

// // Example route
// app.get('/', (req, res) => {
//   res.send('AcademiaPro Backend Running!');
// });

// app.use('/uploads', express.static('uploads'));

// // Connect to MongoDB
// mongoose.connect(process.env.MONGO_URI)
//   .then(() => {
//     const port = process.env.PORT || 5000;
//     app.listen(port);











const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

require('./models/Attendance');
require('./models/Result');
require('./models/Notice');
require('./models/Fee');
require('./models/Notification');

const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/student');
const facultyRoutes = require('./routes/faculty');
const adminRoutes = require('./routes/admin');
const profileRoutes = require('./routes/profile');
const notificationRoutes = require('./routes/notification');

const app = express();

// CORS setup for multiple origins
const allowedOrigins = [
  "https://academia-pro-jet.vercel.app",
  "https://academiapro-u865.onrender.com/"
];

app.use(cors({
  origin: function(origin, callback){
    if(!origin || allowedOrigins.includes(origin)){
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/faculty', facultyRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/notifications', notificationRoutes);

app.get('/', (req, res) => {
  res.send('AcademiaPro Backend Running!');
});

app.use('/uploads', express.static('uploads'));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected Successfully!");
    const port = process.env.PORT || 5000;
    app.listen(port, () => console.log(`Server running on port ${port}`));
  })
  .catch(err => console.error("MongoDB connection error:", err));

//     console.log(`AcademiaPro Backend Server started on port ${port}`);
//   })
//   .catch(err => console.error(err));
