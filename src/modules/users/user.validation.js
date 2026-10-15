import Joi from "joi";
import { generalRules } from "../../common/utils/generalRules.js";




export const signUpSchema = {
    body: Joi.object({
        fName: generalRules.fName.required(),
        lName: generalRules.lName.required(),
        email: generalRules.email.required(),
        password: generalRules.password.required(),
        cPassword: Joi.string().valid(Joi.ref("password")).required(),
        age: generalRules.age.required(),
        phone: generalRules.phone,
        gender: generalRules.gender,
    }).required(),

    files: Joi.object({
        attachments: Joi.array().items(generalRules.file.required()).required(),
        attachment: Joi.array().items(generalRules.file.required()).required(),
    }).required(),
}

export const signInSchema = {
    body: Joi.object({
        email: generalRules.email.required(),
        password: generalRules.password.required(),
    }).required(),
}

export const refreshTokenSchema = {
    headers: generalRules.token.required()
}

export const shareProfileSchema = {
    params: Joi.object({
        id: generalRules.id.required()
    }).required(),
}

export const updateProfileSchema = {
    body: Joi.object({
        fName: generalRules.fName,
        lName: generalRules.lName,
        age: generalRules.age,
        phone: generalRules.phone,
        gender: generalRules.gender,
    }).required(),
}
export const updatePasswordSchema = {
    body: Joi.object({
        old_password:generalRules.password.required(),
        new_password:generalRules.password.required(),
        cPassword: Joi.string().valid(Joi.ref("new_password")).required(),

    }).required(),
}