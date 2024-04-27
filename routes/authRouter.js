import express from "express";
import {
  currentUser,
  loginUser,
  logoutUser,
  registerUser,
  resentVerification,
  updateAvatar,
  verifyUser,
} from "../controllers/authControllers.js";
import { auth } from "../middlewares/authMiddleware.js";
import { uploadImage } from "../middlewares/imgMiddleware.js";

const authRouter = express.Router();

authRouter.post("/register", registerUser);

authRouter.get("/verify/:verificationToken", verifyUser);
authRouter.post("/verify", resentVerification);

authRouter.post("/login", loginUser);

authRouter.post("/logout", auth, logoutUser);

authRouter.get("/current", auth, currentUser);

authRouter.patch("/avatars", auth, uploadImage, updateAvatar);

export default authRouter;
