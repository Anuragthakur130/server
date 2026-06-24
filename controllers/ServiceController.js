const Service = require('../models/Service')
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

// ================= CLOUDINARY CONFIG =================
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

class ServiceController {

    // Create Service
    static createService = async (req, res) => {
        try {
            const { serviceTitle, shortDescription, detailedDescription, category, technologies, displayOrder, status, featured, serviceLink } = req.body;
            
            if (!serviceTitle || !shortDescription || !detailedDescription || !category) {
                return res.status(400).json({ success: false, message: "Required fields are missing" });
            }

            if (!req.files || !req.files.icon) {
                return res.status(400).json({ success: false, message: "Service image/icon is required" });
            }

            const iconFile = req.files.icon;
            const uploadResult = await cloudinary.uploader.upload(iconFile.tempFilePath, {
                folder: 'services',
                resource_type: "auto"
            });
            fs.unlinkSync(iconFile.tempFilePath);

            const parsedTechnologies = technologies ? JSON.parse(technologies) : [];

            const service = await Service.create({
                serviceTitle,
                shortDescription,
                detailedDescription,
                category,
                technologies: parsedTechnologies,
                displayOrder: displayOrder || 0,
                status: status || 'Active',
                featured: featured === 'true' || featured === true,
                serviceLink,
                icon: uploadResult.secure_url,
                public_id: uploadResult.public_id
            });

            res.status(201).json({
                success: true,
                message: 'Service created successfully',
                service
            });

        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // Get All Services
    static getServices = async (req, res) => {
        try {
            // Sort by displayOrder ascending, then fallback to createdAt descending
            const services = await Service.find().sort({ displayOrder: 1, createdAt: -1 });

            res.status(200).json({
                success: true,
                services
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // Update Service
    static updateService = async (req, res) => {
        try {
            const { id } = req.params;
            const { serviceTitle, shortDescription, detailedDescription, category, technologies, displayOrder, status, featured, serviceLink } = req.body;

            const service = await Service.findById(id);
            if (!service) {
                return res.status(404).json({ success: false, message: 'Service not found' });
            }

            // Image Update Logic
            if (req.files && req.files.icon) {
                if (service.public_id) {
                    await cloudinary.uploader.destroy(service.public_id);
                }
                const iconFile = req.files.icon;
                const uploadResult = await cloudinary.uploader.upload(iconFile.tempFilePath, {
                    folder: 'services',
                    resource_type: "auto"
                });
                fs.unlinkSync(iconFile.tempFilePath);
                service.icon = uploadResult.secure_url;
                service.public_id = uploadResult.public_id;
            }

            if (serviceTitle) service.serviceTitle = serviceTitle;
            if (shortDescription) service.shortDescription = shortDescription;
            if (detailedDescription) service.detailedDescription = detailedDescription;
            if (category) service.category = category;
            if (technologies) service.technologies = JSON.parse(technologies);
            if (displayOrder !== undefined) service.displayOrder = displayOrder;
            if (status) service.status = status;
            if (featured !== undefined) service.featured = featured === 'true' || featured === true;
            if (serviceLink !== undefined) service.serviceLink = serviceLink;

            await service.save();

            res.status(200).json({
                success: true,
                message: 'Service updated successfully',
                service
            });

        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // Delete Service
    static deleteService = async (req, res) => {
        try {
            const service = await Service.findById(req.params.id);
            if (!service) {
                return res.status(404).json({ success: false, message: 'Service not found' });
            }

            if (service.public_id) {
                await cloudinary.uploader.destroy(service.public_id);
            }

            await service.deleteOne();

            res.status(200).json({
                success: true,
                message: 'Service deleted successfully'
            });

        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}

module.exports = ServiceController;