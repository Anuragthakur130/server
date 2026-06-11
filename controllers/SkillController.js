const skill = require("../models/skill");

class SkillController {

    // create skill
    static createSkill = async (req, res) => {
        try {
            const { name, percentage, icon } = req.body;
            if (!name || !percentage || !icon) {
                return res.status(400).json({ message: "All fields are required" });
            }
            const result = new skill({
                name,
                percentage,
                icon
            });
            await result.save();
            res.status(201).json({ message: "Skill created successfully" });
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    // get all skill
    static getAllSkill = async (req, res) => {
        try {
            const skills = await skill.find();
            res.status(200).json(skills);
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    // update skill
    static updateSkill = async (req,res) => {
        try {

           const {name,percentage,icon  } = req.body;
           if (!name || !percentage || !icon) {
            return res.status(400).json({ message: "All fields are required" });
        }
            const result = await skill.findByIdAndUpdate(req.params.id, {
                name,
                percentage,
                icon
            }, { new: true });
            res.status(200).json({ message: "Skill updated successfully" });
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    // delete skill
    static deleteSkill = async (req, res) => {
        try {
            const result = await skill.findByIdAndDelete(req.params.id);
            res.status(200).json({ message: "Skill deleted successfully" });
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

}
module.exports = SkillController;