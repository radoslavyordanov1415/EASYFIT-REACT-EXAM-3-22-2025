"use client"

import { useOutfitLoader } from "./OutfitLoader"
import { useMannequinControls } from "./useMannequinControls"
import { useClothingDrag } from "./UseClothingDrag"
import { useClothingResize } from "./UseClothingResize"
import { useClothingUpload } from "./useCloathingUpload"
import { useOutfitSave } from "./OutfitSave"

const useMannequin = (selectedPart, formState, onOutfitLoaded) => {
    // Load outfit data
    const { isEditing, mannequinImage, setMannequinImage, appliedClothing, setAppliedClothing } =
        useOutfitLoader(onOutfitLoaded)

    // Mannequin controls
    const { toggleMannequinGender } = useMannequinControls(mannequinImage, setMannequinImage)

    // Clothing drag
    const { containerRef, handleMouseDown } = useClothingDrag(setAppliedClothing)

    // Clothing resize
    const { handleResizeMouseDown } = useClothingResize(setAppliedClothing)

    // Clothing upload
    const { fileInputRef, handleFileChange, handleDeleteClothing } = useClothingUpload(selectedPart, setAppliedClothing)

    // Outfit save
    const { saveStatus, handleSave } = useOutfitSave(
        isEditing,
        mannequinImage,
        appliedClothing,
        formState,
        onOutfitLoaded,
    )

    return {
        isEditing,
        saveStatus,
        mannequinImage,
        appliedClothing,
        fileInputRef,
        containerRef,
        handleSave,
        toggleMannequinGender,
        handleFileChange,
        handleDeleteClothing,
        handleMouseDown,
        handleResizeMouseDown,
    }
}

export default useMannequin

