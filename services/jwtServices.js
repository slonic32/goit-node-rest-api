import jwt from "jsonwebtoken";
import HttpError from "../helpers/HttpError.js";

export function genToken(id) {
  const token = jwt.sign({ id }, process.env.jwtSecrete, {
    expiresIn: process.env.jwtExpires,
  });
  return token;
}

export function readToken(token) {
  try {
    const { id } = jwt.verify(token, process.env.jwtSecrete);
    return id;
  } catch (err) {
    throw HttpError(401, "Not authorized");
  }
}
