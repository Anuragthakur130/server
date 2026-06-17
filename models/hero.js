const mongoose = require('mongoose')

const heroSchema = new mongoose.Schema({
    subtitle: {
        type: String,
        required: [true, "Subtitle is required"],
    },
    name: {
        type: String,
        required: [true, "Name is required"],
    },
    description: {
        type: String,
        required: [true, "Description is required"],
    },
    profileImage: {
        type: String,
        required: [true, "Profile image is required"],
    },
    public_id: {
        type: String,

    },
    resumeLink: {
        type: String,
        require:true,
    },
    github: {
        type: String,
        required: [true, "github is required"],
    },
    linkedin: {
        type: String,
        required: [true, "linkedin is required"],
    },
    instagram: {
        type: String,
        required: [true, "instagram is required"],
    },
    frontendTitle: {
        type: String,
        required: [true, "frontendTitle is required"],
    },
    backendTitle: {
        type: String,
        required: [true, "backendTitle is required"],
    }
}, { timestamps: true })

module.exports = mongoose.model('Hero', heroSchema)