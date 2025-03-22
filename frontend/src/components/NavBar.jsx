import React, { useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "./context/authContext";

import ReorderIcon from "@mui/icons-material/Reorder";
import logo from "../assets/img/logo.png";
import "../styles/NavBar.css";

export default function NavBar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const { isLoggedIn, logout } = useAuth();

    const handleLogout = () => {
        logout();
    };
    return (
        <div className="navbar">
            <div className="leftSide">
                <Link to='/'>
                    <img src={logo} alt="Logo" />
                </Link>
            </div>

            <div className="rightSide">
                {isLoggedIn ? (
                    <>
                        <Link to="/profile">Profile</Link>
                        <Link to="/create">Create</Link>
                        <Link to="/catalog">Catalog</Link>

                        <button onClick={handleLogout}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/">Home</Link>
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
                        <button onClick={() => { handleLogout(); setMenuOpen(false); }}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
                        <Link to="/register" onClick={() => setMenuOpen(false)}>Register</Link>
                        <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
                    </>
                )}
            </div>
        </div>
    );
}
