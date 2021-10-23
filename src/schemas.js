import Joi from 'joi';

export const loginSchema = Joi.object({
    email: Joi.string().email({ tlds: { allow: false } }),
    password: Joi.string().required()
})

export const userSchema = Joi.object({
    name: Joi.string().min(1).required(),
    email: Joi.string().required().email({ tlds: { allow: false } }),
    password: Joi.string().min(1).required()
})

export const entrieSchema = Joi.object({
    description: Joi.string().required(),
    value: Joi.number().integer().required()
})

