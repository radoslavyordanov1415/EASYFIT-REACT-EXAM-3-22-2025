// AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const response = await fetch('http://localhost:5005/auth/status', {
                    method: 'GET',
                    credentials: 'include',
                });
                const data = await response.json();

                if (data.isLoggedIn) {
                    setIsLoggedIn(true);
                    setUser(data.user);
                } else {
                    setIsLoggedIn(false);
                    setUser(null);
                }
            } catch (error) {
                console.error('Error checking authentication status:', error);
                setIsLoggedIn(false);
                setUser(null);
            }
        };

        checkAuthStatus();
    }, []);

    const login = (user) => {
        setIsLoggedIn(true);
        setUser(user);
    };

    const logout = async () => {
        try {
            await fetch('http://localhost:5005/auth/logout', {
                method: 'POST',
                credentials: 'include',
            });
            setIsLoggedIn(false);
            setUser(null);
            navigate('/');
        } catch (err) {
            console.error('Error during logout:', err);
        }
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
