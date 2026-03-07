import { validateID, validate } from "../helpers/validate.js";

import {
  createContactSchema,
  updateContactSchema,
  favoriteContactSchema,
} from "../schemas/contactsSchemas.js";

export async function contactValidateCreate(req, res, next) {
  try {
    validate(createContactSchema, req.body);
    next();
  } catch (error) {
    next(error);
  }
}

export async function contactValidateUpdate(req, res, next) {
  try {
    validate(updateContactSchema, req.body);
    next();
  } catch (error) {
    next(error);
  }
}

export async function contactValidateFavorite(req, res, next) {
  try {
    validate(favoriteContactSchema, req.body);
    next();
  } catch (error) {
    next(error);
  }
}

export async function contactValidateID(req, res, next) {
  try {
    if (!validateID(req.params.contactId)) {
      return res.status(404).json({
        message: "Not found",
      });
    }
    next();
  } catch (error) {
    next(error);
  }
}
