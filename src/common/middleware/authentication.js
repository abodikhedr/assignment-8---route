import jwt from "jsonwebtoken"
import userModel from "../../DB/models/user.model.js"
import * as dbService from "../../DB/db.service.js"






export const authentication = async (req,res,next)=>{
    const { authorization } = req.headers

    if (!authorization) {
        throw new Error("token doesnt exist", { cause: 404 })
    }
    const decoded = jwt.verify(authorization, "test1")
    if (!decoded?.id) {
        throw new Error("inValid token", { cause: 400 })
    }
    const user = await dbService.findOne({
        model: userModel,
        filter: {
            _id: decoded.id
        }
    })
    req.user=user
    next()
}