const admin = require("../models/admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

// ================= CLOUDINARY CONFIG =================
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

class AdminController {
  static register = async (req, res) => {
    try {
      const { name, email, password } = req.body;
      const adminExists = await admin.findOne({ email });
      if (adminExists) {
        return res.status(400).json({ message: "Admin already exists" });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const result = await admin.create({
        name,
        email,
        password: hashedPassword,
      });
      res
        .status(201)
        .json({ message: "Admin registered successfully", result });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  static login = async (req, res) => {
    try {
      const { email, password } = req.body;
      const adminExists = await admin.findOne({ email });
      if (!adminExists) {
        return res.status(400).json({ message: "Admin not found" });
      }
      const isPasswordValid = await bcrypt.compare(
        password,
        adminExists.password,
      );
      if (!isPasswordValid) {
        return res.status(400).json({ message: "Invalid password" });
      }
      const token = jwt.sign({ id: adminExists._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 3600000,
      });
      res.status(200).json({ message: "Admin logged in successfully", token });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  static logout = async (req, res) => {
    try {
      res.clearCookie("token");
      res.status(200).json({ message: "Admin logged out successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  static getProfile = async (req, res) => {
    try {

      const adminData = await admin.findById(req.admin.id).select("-password");


      if (!adminData) {
        return res.status(404).json({
          message: "Admin not found",
        });
      }

      return res.status(200).json({ adminData });

    } catch (error) {

      console.log(error);

      return res.status(500).json({
        message: "Internal Server Error",
      });
    }
  };

  static updateProfile = async (req, res) => {
    try {
      const { name, emai } = req.body;
      const adminExists = await admin.findById(req.admin.id).select("-password");
      if (!adminExists) {
        return res.status(404).json({ message: "Admin not found" });
      }
      const updatedAdmin = await admin.findByIdAndUpdate(req.admin.id, { name, email }, { new: true }).select("-password");
      res.status(200).json(updatedAdmin);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  static changePassword = async (req, res) => {
    try {
      const { oldPassword, newPassword, confirmPassword } = req.body;
      const adminExists = await admin.findById(req.admin.id).select("+password");
      if (!adminExists) {
        return res.status(404).json({ message: "Admin not found" });
      }
      const isPasswordValid = await bcrypt.compare(
        oldPassword,
        adminExists.password,
      );
      if (!isPasswordValid) {
        return res.status(400).json({ message: "Invalid password" });
      }
      if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: "Password does not match" });
      }
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const updatedAdmin = await admin.findByIdAndUpdate(req.admin.id,
        { password: hashedPassword },
        { new: true },
      )
        .select("-password");
      res.status(200).json(updatedAdmin);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
}

module.exports = AdminController;
