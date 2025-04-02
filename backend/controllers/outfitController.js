import outfitService from '../services/outfitService.js';

const outfitController = {
    createOutfit: async (req, res) => {
        try {
            const newOutfit = await outfitService.createOutfit(req.body, req.userId);
            res.status(201).json(newOutfit);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Error saving outfit' });
        }
    },

    editOutfit: async (req, res) => {
        try {
            const outfit = await outfitService.editOutfit(req.params.id, req.body, req.userId);
            res.status(200).json(outfit);
        } catch (err) {
            console.error(err);
            res.status(err.message === 'Outfit not found or unauthorized' ? 404 : 500).json({
                message: 'Error editing outfit',
                error: err.message
            });
        }
    },

    deleteOutfit: async (req, res) => {
        try {
            const result = await outfitService.deleteOutfit(req.params.id, req.userId);
            res.status(200).json(result);
        } catch (err) {
            console.error(err);
            res.status(err.message === 'Outfit not found or unauthorized' ? 404 : 500).json({ message: 'Error deleting outfit' });
        }
    },

    getAllOutfits: async (req, res) => {
        try {
            const { page, limit } = req.query;
            const result = await outfitService.getAllOutfits(req.userId, page, limit);
            res.status(200).json(result);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Error fetching outfits' });
        }
    },

    getRecentOutfits: async (req, res) => {
        try {
            const result = await outfitService.getRecentOutfits(req.userId);
            res.json(result);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Error fetching recent outfits', error: err.message });
        }
    },

    getOutfitStats: async (req, res) => {
        try {
            const result = await outfitService.getOutfitStats(req.userId);
            res.json(result);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Error fetching user stats', error: err.message });
        }
    },

    getOutfitById: async (req, res) => {
        try {
            const outfit = await outfitService.getOutfitById(req.params.id);
            res.json(outfit);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    getCommunityOutfits: async (req, res) => {
        try {
            const outfits = await outfitService.getCommunityOutfits();
            res.json(outfits);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    likeOutfit: async (req, res) => {
        try {
            const outfit = await outfitService.handleReaction(req.params.id, req.userId, 'likes');
            res.json(outfit);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    dislikeOutfit: async (req, res) => {
        try {
            const outfit = await outfitService.handleReaction(req.params.id, req.userId, 'dislikes');
            res.json(outfit);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    addComment: async (req, res) => {
        try {
            const comment = await outfitService.addComment(req.params.id, req.userId, req.body.text);
            res.json(comment);
        } catch (err) {
            console.error('Error posting comment:', err);
            res.status(500).json({ message: err.message });
        }
    }
};

export default outfitController;