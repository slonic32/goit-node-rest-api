import { sendVerificationEmail } from "../helpers/mail.js";
import { validate } from "../helpers/validate.js";
import { registerSchema, verificationSchema } from "../schemas/userSchemas.js";
import {
  changeAvatar,
  completeUserVerification,
  createUser,
  getUserByEmail,
  getUserById,
  getUserByVerificationToken,
} from "../services/authServices.js";
import { resizeImg } from "../services/imgServices.js";
import { genToken } from "../services/jwtServices.js";

export async function registerUser(req, res, next) {
  try {
    validate(registerSchema, req.body);
    const { email, password } = req.body;
    if (!(await getUserByEmail(email))) {
      const newUser = await createUser(email, password);
      await sendVerificationEmail(
        newUser.email,
        `http://localhost:3000/api/users/verify/${newUser.verificationToken}`
      );
      res
        .status(201)
        .json({ email: newUser.email, subscription: newUser.subscription });
    } else {
      res.status(409).json({
        message: "Email in use",
      });
    }
  } catch (error) {
    next(error);
  }
}

export async function loginUser(req, res, next) {
  try {
    validate(registerSchema, req.body);
    const { email, password } = req.body;
    const alreadyRegistered = await getUserByEmail(email);
    if (
      alreadyRegistered &&
      alreadyRegistered.verify &&
      (await alreadyRegistered.checkPassword(password))
    ) {
      const token = genToken(alreadyRegistered._id);
      alreadyRegistered.token = token;
      await alreadyRegistered.save();
      res.status(200).json({
        token,
        user: {
          email: alreadyRegistered.email,
          subscription: alreadyRegistered.subscription,
        },
      });
    } else {
      res.status(401).json({
        message: "Email or password is wrong",
      });
    }
  } catch (error) {
    next(error);
  }
}

export async function logoutUser(req, res, next) {
  try {
    const user = await getUserById(req.user._id);
    user.token = null;
    await user.save();
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export async function currentUser(req, res, next) {
  try {
    const user = await getUserById(req.user._id);
    res.status(200).json({
      email: user.email,
      subscription: user.subscription,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateAvatar(req, res, next) {
  try {
    if (req.file) {
      const avatar = await resizeImg(req.file);
      const user = await changeAvatar(req.user._id, avatar);
      res.status(200).json({
        avatarURL: user.avatarURL,
      });
    } else {
      res.status(401).json({
        message: "Not authorized",
      });
    }
  } catch (error) {
    next(error);
  }
}

export async function verifyUser(req, res, next) {
  try {
    const user = await getUserByVerificationToken(req.params.verificationToken);
    if (user) {
      await completeUserVerification(user);
      res.status(200).json({
        message: "Verification successful",
      });
    } else {
      res.status(404).json({
        message: "User not found",
      });
    }
  } catch (error) {
    next(error);
  }
}

export async function resentVerification(req, res, next) {
  try {
    validate(verificationSchema, req.body);
    const { email } = req.body;
    const user = await getUserByEmail(email);
    if (user) {
      if (user.verify) {
        res.status(400).json({
          message: "Verification has already been passed",
        });
      } else {
        await sendVerificationEmail(
          user.email,
          `http://localhost:3000/api/users/verify/${user.verificationToken}`
        );
        res.status(200).json({
          message: "Verification email sent",
        });
      }
    } else {
      res.status(400).json({
        message: "missing required field email",
      });
    }
  } catch (error) {
    next(error);
  }
}
