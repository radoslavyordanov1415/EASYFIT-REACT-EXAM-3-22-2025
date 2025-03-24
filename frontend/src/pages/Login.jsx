
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import walkGif from "../assets/videos/walk1.gif"
import AlertBox from "../components/AlertBox";

import { useAuth } from "../components/context/AuthenticationContex";
import "../styles/Login.css";


export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState({ text: "", type: "" });
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from || "/";

    const handleLogin = async (e) => {
        e.preventDefault();
        setMessage({ text: "", type: "" });

        try {
            const response = await fetch("http://localhost:5005/auth/login", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                setMessage({ text: data.message || "Login failed", type: "error" });
                return;
            }

            setMessage({ text: "Login successful!", type: "success" });

            login(data.user);

            setTimeout(() => {
                navigate(from, { replace: true });
            }, 1000);
        } catch (err) {
            setMessage({ text: "Network error, please try again!", type: "error" });
            console.error(err);
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <div className="gif-column">
                    <img src={walkGif || "/placeholder.svg"} alt="Walking GIF" />
                </div>
                <div className="form-column">
                    <div className="login-form">
                        <h2>Welcome Back!</h2>
                        {message.text && <AlertBox message={message.text} type={message.type} />}
                        <form onSubmit={handleLogin}>
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit">Login</button>
                        </form>
                        <p>
                            Don't have an account? <a href="/register">Register</a>
                        </p>
                        <p>
                            <a href="/forgot-password">Forgot your password?</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}