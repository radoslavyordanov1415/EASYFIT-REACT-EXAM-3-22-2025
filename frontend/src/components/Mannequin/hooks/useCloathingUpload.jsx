"use client"

import { useRef, useEffect } from "react"
import { DEFAULT_POSITIONS, DEFAULT_DIMENSIONS } from "../constants/MannequinConstants"

export const useClothingUpload = (selectedPart, setAppliedClothing, onPhotoUploaded) => {
    const fileInputRef = useRef(null)

    useEffect(() => {
        if (selectedPart && fileInputRef.current) {
            fileInputRef.current.click()
        }
    }, [selectedPart])

    const handleFileChange = async (e) => {
        if (!e.target.files || e.target.files.length === 0 || !selectedPart) return

        const file = e.target.files[0]
        const formData = new FormData()
        formData.append("image_file", file)

        try {
            const response = await fetch("http://localhost:5005/api/upload", {
                method: "POST",
                body: formData,
                credentials: "include",
            })

            if (!response.ok) {
                throw new Error("Failed to upload image")
            }

            const data = await response.json()

            if (e.target) {
                e.target.value = ""
            }

            if (fileInputRef.current) {
                fileInputRef.current.value = ""
            }

            const img = new Image()
            img.src = data.imageUrl
            await new Promise((resolve) => {
                img.onload = resolve
            })

            const naturalWidth = img.naturalWidth
            const naturalHeight = img.naturalHeight
            const aspectRatio = naturalWidth / naturalHeight

            const defaultDimension = DEFAULT_DIMENSIONS[selectedPart] || DEFAULT_DIMENSIONS.default
            let newWidth, newHeight

            if (defaultDimension.width) {
                newWidth = defaultDimension.width
                newHeight = newWidth / aspectRatio
            } else if (defaultDimension.height) {
                newHeight = defaultDimension.height
                newWidth = newHeight * aspectRatio
            } else {
                newWidth = 100
                newHeight = 100
            }

            const defaultPosition = DEFAULT_POSITIONS[selectedPart] || DEFAULT_POSITIONS.default

            const newClothingItem = {
                imageUrl: data.imageUrl,
                x: defaultPosition.x,
                y: defaultPosition.y,
                width: newWidth,
                height: newHeight,
            }

            setAppliedClothing((prev) => ({
                ...prev,
                [selectedPart]: newClothingItem,
            }))

            if (onPhotoUploaded) {
                onPhotoUploaded(selectedPart, newClothingItem)
            }
        } catch (error) {
            console.error("Error uploading image:", error)
            alert("Failed to upload image. Please try again.")

            if (onPhotoUploaded) {
                onPhotoUploaded(selectedPart, null)
            }
        }
    }

    const handleDeleteClothing = (part) => {
        setAppliedClothing((prev) => {
            const newState = { ...prev }
            delete newState[part]
            return newState
        })
    }

    return {
        fileInputRef,
        handleFileChange,
        handleDeleteClothing,
    }
}

