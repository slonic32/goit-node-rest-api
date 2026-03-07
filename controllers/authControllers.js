import {
  createUser,
  getUserByEmail,
  getUserById,
  loginUserService,
  logoutUserService,
  changeAvatar,
} from "../services/authServices.js";

import { resizeImg } from "../services/imgServices.js";

export async function registerUser(req, res, next) {
  try {
    const { email, password } = req.body;
    if (await getUserByEmail(email)) {
      return res.status(409).json({
        message: "Email in use",
      });
    }
    const newUser = await createUser(email, password);
    return res.status(201).json({
      email: newUser.email,
      subscription: newUser.subscription,
      avatarURL: newUser.avatarURL,
    });
  } catch (error) {
    next(error);
  }
}

export async function loginUser(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await loginUserService({ email, password });
    res.status(200).json({
      token: user.token,
      user: {
        email: user.email,
        subscription: user.subscription,
        avatarURL: user.avatarURL,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function logoutUser(req, res, next) {
  try {
    const userId = req.user.id;
    await logoutUserService(userId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export async function currentUser(req, res, next) {
  try {
    const user = await getUserById(req.user.id);
    res.status(200).json({
      email: user.email,
      subscription: user.subscription,
      avatarURL: user.avatarURL,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateAvatar(req, res, next) {
  try {
    if (req.file) {
      const avatar = await resizeImg(req.file);
      const user = await changeAvatar(req.user.id, avatar);
      return res.status(200).json({
        avatarURL: user.avatarURL,
      });
    }
    return res.status(401).json({
      message: "Not authorized",
    });
  } catch (error) {
    next(error);
  }
}
