"use client"
import useMannequin from "./hooks/UseMannequin"
import { EDITOR_WIDTH, EDITOR_HEIGHT } from "./constants/MannequinConstants"

export default function Mannequin({
    selectedPart,
    formState,
    onOutfitLoaded,
    onPhotoUploaded,
    onPhotoRemoved,
    validateForm,
    onUploadStart,
    isUploading,
}) {
    const {
        isEditing,
        saveStatus,
        mannequinImage,
        appliedClothing,
        fileInputRef,
        containerRef,
        handleSave: originalHandleSave,
        toggleMannequinGender,
        handleFileChange,
        handleDeleteClothing,
        handleMouseDown,
        handleResizeMouseDown,
    } = useMannequin(selectedPart, formState, onOutfitLoaded, onPhotoUploaded)

    const handleFileChangeWithCallback = (e) => {
        if (e.target.files && e.target.files[0]) {
            if (onUploadStart) onUploadStart()

            handleFileChange(e)
        }
    }

    const handleDeleteClothingWithCallback = (part) => {
        handleDeleteClothing(part)
        onPhotoRemoved(part)
    }

    const handleSave = () => {
        if (!validateForm || validateForm()) {
            originalHandleSave()
        }
    }

    return (
        <div
            ref={containerRef}
            style={{
                position: "relative",
                width: `${EDITOR_WIDTH}px`,
                height: `${EDITOR_HEIGHT}px`,
                margin: "0 auto",
                border: "1px solid #ddd",
                boxSizing: "border-box",
                backgroundColor: "#fff",
                borderRadius: "10px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                opacity: isUploading ? 0.7 : 1,
                pointerEvents: isUploading ? "none" : "auto",
            }}
        >
            <button
                onClick={toggleMannequinGender}
                style={{
                    padding: "8px 16px",
                    backgroundColor: "transparent",
                    color: "#333",
                    border: "2px solid #333",
                    borderRadius: "15px",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "pointer",
                    position: "absolute",
                    top: "10px",
                    left: "10px",
                    zIndex: "1",
                    transition: "all 0.3s ease",
                }}
                className="styled-button"
                disabled={isUploading}
            >
                Switch Gender
            </button>

            <img
                src={mannequinImage || "/placeholder.svg"}
                alt="Mannequin"
                style={{
                    position: "absolute",
                    top: "0",
                    left: "0",
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                }}
            />

            {Object.entries(appliedClothing).map(([part, item]) => (
                <div
                    key={part}
                    style={{
                        position: "absolute",
                        top: `${item.y}px`,
                        left: `${item.x}px`,
                        width: `${item.width}px`,
                        height: `${item.height}px`,
                        backgroundImage: `url(${item.imageUrl})`,
                        backgroundSize: "contain",
                        cursor: isUploading ? "default" : "move",
                        border: "1px dashed rgba(0,0,0,0.2)",
                        transition: "transform 0.2s ease",
                    }}
                    onMouseDown={(e) => !isUploading && handleMouseDown(e, part, item.x, item.y)}
                >
                    <div
                        onMouseDown={(e) => !isUploading && handleResizeMouseDown(e, part, item.width, item.height)}
                        style={{
                            position: "absolute",
                            bottom: "5px",
                            right: "5px",
                            backgroundColor: "rgba(0, 0, 0, 0.5)",
                            borderRadius: "50%",
                            width: "10px",
                            height: "10px",
                            cursor: isUploading ? "default" : "se-resize",
                            display: isUploading ? "none" : "block",
                        }}
                    ></div>
                    <button
                        onClick={() => !isUploading && handleDeleteClothingWithCallback(part)}
                        style={{
                            position: "absolute",
                            top: "-15px",
                            right: "-15px",
                            backgroundColor: "red",
                            color: "white",
                            border: "none",
                            borderRadius: "50%",
                            width: "20px",
                            height: "20px",
                            fontSize: "12px",
                            cursor: isUploading ? "default" : "pointer",
                            display: isUploading ? "none" : "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "transform 0.2s ease",
                        }}
                        onMouseOver={(e) => {
                            if (!isUploading) e.currentTarget.style.transform = "scale(1.1)"
                        }}
                        onMouseOut={(e) => {
                            if (!isUploading) e.currentTarget.style.transform = "scale(1)"
                        }}
                        disabled={isUploading}
                    >
                        ×
                    </button>
                </div>
            ))}

            <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                accept="image/*"
                onChange={handleFileChangeWithCallback}
                disabled={isUploading}
            />

            <div
                style={{
                    position: "absolute",
                    bottom: "20px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: "1",
                }}
            >
                <button
                    onClick={handleSave}
                    style={{
                        padding: "12px 25px",
                        backgroundColor: "#337ab7",
                        color: "white",
                        border: "none",
                        borderRadius: "10px",
                        fontSize: "16px",
                        fontWeight: "600",
                        cursor: isUploading ? "default" : "pointer",
                        transition: "background-color 0.3s ease, transform 0.2s ease",
                        opacity: isUploading ? 0.7 : 1,
                    }}
                    className="new-outfit-btn"
                    onMouseOver={(e) => {
                        if (!isUploading) {
                            e.currentTarget.style.backgroundColor = "#286090"
                            e.currentTarget.style.transform = "scale(1.05)"
                        }
                    }}
                    onMouseOut={(e) => {
                        if (!isUploading) {
                            e.currentTarget.style.backgroundColor = "#337ab7"
                            e.currentTarget.style.transform = "scale(1)"
                        }
                    }}
                    disabled={isUploading}
                >
                    {isEditing ? "Update Outfit" : "Save Outfit"}
                </button>
                {saveStatus && <div style={{ marginTop: "10px", textAlign: "center" }}>{saveStatus}</div>}
            </div>
        </div>
    )
}

