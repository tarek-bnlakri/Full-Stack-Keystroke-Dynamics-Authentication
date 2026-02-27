import bcrypt from 'bcrypt';
import prisma from '../lib/prisma.js';
import jwt from "jsonwebtoken"

export const register=async(req,res)=>{
 

    const {email,password,username}=req.body
    if(!email || !password || !username)
             res.status(400).json({messsage:"All fields are required"})

try {
    const hashedPassword = await bcrypt.hash(password,10)
    const user=await prisma.user.create({
        data: {email,password:hashedPassword,username}
    })
    if(user)
        return res.status(203).json("user added successfully")

} catch (error) {
    console.log(error)
     res.status(403).json({messsage:"Could't add user"})
   
    
}
    
}

export const login=async(req,res)=>{
    const {email,password}=req.body
    if(!email || !password)
             res.status(400).json({messsage:"All fields are required"})


    try {
        const validEmail=await prisma.user.findUnique({
            where:{
                email
            }
        })
        if(!validEmail){
            console.log("invald email")
            return res.sendStatus(401)
        }
        const validPassword=await bcrypt.compare(password,validEmail.password)
        if(!validPassword){
            console.log("invald password")
            res.sendStatus(401)
        }
        const token =jwt.sign({userId:validEmail.id},process.env.REFRESH_TOKEN_SECRET,{expiresIn:1000*60*60*24})
        const {password:userPssword,...userInfo}=validEmail
        
        res.cookie("token",token,{
            httpOnly:true,
            //secure:true,
            maxAge:1000*60*60*24
        }).status(200).json(userInfo)
       
        
    } catch (error) {
        console.log(error)
    }
    
}
export const logout=(req,res)=>{
    res.clearCookie("token").status(200).json("logout success")
}