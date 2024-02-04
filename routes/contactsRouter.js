import express from 'express'
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateFavorite
} from '../controllers/contactsControllers.js'

import isValidId from '../middlewares/isValidId.js'
import {protect} from '../middlewares/protectJws.js'


const contactsRouter = express.Router()

contactsRouter.get('/', protect, getAllContacts)

contactsRouter.get('/:id',protect, isValidId, getOneContact)

contactsRouter.delete('/:id',protect, isValidId, deleteContact)

contactsRouter.post('/',protect, createContact)

contactsRouter.put('/:id',protect, isValidId, updateContact)

contactsRouter.patch('/:id/favorite',protect, isValidId, updateFavorite)

export default contactsRouter
