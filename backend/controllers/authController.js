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

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" }); 
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user.id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    const { password: _password, ...userInfo } = user;

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",   
      maxAge: 1000 * 60 * 60 * 24
    }).status(200).json(userInfo);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const logout=(req,res)=>{
    res.clearCookie("token").status(200).json("logout success")
}