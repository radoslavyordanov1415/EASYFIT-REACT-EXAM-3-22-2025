import axios from 'axios';

const API_BASE_URL = "http://localhost:5005/api/outfits";

export const fetchOutfits = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/all`, { withCredentials: true });
        return response.data.outfits;
    } catch (error) {
        console.error("Error fetching outfits:", error);
        throw error;
    }
};

export const deleteOutfit = async (outfitId) => {
    try {
        await axios.delete(`${API_BASE_URL}/delete/${outfitId}`, { withCredentials: true });
    } catch (error) {
        console.error("Error deleting outfit:", error);
        throw error;
    }
};