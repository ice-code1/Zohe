import mongoose from 'mongoose';

// Define the schema for the User model
const userSchema = new mongoose.Schema({
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
    zohe: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Zohe',
        },
    ],
    onboarded: {
        type: Boolean,
        default: false,
    },
    communities: [ // Fixed typo from "communites" to "communities"
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Community',
        },
    ],
}, { timestamps: true }); // Optional: add timestamps for createdAt and updatedAt

// Create the User model
const User = mongoose.models.User || mongoose.model('User', userSchema)

export default User;
