import { generateToken } from "../lib/utils/generateToken.js";
import User from "../models/userModel.js";
import bcrypt from 'bcryptjs'
class authController {
    static signup = async (req, res) => {
        try {
            const { fullName, username, email, password } = req.body
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({
                    error: "Invalid email format",
                    success: false,
                })
            }
            const existingUser = await User.findOne({ username })
            if (existingUser) {
                return res.status(400).json({
                    error: "Username is already taken",
                    success: false,
                })
            }

            const existingEmail = await User.findOne({ email })
            if (existingEmail) {
                return res.status(400).json({
                    error: "Email is already taken",
                    success: false,
                })

            }
            if(password.length < 6){
                return res.status(400).json({
                    error: "Password must be atleast 6 character long",
                    success: false,
                })
            }
            const hashedPassword = await bcrypt.hash(password, 16)
            const newUser = new User({
                fullName,
                username,
                email,
                password: hashedPassword,
            })
            if (newUser) {
                await newUser.save()
                // generateTokenAndSetCookie(newUser._id, res);
                return res.status(201).json({
                    user: newUser,
                    success: true
                })

            } else {
                return res.status(400).json({
                    error: "Invalid user data",
                    success: false,
                })
            }


        } catch (err) {
            console.log("Error in signup controller", err.message)
            return res.status(500).json({
               error: "Internal Server Error.."
            })
        }
    }

    static login = async (req, res) => {
        try {
            const {username , password} = req.body
            const authUser = await User.findOne({username})
            const isPasswordCorrect = await bcrypt.compare(password,authUser?.password || "")
            if(!authUser || !isPasswordCorrect){
               return res.status(400).json({
                  error:"Invalid username or password"
               })
            }
            generateToken(authUser._id,res)
           return  res.status(200).json(
            authUser
            )

        } catch (err) {
            console.log("Error in login  controller", err.message)
            return res.status(500).json({
                error: "Internal Server Error.."
            })

        }

    }
    static logout = async (req, res) => {
        try {
            res.clearCookie('jwt')
            return res.status(200).send({message:"successfully logged out"})
            // return res.cookie("jwt", "", {maxAge:0}).json({
            //     message: "User Logged out successfully.",
            //     success: true
            // })
        } catch (err) {
            console.log("Error in logout  controller", err.message)
            return res.status(500).json({
                error: "Internal Server Error.."
            })
        }
    }
    static getMe = async (req,res)=>{
        try{
            const authUser = await User.findById(req.user._id)
            return res.status(200).json(
 authUser)

        }catch(err){
            console.log("Error in getMe  controller", err.message)
            return res.status(500).json({
                error: "Internal Server Error.."
            })
        }
    }
}
export default authController