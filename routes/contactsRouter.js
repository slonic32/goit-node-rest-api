import express from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateStatusContact,
} from "../controllers/contactsControllers.js";

import { auth } from "../middlewares/authMiddleware.js";

import { contactValidateID } from "../middlewares/contactValidate.js";

import {
  contactValidateCreate,
  contactValidateUpdate,
  contactValidateFavorite,
} from "../middlewares/contactValidate.js";

const contactsRouter = express.Router();

contactsRouter.use("/", auth);

contactsRouter.get("/", getAllContacts);

contactsRouter.get("/:contactId", contactValidateID, getOneContact);

contactsRouter.delete("/:contactId", contactValidateID, deleteContact);

contactsRouter.post("/", contactValidateCreate, createContact);

contactsRouter.put(
  "/:contactId",
  contactValidateID,
  contactValidateUpdate,
  updateContact,
);

contactsRouter.patch(
  "/:contactId/favorite",
  contactValidateID,
  contactValidateFavorite,
  updateStatusContact,
);

export default contactsRouter;
