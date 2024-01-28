// import { randomUUID } from 'crypto'
import { Contact } from '../models/contactsModel.js'


async function listContacts() {
  const contacts = await Contact.find()
  return contacts
}

async function getContactById(contactId) {
  const contacts = await listContacts()
  const contact = contacts.find((el) => el.id === contactId) || null
  return contact || null
}

async function removeContact(contactId) {
  const contact = await getContactById(contactId)
  const result = await Contact.findByIdAndDelete(contactId)

  if (contact && result) {
    return contact
  } else return null
}

async function addContact(name, email, phone) {
  const newContact = await Contact.create({ name, email, phone });
  return newContact
}

async function updateOneContact(id, name, email, phone) {
  const contact = await getContactById(id)
  if (!contact) return null


  const upContact = {  
    name: name || contact.name,
    email: email || contact.email,
    phone: phone || contact.phone,
  }

  const result = await Contact.findByIdAndUpdate(id, upContact, {
    new: true,
  });

  return result
}

async function updateStatus(id, favorite) {
  const contact = await getContactById(id)
  if (!contact) return null

  const result = await Contact.findByIdAndUpdate(id, {favorite}, {
    new: true,
  });

  return result
}

export {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateOneContact,
  updateStatus
}
