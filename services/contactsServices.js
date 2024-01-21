import { readFile, writeFile } from 'fs/promises'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { randomUUID } from 'crypto'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const contactsPath = join(__dirname, '../db/contacts.json')

async function listContacts() {
  const data = await readFile(contactsPath)
  return JSON.parse(data)
}

async function getContactById(contactId) {
  const contacts = await listContacts()
  const contact = contacts.find((el) => el.id === contactId) || null
  return contact || null
}

async function removeContact(contactId) {
  const contacts = await listContacts()
  const contact = await getContactById(contactId)
  if (contacts && contact) {
    const updatedContacts = contacts.filter((el) => el.id !== contactId)
    await writeFile(contactsPath, JSON.stringify(updatedContacts, null, 2))
    return contact
  } else return null
}

async function addContact(name, email, phone) {
  const contacts = await listContacts()
  const newContact = { id: randomUUID(), name, email, phone }

  contacts.push(newContact)
  await writeFile(contactsPath, JSON.stringify(contacts, null, 2))
  return newContact
}

async function updateOneContact(id, name, email, phone) {
  const contact = await removeContact(id)
  if(!contact) return null
  
  const contacts = await listContacts()

  const upContact = {
    id,
    name: name || contact.name,
    email: email || contact.email,
    phone: phone || contact.phone,
  }
  contacts.push(upContact)
  await writeFile(contactsPath, JSON.stringify(contacts, null, 2))
  return upContact
}

export {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateOneContact,
}
