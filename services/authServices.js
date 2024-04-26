import { UserModel } from "../models/usersModel.js";
import HttpError from "../helpers/HttpError.js";
import { v4 } from "uuid";

export async function getUserByEmail(userEmail) {
  try {
    const user = await UserModel.findOne({ email: userEmail });
    return user;
  } catch (error) {
    throw HttpError(500);
  }
}

export async function createUser(userEmail, userPassword) {
  try {
    const newUser = await UserModel.create({
      email: userEmail,
      password: userPassword,
      verificationToken: v4(),
    });
    return newUser;
  } catch (error) {
    throw HttpError(500);
  }
}

export async function getUserById(id) {
  try {
    const user = await UserModel.findOne({ _id: id });
    return user;
  } catch (error) {
    throw HttpError(500);
  }
}

export async function changeAvatar(id, avatar) {
  try {
    const user = await UserModel.findOne({ _id: id });
    user.avatarURL = avatar;
    await user.save();
    return user;
  } catch (error) {
    throw HttpError(500);
  }
}

export async function getUserByVerificationToken(vToken) {
  try {
    const user = await UserModel.findOne({ verificationToken: vToken });
    return user;
  } catch (error) {
    throw HttpError(500);
  }
}

export async function completeUserVerification(user) {
  try {
    user.verificationToken = null;
    user.verify = true;
    await user.save();
  } catch (error) {
    throw HttpError(500);
  }
}
