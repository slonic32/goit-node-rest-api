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

const contactsRouter = express.Router();

contactsRouter.use("/", auth);

contactsRouter.get("/", getAllContacts);

contactsRouter.get("/:contactId", getOneContact);

contactsRouter.delete("/:contactId", deleteContact);

contactsRouter.post("/", createContact);

contactsRouter.put("/:contactId", updateContact);

contactsRouter.patch("/:contactId/favorite", updateStatusContact);

export default contactsRouter;
