import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userService = {
    registerUser: async (username, email, password) => {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return { success: false, status: 400, message: 'User already exists.' };
        }

        const newUser = new User({ username, email, password });
        await newUser.save();

        const token = jwt.sign(
            { userId: newUser._id, username: newUser.username },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        return { success: true, status: 201, token, user: newUser };
    },

    loginUser: async (email, password) => {
        const user = await User.findOne({ email });
        if (!user) {
            return { success: false, status: 401, message: 'No user found with this email address.' };
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return { success: false, status: 401, message: 'Invalid password. Please try again.' };
        }

        const token = jwt.sign(
            { userId: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        const userForClient = {
            _id: user._id,
            username: user.username,
            email: user.email,
            createdAt: user.createdAt,
        };

        return { success: true, status: 200, token, user: userForClient };
    },

    checkStatus: async (token) => {
        if (!token) {
            return { success: false, isLoggedIn: false };
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            if (decoded.exp * 1000 < Date.now()) {
                return { success: false, isLoggedIn: false };
            }

            const user = await User.findById(decoded.userId).select('-password');

            if (!user) {
                return { success: false, isLoggedIn: false };
            }

            return {
                success: true,
                isLoggedIn: true,
                user: {
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                },
            };
        } catch (err) {
            console.error('Token verification failed:', err);
            return { success: false, isLoggedIn: false };
        }
    },
};

export default userService;