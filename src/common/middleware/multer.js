import { Error } from "mongoose";
import multer from "multer";
import { randomUUID } from "node:crypto"
import fs from "node:fs"



export const multerLocal = ({ customPath = "General", customTypes = [] }) => {

    const path = `uploads/${customPath}`
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path, { recursive: true })
    }
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path)
        },

        filename: (req, file, cb) => {
            cb(null, randomUUID() + "__" + file.originalname)
        }
    }
    )



    const fileFilter=(req,file,cb)=>{
        if (!customTypes.includes(file.mimetype)) {
            return cb(new Error("Invalid file"))
        }
        cb(null,true)
    }
    
    const upload = multer({ storage ,fileFilter})
    
    return upload
}