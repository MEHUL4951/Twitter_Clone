import jwt from 'jsonwebtoken'
export const generateToken  = (userId,res)=>{
   const token = jwt.sign({userId},process.env.JWT_SECRET,{
    expiresIn:"15d",
   })
   res.cookie("jwt",token,{
    maxAge :new Date(Date.now() + (15*24 * 60 * 60 * 1000)),
    httpOnly:true,
    sameSite : "Strict"
   
   })
}
// res.cookie("jwtoken",jwtoken,{expires:new Date(Date.now() + (15*24 * 60 * 60 * 1000)),httpOnly:true})