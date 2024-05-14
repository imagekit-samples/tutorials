const express = require('express')
const app = express()
const port = 3000
const path = require("path");
const multer = require('multer')
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: Infinity
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Please upload an image'))
    }
    cb(null, true)
  }
})

// View Engine Setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.get('/', (req, res) => {
  res.render("index");
})

app.post('/upload-file', upload.single('file'), (req, res) => {
  res.send('File uploaded successfully')
})

app.use((err, req, res, next) => {
  const error = err.message || 'Internal Server Error'
  res.status(500).send(error)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})