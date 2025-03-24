"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { DEFAULT_WOMAN_IMAGE } from "../constants/MannequinConstants"

export const useOutfitLoader = (onOutfitLoaded) => {
    const { outfitId } = useParams()
    const navigate = useNavigate()
    const [isEditing, setIsEditing] = useState(false)
    const [mannequinImage, setMannequinImage] = useState(DEFAULT_WOMAN_IMAGE)
    const [appliedClothing, setAppliedClothing] = useState({})

    useEffect(() => {
        if (outfitId) {
            const loadOutfit = async () => {
                try {
                    const response = await fetch(`http://localhost:5005/api/outfits/${outfitId}`, {
                        credentials: "include",
                    })
                    const outfit = await response.json()

                    if (outfit) {
                        setMannequinImage(outfit.mannequinImage || DEFAULT_WOMAN_IMAGE)

                        const processedClothing = {}
                        Object.entries(outfit.appliedClothing || {}).forEach(([part, item]) => {
                            processedClothing[part] = {
                                ...item,
                                x: item.x,
                                y: item.y,
                                width: item.width,
                                height: item.height,
                            }
                        })

                        setAppliedClothing(processedClothing)
                        onOutfitLoaded && onOutfitLoaded(outfit)
                        setIsEditing(true)
                    }
                } catch (err) {
                    console.error("Error loading outfit:", err)
                    navigate("/profile")
                }
            }
            loadOutfit()
        }
    }, [outfitId, navigate, onOutfitLoaded])

    return {
        isEditing,
        mannequinImage,
        setMannequinImage,
        appliedClothing,
        setAppliedClothing,
    }
}

