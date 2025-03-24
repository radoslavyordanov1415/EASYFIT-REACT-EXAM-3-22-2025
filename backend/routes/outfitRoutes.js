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


//* Delete route

//* Get All route

//* Recent route

//* Stats route

//* ID route

export default router;
