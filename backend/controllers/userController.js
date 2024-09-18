
import Notification from "../models/notificationModel.js";
import User from "../models/userModel.js";
import {v2 as cloudinary} from 'cloudinary'
import bcrypt from 'bcryptjs'
class userController
{
    static getUserProfile = async (req,res)=>{
        try{
            const username = req?.params?.username
            const user = await User.findOne({username}).select("-password")
            if(!user){
                return res.status(404).json({error:"User not found"})
            }
            return res.status(200).json({user})

        }catch(err){
            console.log("error in getUserProfile" , err.message)
            res.status(500).json({error:err.message})
        }
    }
    static followUnfollowUser = async (req,res)=>{
        try{
            const {id} = req.params
            const loggedUserId = req.user._id.toString()
            const loggedUser = await User.findById(loggedUserId)
            const followingUser = await User.findById(id)
            if(id === loggedUserId){
                return res.status(400).json({error:"You can't follow/unfollow yourself"})
            }

            if(!loggedUser || !followingUser ){
                return res.status(404).json({error:"User not found"})
            }
            const isFollowing = loggedUser.following.includes(id)
            if(isFollowing){
                await loggedUser.updateOne({$pull:{following:id}})
                await followingUser.updateOne({$pull:{followers:loggedUserId}})
                return res.status(200).json({
                    message:`${loggedUser.username} unfollow ${followingUser.username}`
                })

            }else{
                await loggedUser.updateOne({$push:{following:id}})
                await followingUser.updateOne({$push:{followers:loggedUserId}})
                const newNotification = new Notification({
                    type:'follow',
                    from:loggedUserId,
                    to:id
                })
                await newNotification.save()
                return res.status(200).json({
                    message:`${loggedUser.username} follow ${followingUser.username}`
                })
            }


        }catch(err){
            console.log("error in followUnfollowUser" , err.message)
            res.status(500).json({error:err.message})
        }
    }
    static getfollowingUser = async (req,res)=>{
        try{
            const {id} = req.params
            const followingUser = await User.findById(id).populate({
                path:'following',
                select:['profileImg','username','fullName']
            })
            res.json(followingUser.following)
           
        }catch(err){
            console.log("error in getfollowingUser" , err.message)
            res.status(500).json({error:err.message})
        }

    }
    static getSuggestedUsers = async(req,res)=>{
        try{
           const userId = req.user._id
           const userFollowedByMe = await User.findById(userId).select('following')
           const users = await User.aggregate([
            {
                $match:{
                    _id:{$ne:userId}
                }
            },
            {
                $sample:{
                    size:10
                }
            }
           ])
           const filteredUsers = users.filter(user=>!userFollowedByMe.following.includes(user._id))
           const suggestedUsers = filteredUsers.slice(0,4)
           suggestedUsers.forEach(user=>user.password=null)
           return res.status(200).json({suggestedUsers})
        }catch(err){
            console.log("error in suggestedUser" , err.message)
            res.status(500).json({error:err.message})

        }
    }
    static updateUser = async (req,res)=>{
        try{
            const {fullname , username , email,currentPassword,newPassword,bio,link} = req.body
            let {profileImg , coverImg}  = req.body
            const userId = req.user._id
            let  user = await User.findById(userId)
            if(!user){
                return res.status(404).json({error:"User not found"})
            }
            if((!newPassword && currentPassword) || (!currentPassword && newPassword)){
                return res.status(400).json({error:"Please provide both current password and new password"})
            }
            if(currentPassword && newPassword){
                const isMatch = await bcrypt.compare(currentPassword,user.password)
                if(!isMatch){
                    return res.status(400).json({
                        error: "Current password is incorrect"
                    })
                }
                if(newPassword < 6){
                    return res.status(400).json({error:"Password must be at least 6 characters long"})
                }
                user.password = await bcrypt.hash(newPassword,16)
            }

            if(profileImg){
                if(user.profileImg){
                    await cloudinary.uploader.destroy(user.profileImg.split("/").pop().split(".")[0])
                }
                const uploadedRes = await cloudinary.uploader.upload(profileImg)
                profileImg = uploadedRes.secure_url

            }
            if(coverImg){
                if(user.coverImg){
                    await cloudinary.uploader.destroy(user.profileImg.split("/").pop().split(".")[0])
                }
                const uploadedRes = await cloudinary.uploader.upload(coverImg)
                coverImg = uploadedRes.secure_url

            }
            user.fullName = fullname || user.fullName
            user.email = email || user.email
            user.username = username || user.username
            user.bio = bio || user.bio
            user.link = link || user.link
            user.profileImg = profileImg || user.profileImg
            user.coverImg = coverImg || user.coverImg
            user = await user.save()
            user.password = null
            return res.status(200).json({
                message:"Profile Update Successfully"
            })


        }catch(err){
            console.log("error in updateUser" , err.message)
            res.status(500).json({error:err.message})
        }
    }
}
export default userController