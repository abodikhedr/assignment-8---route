import { decrypt, Encrypt } from "../../common/security/encrypit.js"
import { compare, hash } from "../../common/security/hash.js"
import * as dbService from "../../DB/service/db.service.js"
import userModel from "../../DB/models/user.model.js"
import jwt from "jsonwebtoken"
import { OAuth2Client } from 'google-auth-library'
import { providerEnum } from "../../common/enum/user.enum.js"
import { randomUUID } from "crypto"
import { deleteKey, keys, setValue } from "../../DB/service/redis.service.js"
const client = new OAuth2Client();



//================sign up================
export const signup = async (req, res, next) => {

    const { email, password, fName, lName, age, gender, phone } = req.body
    const paths = []
    for (const file of req.files.attachments) {
        paths.push(file.path)
        console.log({ file });
    }
    const user = await dbService.create({
        model: userModel,
        data: {
            email,
            password: await hash(password, 12),
            fName,
            lName,
            age,
            gender,
            phone: Encrypt(phone),
            profileImage: req.files.attachment[0].path,
            coverImages: paths
        },

    })
    res.status(201).json({ message: "account created successfully", user })
}

//================sign up with gmail================
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
                provider: providerEnum.google
            }
        })
    }
    if (user.provider == providerEnum.system) {
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

//================sign in================
export const signin = async (req, res, next) => {
    const tokenId = randomUUID()
    const { email, password } = req.body
    const user = await dbService.findOne({
        model: userModel,
        filter: {
            email: email.toLowerCase(),
            provider: providerEnum.system

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
        phone: decrypt(user.phone),


    }, "test1",
        {
            expiresIn: "400s",
            audience: "http://localhost:4000",
            issuer: "http://localhost:3000",
            jwtid: tokenId

        })
    const refresh_token = jwt.sign({
        id: user._id,
        email: user.email,
        phone: decrypt(user.phone)
    }, "test2", {
        expiresIn: "4000s",
        audience: "http://localhost:4000",
        issuer: "http://localhost:3000",
        jwtid: tokenId
    })


    res.status(200).json({ message: "successfully signed in", tokens: { access_token, refresh_token } },)

}

//================get profile================
export const getProfile = async (req, res, next) => {

    const user = req.user

    res.status(200).json({ message: "successfully signed in", user },)

}

//================share profile================
export const shareProfile = async (req, res, next) => {

    const id = req.params.id
    const user = await dbService.findById({
        model: userModel,
        id,
        options: { password: 0 }
    })
    if (!user) {
        throw new Error("user doesnt exist", { cause: 404 })

    }
    user.phone = decrypt(user.phone)
    res.status(200).json({ message: "user profile", user },)

}

//================refresh token================
export const refreshToken = async (req, res, next) => {
    const { authorization } = req.headers
    if (!authorization) {
        throw new Error("token doesnt exist", { cause: 404 })
    }
    const decoded = jwt.verify(authorization, "test2")
    if (!decoded?.id) {
        throw new Error("inValid token", { cause: 400 })
    }
    const user = await dbService.findOne({
        model: userModel,
        filter: {
            _id: decoded.id
        }
    })
    const access_token = jwt.sign({
        id: user._id,
        email: user.email,
        phone: decrypt(user.phone)
    }, "test1",
    )
    return res.status(200).json({ message: "done", access_token })

}

//================update profile================
export const updateProfile = async (req, res, next) => {

    const { fName, lName, age, gender, phone } = req.body
    let updateQuery = {}
    if (fName !== undefined) {
        updateQuery.fName = fName
    }
    if (lName !== undefined) {
        updateQuery.lName = lName
    }
    if (age !== undefined) {
        updateQuery.age = age
    }
    if (gender !== undefined) {
        updateQuery.gender = gender
    }
    if (phone !== undefined) {
        updateQuery.phone = Encrypt(phone)
    }

    let user = await dbService.findByIdAndUpdate({
        model: userModel,
        id: req.user._id,
        update: updateQuery
    })

    return res.status(200).json({ message: "done", user })
}

//================update password================
export const updatePassword = async (req, res, next) => {

    const { old_password, new_password } = req.body
    if (!await compare(old_password, req.user.password)) {
        throw new Error("inValid old password");
    }
    req.user.password = await hash(new_password)
    await req.user.save()
    return res.status(200).json({ message: "done" })
}

//================log out================
export const logOut = async (req, res, next) => {
    const { flag } = req.query

    if (flag == "all") {
        req.user.changeCredentialAt = new Date()
        await req.user.save()

        await deleteKey(await keys(`revoke_token::${req.user._id}`))
    } else {
        console.log(req.decoded.exp - Math.floor(Date.now() / 1000));

        await setValue({
            key: `revoke_token::${req.user._id}::${req.decoded.jti}`,
            value: `${req.decoded.jti}`,
            ttl: req.decoded.exp - Math.floor(Date.now() / 1000)
        })
    }
    return res.status(200).json({ message: "successfully logged out" })
}

