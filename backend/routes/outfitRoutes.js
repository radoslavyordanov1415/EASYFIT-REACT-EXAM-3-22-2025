import express from 'express';
import mongoose from 'mongoose';

import Outfit from '../models/Outfit.js';
import { verifyToken } from '../middlewares/authMiddleware.js';


const router = express.Router();


//* Create route
router.post('/create', verifyToken, async (req, res) => {
    const { mannequinImage, appliedClothing, name, season, occasion, comfortLevel, budget, fitType, description } = req.body;

    try {
        const newOutfit = new Outfit({
            userId: req.userId,
            mannequinImage,
            appliedClothing,
            name,
            season,
            occasion,
            comfortLevel,
            budget,
            fitType,
            description
        });

        await newOutfit.save();
        res.status(201).json(newOutfit);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error saving outfit' });
    }
});


//* Edit route
router.put('/edit/:id', verifyToken, async (req, res) => {
    const { mannequinImage, appliedClothing, name, season, occasion, comfortLevel, budget, fitType, description } = req.body;

    try {
        const outfit = await Outfit.findOneAndUpdate(
            { _id: req.params.id, userId: req.userId },
            {
                mannequinImage,
                appliedClothing,
                name,
                season,
                occasion,
                comfortLevel,
                budget,
                fitType,
                description
            },
            { new: true, runValidators: true }
        );

        if (!outfit) {
            return res.status(404).json({ message: 'Outfit not found or unauthorized' });
        }

        res.status(200).json(outfit);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Error editing outfit',
            error: err.message
        });
    }
});


//* Delete route
router.delete('/delete/:id', verifyToken, async (req, res) => {
    try {
        const outfit = await Outfit.findOneAndDelete({
            _id: req.params.id,
            userId: req.userId
        });

        if (!outfit) {
            return res.status(404).json({ message: 'Outfit not found or unauthorized' });
        };
        res.status(200).json({ message: 'Outfit deleted successfully' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error deleting outfit' });
    }
});
//* Get All route
router.get('/all', verifyToken, async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    try {
        const outfits = await Outfit.find({ userId: req.userId })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const count = await Outfit.countDocuments({ userId: req.userId });
        res.status(200).json({
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            outfits
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching outfits' });
    }
});
//* Recent route
router.get('/recent', verifyToken, async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.userId);

        const outfits = await Outfit.find({ userId }).sort({ createdAt: -1 }).limit(3);
        res.json({ outfits });
    } catch (error) {
        console.error('Error fetching recent outfits:', error);
        res.status(500).json({ message: 'Error fetching recent outfits', error: error.message });
    }
});
//* Stats route
router.get('/stats', verifyToken, async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.userId);

        const totalOutfits = await Outfit.countDocuments({ userId });

        const favoriteSeasons = await Outfit.aggregate([
            { $match: { userId } },
            { $group: { _id: "$season", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        const favoriteOccasions = await Outfit.aggregate([
            { $match: { userId } },
            { $group: { _id: "$occasion", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        res.json({
            totalOutfits,
            favoriteSeasons: Object.fromEntries(favoriteSeasons.map(s => [s._id, s.count])),
            favoriteOccasions: Object.fromEntries(favoriteOccasions.map(o => [o._id, o.count]))
        });
    } catch (error) {
        console.error('Error fetching user stats:', error);
        res.status(500).json({ message: 'Error fetching user stats', error: error.message });
    }
});
//* ID route
router.get('/:id', async (req, res) => {
    try {
        const outfit = await Outfit.findById(req.params.id);
        res.json(outfit);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
export default router;
