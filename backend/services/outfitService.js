import Outfit from "../models/Outfit.js"
import mongoose from "mongoose"

const outfitService = {
    createOutfit: async (outfitData, userId) => {
        try {
            const newOutfit = new Outfit({ ...outfitData, userId })
            return await newOutfit.save()
        } catch (err) {
            throw err
        }
    },

    editOutfit: async (outfitId, outfitData, userId) => {
        try {
            const outfit = await Outfit.findOneAndUpdate({ _id: outfitId, userId }, outfitData, {
                new: true,
                runValidators: true,
            })
            if (!outfit) {
                throw new Error("Outfit not found or unauthorized")
            }
            return outfit
        } catch (err) {
            throw err
        }
    },

    deleteOutfit: async (outfitId, userId) => {
        try {
            const outfit = await Outfit.findOneAndDelete({ _id: outfitId, userId })
            if (!outfit) {
                throw new Error("Outfit not found or unauthorized")
            }
            return { message: "Outfit deleted successfully" }
        } catch (err) {
            throw err
        }
    },

    getAllOutfits: async (userId, page = 1, limit = 10) => {
        try {
            const outfits = await Outfit.find({ userId })
                .limit(limit * 1)
                .skip((page - 1) * limit)
                .exec()
            const count = await Outfit.countDocuments({ userId })
            return {
                totalPages: Math.ceil(count / limit),
                currentPage: page,
                outfits,
            }
        } catch (err) {
            throw err
        }
    },

    getRecentOutfits: async (userId) => {
        try {
            const outfits = await Outfit.find({ userId: new mongoose.Types.ObjectId(userId) })
                .sort({ createdAt: -1 })
                .limit(3)
            return { outfits }
        } catch (err) {
            throw err
        }
    },

    getOutfitStats: async (userId) => {
        try {
            const userIdObj = new mongoose.Types.ObjectId(userId)
            const totalOutfits = await Outfit.countDocuments({ userId: userIdObj })
            const favoriteSeasons = await Outfit.aggregate([
                { $match: { userId: userIdObj } },
                { $group: { _id: "$season", count: { $sum: 1 } } },
                { $sort: { count: -1 } },
            ])
            const favoriteOccasions = await Outfit.aggregate([
                { $match: { userId: userIdObj } },
                { $group: { _id: "$occasion", count: { $sum: 1 } } },
                { $sort: { count: -1 } },
            ])
            return {
                totalOutfits,
                favoriteSeasons: Object.fromEntries(favoriteSeasons.map((s) => [s._id, s.count])),
                favoriteOccasions: Object.fromEntries(favoriteOccasions.map((o) => [o._id, o.count])),
            }
        } catch (err) {
            throw err
        }
    },

    getOutfitById: async (id) => {
        try {
            return await Outfit.findById(id)
                .populate('userId', 'username avatar')
                .populate({
                    path: 'comments.userId',
                    select: 'username avatar',
                })
                .exec();
        } catch (err) {
            throw new Error("Error fetching outfit");
        }
    },

    getCommunityOutfits: async () => {
        try {
            return await Outfit.find()
                .populate("userId", "username avatar")
                .populate({
                    path: "comments.userId",
                    select: "username avatar _id",
                })
                .sort({ createdAt: -1 })
        } catch (err) {
            throw err
        }
    },

    handleReaction: async (outfitId, userId, reactionType) => {
        try {
            const outfit = await Outfit.findById(outfitId)
            const oppositeReaction = reactionType === "likes" ? "dislikes" : "likes"
            if (outfit[reactionType].includes(userId)) {
                outfit[reactionType].pull(userId)
            } else {
                outfit[oppositeReaction].pull(userId)
                outfit[reactionType].push(userId)
            }
            return await outfit.save()
        } catch (err) {
            throw err
        }
    },

    addComment: async (outfitId, userId, text) => {
        try {
            const outfit = await Outfit.findById(outfitId)
            if (!outfit) throw new Error("Outfit not found")

            outfit.comments.push({ userId, text })
            await outfit.save()

            const updatedOutfit = await Outfit.findById(outfitId).populate({
                path: "comments.userId",
                select: "username avatar _id",
            })

            return updatedOutfit
        } catch (err) {
            throw err
        }
    },

    deleteComment: async (outfitId, commentId, userId) => {
        const outfit = await Outfit.findById(outfitId);
        if (!outfit) throw new Error("Outfit not found");

        const commentIndex = outfit.comments.findIndex(
            c => c._id.toString() === commentId
        );

        if (commentIndex === -1) throw new Error("Comment not found");

        if (outfit.comments[commentIndex].userId.toString() !== userId && !isAdmin(userId)) {
            throw new Error("Unauthorized to delete comment");
        }

        outfit.comments.splice(commentIndex, 1);

        await outfit.save();
        return { message: "Comment deleted successfully" };
    },
}

export default outfitService

