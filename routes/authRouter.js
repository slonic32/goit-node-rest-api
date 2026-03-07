import express from "express";
import {
  currentUser,
  loginUser,
  logoutUser,
  registerUser,
  updateAvatar,
  verifyUser,
  resentVerification,
} from "../controllers/authControllers.js";
import { auth } from "../middlewares/authMiddleware.js";
import {
  authValidate,
  authVerificationValidate,
} from "../middlewares/authValidate.js";

import { uploadImage } from "../middlewares/imgMiddleware.js";

const authRouter = express.Router();

authRouter.post("/register", authValidate, registerUser);

authRouter.post("/login", authValidate, loginUser);

authRouter.post("/logout", auth, logoutUser);

authRouter.get("/current", auth, currentUser);

authRouter.patch("/avatars", auth, uploadImage, updateAvatar);

authRouter.get("/verify/:verificationToken", verifyUser);

authRouter.post("/verify", authVerificationValidate, resentVerification);

export default authRouter;
