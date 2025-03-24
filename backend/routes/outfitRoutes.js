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

//* Stats route

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
