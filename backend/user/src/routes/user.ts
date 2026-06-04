import express from "express";
import {
  getAllUsers,
  getAUser,
  loginUser,
  myProfile,
  updateName,
  verifyUser,
  updateProfilePic,
} from "../controllers/user.js";
import { isAuth } from "../middleware/isAuth.js";
import { upload } from "../middleware/multer.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/verify", verifyUser);
router.get("/me", isAuth, myProfile);
router.get("/user/all", isAuth, getAllUsers);
router.get("/user/:id", getAUser);
router.post("/update/user", isAuth, updateName);

router.post(
  "/update/profile-pic",
  isAuth,
  upload.single("image"),
  updateProfilePic,
);

export default router;
