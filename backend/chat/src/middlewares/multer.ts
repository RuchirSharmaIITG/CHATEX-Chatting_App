import multer from "multer";
import cloudinary from "../config/cloudinary.js";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const cloudinaryStoragePkg = require("multer-storage-cloudinary");

// THE FIX: This brute-forces the import. It checks if it's nested in a property,
// hidden in a default wrapper, or exported directly as the class itself.
const CloudinaryStorage =
  cloudinaryStoragePkg.CloudinaryStorage ||
  cloudinaryStoragePkg.default ||
  cloudinaryStoragePkg;

const storage = new CloudinaryStorage({
  cloudinary: { v2: cloudinary },
  params: {
    folder: "chat-images",
    allowed_formats: ["jpg", "jpeg", "png", "gif", "webp"],
    transformation: [
      { width: 800, height: 600, crop: "limit" },
      { quality: "auto" },
    ],
  } as any,
});

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only images are allowed"));
    }
  },
});
