import fs from "fs/promises";
import path from "path";
import { nanoid } from "nanoid";
import HttpError from "../helpers/HttpError.js";

const contactsPath = path.join("db", "contacts.json");

async function saveFile(data) {
  try {
    await fs.writeFile(contactsPath, JSON.stringify(data));
  } catch (error) {
    throw HttpError(500);
  }
}

export async function listContacts() {
  let contacts = [];
  try {
    const fileBuffer = await fs.readFile(contactsPath);
    const fileText = fileBuffer.toString();
    contacts = JSON.parse(fileText);
    return contacts;
  } catch (error) {
    throw HttpError(500);
  }
}

export async function getContactById(contactId) {
  let contacts = [];
  try {
    contacts = await listContacts();
    for (let index = 0; index < contacts.length; index++) {
      if (contacts[index].id === contactId) {
        return contacts[index];
      }
    }
    return null;
  } catch (error) {
    throw HttpError(500);
  }
}

export async function removeContact(contactId) {
  let contacts = [];
  let contact = null;
  try {
    contacts = await listContacts();
    for (let index = 0; index < contacts.length; index++) {
      if (contacts[index].id === contactId) {
        contact = contacts[index];
        contacts.splice(index, 1);
        await saveFile(contacts);
        break;
      }
    }
    return contact;
  } catch (error) {
    throw HttpError(500);
  }
}

export async function addContact(name, email, phone, id = nanoid()) {
  let contacts = [];
  try {
    contacts = await listContacts();
    const newContact = {
      id: id,
      name: name,
      email: email,
      phone: phone,
    };

    contacts.push(newContact);
    await saveFile(contacts);
    return newContact;
  } catch (error) {
    throw HttpError(500);
  }
}

export async function editContact(contactId, name, email, phone) {
  try {
    const contacts = await listContacts();
    for (let index = 0; index < contacts.length; index++) {
      if (contacts[index].id === contactId) {
        if (!name) {
          name = contacts[index].name;
        }
        if (!email) {
          email = contacts[index].email;
        }
        if (!phone) {
          phone = contacts[index].phone;
        }
        await removeContact(contactId);
        return await addContact(name, email, phone, contactId);
      }
    }
    return null;
  } catch (error) {
    throw HttpError(500);
  }
}
