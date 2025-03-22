
import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useAuth } from "../context/authContext"


const ProtectedRoute = () => {
    const { isLoggedIn } = useAuth()
    const location = useLocation()

    if (isLoggedIn === null) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading...</p>
            </div>
        )
    }

    if (!isLoggedIn) {
        return <Navigate to="/login" state={{ from: location.pathname }} replace />
    }

    return <Outlet />
}

export default ProtectedRoute

