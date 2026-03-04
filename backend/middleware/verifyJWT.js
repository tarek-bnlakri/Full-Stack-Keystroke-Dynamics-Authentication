import jwt from "jsonwebtoken"
export const verifyJWT=async(req,res,next)=>{
    const token=req.cookies.token
    if(!token) return res.status(401).json({message:"You are not authenticated"})
    
    jwt.verify(token,process.env.REFRESH_TOKEN_SECRET,async(err,payload)=>{
        if(err) return res.status(403).json({message:"invalid token"})
        req.userId=payload.userId
        next()
    })
    
    
}