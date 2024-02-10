import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import './envs/env.js'
import contactsRouter from './routes/contactsRouter.js'
import authRouter from './routes/authRouter.js'

// import {
//   createContactSchema,
//   updateContactSchema,
//   favoriteSchema,
// } from './schemas/contactsSchemas.js'
// import { registerSchema ,loginSchema} from './schemas/usersSchema.js'
// import validateBody from './helpers/validateBody.js'
// import { validateBodyReg } from './middlewares/validateBodyReg.js'
// import {
//   createContact,
//   updateContact,
//   updateFavorite,
// } from './controllers/contactsControllers.js'
// import {current} from  './controllers/usersControllers.js'
// import { register,login } from './controllers/usersControllers.js'
import mongoose from 'mongoose'

import {serverConfig} from './configs/serverConfig.js'

const app = express()

const logger = app.get('env') === 'development' ? 'dev' : 'short'

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
app.use(express.static('public'))

app.use('/api/contacts', contactsRouter)
app.use('/api/users', authRouter)

app.use((_, res) => {
  res.status(404).json({ message: 'Route not found' })
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  const { status = 500, message = 'Server error' } = err
  res.status(status).json({ message })
})

// app.post('/api/contacts', validateBody(createContactSchema), createContact)
// app.put('/api/contacts/:id', validateBody(updateContactSchema), updateContact)
// app.patch(
//   '/api/contacts/:id/favorite',
//   validateBody(favoriteSchema),
//   updateFavorite
// )

// app.post('/api/users/register', validateBodyReg(registerSchema), register)
// app.post('/api/users/login', validateBodyReg(loginSchema), login)
// app.get('/api/users/current', current)


app.listen(3000, () => {
  console.log('Server is running. Use our API on port: 3000')
})

console.log(serverConfig)