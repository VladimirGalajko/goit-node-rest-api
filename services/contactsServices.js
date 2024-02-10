// import { randomUUID } from 'crypto'
import { Contact } from '../models/contactsModel.js'


async function listContacts(req) {
  const { _id: owner } = req.user;
  const contacts = await Contact.find({ owner })
  return contacts
}

async function getContactById(contactId, req) {

  const contacts = await listContacts(req)
  const contact = contacts.find((el) => el.id === contactId) || null
  return contact || null
}

async function removeContact(contactId,req) {
  const contact = await getContactById(contactId,req)
  const result = await Contact.findByIdAndDelete(contactId)

  if (contact && result) {
    return contact
  } else return null
}

async function addContact(name, email, phone,owner) {
  const newContact = await Contact.create({ name, email, phone,owner });
  return newContact
}

async function updateOneContact(id, name, email, phone,req) {
  const contact = await getContactById(id,req)
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

async function updateStatus(id, body,req) {
  const contact = await getContactById(id,req)

  if (!contact) return null

  const result = await Contact.findByIdAndUpdate(id, body, {
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
