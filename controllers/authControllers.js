import {
  createUser,
  getUserByEmail,
  getUserById,
  loginUserService,
  logoutUserService,
} from "../services/authServices.js";

export async function registerUser(req, res, next) {
  try {
    const { email, password } = req.body;
    if (await getUserByEmail(email)) {
      return res.status(409).json({
        message: "Email in use",
      });
    }
    const newUser = await createUser(email, password);
    return res
      .status(201)
      .json({ email: newUser.email, subscription: newUser.subscription });
  } catch (error) {
    next(error);
  }
}

export async function loginUser(req, res, next) {
  try {
    const { email, password } = req.body;
    const result = await loginUserService({ email, password });
    res.status(200).json(result);
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
    });
  } catch (error) {
    next(error);
  }
}
