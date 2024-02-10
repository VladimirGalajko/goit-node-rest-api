import express from 'express'
import { register, login, logout, current } from '../controllers/usersControllers.js'
import { registerSchema, loginSchema } from '../schemas/usersSchema.js'
import { validateBodyReg } from '../middlewares/validateBodyReg.js'
import { protect } from '../middlewares/protectJws.js'
const usersRouter = express.Router()

usersRouter.post('/register', validateBodyReg(registerSchema), register)
usersRouter.post('/login', validateBodyReg(loginSchema), login)
usersRouter.post('/logout', protect, logout)
usersRouter.get('/current', protect, current)
// router.patch('/avatars',  protect, upload.single('avatar'), updateAvatar);

export default usersRouter
