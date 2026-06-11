// middleware/auth.js

const jwt = require("jsonwebtoken");
const Admindata = require("../models/admin");

const auth = async (req, res, next) => {
  try {

    // Get token from cookies
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No token provided",
      });
    }

    // Verify token
    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Find admin
    const adminData = await Admindata.findById(decodedToken.id).select("-password");

    if (!adminData) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Admin not found",
      });
    }

    // Attach admin to request
    req.admin = adminData;

    next();

  } catch (error) {

    console.error("Auth Middleware Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = auth;