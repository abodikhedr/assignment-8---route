import Joi from "joi";



export const signUpSchema = {
    body: Joi.object({
        fName: Joi.string().min(2).max(10).required(),
        lName: Joi.string().min(2).max(10).required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        age: Joi.number().min(18).max(60).required(),
        phone: Joi.number(),
        gender: Joi.string().valid("male", "female"),
    }).required(),

    query: Joi.object({
        flag: Joi.boolean()
    })
}

export const signInSchema = {
    body: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    }).required(),
}