
import { useState } from "react"

import walkGif from "../assets/videos/walk2.gif"
import "../styles/Register.css"
import AlertBox from "../components/AlertBox"

export default function Register() {
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [message, setMessage] = useState({ text: "", type: "" })

    const handleRegister = async (e) => {
        e.preventDefault()

        if (password !== confirmPassword) {
            setMessage({ text: "Passwords do not match", type: "error" })
            return
        }

        if (!username || !email || !password) {
            setMessage({ text: "All fields are required!", type: "error" })
            return
        }

        try {
            const response = await fetch("http://localhost:5005/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, email, password }),
                credentials: "include",
            })

            const data = await response.json()

            if (response.ok) {
                setMessage({ text: "Registration successful!", type: "success" })

                setTimeout(() => {
                    localStorage.setItem("token", data.token)
                    window.location.href = "/"
                }, 2000)
            } else {
                setMessage({ text: data.message || "Registration failed.", type: "error" })
            }
        } catch (err) {
            setMessage({ text: "Something went wrong!", type: "error" })
            console.error(err)
        }
    }

    return (
        <div className="register-container">
            <div className="register-box">
                <div className="gif-column">
                    <img src={walkGif || "/placeholder.svg"} alt="Walking GIF" />
                </div>
                <div className="form-column">
                    <div className="register-form">
                        <h2>Create an Account</h2>
                        {message.text && <AlertBox message={message.text} type={message.type} />}
                        <form onSubmit={handleRegister}>
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
                                <label htmlFor="username">Username</label>
                                <input
                                    type="text"
                                    id="username"
                                    placeholder="Enter your username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
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
                            <div className="form-group">
                                <label htmlFor="confirmPassword">Confirm Password</label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    placeholder="Confirm your password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit">Register</button>
                        </form>
                        <p>
                            Already have an account? <a href="/login">Login</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )

}