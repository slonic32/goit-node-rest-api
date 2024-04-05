import HttpError from "./HttpError.js";

export default function validate(schema, name, email, phone) {
  const { value, error } = schema.validate({ name, email, phone });
  if (error) {
    throw HttpError(400, error.details.map((err) => err.message).join(" ; "));
  }
}
