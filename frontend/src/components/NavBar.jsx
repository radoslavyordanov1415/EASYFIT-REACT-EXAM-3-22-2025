import React, { useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "./context/AuthenticationContex";
import AlertBox from "./AlertBox";

import ReorderIcon from "@mui/icons-material/Reorder";
import logo from "../assets/img/logo.png";
import "../styles/NavBar.css";

export default function NavBar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const { isLoggedIn, logout } = useAuth();
    const [alert, setAlert] = useState({ message: "", type: "" });

    const handleLogout = () => {
        setAlert({ message: "Logging out...", type: "info" });
        logout();
    };

    return (
        <div className="navbar">
            {alert.message && <AlertBox message={alert.message} type={alert.type} />}
            <div className="leftSide">
                <Link to="/">
                    <img src={logo} alt="Logo" />
                </Link>
            </div>

            <div className="rightSide">
                {isLoggedIn ? (
                    <>
                        <Link to="/profile">Profile</Link>
                        <Link to="/create">Create</Link>
                        <Link to="/catalog">Catalog</Link>
                        <Link to="/community">Community</Link>

                        {/* Desktop Logout Button */}
                        <div className="desktopLogout">
                            <button onClick={handleLogout}>Logout</button>
                        </div>
                    </>
                ) : (
                    <>
                        <Link to="/">Home</Link>
                        <Link to="/about">About</Link>
                        <Link to="/register">Register</Link>
                        <Link to="/login">Login</Link>
                    </>
                )}

                <button className="menuButton" onClick={() => setMenuOpen(!menuOpen)}>
                    <ReorderIcon />
                </button>
            </div>

            <div className={`mobileMenu ${menuOpen ? "open" : ""}`}>
                {isLoggedIn ? (
                    <>
                        <Link to="/profile" onClick={() => setMenuOpen(false)}>Profile</Link>
                        <Link to="/create" onClick={() => setMenuOpen(false)}>Create</Link>
                        <Link to="/community" onClick={() => setMenuOpen(false)}>Community</Link>
                        <Link to="/catalog" onClick={() => setMenuOpen(false)}>Catalog</Link>

                        {/* Mobile Logout Button */}
                        <button onClick={() => { handleLogout(); setMenuOpen(false); }}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
                        <Link to="/about" onClick={() => setMenuOpen(false)}>About</Link>
                        <Link to="/register" onClick={() => setMenuOpen(false)}>Register</Link>
                        <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
                    </>
                )}
            </div>
        </div>
    );
}
