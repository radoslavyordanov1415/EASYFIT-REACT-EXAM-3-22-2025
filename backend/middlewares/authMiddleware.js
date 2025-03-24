import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    try {
        console.log("Verifying token...");
        const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

        if (!token) {
            console.log("Token not found.");
            return res.status(401).json({ message: "Unauthorized - No token" });
        }

        console.log("Token found:", token);
        console.log('Cookies:', req.cookies);
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                console.log("Token verification failed:", err.message);
                return res.status(401).json({ message: "Unauthorized - Invalid token" });
            }

            req.userId = decoded.userId;
            console.log("User authenticated:", req.userId);
            next();
        });
    } catch (error) {
        console.error("Auth middleware error:", error);
        res.status(500).json({ message: "Internal Server Error in auth middleware" });
    }
};
