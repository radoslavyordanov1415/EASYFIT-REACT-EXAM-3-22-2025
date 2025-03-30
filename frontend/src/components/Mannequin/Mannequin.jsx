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
    } = useMannequin(selectedPart, formState, onOutfitLoaded)

    const handleFileChangeWithCallback = (e) => {
        handleFileChange(e)
        onPhotoUploaded(selectedPart)
    }

    const handleDeleteClothingWithCallback = (part) => {
        handleDeleteClothing(part)
        onPhotoRemoved(part)
    }

    // Wrap the original save function with validation
    const handleSave = () => {
        // If validateForm is provided and returns true, proceed with save
        // Otherwise, if validateForm is not provided, just call the original save function
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
                        cursor: "move",
                        border: "1px dashed rgba(0,0,0,0.2)",
                        transition: "transform 0.2s ease",
                    }}
                    onMouseDown={(e) => handleMouseDown(e, part, item.x, item.y)}
                >
                    <div
                        onMouseDown={(e) => handleResizeMouseDown(e, part, item.width, item.height)}
                        style={{
                            position: "absolute",
                            bottom: "5px",
                            right: "5px",
                            backgroundColor: "rgba(0, 0, 0, 0.5)",
                            borderRadius: "50%",
                            width: "10px",
                            height: "10px",
                            cursor: "se-resize",
                        }}
                    ></div>
                    <button
                        onClick={() => handleDeleteClothingWithCallback(part)}
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
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "transform 0.2s ease",
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.transform = "scale(1.1)"
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.transform = "scale(1)"
                        }}
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
                        cursor: "pointer",
                        transition: "background-color 0.3s ease, transform 0.2s ease",
                    }}
                    className="new-outfit-btn"
                    onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = "#286090"
                        e.currentTarget.style.transform = "scale(1.05)"
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = "#337ab7"
                        e.currentTarget.style.transform = "scale(1)"
                    }}
                >
                    {isEditing ? "Update Outfit" : "Save Outfit"}
                </button>
                {saveStatus && <div style={{ marginTop: "10px", textAlign: "center" }}>{saveStatus}</div>}
            </div>
        </div>
    )
}

