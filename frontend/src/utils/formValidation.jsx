export const validateUsername = (username) => {
    if (!username) return "Username is required"
    if (username.length < 3) return "Username must be at least 3 characters long"
    if (username.length > 20) return "Username cannot exceed 20 characters"
    if (!/^[a-zA-Z0-9_]+$/.test(username)) return "Username can only contain letters, numbers, and underscores"
    return ""
}

export const validateEmail = (email) => {
    if (!email) return "Email is required"
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email)) return "Please enter a valid email address"
    return ""
}

export const validatePassword = (password) => {
    if (!password) return "Password is required"
    if (password.length < 6) return "Password must be at least 6 characters long"

    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumbers = /\d/.test(password)
    const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/.test(password)

    if (!(hasUpperCase && hasLowerCase && hasNumbers)) {
        return "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    }

    return ""
}

export const validateConfirmPassword = (password, confirmPassword) => {
    if (!confirmPassword) return "Please confirm your password"
    if (password !== confirmPassword) return "Passwords do not match"
    return ""
}

