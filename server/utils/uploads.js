const multer = require("multer");
const fs = require("fs");
const path = require("path");

const uploadDir = path.join(__dirname, "..", "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({ storage });

const uploadMultiple = upload.fields([
  { name: "image", maxCount: 1 },
  { name: "image_2", maxCount: 1 },
  { name: "image_3", maxCount: 1 },
]);

module.exports = { uploadDir, uploadMultiple };