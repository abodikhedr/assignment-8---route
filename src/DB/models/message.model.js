import mongoose from "mongoose";


const messageSchema = new mongoose.Schema({

    content: {
        type: String,
        required: function () {
            return this.attachments?.length ? false : true
        }
    },
    attachments: [String],

    userId: {
        type: mongoose.Types.ObjectId,
        ref:"User",
        required:true
    }
}, {
    timestamps: true,
    strictQuery: true,
    strict: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})





const messageModel = mongoose.models.Message || mongoose.model("Message", messageSchema)




export default messageModel