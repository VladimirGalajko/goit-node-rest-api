import { User } from '../models/usersModel.js'
// import { Types } from 'mongoose';
import { signToken } from '../services/jwtService.js'
import HttpError from '../helpers/HttpError.js'
import bcrypt from 'bcrypt'

async function registerUser(dataUser) {
  const newUser = await User.create(dataUser)
  return newUser
}

async function loginUser({ email, password }) {
  const user = await User.findOne({ email })

  if (!user) throw new HttpError(401, 'Email or password is wrong')
  if(!user.verify) {
    throw HttpError(401, "Email not verified");
}

  const isPasswordValid = await bcrypt.compare(password, user.password)
 
  if (!isPasswordValid) throw new HttpError(401, 'Email or password is wrong')

  const token = signToken(user.id)
  await User.findByIdAndUpdate(user._id, { token });
  
  const obj = {
    token,
    user: { email: user.email, subscription: user.subscription },
  }

  return obj
}

function getUserById(id) {
  return User.findById(id)
}

export { registerUser, loginUser, getUserById }
