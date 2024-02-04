import HttpError from '../helpers/HttpError.js'



export const validateBodyReg = (schema) => {
    const fn = (req, res, next) => {
        const validationResult = schema.validate(req.body);

        if (validationResult.error) {
            throw HttpError(400, validationResult.error.message);
          
        }
        next();
    }
    return fn;
}
