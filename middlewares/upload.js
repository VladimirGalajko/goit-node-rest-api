import multer from 'multer'
import path from 'path'
import { v4 } from 'uuid'

const multerFilter = (req, file, cbk) => {
  if (file.mimetype.startsWith('image/')) {
    cbk(null, true)
  } else {
    cbk(new HttpError(400, 'Please, upload images only..'), false)
  }
}

const destination = path.resolve('tmp')

const multerStorage = multer.diskStorage({
  destination,
  filename: (req, file, cbk) => {
    const { _id } = req.user
    const extension = file.mimetype.split('/')[1]
    cbk(null, `${_id}-${v4()}.${extension}`)
  },
})

export const uploadAvatar = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
}).single('avatar')
