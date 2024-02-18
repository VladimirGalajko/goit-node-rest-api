import Joi from "joi";

export const registerSchema = Joi.object({
    password: Joi.string().min(6).required(),
    email: Joi.string().required(),
    subscription: Joi.string()
});

export const loginSchema = Joi.object({
    password: Joi.string().min(6).required(),
    email: Joi.string().required(),
});

const emailValid = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

export const emailSchema = Joi.object({
  email: Joi.string().pattern(emailValid).required(),
});