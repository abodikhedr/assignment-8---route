import Joi from "joi";
import { Types } from "mongoose";

export const generalRules = {
    id: Joi.string().custom((value, helper) => {
        return Types.ObjectId.isValid(value) ? value : helper.message("inValid id")
    }),
    fName: Joi.string().min(2).max(10),
    lName: Joi.string().min(2).max(10),
    email: Joi.string().email(),
    password: Joi.string(),
    age: Joi.number().min(18).max(60),
    phone: Joi.number(),
    gender: Joi.string().valid("male", "female"),

    file: Joi.object({
        fieldname: Joi.string().required(),
        originalname: Joi.string().required(),
        encoding: Joi.string().required(),
        mimetype: Joi.string().required(),
        path: Joi.string(),
        destination: Joi.string(),
        filename: Joi.string(),
        size: Joi.number().required()
    }),

    token: Joi.object({
        authorization: Joi.string().required(),
        connection: Joi.string(),
        "accept-encoding": Joi.string(),
        accept: Joi.string(),
        "user-agent": Joi.string(),
        host: Joi.string(),
        "content-length": Joi.string(),
        "postman-token": Joi.string(),
    })

}