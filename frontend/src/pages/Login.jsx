"use client"

import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import walkGif from "../assets/videos/walk1.gif"
import AlertBox from "../components/AlertBox"
import { useAuth } from "../components/context/AuthenticationContex"
import "../styles/Login.css"
import { validateEmail } from "../utils/formValidation"

export default function Login() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    })

    const [errors, setErrors] = useState({
        email: "",
        password: "",
    })

    const [message, setMessage] = useState({ text: "", type: "" })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { login } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    const from = location.state?.from || "/"

    useEffect(() => {
        if (message.text && message.type === "error") {
            setMessage({ text: "", type: "" })
        }
    }, [formData])

    const handleChange = (e) => {
        const { id, value } = e.target
        setFormData({
            ...formData,
            [id]: value,
        })

        if (errors[id]) {
            setErrors({
                ...errors,
                [id]: "",
            })
        }
    }

    const validateField = (field) => {
        let errorMessage = ""

        switch (field) {
            case "email":
                errorMessage = validateEmail(formData.email)
                break
            case "password":
                errorMessage = !formData.password ? "Password is required" : ""
                break
            default:
                break
        }

        setErrors((prev) => ({
            ...prev,
            [field]: errorMessage,
        }))

        return !errorMessage
    }

    const validateForm = () => {
        const emailValid = validateField("email")
        const passwordValid = validateField("password")

        const errorMessages = []
        if (!emailValid) errorMessages.push(errors.email || validateEmail(formData.email))
        if (!passwordValid) errorMessages.push(errors.password || (!formData.password ? "Password is required" : ""))

        if (errorMessages.length > 0) {
            setMessage({
                text: "Please fix the following errors:\n• " + errorMessages.join("\n• "),
                type: "error",
            })
            return false
        }

        return true
    }

    const handleLogin = async (e) => {
        e.preventDefault()
        setMessage({ text: "", type: "" })

        if (!validateForm()) {
            return
        }

        setIsSubmitting(true)

        try {
            const response = await fetch("http://localhost:5005/auth/login", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                setMessage({
                    text: data.message || "Login failed",
                    type: "error",
                })

                if (data.message?.toLowerCase().includes("email")) {
                    setErrors((prev) => ({ ...prev, email: "Email not found" }))
                } else if (data.message?.toLowerCase().includes("password")) {
                    setErrors((prev) => ({ ...prev, password: "Incorrect password" }))
                }
                return
            }

            setMessage({ text: "Login successful!", type: "success" })

            login(data.user)

            setTimeout(() => {
                navigate(from, { replace: true })
            }, 1000)
        } catch (err) {
            setMessage({ text: "Network error, please try again!", type: "error" })
            console.error(err)
        } finally {
            setIsSubmitting(false)
        }
    }

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
                        <form onSubmit={handleLogin} noValidate>
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={errors.email ? "error" : ""}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={errors.password ? "error" : ""}
                                    required
                                />
                            </div>
                            <button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Logging in..." : "Login"}
                            </button>
                        </form>
                        <p>
                            Don't have an account? <a href="/register">Register</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

