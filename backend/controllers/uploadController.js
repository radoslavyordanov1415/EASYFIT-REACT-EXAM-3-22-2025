import uploadService from '../services/uploadService.js';

const uploadController = {
    uploadImage: async (req, res) => {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        try {
            const imageUrl = await uploadService.processImage(req.file);
            res.json({ imageUrl });
        } catch (error) {
            console.error("Image processing failed:", error);
            res.status(500).json({ message: "Image processing failed", error: error.message });
        }
    }
};

export default uploadController;