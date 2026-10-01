import { decrypt, Encrypt } from "../../common/security/encrypit.js"
import { compare, hash } from "../../common/security/hash.js"
import * as dbService from "../../DB/db.service.js"
import userModel from "../../DB/models/user.model.js"
import jwt from "jsonwebtoken"
import { OAuth2Client } from 'google-auth-library'
const client = new OAuth2Client();





export const signup = async (req, res, next) => {

    const { email, password, fName, lName, age, gender, phone } = req.body
    const user = await dbService.create({
        model: userModel,
        data: { email, password: await hash(password, 12), fName, lName, age, gender, phone: Encrypt(phone) },

    })
    res.status(201).json({ message: "account created successfully", user })
}


export const signin = async (req, res, next) => {

    const { email, password } = req.body
    const user = await dbService.findOne({
        model: userModel,
        filter: {
            email: email.toLowerCase(),
            provider: "system"
        }
    })
    if (!user || ! await compare(password, user.password)) {
        throw new Error("invalid credentials", { cause: 401 })
    }
    // if (user.isConfirmed == false) {
    //     throw new Error("user isnt confirmed",{cause:400})
    // }
    const access_token = jwt.sign({
        id: user._id,
        email: user.email,
        phone: decrypt(user.phone)
    }, "test1",
        {
            expiresIn: "40s",
            audience: "http://localhost:4000",
            issuer: "http://localhost:3000",
            notBefore: "15s"

        })
    const refresh_token = jwt.sign({
        id: user._id,
        email: user.email,
        phone: decrypt(user.phone)
    }, "test2")


    res.status(200).json({ message: "successfully signed in", tokens: { access_token, refresh_token } },)

}


export const getProfile = async (req, res, next) => {

    const { authorization } = req.body

    if (!authorization) {
        throw new Error("token doesnt exist", { cause: 404 })
    }
    const verify = jwt.verify(authorization, "test1")
    const user = await dbService.findOne({
        model: userModel,
        filter: {
            _id: verify.id
        }
    })



    res.status(200).json({ message: "successfully signed in", user },)

}

export const signupWithGmail = async (req, res, next) => {

    const { idToken } = req.body
    const ticket = await client.verifyIdToken({
        idToken,
        audience: "1043769584776-kcktdbnf7eme1sl0ipq21ei0vhs6iedm.apps.googleusercontent.com" // Specify the WEB_CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[WEB_CLIENT_ID_1, WEB_CLIENT_ID_2, WEB_CLIENT_ID_3]
    });
    const { family_name, given_name, picture, email, email_verified } = ticket.getPayload();
    // This ID is unique to each Google Account, making it suitable for use as a primary key
    // during account lookup. Email is not a good choice because it can be changed by the user.
    let user = await dbService.findOne({
        model: userModel,
        filter: {
            email: email.toLowerCase()
        }
    })
    if (!user) {
        user = await dbService.create({
            model: userModel,
            data: {
                email,
                fName: given_name,
                lName: family_name,
                profileImage: picture,
                isConfirmed: email_verified,
                provider: "google"
            }
        })
    }
        if (user.provider=="system") {
            throw new Error("please sign in through the system")
        }

        const access_token = jwt.sign({
            id: user._id,
            email: user.email,
            
        }, "test1",
            {
                expiresIn: "60s",
                

            })
        const refresh_token = jwt.sign({
            id: user._id,
            email: user.email,
            
        }, "test2")

        res.status(200).json({ message: "successfully signed in", tokens: { access_token, refresh_token } },)
    


}
