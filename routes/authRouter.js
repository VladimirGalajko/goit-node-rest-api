import express from 'express'
import {
  register,
  login,
  logout,
  current,
  updateAvatar,
  verifyEmail,
  resendVerifyEmail
} from '../controllers/usersControllers.js'
import { registerSchema, loginSchema,emailSchema } from '../schemas/usersSchema.js'
import { validateBodyReg } from '../middlewares/validateBodyReg.js'
import { protect } from '../middlewares/protectJws.js'
import { uploadAvatar } from '../middlewares/upload.js'

const usersRouter = express.Router()

usersRouter.post('/register', validateBodyReg(registerSchema), register)
usersRouter.post('/login', validateBodyReg(loginSchema), login)
usersRouter.post('/logout', protect, logout)
usersRouter.get('/current', protect, current)
usersRouter.patch('/avatars', protect, uploadAvatar, updateAvatar)

usersRouter.get('/verify/:verificationToken', verifyEmail);
usersRouter.post("/verify", validateBodyReg(emailSchema), resendVerifyEmail);
export default usersRouter
