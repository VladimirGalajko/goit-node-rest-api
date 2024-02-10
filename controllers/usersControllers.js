import { catchAsync } from '../helpers/catchAsync.js'
import { registerUser, loginUser } from '../services/userServices.js'
import { User } from '../models/usersModel.js'
import HttpError from '../helpers/HttpError.js'
import bcrypt from 'bcrypt'
import gravatar from 'gravatar';

export const register = catchAsync(async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })

  if (user) {
    throw new HttpError(409, 'Email in use')
  }
  const getUrl = gravatar.url(email);
  const avatarURL = 'https:'+getUrl
  const hashPassword = await bcrypt.hash(password, 10)
  console.log("avatarURL:" ,avatarURL)
  const newUser = await registerUser({ ...req.body, password: hashPassword,avatarURL })

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
  // const { email, subscription } = req.user
  const { email, subscription } = req.user
  // res.status(200).json({ email, subscription })
  res.status(200).json(req.user)
}

export { current }
