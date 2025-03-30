"use client"

import { useState, useEffect } from "react"
import "../styles/AlertBox.css"

const ErrorIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
    </svg>
)

const WarningIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
        <line x1="12" y1="9" x2="12" y2="13"></line>
        <line x1="12" y1="17" x2="12.01" y2="17"></line>
    </svg>
)

const SuccessIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
)

const InfoIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="16" x2="12" y2="12"></line>
        <line x1="12" y1="8" x2="12.01" y2="8"></line>
    </svg>
)

const AlertBox = ({ message, type = "error", onClose }) => {
    const [isVisible, setIsVisible] = useState(true)

    useEffect(() => {
        if (!message) return

        setIsVisible(true)

        const timer = setTimeout(() => {
            setIsVisible(false)
            if (onClose) onClose()
        }, 5000)

        return () => clearTimeout(timer)
    }, [message, onClose])

    if (!message || !isVisible) {
        return null
    }

    const getIcon = () => {
        switch (type) {
            case "error":
                return <ErrorIcon />
            case "warning":
                return <WarningIcon />
            case "success":
                return <SuccessIcon />
            case "info":
                return <InfoIcon />
            default:
                return <ErrorIcon />
        }
    }

    const formattedMessage = message.split("\n").map((line, index) => <div key={index}>{line}</div>)

    return (
        <div className={`alert-box ${type} ${isVisible ? "visible" : "hidden"}`} role="alert">
            <div className="alert-content">
                <div className="alert-icon">{getIcon()}</div>
                <div className="alert-message">{formattedMessage}</div>
            </div>
        </div>
    )
}

export default AlertBox

