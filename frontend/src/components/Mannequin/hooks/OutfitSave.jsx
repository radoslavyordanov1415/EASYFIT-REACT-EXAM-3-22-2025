"use client";

import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthenticationContex";
import AlertBox from "../../AlertBox";

export const useOutfitSave = (isEditing, mannequinImage, appliedClothing, formState, onOutfitLoaded) => {
    const { isLoggedIn } = useAuth();
    const { outfitId } = useParams();
    const navigate = useNavigate();
    const [saveStatus, setSaveStatus] = useState("");
    const [alertType, setAlertType] = useState("error");

    const handleSave = async () => {
        if (!isLoggedIn) {
            setSaveStatus("Please login to save outfits");
            setAlertType("warning");
            return navigate("/login");
        }

        if (!formState.name.trim()) {
            setSaveStatus("Outfit name is required");
            setAlertType("error");
            return;
        }

        if (!Object.values(appliedClothing).some(part => part)) {
            setSaveStatus("Please upload at least one clothing item");
            setAlertType("error");
            return;
        }

        try {
            setSaveStatus("Saving...");
            setAlertType("info");

            const method = isEditing ? "PUT" : "POST";
            const url = isEditing
                ? `http://localhost:5005/api/outfits/edit/${outfitId}`
                : "http://localhost:5005/api/outfits/create";

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    mannequinImage,
                    appliedClothing,
                    ...formState
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to save outfit");
            }

            const savedOutfit = await response.json();
            setSaveStatus("Saved successfully!");
            setAlertType("success");

            if (onOutfitLoaded) onOutfitLoaded(savedOutfit);
            setTimeout(() => navigate("/profile"), 1500);

        } catch (err) {
            setSaveStatus(err.message);
            setAlertType("error");
        }
    };

    return {
        saveStatus,
        handleSave,
        alertType
    };
};