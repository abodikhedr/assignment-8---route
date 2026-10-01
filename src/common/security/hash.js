import { compareSync, hashSync } from "bcrypt"



export const hash =async(plainText,saltRounds=12)=>{
    return hashSync(plainText,saltRounds)
}

export const compare =async(plainText,hashedText)=>{
    return compareSync(plainText,hashedText)
}