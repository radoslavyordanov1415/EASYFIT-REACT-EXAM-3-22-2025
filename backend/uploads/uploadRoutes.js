import express from "express";
import multer from "multer";
import axios from "axios";
import FormData from "form-data";
import cloudinary from "cloudinary";
import dotenv from "dotenv";
import streamifier from "streamifier";
dotenv.config();

const router = express.Router();

cloudinary.v2.config({
    cloud_name: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.REACT_APP_CLOUDINARY_API_KEY,
    api_secret: process.env.REACT_APP_CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const uploadToCloudinary = (buffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.v2.uploader.upload_stream(
            { resource_type: "image" },
            (error, result) => {
                if (error) return reject(error);
                resolve(result.secure_url);
            }
        );
        streamifier.createReadStream(buffer).pipe(stream);
    });
};

router.post("/upload", upload.single("image_file"), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }

    try {
        let imageUrl = await uploadToCloudinary(req.file.buffer);

        if (process.env.REMOVE_BG_API_KEY) {
            const formData = new FormData();
            formData.append("image_file", req.file.buffer, {
                filename: req.file.originalname,
            });
            formData.append("size", "auto");

            const response = await axios.post(
                "https://api.remove.bg/v1.0/removebg",
                formData,
                {
                    headers: {
                        ...formData.getHeaders(),
                        "X-Api-Key": process.env.REMOVE_BG_API_KEY,
                    },
                    responseType: "arraybuffer",
                }
            );

            imageUrl = await uploadToCloudinary(response.data);
        }

        res.json({ imageUrl });
    } catch (error) {
        console.error("Image processing failed:", error);
        res.status(500).json({ message: "Image processing failed", error: error.message });
    }
});

export default router;
