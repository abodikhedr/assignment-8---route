import nodemailer from "nodemailer";
import {randomInt, randomUUID} from "crypto"


export const sendEmail = async ({ to, subject, html, attachments = [] } = {}) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "abodi4000khedr@gmail.com",
            pass: "rqmlwrodgcldttql"
        }
    })

    const info = await transporter.sendMail({
        from: `"abodi" <abodi4000khedr@gmail.com>`,
        to: to,
        subject: subject,
        html: html || "<h1>hello<h1>",
        attachments: attachments
    })


    return info.accepted.length > 0 ? true : false
}

export const generate_otp=async()=>{
    return  randomInt(100000,1000000).toString()
}
