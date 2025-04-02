"use client"

import { useOutfitLoader } from "./OutfitLoader"
import { useMannequinControls } from "./useMannequinControls"
import { useClothingDrag } from "./UseClothingDrag"
import { useClothingResize } from "./UseClothingResize"
import { useClothingUpload } from "./useCloathingUpload"
import { useOutfitSave } from "./OutfitSave"

const useMannequin = (selectedPart, formState, onOutfitLoaded, onPhotoUploaded) => {
    const { isEditing, mannequinImage, setMannequinImage, appliedClothing, setAppliedClothing } =
        useOutfitLoader(onOutfitLoaded)

    const { toggleMannequinGender } = useMannequinControls(mannequinImage, setMannequinImage)

    const { containerRef, handleMouseDown } = useClothingDrag(setAppliedClothing)

    const { handleResizeMouseDown } = useClothingResize(setAppliedClothing)

    const { fileInputRef, handleFileChange, handleDeleteClothing } = useClothingUpload(
        selectedPart,
        setAppliedClothing,
        onPhotoUploaded,
    )

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

