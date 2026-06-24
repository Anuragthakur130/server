// controllers/ProjectController.js
const Project = require("../models/project");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

// ================= CLOUDINARY CONFIG =================
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

class ProjectController {
    static createProject = async (req, res) => {
        try {
            const { title, description, liveLink, githubLink, technologies } = req.body;
            if (!title || !description || !liveLink || !githubLink || !technologies) {
                return res.status(400).json({
                    message: "All fields are required",
                })
            }
            if (!req.files || !req.files.image) {
                return res.status(400).json({
                    message: "Project image is required",
                })
            }
            const projectImage = req.files.image;

            const uploadResult = await cloudinary.uploader.upload(projectImage.tempFilePath, {
                folder: "projects",
            });
            fs.unlinkSync(projectImage.tempFilePath);

            // Handle comma-separated string from frontend or JSON array
            let parsedTechnologies = [];
            try {
                parsedTechnologies = JSON.parse(technologies);
            } catch(e) {
                parsedTechnologies = typeof technologies === 'string' ? technologies.split(',').map(t => t.trim()).filter(Boolean) : technologies;
            }

            const result = await Project.create({
                title,
                description,
                liveLink,
                githubLink,
                technologies: parsedTechnologies,
                image: uploadResult.secure_url,
                public_id: uploadResult.public_id,
            });
            res.status(201).json({
                message: "Project created successfully",
                result,
            });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ message: "Internal server error", error: error.message });
        }
    }

    // all projects  
    static getAllProjects = async (req, res) => {
        try {
            const projects = await Project.find();
            res.status(200).json({
                message: "Projects fetched successfully",
                projects,
            });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    // single project  
    static getSingleProject = async (req, res) => {
        try {
            const { id } = req.params;
            const project = await Project.findById(id);
            if (!project) {
                return res.status(404).json({
                    message: "Project not found",
                });
            }
            res.status(200).json({
                message: "Project fetched successfully",
                project,
            });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    // update project  
    static updateProject = async (req, res) => {
        try {
            const { id } = req.params;
            const { title, description, liveLink, githubLink, technologies } = req.body;
            const project = await Project.findById(id);
            if (!project) {
                return res.status(404).json({
                    message: "Project not found",
                });
            }
            // if user send image old image delete
            if (req.files && req.files.image) {
                if (project.public_id) {
                    await cloudinary.uploader.destroy(project.public_id);
                }
                const projectImage = req.files.image;
                const uploadResult = await cloudinary.uploader.upload(projectImage.tempFilePath, {
                    folder: "projects",
                });
                fs.unlinkSync(projectImage.tempFilePath);
                project.image = uploadResult.secure_url;
                project.public_id = uploadResult.public_id;
            }

            // Handle comma-separated string from frontend or JSON array
            let parsedTechnologies = project.technologies;
            if (technologies) {
                try {
                    parsedTechnologies = JSON.parse(technologies);
                } catch(e) {
                    parsedTechnologies = typeof technologies === 'string' ? technologies.split(',').map(t => t.trim()).filter(Boolean) : technologies;
                }
            }

            if(title) project.title = title;
            if(description) project.description = description;
            if(liveLink) project.liveLink = liveLink;
            if(githubLink) project.githubLink = githubLink;
            if(technologies) project.technologies = parsedTechnologies;

            await project.save();
            res.status(200).json({
                message: "Project updated successfully",
                project,
            });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ message: "Internal server error", error: error.message });
        }
    }

    // delete project  
    static deleteProject = async (req, res) => {
        try {
            const { id } = req.params;
            const project = await Project.findById(id);
            if (!project) {
                return res.status(404).json({
                    message: "Project not found",
                });
            }
            if (project.public_id) {
                await cloudinary.uploader.destroy(project.public_id);
            }
            await project.deleteOne();
            res.status(200).json({
                message: "Project deleted successfully",
            });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

}
module.exports = ProjectController;