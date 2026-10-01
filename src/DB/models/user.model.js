import mongoose from "mongoose";

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
            return this.provider == "system" ? true : false
        }
    },
    age: {
        type: Number,
        required: function () {
            return this.provider == "system" ? true : false
        },
        min: 18,
        max: 60
    },
    phone: {
        type: String
    },
    gender: {
        type: String,
        enum: ["male", "female"],
        default: "male"
    },
    profileImage: {
        type: String
    },
    provider: {
        type: String,
        enum: ["system", "google"],
        default: "system"
    },
    isConfirmed: {
        type: Boolean,
        default: false
    }


}, {
    timestamps: true,
    strictQuery: true,
    strict: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})





const userModel = mongoose.models.User || mongoose.model("User", userSchema)




export default userModel