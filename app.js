import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import './envs/env.js';
import contactsRouter from './routes/contactsRouter.js'

import {
  createContactSchema,
  updateContactSchema,
  favoriteSchema
} from './schemas/contactsSchemas.js'
import validateBody from './helpers/validateBody.js'
import {
  createContact,
  updateContact,
  updateFavorite
} from './controllers/contactsControllers.js'
import mongoose from 'mongoose'

const app = express()

const logger = app.get("env") === "development" ? "dev" : "short";

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log('Database connection successful')
  })
  .catch((err) => {
    console.log(err)
    process.exit(1)
  })

  

app.use(morgan(logger))
app.use(cors())
app.use(express.json())

app.use('/api/contacts', contactsRouter)

app.use((_, res) => {
  res.status(404).json({ message: 'Route not found' })
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  const { status = 500, message = 'Server error' } = err
  res.status(status).json({ message })
})

app.post('/api/contacts', validateBody(createContactSchema), createContact)
app.put('/api/contacts/:id', validateBody(updateContactSchema), updateContact)
app.patch('/api/contacts/:id/favorite', validateBody(favoriteSchema), updateFavorite)
app.listen(3000, () => {
  console.log('Server is running. Use our API on port: 3000')
})
