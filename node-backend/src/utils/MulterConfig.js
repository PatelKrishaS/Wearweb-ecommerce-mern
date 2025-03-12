const multer = require("multer");
const path = require("path");

// Configure storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save files in the "uploads" folder
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

// Initialize Multer
const upload = multer({ storage });

module.exports = upload;