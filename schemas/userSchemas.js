import Joi from "joi";

export const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(30).required(),
});

export const verificationSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "any.required": "missing required field email",
  }),
});
