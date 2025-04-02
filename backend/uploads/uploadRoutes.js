import express from 'express';
import multer from 'multer';
import uploadController from '../controllers/uploadController.js';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/upload", upload.single("image_file"), uploadController.uploadImage);

export default router;