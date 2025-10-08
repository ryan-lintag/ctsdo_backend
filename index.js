import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import privateRoutes from './routes/private.js';
import authRoutes from './routes/auth.js';
import courseRoutes from './routes/courseRoutes.js';
import faqRoutes from './routes/faqRoutes.js'
import registrationRoutes from './routes/registrationRoutes.js';
import userRoutes from './routes/userRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js'
import certificateRoutes from './routes/certificateRoutes.js';
import jobMatchingRoutes from './routes/jobMatchingRoutes.js';
import adminDashboardRoutes from './routes/adminDashboardRoutes.js';
import portfolioRoutes from './routes/portfolioRoutes.js';
import studentsRoutes from  './routes/studentRoutes.js';
import aiRoutes from "./controllers/auth/portfolioAi.js";
import homePageSettingRoutes from './controllers/auth/homePageSetting.js';

const app = express();
const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use((req, res, next) => {
  console.log(`Received ${req.method} request at ${req.url}`);
  next();
});

// CORS configuration with CLIENT_URL whitelist
const allowedOrigins = process.env.CLIENT_URL 
  ? process.env.CLIENT_URL.split(',').map(url => url.trim())
  : ['http://localhost:5173', 'http://localhost:5174', 'https://ctsdo-frontend.vercel.app']; // fallback for development

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS policy'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json({ limit: '50mb' }));

app.get('/api/tickets', (req, res) => {
  const tickets = [
    { id: 1, subject: 'Issue 1', description: 'Description of issue 1' },
    { id: 2, subject: 'Issue 2', description: 'Description of issue 2' }
  ];
  res.json(tickets);
});

app.post('/api/tickets/respond/:id', (req, res) => {
  console.log('Ticket ID:', req.params.id); // Log the ticket ID
  res.send('Received ticket ID');
});

app.use('/auth', authRoutes);
app.use('/private', privateRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/user', userRoutes);
app.use('/api/registration', registrationRoutes);
app.use('/api/application', applicationRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/job-matching', jobMatchingRoutes);
app.use('/api/admin-dashboard', adminDashboardRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/students', studentsRoutes);
app.use("/api/homepage-settings", homePageSettingRoutes);
app.use("/api/ai", aiRoutes);
app.get('/', (req, res) => {
  res.send('API is running');
});


const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_CONNECTION, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected');

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ DB Connection Error:', err);
    process.exit(1);
  }
};
connectDB();
const authenticate = (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Protect routes
app.post('/api/faqs', authenticate, (req, res) => {
  // FAQ creation logic
});