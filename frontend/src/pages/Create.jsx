"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams } from "react-router-dom"
import Mannequin from "../components/Mannequin/Mannequin"
import AlertBox from "../components/AlertBox"
import "../styles/Create.css"

function Create() {
    const { outfitId } = useParams()
    const [selectedPart, setSelectedPart] = useState(null)
    const [isEditing, setIsEditing] = useState(false)
    const [loadingOutfit, setLoadingOutfit] = useState(false)
    const [uploadedParts, setUploadedParts] = useState({
        head: false,
        chest: false,
        legs: false,
        feet: false,
    })
    const [mannequinImage, setMannequinImage] = useState(null)
    const [appliedClothing, setAppliedClothing] = useState({})
    const [alertMessage, setAlertMessage] = useState("")
    const [alertType, setAlertType] = useState("error")

    const [formState, setFormState] = useState({
        name: "",
        season: "",
        occasion: "",
        comfortLevel: "",
        budget: "",
        fitType: "",
        description: "",
    })

    useEffect(() => {
        if (outfitId) {
            setIsEditing(true)
            setLoadingOutfit(true)

            const fetchOutfit = async () => {
                try {
                    const response = await fetch(`http://localhost:5005/api/outfits/${outfitId}`, {
                        credentials: "include",
                    })

                    if (!response.ok) {
                        throw new Error("Failed to fetch outfit")
                    }

                    const outfit = await response.json()

                    setFormState({
                        name: outfit.name || "",
                        season: outfit.season || "",
                        occasion: outfit.occasion || "",
                        comfortLevel: outfit.comfortLevel || "",
                        budget: outfit.budget || "",
                        fitType: outfit.fitType || "",
                        description: outfit.description || "",
                    })

                    if (outfit.appliedClothing) {
                        setAppliedClothing(outfit.appliedClothing)
                        setUploadedParts({
                            head: !!outfit.appliedClothing.head,
                            chest: !!outfit.appliedClothing.chest,
                            legs: !!outfit.appliedClothing.legs,
                            feet: !!outfit.appliedClothing.feet,
                        })
                    }

                    if (outfit.mannequinImage) {
                        setMannequinImage(outfit.mannequinImage)
                    }
                } catch (error) {
                    console.error("Error fetching outfit:", error)
                    setAlertMessage("Failed to load outfit")
                    setAlertType("error")
                } finally {
                    setLoadingOutfit(false)
                }
            }

            fetchOutfit()
        }
    }, [outfitId])

    const handleButtonClick = (part) => {
        setSelectedPart(part)
    }

    const handleFormChange = (field, value) => {
        setFormState((prev) => ({ ...prev, [field]: value }))
    }

    function handleOutfitLoaded(outfit) {
        if (outfit) {
            setFormState({
                name: outfit.name || "",
                season: outfit.season || "",
                occasion: outfit.occasion || "",
                comfortLevel: outfit.comfortLevel || "",
                budget: outfit.budget || "",
                fitType: outfit.fitType || "",
                description: outfit.description || "",
            })

            if (outfit.appliedClothing) {
                setAppliedClothing(outfit.appliedClothing)
                setUploadedParts({
                    head: !!outfit.appliedClothing.head,
                    chest: !!outfit.appliedClothing.chest,
                    legs: !!outfit.appliedClothing.legs,
                    feet: !!outfit.appliedClothing.feet,
                })
            }

            if (outfit.mannequinImage) {
                setMannequinImage(outfit.mannequinImage)
            }
        }
    }

    const handlePhotoUploaded = (part, photoData) => {
        setUploadedParts((prev) => ({
            ...prev,
            [part]: true,
        }))

        // Update applied clothing with the new photo data
        setAppliedClothing((prev) => ({
            ...prev,
            [part]: photoData,
        }))
    }

    const handlePhotoRemoved = (part) => {
        setUploadedParts((prev) => ({
            ...prev,
            [part]: false,
        }))

        // Remove the part from applied clothing
        setAppliedClothing((prev) => {
            const updated = { ...prev }
            delete updated[part]
            return updated
        })

        setSelectedPart(null)
    }

    const validateForm = useCallback(() => {
        if (!formState.name.trim()) {
            setAlertMessage("Outfit name is required")
            setAlertType("error")
            return false
        }

        if (!Object.values(uploadedParts).some((part) => part)) {
            setAlertMessage("Please upload at least one clothing item")
            setAlertType("error")
            return false
        }

        return true
    }, [formState.name, uploadedParts])

    const clearAlert = () => {
        setAlertMessage("")
    }

    return (
        <div className="create-container">
            <h2 className="create-title">{isEditing ? "Edit Your Design" : "Create Your Design"}</h2>

            {/* Alert Box for displaying validation messages */}
            {alertMessage && <AlertBox message={alertMessage} type={alertType} onClose={clearAlert} />}

            <div className="create-content">
                <div className="clothing-selection-form">
                    {loadingOutfit ? (
                        <p>Loading outfit details...</p>
                    ) : (
                        <>
                            <input
                                type="text"
                                placeholder="Outfit Name"
                                value={formState.name}
                                onChange={(e) => handleFormChange("name", e.target.value)}
                                className="input-field"
                            />

                            <select
                                value={formState.season}
                                onChange={(e) => handleFormChange("season", e.target.value)}
                                className="input-field"
                            >
                                <option value="">Select Season</option>
                                <option value="spring">Spring</option>
                                <option value="summer">Summer</option>
                                <option value="autumn">Autumn</option>
                                <option value="winter">Winter</option>
                            </select>

                            <input
                                type="text"
                                placeholder="Occasion"
                                value={formState.occasion}
                                onChange={(e) => handleFormChange("occasion", e.target.value)}
                                className="input-field"
                            />

                            <select
                                value={formState.comfortLevel}
                                onChange={(e) => handleFormChange("comfortLevel", e.target.value)}
                                className="input-field"
                            >
                                <option value="">Comfort Level</option>
                                <option value="casual">Casual</option>
                                <option value="formal">Formal</option>
                                <option value="sport">Sport</option>
                            </select>

                            <select
                                value={formState.budget}
                                onChange={(e) => handleFormChange("budget", e.target.value)}
                                className="input-field"
                            >
                                <option value="">Budget Range</option>
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>

                            <select
                                value={formState.fitType}
                                onChange={(e) => handleFormChange("fitType", e.target.value)}
                                className="input-field"
                            >
                                <option value="">Fit Type</option>
                                <option value="slim">Slim</option>
                                <option value="regular">Regular</option>
                                <option value="loose">Loose</option>
                            </select>

                            <textarea
                                placeholder="Outfit Description"
                                value={formState.description}
                                onChange={(e) => handleFormChange("description", e.target.value)}
                                className="input-field"
                                rows="4"
                                style={{
                                    resize: "vertical",
                                    minHeight: "100px",
                                    padding: "10px",
                                    margin: "10px 0",
                                }}
                            />
                        </>
                    )}

                    <div className="part-selection">
                        {["head", "chest", "legs", "feet"].map((part) => (
                            <button
                                key={part}
                                className={`styled-button ${uploadedParts[part] ? "uploaded" : ""}`}
                                onClick={() => !uploadedParts[part] && handleButtonClick(part)}
                                disabled={uploadedParts[part]}
                            >
                                {part.charAt(0).toUpperCase() + part.slice(1)} {uploadedParts[part] ? "✓" : ""}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mannequin-container">
                    <Mannequin
                        selectedPart={selectedPart}
                        formState={formState}
                        onOutfitLoaded={handleOutfitLoaded}
                        onPhotoUploaded={handlePhotoUploaded}
                        onPhotoRemoved={handlePhotoRemoved}
                        validateForm={validateForm}
                    />
                </div>
            </div>
        </div>
    )
}

export default Create

