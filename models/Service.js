const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    serviceTitle: {
      type: String,
      required: true,
    },
    shortDescription: {
      type: String,
      required: true,
    },
    detailedDescription: {
      type: String,
      required: true,
    },
    icon: {
      type: String, // Cloudinary image URL
      required: true,
    },
    public_id: {
      type: String, // For deleting from Cloudinary
    },
    category: {
      type: String,
      required: true,
    },
    technologies: {
      type: [String],
      default: [],
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active',
    },
    featured: {
      type: Boolean,
      default: false,
    },
    serviceLink: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Service", serviceSchema);