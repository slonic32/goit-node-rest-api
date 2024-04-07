import {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  editContact,
} from "../services/contactsServices.js";

import validate from "../helpers/validate.js";

import {
  createContactSchema,
  updateContactSchema,
} from "../schemas/contactsSchemas.js";

export const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await listContacts();
    res.status(200).json(contacts);
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const contact = await getContactById(req.params.id);
    if (contact) {
      res.status(200).json(contact);
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
    const contact = await removeContact(req.params.id);
    if (contact) {
      res.status(200).json(contact);
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
    validate(
      createContactSchema,
      req.body.name,
      req.body.email,
      req.body.phone
    );
    const newContact = await addContact(
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
    if (req.body.name || req.body.email || req.body.phone) {
      validate(
        updateContactSchema,
        req.body.name,
        req.body.email,
        req.body.phone
      );

      const contact = await editContact(
        req.params.id,
        req.body.name,
        req.body.email,
        req.body.phone
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
  } catch (error) {
    next(error);
  }
};
