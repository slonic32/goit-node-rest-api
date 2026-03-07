import {
  createUser,
  getUserByEmail,
  getUserById,
  loginUserService,
  logoutUserService,
  changeAvatar,
  getUserByVerificationToken,
  completeUserVerification,
} from "../services/authServices.js";

import { resizeImg } from "../services/imgServices.js";

import { sendVerificationEmail } from "../helpers/mail_send_grid.js";

export async function registerUser(req, res, next) {
  try {
    const { email, password } = req.body;
    if (await getUserByEmail(email)) {
      return res.status(409).json({
        message: "Email in use",
      });
    }
    const newUser = await createUser(email, password);

    await sendVerificationEmail(
      newUser.email,
      `http://localhost:3000/api/auth/verify/${newUser.verificationToken}`,
    );

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

export async function verifyUser(req, res, next) {
  try {
    const user = await getUserByVerificationToken(req.params.verificationToken);
    if (user) {
      await completeUserVerification(user);
      return res.status(200).json({
        message: "Verification successful",
      });
    }
    res.status(404).json({
      message: "User not found",
    });
  } catch (error) {
    next(error);
  }
}

export async function resentVerification(req, res, next) {
  try {
    const { email } = req.body;
    const user = await getUserByEmail(email);
    if (user) {
      if (user.verify) {
        return res.status(400).json({
          message: "Verification has already been passed",
        });
      }
      await sendVerificationEmail(
        user.email,
        `http://localhost:3000/api/auth/verify/${user.verificationToken}`,
      );
      return res.status(200).json({
        message: "Verification email sent",
      });
    }
    res.status(400).json({
      message: "missing required field email",
    });
  } catch (error) {
    next(error);
  }
}
