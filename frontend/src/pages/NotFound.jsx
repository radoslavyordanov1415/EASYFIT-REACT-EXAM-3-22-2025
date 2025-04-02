import { Link } from "react-router-dom";
import "../styles/NotFound.css";

export default function NotFound() {
    return (
        <div className="not-found-container">
            <h1 className="not-found-title">404</h1>
            <h2 className="not-found-subtitle">Page Not Found</h2>
            <p className="not-found-message">
                The page you are looking for doesn't exist or has been moved.
            </p>
            <Link to="/" className="not-found-link">
                Return Home
            </Link>
        </div>
    );
}
