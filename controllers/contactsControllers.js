import {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  editContact,
  editFavContact,
} from "../services/contactsServices.js";

import { validate, validateID } from "../helpers/validate.js";

import {
  createContactSchema,
  updateContactSchema,
  favoriteContactSchema,
} from "../schemas/contactsSchemas.js";

export const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await listContacts(req.user);
    res.status(200).json(contacts);
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    if (validateID(req.params.id)) {
      const contact = await getContactById(req.params.id, req.user);
      if (contact) {
        res.status(200).json(contact);
      } else {
        res.status(404).json({
          message: "Not found",
        });
      }
    } else {
      res.status(404).json({
        message: "Not found",
      });
    }
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    if (validateID(req.params.id)) {
      const contact = await removeContact(req.params.id, req.user);
      if (contact) {
        res.status(200).json(contact);
      } else {
        res.status(404).json({
          message: "Not found",
        });
      }
    } else {
      res.status(404).json({
        message: "Not found",
      });
    }
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    validate(createContactSchema, req.body);
    const newContact = await addContact(
      req.user,
      req.body.name,
      req.body.email,
      req.body.phone
    );
    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    if (validateID(req.params.id)) {
      if (
        req.body.name ||
        req.body.email ||
        req.body.phone ||
        req.body.favorite
      ) {
        validate(updateContactSchema, req.body);

        const contact = await editContact(
          req.user,
          req.params.id,
          req.body.name,
          req.body.email,
          req.body.phone,
          req.body.favorite
        );

        if (contact) {
          res.status(200).json(contact);
        } else {
          res.status(404).json({
            message: "Not found",
          });
        }
      } else {
        res.status(400).json({
          message: "Body must have at least one field",
        });
      }
    } else {
      res.status(404).json({
        message: "Not found",
      });
    }
  } catch (error) {
    next(error);
  }
};

export async function updateStatusContact(req, res, next) {
  try {
    if (validateID(req.params.id)) {
      validate(favoriteContactSchema, req.body);

      const contact = await editFavContact(
        req.user,
        req.params.id,
        req.body.favorite
      );
      if (contact) {
        res.status(200).json(contact);
      } else {
        res.status(404).json({
          message: "Not found",
        });
      }
    } else {
      res.status(404).json({
        message: "Not found",
      });
    }
  } catch (error) {
    next(error);
  }
}
