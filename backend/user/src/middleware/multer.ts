import multer from "multer";
import cloudinary from "../config/cloudinary.js";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const cloudinaryStoragePkg = require("multer-storage-cloudinary");

const CloudinaryStorage =
  cloudinaryStoragePkg.CloudinaryStorage ||
  cloudinaryStoragePkg.default ||
  cloudinaryStoragePkg;

// DIAGNOSTIC CHECK: This will warn you in the terminal if your .env keys are missing!
if (!cloudinary.config().cloud_name) {
  console.error("🚨 CLOUDINARY KEYS MISSING IN USER SERVICE .ENV FILE!");
}

// THE FIX: We pass the imported cloudinary object directly instead of nesting it
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "profile-pics", // Keeps your avatars separate from chat images!
    allowed_formats: ["jpg", "jpeg", "png", "gif", "webp"],
    transformation: [
      { width: 500, height: 500, crop: "fill" }, // Forces a perfect square crop for avatars!
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
