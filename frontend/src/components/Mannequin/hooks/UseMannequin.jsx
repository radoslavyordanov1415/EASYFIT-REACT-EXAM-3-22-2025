"use client"

import { useOutfitLoader } from "./OutfitLoader"
import { useMannequinControls } from "./useMannequinControls"
import { useClothingDrag } from "./UseClothingDrag"
import { useClothingResize } from "./UseClothingResize"
import { useClothingUpload } from "./useCloathingUpload"
import { useOutfitSave } from "./OutfitSave"

const useMannequin = (selectedPart, formState, onPhotoUploaded) => {
    const { isEditing, mannequinImage, setMannequinImage, appliedClothing, setAppliedClothing } = useOutfitLoader()

    const { toggleMannequinGender } = useMannequinControls(mannequinImage, setMannequinImage)

    const { containerRef, handleMouseDown } = useClothingDrag(setAppliedClothing)

    const { handleResizeMouseDown } = useClothingResize(setAppliedClothing)

    const { fileInputRef, handleFileChange, handleDeleteClothing } = useClothingUpload(
        selectedPart,
        setAppliedClothing,
        onPhotoUploaded,
    )

    const { saveStatus, handleSave } = useOutfitSave(isEditing, mannequinImage, appliedClothing, formState)

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

