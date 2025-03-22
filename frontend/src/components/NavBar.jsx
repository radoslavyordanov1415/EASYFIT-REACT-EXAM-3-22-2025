import React from "react";
import { Link } from "react-router-dom";

import logo from "../assets/img/logo.png";

import "../styles/NavBar.css";

export default function NavBar() {
    return (
        <div className="navbar">
            <div className="leftSide">
                <Link to="/">
                    <img src={logo} alt="Logo" />
                </Link>
                <Link to="/profile">Profile</Link>
                <Link to="/create">Create</Link>
                <Link to="/catalog">Catalog</Link>
                <Link to="/logout">Logout</Link>
                <Link to="/register">Register</Link>
            </div>
        </div>
    );
}
