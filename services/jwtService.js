import jwt from 'jsonwebtoken'
import { serverConfig } from '../configs/serverConfig.js'
import HttpError from '../helpers/HttpError.js'

export const signToken = (id) =>
  jwt.sign({ id }, serverConfig.jwtSecret, {
    expiresIn: serverConfig.jwtExpiresIn,
  })

export const checkToken = (token) => {
  if (!token) throw new HttpError(401, 'Not authorized')

  try {
    const { id } = jwt.verify(token, serverConfig.jwtSecret)
    return id
  } catch (err) {
    throw new HttpError(401, 'Not authorized')
  }
}
