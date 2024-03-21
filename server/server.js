const express = require("express");
const multer = require("multer");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = 4000;

app.use(cors());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
const fileFilter = (req, file, cb) => {
  // Check if file is an image or video
  if (
    file.mimetype.startsWith("image/") ||
    file.mimetype.startsWith("video/")
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only image and video files are allowed"));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 2000000 },
});

app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  res.status(200).json({
    message: "File uploaded successfully",
    filename: req.file.filename,
  });
});

app.use("/uploads", express.static("uploads"));

// Error handling middleware
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Multer error occurred (e.g., file size exceeded)
    return res.status(400).json({ message: err.message });
  } else if (err) {
    // Other errors (e.g., unsupported file type)
    return res.status(400).json({ message: err.message });
  }
  next();
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
