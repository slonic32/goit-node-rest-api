import express from "express";
import {
  currentUser,
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/authControllers.js";
import { auth } from "../middlewares/authMiddleware.js";
import { authValidate } from "../middlewares/authValidate.js";

const authRouter = express.Router();

authRouter.post("/register", authValidate, registerUser);

authRouter.post("/login", authValidate, loginUser);

authRouter.post("/logout", auth, logoutUser);

authRouter.get("/current", auth, currentUser);

export default authRouter;
