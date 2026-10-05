import { Router } from "express";
import * as US from "./user.service.js";
import { authentication } from "../../common/middleware/authentication.js";
import { authorization } from "../../common/middleware/authorization.js";
import { roleEnum } from "../../common/enum/user.enum.js";
import { validation } from "../../common/middleware/validation.js";
import { signInSchema, signUpSchema } from "./user.validation.js";

const userRouter = Router()

userRouter.post("/signup/gmail", US.signupWithGmail)
userRouter.post("/", validation(signUpSchema), US.signup)
userRouter.post("/signin", validation(signInSchema), US.signin)
userRouter.get("/", authentication, authorization(Object.values(roleEnum)), US.getProfile)


export default userRouter