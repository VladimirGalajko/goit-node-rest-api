import { isValidObjectId } from 'mongoose';
import HttpError from '../helpers/HttpError.js'

const isValidId = (req, res, next) => { 
  const  contactId  = req.params.id;
  const result = isValidObjectId(contactId);
  if (!result) {
    throw HttpError(400, `Invalid format id`);
  }
  next();
};


export default isValidId;