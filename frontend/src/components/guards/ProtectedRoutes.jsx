"use client"

import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../context/AuthenticationContex"

export default function ProtectedRoute() {
    const { isLoggedIn, loading } = useAuth()

    // Show loading state while checking authentication
    if (loading) {
        return <div className="loading">Loading...</div>
    }

    // If not logged in, redirect to login page
    if (!isLoggedIn) {
        console.log("Protected route: Not logged in, redirecting to login")
        return <Navigate to="/login" />
    }

    // If logged in, render the child routes
    return <Outlet />
}

