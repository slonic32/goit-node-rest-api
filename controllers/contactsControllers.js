import {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  editContact,
  editFavContact,
} from "../services/contactsServices.js";

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
    const contact = await getContactById(req.user, req.params.contactId);
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
    const contact = await removeContact(req.user, req.params.contactId);
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
    const newContact = await addContact(
      req.user,
      req.body.name,
      req.body.email,
      req.body.phone,
    );

    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    if (
      req.body.name ||
      req.body.email ||
      req.body.phone ||
      req.body.favorite
    ) {
      const contact = await editContact(
        req.user,
        req.params.contactId,
        req.body.name,
        req.body.email,
        req.body.phone,
        req.body.favorite,
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

export async function updateStatusContact(req, res, next) {
  try {
    const contact = await editFavContact(
      req.user,
      req.params.contactId,
      req.body.favorite,
    );
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
}
