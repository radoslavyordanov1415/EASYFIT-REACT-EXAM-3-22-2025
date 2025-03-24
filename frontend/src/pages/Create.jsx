"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import Mannequin from "../components/Mannequin/Mannequin";
import "../styles/Create.css";

function Create() {
    const { outfitId } = useParams();
    const [selectedPart, setSelectedPart] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loadingOutfit, setLoadingOutfit] = useState(false);

    const [formState, setFormState] = useState({
        name: "",
        season: "",
        occasion: "",
        comfortLevel: "",
        budget: "",
        fitType: "",
        description: "",
    });

    useEffect(() => {
        if (outfitId) {
            setIsEditing(true);
            setLoadingOutfit(true);

            const fetchOutfit = async () => {
                try {
                    const response = await fetch(`http://localhost:5005/api/outfits/${outfitId}`, {
                        credentials: "include",
                    });

                    if (!response.ok) {
                        throw new Error("Failed to fetch outfit");
                    }

                    const outfit = await response.json();
                    setFormState({
                        name: outfit.name || "",
                        season: outfit.season || "",
                        occasion: outfit.occasion || "",
                        comfortLevel: outfit.comfortLevel || "",
                        budget: outfit.budget || "",
                        fitType: outfit.fitType || "",
                        description: outfit.description || "",
                    });
                } catch (error) {
                    console.error("Error fetching outfit:", error);
                } finally {
                    setLoadingOutfit(false);
                }
            };

            fetchOutfit();
        }
    }, [outfitId]);

    const handleButtonClick = (part) => {
        setSelectedPart(part);
    };

    const handleFormChange = (field, value) => {
        setFormState((prev) => ({ ...prev, [field]: value }));
    };

    const handleOutfitLoaded = useCallback((outfit) => {
        if (outfit) {
            setFormState({
                name: outfit.name || "",
                season: outfit.season || "",
                occasion: outfit.occasion || "",
                comfortLevel: outfit.comfortLevel || "",
                budget: outfit.budget || "",
                fitType: outfit.fitType || "",
                description: outfit.description || "",
            });
        }
    }, []);

    return (
        <div className="create-container">
            <h2 className="create-title">{isEditing ? "Edit Your Design" : "Create Your Design"}</h2>
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
                                    margin: "10px 0"
                                }}
                            />
                        </>
                    )}

                    <div className="part-selection">
                        <button className="styled-button" onClick={() => handleButtonClick("head")}>Head</button>
                        <button className="styled-button" onClick={() => handleButtonClick("chest")}>Chest</button>
                        <button className="styled-button" onClick={() => handleButtonClick("legs")}>Legs</button>
                        <button className="styled-button" onClick={() => handleButtonClick("feet")}>Feet</button>
                    </div>
                </div>

                <div className="mannequin-container">
                    <Mannequin
                        selectedPart={selectedPart}
                        formState={formState}
                        onOutfitLoaded={handleOutfitLoaded}
                    />
                </div>
            </div>
        </div>
    );
}

export default Create;
