import { UserModel } from "../models/usersModel.js";
import HttpError from "../helpers/HttpError.js";

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
