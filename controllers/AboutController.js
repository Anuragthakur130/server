const About = require('../models/About')

class AboutController {

    // CREATE ABOUT
    static createAbout = async (req, res) => {
        try {
            let {
                title,
                description,
                skills,
                achievements
            } = req.body

            // अगर फ्रंटएंड से skills स्ट्रिंग के रूप में आ रही है, तो उसे कॉमा से तोड़कर असली एरे बनाएं
            if (skills && typeof skills === 'string') {
                skills = skills.split(',').map(s => s.trim()).filter(Boolean)
            } else if (Array.isArray(skills) && skills.length === 1 && skills[0].includes(',')) {
                // यह उस कंडीशन को हैंडल करेगा जहाँ एरे के अंदर एक सिंगल लंबी स्ट्रिंग आ रही हो
                skills = skills[0].split(',').map(s => s.trim()).filter(Boolean)
            }

            // अगर फ्रंटएंड से achievements स्ट्रिंग के रूप में आ रही है
            if (achievements && typeof achievements === 'string') {
                achievements = achievements.split(',').map(a => a.trim()).filter(Boolean)
            } else if (Array.isArray(achievements) && achievements.length === 1 && achievements[0].includes(',')) {
                achievements = achievements[0].split(',').map(a => a.trim()).filter(Boolean)
            }

            const about = await About.create({
                title,
                description,
                skills: skills || [],
                achievements: achievements || []
            })

            res.status(201).json({
                success: true,
                message: 'About section created successfully',
                about
            })

        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            })
        }
    }


    // GET ABOUT
    static getAbout = async (req, res) => {
        try {
            const about = await About.findOne()

            res.status(200).json({
                success: true,
                about
            })

        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            })
        }
    }


    // UPDATE ABOUT
    static updateAbout = async (req, res) => {
        try {
            const { id } = req.params

            let {
                title,
                description,
                skills,
                achievements
            } = req.body

            const about = await About.findById(id)

            if (!about) {
                return res.status(404).json({
                    success: false,
                    message: 'About section not found'
                })
            }

            // array krte samay string ko array me convert krta hai
            if (skills && typeof skills === 'string') {
                skills = skills.split(',').map(s => s.trim()).filter(Boolean)
            } else if (Array.isArray(skills) && skills.length === 1 && skills[0].includes(',')) {
                skills = skills[0].split(',').map(s => s.trim()).filter(Boolean)
            }

            if (achievements && typeof achievements === 'string') {
                achievements = achievements.split(',').map(a => a.trim()).filter(Boolean)
            } else if (Array.isArray(achievements) && achievements.length === 1 && achievements[0].includes(',')) {
                achievements = achievements[0].split(',').map(a => a.trim()).filter(Boolean)
            }

            // data update
            about.title = title || about.title
            about.description = description || about.description
            about.skills = skills || about.skills
            about.achievements = achievements || about.achievements

            await about.save()

            res.status(200).json({
                success: true,
                message: 'About section updated successfully',
                about
            })

        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            })
        }
    }


    // DELETE ABOUT
    static deleteAbout = async (req, res) => {
        try {
            const { id } = req.params

            const about = await About.findById(id)

            if (!about) {
                return res.status(404).json({
                    success: false,
                    message: 'About section not found'
                })
            }

            await About.findByIdAndDelete(id)

            res.status(200).json({
                success: true,
                message: 'About section deleted successfully'
            })

        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            })
        }
    }
}

module.exports = AboutController