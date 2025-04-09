import express from "express"
import outfitController from "../controllers/outfitController.js"
import { verifyToken } from "../middlewares/authMiddleware.js"

const router = express.Router()

router.post("/create", verifyToken, outfitController.createOutfit)
router.put("/edit/:id", verifyToken, outfitController.editOutfit)
router.delete("/delete/:id", verifyToken, outfitController.deleteOutfit)
router.get("/all", verifyToken, outfitController.getAllOutfits)
router.get("/recent", verifyToken, outfitController.getRecentOutfits)
router.get("/stats", verifyToken, outfitController.getOutfitStats)
router.get("/:id", outfitController.getOutfitById)
router.get("/community/all", outfitController.getCommunityOutfits)
router.post("/:id/like", verifyToken, outfitController.likeOutfit)
router.post("/:id/dislike", verifyToken, outfitController.dislikeOutfit)
router.post("/:id/comment", verifyToken, outfitController.addComment)
router.delete("/:outfitId/comment/:commentId", verifyToken, outfitController.deleteComment)

export default router

