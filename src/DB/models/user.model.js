import mongoose from "mongoose";
import { genderEnum, providerEnum, roleEnum } from "../../common/enum/user.enum.js";


const userSchema = new mongoose.Schema({

    fName: {
        type: String,
        trim: true,
        minlength: 2,
        maxlength: 10,
        required: true
    },

    lName: {
        type: String,
        trim: true,
        minlength: 2,
        maxlength: 10,
        required: true
    },

    email: {
        type: String,
        trim: true,
        unique: true,
        lowercase: true,
        required: true
    },
    password: {
        type: String,
        trim: true,
        required: function () {
            return this.provider == providerEnum.system ? true : false
        }
    },
    age: {
        type: Number,
        required: function () {
            return this.provider == providerEnum.system ? true : false
        },
        min: 18,
        max: 60
    },
    phone: {
        type: String
    },
    gender: {
        type: String,
        enum: Object.values(genderEnum),
        default: genderEnum.male
    },
    profileImage: {
        type: String
    },
    coverImages: {
        type: [String]
    },
    role: {
        type: String,
        enum: Object.values(roleEnum),
        default: roleEnum.user
    },
    provider: {
        type: String,
        enum: Object.values(providerEnum),
        default: providerEnum.system
    },
    isConfirmed: {
        type: Boolean,
        default: false
    },
    changeCredentialAt:Date


}, {
    timestamps: true,
    strictQuery: true,
    strict: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})





const userModel = mongoose.models.User || mongoose.model("User", userSchema)




export default userModel