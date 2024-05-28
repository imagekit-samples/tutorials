const express = require("express");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const dotenv = require('dotenv');

dotenv.config();

const crypto = require("crypto");

const privateKey = process.env.PRIVATE_KEY;
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


app.get("/auth", function(req, res) {
  var token = req.query.token || crypto.randomUUID();
  var expire = req.query.expire || parseInt(Date.now()/1000)+2400;
  var privateAPIKey = `${privateKey}`;
  var signature = crypto.createHmac('sha1', privateAPIKey).update(token+expire).digest('hex');
  res.status(200);
  res.send({
      token : token,
      expire : expire,
      signature : signature
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
