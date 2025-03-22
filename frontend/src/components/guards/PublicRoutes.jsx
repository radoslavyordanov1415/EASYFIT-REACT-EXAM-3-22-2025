


import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../context/authContext"


export default function PublicRoute() {
    const { isLoggedIn } = useAuth()

    if (isLoggedIn === null) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading...</p>
            </div>
        )
    }

    if (isLoggedIn) {
        return <Navigate to="/" replace />
    }

    return <Outlet />
}