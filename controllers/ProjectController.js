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
            // console.log(req.body);
            // console.log(req.files)
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
            console.log(projectImage);

            const uploadResult = await cloudinary.uploader.upload(projectImage.tempFilePath, {
                folder: "projects",
            });
            // console.log(uploadResult);
            fs.unlinkSync(projectImage.tempFilePath);

            const result = await Project.create({
                title,
                description,
                liveLink,
                githubLink,
                technologies: JSON.parse(technologies),
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
                await cloudinary.uploader.destroy(project.public_id);
                const projectImage = req.files.image;
                const uploadResult = await cloudinary.uploader.upload(projectImage.tempFilePath, {
                    folder: "projects",
                });
                fs.unlinkSync(projectImage.tempFilePath);
                project.image = uploadResult.secure_url;
                project.public_id = uploadResult.public_id;
            }
            project.title = title;
            project.description = description;
            project.liveLink = liveLink;
            project.githubLink = githubLink;
            project.technologies = technologies;
            await project.save();
            res.status(200).json({
                message: "Project updated successfully",
                project,
            });


        }
        catch (error) {
            console.log(error);
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
            await cloudinary.uploader.destroy(project.public_id);
            await project.deleteOne();
            res.status(200).json({
                message: "Project deleted successfully",
            });
        }
        catch (error) {
            console.log(error);
        }
    }

}
module.exports = ProjectController;