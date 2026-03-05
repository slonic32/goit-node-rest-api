import { Contact as ContactModel } from "../models/contactsModel.js";
import HttpError from "../helpers/HttpError.js";

export async function listContacts() {
  try {
    return await ContactModel.findAll();
  } catch (error) {
    throw HttpError(500, error.message);
  }
}

export async function getContactById(contactId) {
  try {
    
    return await ContactModel.findByPk(contactId);
  } catch (error) {
    throw HttpError(500, error.message);
  }
}

export async function removeContact(contactId) {
  try {
    const contact = await ContactModel.findByPk(contactId);
    if (!contact) return null;

    await contact.destroy();
    return contact; 
  } catch (error) {
    throw HttpError(500, error.message);
  }
}

export async function addContact(name, email, phone, favorite = false) {
  try {
  
    return await ContactModel.create({ name, email, phone, favorite });
   
  } catch (error) {
    console.log(error);
    
    throw HttpError(500, error.message);
  }
}

export async function editContact(contactId, name, email, phone, favorite) {
  try {
    const contact = await ContactModel.findByPk(contactId);
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

export async function editFavContact(contactId, favorite) {
  try {
    const contact = await ContactModel.findByPk(contactId);
    if (!contact) return null;

    await contact.update({ favorite });
    return contact;
  } catch (error) {
    throw HttpError(500, error.message);
  }
}