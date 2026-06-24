const Hero = require('../models/hero')
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

// ================= CLOUDINARY CONFIG =================
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

class HeroController {

    static createHero = async (req, res) => {
        try {
            // ================= VALIDATION =================    
            const { subtitle, name, description, resumeLink, github, linkedin, instagram, frontendTitle, backendTitle } = req.body

            if (!subtitle || !name || !description || !resumeLink || !github || !linkedin || !instagram || !frontendTitle || !backendTitle) {
                return res.status(400).json({
                    success: false,
                    message: "All fields are required"
                })
            }

            // ================= FILE VALIDATION =================
            if (!req.files || !req.files.profileImage) {
                return res.status(400).json({
                    success: false,
                    message: "Profile image is required"
                })
            }

            const file = req.files.profileImage
            console.log(file)

            // ================= UPLOAD TO CLOUDINARY =================
            const uploadResult = await cloudinary.uploader.upload(
                file.tempFilePath,
                {
                    folder: 'portfolio_hero',
                    resource_type: "auto"
                }
            )
            console.log(uploadResult)

            // ================= DELETE TEMP FILE =================
            fs.unlinkSync(file.tempFilePath)

            // ================= CREATE HERO DOCUMENT =================
            const hero = await Hero.create({
                subtitle,
                name,
                description,
                resumeLink,
                github,
                linkedin,
                instagram,
                frontendTitle,
                backendTitle,
                profileImage: uploadResult.secure_url,
                public_id: uploadResult.public_id,
            })

            res.status(201).json({
                success: true,
                message: "Hero section created successfully",
                hero
            })

        } catch (error) {
            console.log(error);
            res.status(500).json({
                success: false,
                message: error.message
            })
        }
    }
    // get all hero
    static getAllHero = async (req, res) => {
        try {
            const hero = await Hero.findOne();
            if (!hero) {
                return res.status(404).json({
                    success: false,
                    message: "Hero section not found",
                });
            }
            res.status(200).json({
                success: true,
                message: "Hero section fetched successfully",
                hero,
            });
        } catch (error) {
            console.log(error);
        }
    };

    // single hero  
    static getSingleHero = async (req, res) => {
        try {
            const { id } = req.params
            const hero = await Hero.findById(id)

            if (!hero) {
                return res.status(404).json({
                    success: false,
                    message: 'Hero not found'
                })
            }

            res.json({
                success: true,
                message: 'Hero fetched successfully',
                hero
            })

        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            })
        }
    }

    static deleteHero = async (req, res) => {
        try {
            const { id } = req.params
            const hero = await Hero.findById(id)

            if (!hero) {
                return res.status(404).json({
                    success: false,
                    message: 'Hero not found'
                })
            }
         
            await cloudinary.uploader.destroy(hero.public_id)
            await hero.deleteOne()

            res.json({
                success: true,
                message: 'Hero deleted successfully'
            })
   
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            })
        }
    }

    // update hero
    static updateHero = async (req, res) => {
        try {
            const {
                subtitle,
                name,
                description,
                resumeLink,
                github,
                linkedin,
                instagram,
                frontendTitle,
                backendTitle
            } = req.body

            const { id } = req.params

            // Find hero
            const hero = await Hero.findById(id)

            if (!hero) {
                return res.status(404).json({
                    success: false,
                    message: 'Hero not found'
                })
            }

            // ===============================
            // IMAGE UPDATE
            // ===============================
            if (req.files && req.files.profileImage) {

                // Delete old image from Cloudinary
                if (hero.public_id) {
                    await cloudinary.uploader.destroy(hero.public_id)
                }

                const file = req.files.profileImage

                // Upload new image
                const uploadResult = await cloudinary.uploader.upload(
                    file.tempFilePath,
                    {
                        folder: 'portfolio_hero',
                        resource_type: 'auto'
                    }
                )

                // Remove temp file
                fs.unlinkSync(file.tempFilePath)

                // Save new image
                hero.profileImage = uploadResult.secure_url
                hero.public_id = uploadResult.public_id
            }

            // ===============================
            // RESUME FILE UPDATE
            // ===============================
            if (req.files && req.files.resumeFile) {
                const file = req.files.resumeFile

                // Upload new resume
                const uploadResult = await cloudinary.uploader.upload(
                    file.tempFilePath,
                    {
                        folder: 'portfolio_resume',
                        resource_type: 'auto'
                    }
                )

                // Remove temp file
                fs.unlinkSync(file.tempFilePath)

                // Save new resume link
                hero.resumeLink = uploadResult.secure_url
            }

            // ===============================
            // TEXT FIELD UPDATE (only update if value provided)
            // ===============================
            if (subtitle)       hero.subtitle = subtitle
            if (name)           hero.name = name
            if (description)    hero.description = description
            if (resumeLink)     hero.resumeLink = resumeLink
            if (github)         hero.github = github
            if (linkedin)       hero.linkedin = linkedin
            if (instagram)      hero.instagram = instagram
            if (frontendTitle)  hero.frontendTitle = frontendTitle
            if (backendTitle)   hero.backendTitle = backendTitle

            // Save all updates
            await hero.save()

            res.status(200).json({
                success: true,
                message: 'Hero section updated successfully',
                hero
            })

        } catch (error) {   
            res.status(500).json({
                success: false,
                message: error.message
            })
        }
    }




}
module.exports = HeroController