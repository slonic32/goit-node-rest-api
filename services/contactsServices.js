import { ContactModel } from "../models/contactsModel.js";
import HttpError from "../helpers/HttpError.js";

export async function listContacts(user) {
  try {
    const contacts = await ContactModel.find({ owner: user });
    return contacts;
  } catch (error) {
    throw HttpError(500);
  }
}

export async function getContactById(contactId) {
  try {
    const contacts = await ContactModel.findById(contactId);
    return contacts;
  } catch (error) {
    throw HttpError(500);
  }
}

export async function removeContact(contactId) {
  try {
    const contacts = await ContactModel.findByIdAndDelete(contactId);
    return contacts;
  } catch (error) {
    throw HttpError(500);
  }
}

export async function addContact(id, name, email, phone, favorite) {
  try {
    const newContact = await ContactModel.create({
      name: name,
      email: email,
      phone: phone,
      favorite: favorite,
      owner: id,
    });
    return newContact;
  } catch (error) {
    throw HttpError(500);
  }
}

export async function editContact(contactId, name, email, phone, favorite) {
  try {
    const newContact = {};
    if (name) {
      newContact.name = name;
    }
    if (email) {
      newContact.email = email;
    }
    if (phone) {
      newContact.phone = phone;
    }
    if (favorite) {
      newContact.favorite = favorite;
    }
    const contact = await ContactModel.findByIdAndUpdate(
      contactId,
      newContact,
      { new: true }
    );
    return contact;
  } catch (error) {
    throw HttpError(500);
  }
}

export async function editFavContact(contactId, favorite) {
  try {
    const contact = await ContactModel.findByIdAndUpdate(
      contactId,
      { favorite: favorite },
      { new: true }
    );
    return contact;
  } catch (error) {
    throw HttpError(500);
  }
}
