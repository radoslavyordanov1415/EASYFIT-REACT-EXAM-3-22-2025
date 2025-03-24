"use client"

import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useAuth } from "../../context/AuthenticationContex"

export const useOutfitSave = (isEditing, mannequinImage, appliedClothing, formState, onOutfitLoaded) => {
    const { isLoggedIn } = useAuth()
    const { outfitId } = useParams()
    const navigate = useNavigate()
    const [saveStatus, setSaveStatus] = useState("")

    const handleSave = async () => {
        if (!isLoggedIn) {
            alert("Please login to save outfits")
            return navigate("/login")
        }

        try {
            setSaveStatus("Saving...")

            const method = isEditing ? "PUT" : "POST"
            const url = isEditing
                ? `http://localhost:5005/api/outfits/edit/${outfitId}`
                : "http://localhost:5005/api/outfits/create"

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    mannequinImage,
                    appliedClothing,
                    name: formState.name,
                    season: formState.season,
                    occasion: formState.occasion,
                    comfortLevel: formState.comfortLevel,
                    budget: formState.budget,
                    fitType: formState.fitType,
                    description: formState.description,
                }),
            })

            if (!response.ok) throw new Error("Failed to save outfit")

            const savedOutfit = await response.json()
            setSaveStatus("Saved successfully!")

            if (onOutfitLoaded) {
                onOutfitLoaded(savedOutfit)
            }

            setTimeout(() => navigate("/profile"), 1500)
        } catch (err) {
            setSaveStatus(`Error: ${err.message}`)
        }
    }

    return {
        saveStatus,
        handleSave,
    }
}

