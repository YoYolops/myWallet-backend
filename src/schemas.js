import Joi from 'joi';

export const userSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email({ tlds: { allow: false } }),
    password: Joi.string().required(),
})

export const entrieSchema = Joi.object({
    description: Joi.string().required(),
    value: Joi.number().integer().required(),
    date: Joi.string().required().pattern(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/)
})