import mongoose from 'mongoose';

// Define the schema for the User model
const zoheSchema = new mongoose.Schema({
    text: {
        type: String,
        required:true
    },
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true
    },
    community:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Community',
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    parentId:{
        type:String
    },
    children: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:'Zohe'
        }
    ]

}, { timestamps: true }); // Optional: add timestamps for createdAt and updatedAt

// Create the User model
const Zohe = mongoose.models.Zohe || mongoose.model('Zohe', zoheSchema)

export default Zohe;
