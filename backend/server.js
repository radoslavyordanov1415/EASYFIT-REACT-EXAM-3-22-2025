// server.js
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import session from 'express-session';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/authRoutes.js';
import outfitRoutes from './routes/outfitRoutes.js';
import uploadRoutes from './uploads/uploadRoutes.js';
import connectDB from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    methods: 'GET,POST,PUT,DELETE',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Session handling
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-session-secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'None',
    }
}));

// Mount Routes
app.use('/auth', authRoutes);
app.use('/api/outfits', outfitRoutes);
app.use('/api', uploadRoutes);

// Static file serving
app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.use(express.static('public'));

// Start server
const PORT = process.env.PORT || 5005;
app.listen(PORT, async () => {
    await connectDB();
    console.log(`Server running on port ${PORT}`);
});