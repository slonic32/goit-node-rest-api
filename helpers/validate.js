import HttpError from "./HttpError.js";
import { isValidObjectId } from "mongoose";

export function validate(schema, name, email, phone, favorite) {
  const { value, error } = schema.validate({ name, email, phone, favorite });
  if (error) {
    throw HttpError(400, error.details.map((err) => err.message).join(" ; "));
  }
}

export function validateID(id) {
  return isValidObjectId(id);
}
