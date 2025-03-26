import mongoose from 'mongoose';
import validator from 'validator';

const outfitSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required']
    },
    mannequinImage: {
        type: String,
        required: [true, 'Mannequin image is required'],
        validate: {
            validator: function (v) {
                return validator.isURL(v, {
                    protocols: ['http', 'https'],
                    require_protocol: true,
                    host_whitelist: ['localhost', '127.0.0.1']
                });
            },
            message: 'Invalid image URL for mannequin image'
        }
    },
    appliedClothing: {
        type: Map,
        of: {
            imageUrl: {
                type: String,
                required: [true, 'Image URL is required'],
                validate: {
                    validator: (v) => validator.isURL(v, {
                        protocols: ['http', 'https'],
                        require_protocol: true,
                        host_whitelist: ['localhost', '127.0.0.1']
                    }),
                    message: 'Invalid image URL for applied clothing'
                }
            },
            x: {
                type: Number,
                required: true,
                min: [0, 'X position cannot be negative']
            },
            y: {
                type: Number,
                required: true,
                min: [0, 'Y position cannot be negative']
            },
            width: {
                type: Number,
                required: true,
                min: [20, 'Minimum width is 20px']
            },
            height: {
                type: Number,
                required: true,
                min: [20, 'Minimum height is 20px']
            },
            xPercent: {
                type: Number,
                required: false,
                min: [0, 'X percentage cannot be negative'],
                max: [100, 'X percentage cannot exceed 100']
            },
            yPercent: {
                type: Number,
                required: false,
                min: [0, 'Y percentage cannot be negative'],
                max: [100, 'Y percentage cannot exceed 100']
            },
            widthPercent: {
                type: Number,
                required: false,
                min: [0, 'Width percentage cannot be negative'],
                max: [100, 'Width percentage cannot exceed 100']
            },
            heightPercent: {
                type: Number,
                required: false,
                min: [0, 'Height percentage cannot be negative'],
                max: [100, 'Height percentage cannot exceed 100']
            }
        }
    },
    name: {
        type: String,
        required: false
    },
    season: {
        type: String,
        required: false
    },
    occasion: {
        type: String,
        required: false
    },
    comfortLevel: {
        type: String,
        required: false
    },
    budget: {
        type: String,
        required: false
    },
    fitType: {
        type: String,
        required: false
    },
    description: {
        type: String,
        required: false
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    dislikes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    comments: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        text: {
            type: String,
            required: true
        },

        createdAt: {
            type: Date,
            default: Date.now
        }
    }]
}, { timestamps: true });

const Outfit = mongoose.model('Outfit', outfitSchema);

export default Outfit;