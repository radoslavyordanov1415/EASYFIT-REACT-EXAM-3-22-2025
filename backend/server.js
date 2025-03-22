import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import session from 'express-session';


import authRoutes from './routes/authRoutes.js';





dotenv.config();

const app = express();

//* Middleware Configuration
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    methods: 'GET,POST,PUT,DELETE',
    credentials: true,
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

//* Routes
app.use('/auth', authRoutes);
//app.use('/api/outfits');
//app.use('/uploads');
//app.use('/images');
app.use(express.static('public'));



// MongoDB connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected!');
    } catch (err) {
        console.log('Database connection error:', err);
        process.exit(1);
    }
};


const PORT = process.env.PORT || 5005;
app.listen(PORT, async () => {
    await connectDB();
    console.log(`Server running on port ${PORT}`);
});