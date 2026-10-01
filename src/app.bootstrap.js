
import express from "express"
import connectionDB from "./DB/connectionDB.js"
import userRouter from "./modules/users/user.controller.js"
import cors from "cors"
const app = express()
const port = 3000


const bootstrap = async () => {
    app.use(cors({
        origin:"*"
    }))
    app.use(express.json())
    app.get("/", (req, res, next) => {
        res.status(200).json({ message: "welcome to my app" })
    })

    connectionDB()
    app.use("/users", userRouter)


    app.use("{/*demo}", (req, res, next) => {
        throw new Error(`url:${req.originalUrl} with method:${req.method} not found`, { cause: 404 })
    })



    app.use((err, req, res, next) => {
        console.log(err);
        if (err.code == 11000) {
            const field = Object.keys(err.keyValue)[0]
            res.status(409).json({
                message: `${field} already found`,
                code: err.code
            })
        }

        res.status(err.cause || 500).json({
            message: err.message,
            code: err.code,
            stack: err.stack,
        })
    });


    app.listen(port, () => {
        console.log(`server running on port ${port}`);
    })
}

export default bootstrap