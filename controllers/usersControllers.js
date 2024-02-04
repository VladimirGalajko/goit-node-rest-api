import { catchAsync } from '../helpers/catchAsync.js'
import { registerUser, loginUser } from '../services/userServices.js'
import { User } from '../models/usersModel.js'
import HttpError from '../helpers/HttpError.js'
import bcrypt from 'bcrypt'

export const register = catchAsync(async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })

  if (user) {
    throw new HttpError(409, 'Email in use')
  }

  const hashPassword = await bcrypt.hash(password, 10)
  const newUser = await registerUser({ ...req.body, password: hashPassword })

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  })
})

export const login = catchAsync(async (req, res) => {
  const { user, token } = await loginUser(req.body)
  await User.findByIdAndUpdate(user._id, { token })
  res.status(200).json({
    token,
    user,
  })
})

export const logout = async (req, res) => {
  const { _id } = req.user

  await User.findByIdAndUpdate(_id, { token: '' })
  res.sendStatus(204)
}

function current(req, res) {
  const { email, subscription } = req.user

  res.status(200).json({ email, subscription })
}

export { current }
