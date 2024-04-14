import { validate } from "../helpers/validate.js";
import { registerSchema } from "../schemas/userSchemas.js";
import {
  createUser,
  getUserByEmail,
  getUserById,
} from "../services/authServices.js";
import { genToken } from "../services/jwtServices.js";

export async function registerUser(req, res, next) {
  try {
    validate(registerSchema, req.body);
    const { email, password } = req.body;
    if (!(await getUserByEmail(email))) {
      const newUser = await createUser(email, password);
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
