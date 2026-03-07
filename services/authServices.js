import { User } from "../models/usersModel.js";
import HttpError from "../helpers/HttpError.js";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { genToken } from "./jwtServices.js";

const { jwtSecrete, jwtExpires, bcryptSalt } = process.env;

export async function getUserByEmail(userEmail) {
  try {
    const user = await User.findOne({
      where: {
        email: userEmail,
      },
    });
    return user;
  } catch (error) {
    throw HttpError(500);
  }
}

export async function createUser(userEmail, userPassword) {
  try {
    const hashPassword = await bcrypt.hash(
      userPassword,
      Number(bcryptSalt) || 10,
    );
    const newUser = await User.create({
      email: userEmail,
      password: hashPassword,
    });
    return newUser;
  } catch (error) {
    throw HttpError(500);
  }
}

export async function getUserById(id) {
  try {
    const user = await User.findByPk(id);
    return user;
  } catch (error) {
    throw HttpError(500);
  }
}

export async function loginUserService({ email, password }) {
  const user = await getUserByEmail(email);

  if (!user) throw HttpError(401, "Email or password invalid");

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) throw HttpError(401, "Email or password invalid");

  const token = genToken(user.id);

  await user.update({ token });

  return {
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  };
}

export async function logoutUserService(id) {
  try {
    const user = await User.findByPk(id);
    if (!user) throw HttpError(401, "Not authorized");

    await user.update({ token: null });
    return;
  } catch (error) {
    throw HttpError(500);
  }
}
