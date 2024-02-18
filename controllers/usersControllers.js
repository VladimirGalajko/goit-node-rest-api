import { catchAsync } from '../helpers/catchAsync.js'
import { registerUser, loginUser } from '../services/userServices.js'
import { User } from '../models/usersModel.js'
import HttpError from '../helpers/HttpError.js'
import bcrypt from 'bcrypt'
import gravatar from 'gravatar'
import Jimp from 'jimp'
const { PORT,BASE_URL } = process.env
import path from 'path'
import { nanoid } from 'nanoid'
import sendEmail  from '../helpers/sendEmail.js'

export const register = catchAsync(async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })

  if (user) {
    throw new HttpError(409, 'Email in use')
  }
  const getUrl = gravatar.url(email)
  const avatarURL = 'https:' + getUrl
  const hashPassword = await bcrypt.hash(password, 10)
  const verificationToken = nanoid()

  const newUser = await registerUser({
    ...req.body,
    password: hashPassword,
    verificationToken,
    avatarURL,
  })

  const verifyEmail = {
    to: email,
    subject: 'Verify email',
    html: `<a target="_blank" href="${BASE_URL}:${PORT}/api/users/verify/${verificationToken}">Click verify email</a>`,
  }

  await sendEmail(verifyEmail)
  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  })
})

export const verifyEmail = catchAsync(async (req, res)=> {
  const {verificationToken} = req.params;
  const user = await User.findOne({verificationToken});
  if(!user){ 
      throw new HttpError(404, "User not found")
  }
  await User.findByIdAndUpdate(user._id, {verify: true, verificationToken: ""});

  res.json({
      message: "Verification successful"
  })
})

export const resendVerifyEmail = catchAsync(async (req, res)=> {
  const {email} = req.body;
  if(!email) {
    throw HttpError(400, "missing required field email");
  }
  const user = await User.findOne({email});
  if(!user) {
      throw new HttpError(401, "Email not found");
  }
  if(user.verify) {   
       throw new HttpError(400, "Verification has already been passed");
  }

  const verifyEmail = {
      to: email,
      subject: "Verify email",
      html: `<a target="_blank" href="${BASE_URL}:${PORT}/api/users/verify/${user.verificationToken}">Click verify email</a>`
  };

  await sendEmail(verifyEmail);

  res.json({
      message: "Verification email sent"
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

export const updateAvatar = catchAsync(async (req, res) => {
  const { path: oldPath, filename } = req.file
  const { _id } = req.user
  Jimp.read(oldPath, (err, image) => {
    if (err) throw err
    image.resize(250, 250).quality(60).write(`./public/avatars/${filename}`)
  })

  const avatarURL = path.join(`${BASE_URL}:${PORT}/avatars`, filename)
  await User.findByIdAndUpdate(_id, { avatarURL })
  res.json({ avatarURL })
})


function current(req, res) {
  const { email, subscription } = req.user
  res.status(200).json({ email, subscription })
}
export { current }
