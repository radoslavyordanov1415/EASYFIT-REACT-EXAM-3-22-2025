import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';




export default function Logout() {
    const navigate = useNavigate();

    useEffect(() => {
        const handleLogout = async () => {
            try {
                const response = await fetch('http://localhost:5005/auth/logout', {
                    method: 'POST',
                    credentials: 'include',
                });

                if (response.ok) {
                    localStorage.removeItem('isAuthenticated');
                    localStorage.removeItem('token');
                    navigate('/');
                } else {
                    const errorData = await response.json();
                    console.error('Logout failed:', errorData.message || 'Unknown error');
                }
            } catch (error) {
                console.error('Error logging out:', error);
            }
        };

        handleLogout();
    }, [navigate]);

    return (
        <div>
            <h1>Logging out...</h1>
            <p>Please wait while we log you out.</p>
        </div>
    );
}