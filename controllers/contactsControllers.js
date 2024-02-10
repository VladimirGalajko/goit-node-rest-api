import {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateOneContact,
  updateStatus,
} from '../services/contactsServices.js'

import { catchAsync } from '../helpers/catchAsync.js'
import HttpError from '../helpers/HttpError.js'
import {
  createContactSchema,
  updateContactSchema,
  favoriteSchema,
} from '../schemas/contactsSchemas.js'

export const getAllContacts = catchAsync(async (req, res) => {
  const contacts = await listContacts(req)
  res.status(200).json(contacts)
})

export const getOneContact = catchAsync(async (req, res) => {

  const contact = await getContactById(req.params.id, req)
  if (contact) {
    return res.status(200).json(contact)
  } else {
    throw new HttpError(404)
  }
})

export const deleteContact = catchAsync(async (req, res) => {
  const contact = await removeContact(req.params.id, req)
  if (contact) {
    return res.status(200).json(contact)
  } else {
    throw new HttpError(404)
  }
})

export const createContact = async (req, res) => {
  try {
    const { name, email, phone } = req.body
    const { _id: owner } = req.user;  

    await createContactSchema.validateAsync({ name, email, phone})

    const newContact = await addContact(name, email, phone,owner)

    res.status(201).json(newContact)
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(400).json({ message: error.message })
    } else {
      res.status(error.status || 500).json({ message: error.message })
    }
  }
}

export const updateContact = catchAsync(async (req, res) => {
  
  const { name, email, phone } = req.body
  const { id } = req.params

  const validationResult = await updateContactSchema.validateAsync({
    name,
    email,
    phone,
  })
  if (validationResult.error) {
    throw new HttpError(400, validationResult.error.message)
  }

  if (!name && !email && !phone) {
    throw new HttpError(400, 'Body must have at least one field')
  }

  const updatedContact = await updateOneContact(id, name, email, phone,req)

  if (updatedContact) {
    res.status(200).json(updatedContact)
  } else {
    throw new HttpError(404)
  }
})

export const updateFavorite = catchAsync(async (req, res) => {

  const { error } = favoriteSchema.validate(req.body);
  if (error) {
    error.status = 400;
    throw new HttpError(404);
  }

  const { favorite } = req.body
  const { id } = req.params

  const validationResult = await favoriteSchema.validateAsync({ favorite })
  if (validationResult.error) {
    throw new HttpError(400, validationResult.error.message)  }
 
  const updateRes = await updateStatus(id, req.body,req)

  if (updateRes) {
    res.status(200).json(updateRes)
  } else {
    throw new HttpError(404)
  }
})
