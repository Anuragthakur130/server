const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDb = require("./config/connectDb");
const cookieParser = require("cookie-parser");
const web = require("./routes/web");

const fileUpload = require("express-fileupload");

dotenv.config();

const app = express();
app.use(cookieParser());
connectDb();

// image and file handelling
app.use(
  fileUpload({
    useTempFiles: true,
  }),
);

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173", // Replace with your frontend URL
    credentials: true, // Allow cookies to be sent with requests
  }),
);
app.use(express.json()); // Parse JSON request bodies

app.use("/api", web);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
