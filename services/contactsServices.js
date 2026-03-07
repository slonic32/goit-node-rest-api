import { Contact as ContactModel } from "../models/contactsModel.js";
import HttpError from "../helpers/HttpError.js";

export async function listContacts(user) {
  try {
    return await ContactModel.findAll({ where: { owner: user.id } });
  } catch (error) {
    throw HttpError(500, error.message);
  }
}

export async function getContactById(user, contactId) {
  try {
    return await ContactModel.findOne({
      where: { id: contactId, owner: user.id },
    });
  } catch (error) {
    throw HttpError(500, error.message);
  }
}

export async function removeContact(user, contactId) {
  try {
    const contact = await ContactModel.findOne({
      where: { id: contactId, owner: user.id },
    });
    if (!contact) return null;

    await contact.destroy();
    return contact;
  } catch (error) {
    throw HttpError(500, error.message);
  }
}

export async function addContact(user, name, email, phone, favorite = false) {
  try {
    return await ContactModel.create({
      name,
      email,
      phone,
      favorite,
      owner: user.id,
    });
  } catch (error) {
    console.log(error);

    throw HttpError(500, error.message);
  }
}

export async function editContact(
  user,
  contactId,
  name,
  email,
  phone,
  favorite,
) {
  try {
    const contact = await ContactModel.findOne({
      where: { id: contactId, owner: user.id },
    });
    if (!contact) return null;

    const updates = {};
    if (name !== undefined) updates.name = name;
    if (email !== undefined) updates.email = email;
    if (phone !== undefined) updates.phone = phone;
    if (favorite !== undefined) updates.favorite = favorite;

    await contact.update(updates);
    return contact;
  } catch (error) {
    throw HttpError(500, error.message);
  }
}

export async function editFavContact(user, contactId, favorite) {
  try {
    const contact = await ContactModel.findOne({
      where: { id: contactId, owner: user.id },
    });
    if (!contact) return null;

    await contact.update({ favorite });
    return contact;
  } catch (error) {
    throw HttpError(500, error.message);
  }
}
