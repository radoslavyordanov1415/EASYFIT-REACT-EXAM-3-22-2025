import React from "react";
import { useNavigate } from "react-router-dom";



import background from "../assets/img/background.webp";
import "../styles/Home.css";
import { useAuth } from "../components/context/AuthenticationContex";



export default function Home() {
    const navigate = useNavigate();
    const { isLoggedIn } = useAuth();

    const handleClick = () => {
        if (isLoggedIn) {
            navigate("/create");
        } else {
            navigate("/register");
        }

    };

    return (
        <div className="home" style={{ backgroundImage: `url(${background})` }}>
            <div className="headerContainer">
                <h1>Are you bored of choosing your clothes?</h1>
                <p>One click away from the perfect fit!</p>
                <button onClick={handleClick}>
                    Start Creating
                </button>
            </div>
        </div>
    )
}