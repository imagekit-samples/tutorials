const express = require("express");
const multer = require("multer");
const fs = require("fs");
const cors = require("cors");
const ImageKit = require("imagekit");

const app = express();
const upload = multer({
    limits: {
        fileSize: 1024 * 1024 * 5, // 5MB
    },
});

app.use(cors());

const uploadDir = "uploads";

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const imagekit = new ImageKit({
    publicKey: process.env.PUBLIC_KEY,
    urlEndpoint: process.env.URL_ENDPOINT,
    privateKey: process.env.PRIVATE_KEY,
})

app.post("/upload", upload.single("file"), (req, res) => {
    const file = req.file;

    if (!file) {
        return res.status(400).send({ status: "error", message: "No file uploaded" });
    }

    const filePath = `${uploadDir}/${file.originalname}`;
    try {
        fs.writeFileSync(filePath, file.buffer);
        res.send({ status: "success", message: "File uploaded successfully" });
    } catch (error) {
        res.status(500).send({ status: "error", message: "Failed to save file" }); 
    }
});

app.get("/auth", (req, res) => {
    res.send(imagekit.getAuthenticationParameters());
});

app.listen(3000);