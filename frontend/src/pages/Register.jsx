"use client"

import { useState, useEffect } from "react"
import walkGif from "../assets/videos/walk2.gif"
import "../styles/Register.css"
import AlertBox from "../components/AlertBox"
import { validateUsername, validateEmail, validatePassword, validateConfirmPassword } from "../utils/formValidation"

export default function Register() {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    })

    const [errors, setErrors] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    })

    const [message, setMessage] = useState({ text: "", type: "" })
    const [isSubmitting, setIsSubmitting] = useState(false)

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
            case "username":
                errorMessage = validateUsername(formData.username)
                break
            case "email":
                errorMessage = validateEmail(formData.email)
                break
            case "password":
                errorMessage = validatePassword(formData.password)
                break
            case "confirmPassword":
                errorMessage = validateConfirmPassword(formData.password, formData.confirmPassword)
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
        const usernameValid = validateField("username")
        const emailValid = validateField("email")
        const passwordValid = validateField("password")
        const confirmPasswordValid = validateField("confirmPassword")

        const errorMessages = []
        if (!usernameValid) errorMessages.push(errors.username || validateUsername(formData.username))
        if (!emailValid) errorMessages.push(errors.email || validateEmail(formData.email))
        if (!passwordValid) errorMessages.push(errors.password || validatePassword(formData.password))
        if (!confirmPasswordValid)
            errorMessages.push(errors.confirmPassword || validateConfirmPassword(formData.password, formData.confirmPassword))

        if (errorMessages.length > 0) {
            setMessage({
                text: "Please fix the following errors:\n• " + errorMessages.join("\n• "),
                type: "error",
            })
            return false
        }

        return true
    }

    const handleRegister = async (e) => {
        e.preventDefault()

        setMessage({ text: "", type: "" })

        if (!validateForm()) {
            return
        }

        setIsSubmitting(true)

        try {
            const response = await fetch("http://localhost:5005/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                }),
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
                const errorMessage = data.message || "Registration failed."

                setMessage({ text: errorMessage, type: "error" })

                if (errorMessage.includes("email")) {
                    setErrors((prev) => ({ ...prev, email: "This email is already registered" }))
                } else if (errorMessage.includes("username")) {
                    setErrors((prev) => ({ ...prev, username: "This username is already taken" }))
                }
            }
        } catch (err) {
            setMessage({ text: "Something went wrong! Please try again later.", type: "error" })
            console.error(err)
        } finally {
            setIsSubmitting(false)
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
                        <form onSubmit={handleRegister} noValidate>
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
                                <label htmlFor="username">Username</label>
                                <input
                                    type="text"
                                    id="username"
                                    placeholder="Enter your username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    className={errors.username ? "error" : ""}
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
                            <div className="form-group">
                                <label htmlFor="confirmPassword">Confirm Password</label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    placeholder="Confirm your password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className={errors.confirmPassword ? "error" : ""}
                                    required
                                />
                            </div>
                            <button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Registering..." : "Register"}
                            </button>
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

