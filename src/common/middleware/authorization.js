




export const authorization= (roles=[])=>{
    return (req,res,next)=>{
        if (!roles.includes(req.user.role)) {
            throw new Error("user not authorized");
        }

        next()
    }
}