const user = require("../models/user");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

// ================= CLOUDINARY CONFIG =================
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

class UserController {
  static createUser = async (req, res) => {
    try {
      const { name, public_id } = req.body;
      if (!name || !public_id) {
        return res
          .status(400)
          .json({ message: "Name and public_id are required" });
      }
      if (!req.files || !req.files.image) {
        return res.status(400).json({
          message: "User image is required",
        });
      }

      const projectImage = req.files.image;
      //console.log(projectImage)

      const uploadResult = await cloudinary.uploader.upload(
        projecttImage.tempFilePath,
        {
          folder: "users",
        },
      );
      // console.log(uploadResult);

      fs.unlinkSync(projectImage.tempFilePath);

      const result = await user.create({
        name,
        image: uploadResult.secure_url,
        public_id: uploadResult.public_id,
      });

      res.status(201).json({
        message: "User created successfully",
        result,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  static getAllUsers = async (req, res) => {
    try {
      const users = await user.find();
      res.status(200).json({
        message: "Users retrieved successfully",
        users,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  static getSingleUser = async (req, res) => {
    try {
      const { id } = req.params;
      const singleUser = await user.findById(id);
      if (!singleUser) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json({
        message: "User retrieved successfully",
        singleUser,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    } 
  };

  static updateUser = async (req, res) => {
    try {
      const { id } = req.params;
      const { name } = req.body;
      const userExists = await user.findById(id); 
      if (!userExists) {
        return res.status(404).json({ message: "User not found" });
      }
      const updatedUser = await user.findByIdAndUpdate(id, { name }, { new: true });
      res.status(200).json({
        message: "User updated successfully",
        updatedUser,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static deleteUser = async (req, res) => {
    try {
      const { id } = req.params;
      const userExists = await user.findById(id);
      if (!userExists) {
        return res.status(404).json({ message: "User not found" });
      }
      // delete image from cloudinary
      await cloudinary.uploader.destroy(userExists.public_id);
      await user.findByIdAndDelete(id);
      res.status(200).json({
        message: "User deleted successfully",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
  
}


module.exports = UserController;
