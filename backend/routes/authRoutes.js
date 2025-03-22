import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';


const router = express.Router();


//* Regitser route
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'All fields are required!' });
    }

    if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists.' });
        }

        const newUser = new User({
            username,
            email,
            password,
        });

        await newUser.save();

        const token = jwt.sign(
            { userId: newUser._id, username: newUser.username },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Lax',
            maxAge: 3600000,
        });

        res.status(201).json({ message: 'User registered and logged in successfully.', token });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during registration.' });
    }
});

//* Login route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide both email and password.' });
        }

        const user = await User.findOne({ email });
        console.log('User found:', user);

        if (!user) {
            return res.status(401).json({ message: 'No user found with this email address.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Password comparison result:', isMatch);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid password. Please try again.' });
        }

        const token = jwt.sign(
            { userId: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
            maxAge: 3600000,
        });

        const userForClient = {
            _id: user._id,
            username: user.username,
            email: user.email,
            createdAt: user.createdAt,
        };

        res.status(200).json({ message: 'User logged in successfully.', user: userForClient });

    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Server error during login.' });
    }
});

//* Logout route
router.post('/logout', (req, res) => {
    res.cookie('token', '', { maxAge: 0 });
    res.status(200).json({ message: 'User logged out successfully.' });
});
//* Status Check route
router.get('/status', async (req, res) => {
    const token = req.cookies.token;

    if (!token) {
        return res.json({ isLoggedIn: false });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.exp * 1000 < Date.now()) {
            return res.json({ isLoggedIn: false });
        }

        const user = await User.findById(decoded.userId).select('-password');

        if (!user) {
            return res.json({ isLoggedIn: false });
        }

        return res.json({
            isLoggedIn: true,
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
            },
        });
    } catch (err) {
        console.error('Token verification failed:', err);
        return res.json({ isLoggedIn: false });
    }
});
//* Profile route



export default router;
