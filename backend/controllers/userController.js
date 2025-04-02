import userService from '../services/userService.js';

const userController = {
    register: async (req, res) => {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required!' });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
        }

        try {
            const result = await userService.registerUser(username, email, password);
            if (!result.success) {
                return res.status(result.status).json({ message: result.message });
            }

            res.cookie('token', result.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'Lax',
                maxAge: 3600000,
            });

            res.status(result.status).json({ message: 'User registered and logged in successfully.', token: result.token });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error during registration.' });
        }
    },

    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ message: 'Please provide both email and password.' });
            }

            const result = await userService.loginUser(email, password);
            if (!result.success) {
                return res.status(result.status).json({ message: result.message });
            }

            res.cookie('token', result.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
                maxAge: 3600000,
            });

            res.status(result.status).json({ message: 'User logged in successfully.', user: result.user });
        } catch (error) {
            console.error('Login Error:', error);
            res.status(500).json({ message: 'Server error during login.' });
        }
    },

    logout: (req, res) => {
        res.cookie('token', '', { maxAge: 0 });
        res.status(200).json({ message: 'User logged out successfully.' });
    },

    status: async (req, res) => {
        const token = req.cookies.token;

        const result = await userService.checkStatus(token);
        res.json({ isLoggedIn: result.isLoggedIn, user: result.user });
    },
};

export default userController;