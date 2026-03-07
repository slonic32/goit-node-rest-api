import { validate } from "../helpers/validate.js";
import { registerSchema, verificationSchema } from "../schemas/userSchemas.js";

export async function authValidate(req, res, next) {
  try {
    validate(registerSchema, req.body);
    next();
  } catch (error) {
    next(error);
  }
}

export async function authVerificationValidate(req, res, next) {
  try {
    validate(verificationSchema, req.body);
    next();
  } catch (error) {
    next(error);
  }
}
