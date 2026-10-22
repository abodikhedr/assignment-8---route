import messageModel from "../../DB/models/message.model.js";
import userModel from "../../DB/models/user.model.js";
import * as dbService from "../../DB/service/db.service.js";





export const createMessage = async (req, res, next) => {
    const { content, userId } = req.body
    if (!content && !req.files.length) {
        throw new Error("content is required");
    }
    const user = await dbService.findById({
        model: userModel,
        id: userId
    })
    if (!user) {
        throw new Error("user doesnt exist");
    }
        const paths = []
    if (req?.files?.length) {
        for (const file of req.files) {
            paths.push(file.path)
            console.log({ file });
        }
    }

    const message=await dbService.create({
        model:messageModel,
        data:{
            content,
            attachments:paths,
            userId
        }
    })
    return res.status(201).json({ message: "done", })
}