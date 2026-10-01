import { Router } from "express";
import  * as US from "./user.service.js";

const userRouter = Router()

userRouter.post("/signup/gmail",US.signupWithGmail)
userRouter.post("/",US.signup)
userRouter.post("/signin",US.signin)
userRouter.get("/",US.getProfile)





export default userRouter