import { checkToken } from '../services/jwtService.js'
import { getUserById } from '../services/userServices.js'
import HttpError from '../helpers/HttpError.js'
import { catchAsync } from '../helpers/catchAsync.js'

export const protect = catchAsync(async (req, res, next) => {
  const token =
    req.headers.authorization?.startsWith('Bearer ') &&
    req.headers.authorization.split(' ')[1]
  const userId = checkToken(token)

  if (!userId) throw new HttpError(401, 'Not authorized')

  const currentUser = await getUserById(userId)
  console.log('curUser', currentUser)

  if (!currentUser || !currentUser.token) throw new HttpError(401, 'Not authorized')

  req.user = currentUser

  next()
})
