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

export async function getContactById(contactId, user) {
  try {
    const contacts = await ContactModel.findOne({
      _id: contactId,
      owner: user,
    });
    return contacts;
  } catch (error) {
    throw HttpError(500);
  }
}

export async function removeContact(contactId, user) {
  try {
    const contacts = await ContactModel.findOneAndDelete({
      _id: contactId,
      owner: user,
    });
    return contacts;
  } catch (error) {
    throw HttpError(500);
  }
}

export async function addContact(user, name, email, phone, favorite) {
  try {
    const newContact = await ContactModel.create({
      name: name,
      email: email,
      phone: phone,
      favorite: favorite,
      owner: user._id,
    });
    return newContact;
  } catch (error) {
    throw HttpError(500);
  }
}

export async function editContact(
  user,
  contactId,
  name,
  email,
  phone,
  favorite
) {
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
    const contact = await ContactModel.findOneAndUpdate(
      {
        _id: contactId,
        owner: user,
      },
      newContact,
      { new: true }
    );
    return contact;
  } catch (error) {
    throw HttpError(500);
  }
}

export async function editFavContact(user, contactId, favorite) {
  try {
    const contact = await ContactModel.findOneAndUpdate(
      {
        _id: contactId,
        owner: user,
      },
      { favorite: favorite },
      { new: true }
    );
    return contact;
  } catch (error) {
    throw HttpError(500);
  }
}
