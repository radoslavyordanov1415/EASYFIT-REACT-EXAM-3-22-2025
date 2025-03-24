import express from "express"
import multer from "multer"
import path from "path"
import axios from "axios"
import FormData from "form-data"
import fs from "fs"
import dotenv from "dotenv"

dotenv.config()

const router = express.Router()

const storage = multer.diskStorage({
    destination: "./uploads/",
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
        const fileExtension = path.extname(file.originalname)
        cb(null, file.fieldname + "-" + uniqueSuffix + fileExtension)
    },
})

const upload = multer({ storage: storage })

router.post("/upload", upload.single("image_file"), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" })
    }

    try {
        const formData = new FormData()
        formData.append("image_file", fs.createReadStream(req.file.path))
        formData.append("size", "auto")

        const response = await axios.post("https://api.remove.bg/v1.0/removebg", formData, {
            headers: {
                ...formData.getHeaders(),
                "X-Api-Key": process.env.REMOVE_BG_API_KEY,
            },
            responseType: "arraybuffer",
        })

        const processedFilename = `processed-${req.file.filename}`
        const processedPath = path.join("./uploads", processedFilename)
        fs.writeFileSync(processedPath, response.data)

        const imageUrl = `http://localhost:5005/uploads/${processedFilename}`
        res.json({ imageUrl })
    } catch (error) {
        console.error("Background removal failed:", error)
        console.error("Error details:", error.response ? error.response.data.toString() : error.message)
        res.status(500).json({
            message: "Background removal failed",
            error: error.response ? error.response.data.toString() : error.message,
        })
    } finally {
        try {
            fs.unlinkSync(req.file.path)
        } catch (unlinkError) {
            console.error("Error deleting uploaded file:", unlinkError)
        }
    }
})

export default router

