import cloudinary from 'cloudinary';
import streamifier from 'streamifier';
import axios from 'axios';
import FormData from 'form-data';
import dotenv from 'dotenv'

dotenv.config();

cloudinary.v2.config({
    cloud_name: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.REACT_APP_CLOUDINARY_API_KEY,
    api_secret: process.env.REACT_APP_CLOUDINARY_API_SECRET,
});

const uploadService = {
    uploadToCloudinary: (buffer) => {
        return new Promise((resolve, reject) => {
            const stream = cloudinary.v2.uploader.upload_stream(
                { resource_type: "image" },
                (error, result) => {
                    if (error) {
                        return reject(error);
                    }
                    resolve(result.secure_url);
                }
            );
            streamifier.createReadStream(buffer).pipe(stream);
        });
    },

    removeBackground: async (buffer, originalname) => {
        const formData = new FormData();
        formData.append("image_file", buffer, { filename: originalname });
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
        return response.data;
    },

    processImage: async (file) => {
        let imageUrl = await uploadService.uploadToCloudinary(file.buffer);

        if (process.env.REMOVE_BG_API_KEY) {
            const removedBgBuffer = await uploadService.removeBackground(file.buffer, file.originalname);
            imageUrl = await uploadService.uploadToCloudinary(removedBgBuffer);
        }

        return imageUrl;
    }
};

export default uploadService;