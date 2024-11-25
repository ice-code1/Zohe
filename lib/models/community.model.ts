import mongoose from 'mongoose';

// Define the schema for the User model
const communitySchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true, // Ensure this field is unique, especially if it’s meant to be an identifier
    },
    username: {
        type: String,
        required: true,
        unique:true,
        trim: true, // Trim whitespace
    },
    name: {
        type: String,
        required: true,
        trim: true, // Trim whitespace
    },
    image: {
        type: String,
        default: '', // Default to an empty string if no image is provided
    },
    quote: {
        type: String,
        default: '', // Default to an empty string
    },
    bio: {
        type: String,
        default: '', // Default to an empty string
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    zohe: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Zohe',
        },
    ],
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:'User'
        }
    ]
}, { timestamps: true }); // Optional: add timestamps for createdAt and updatedAt

// Create the User model
const Community = mongoose.models.Community || mongoose.model('User', communitySchema)

export default Community;
