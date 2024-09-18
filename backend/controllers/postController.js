import Notification from "../models/notificationModel.js"
import Post from "../models/postModel.js"
import User from "../models/userModel.js"

import { v2 as cloudinary } from 'cloudinary'
class postController {
    static createPost = async (req, res) => {
        try {
            const { text } = req.body
            let { img } = req.body
            const userId = req.user?._id.toString()
            const user = await User.findById(userId)
            if (!user) {
                return res.status(404).json({ error: 'User not found' })
            }
            if (!text && !img) {
                return res.status(400).json({ error: 'Post must have text or image' })
            }
            if (img) {
                const uploadedRes = await cloudinary.uploader.upload(img)
                img = uploadedRes.secure_url
            }
            const newPost = new Post({
                user: userId,
                text,
                img,
            })
            await newPost.save()
            return res.status(201).json(newPost)

        } catch (err) {
            res.status(500).json({ error: err.message })
            console.log(err)

        }
    }
    static likeUnlikePost = async (req, res) => {
        try {
            const { id } = req.params
            const userId = req.user?._id
            const post = await Post.findById(id)
            const isLike = post.likes.includes(userId)
            if (isLike) {
                await post.updateOne({ $pull: { likes: userId } })
                await User.updateOne({ _id: userId }, { $pull: { likedPosts: id } })
                // const updatedLikes = post.likes.filter((id)=>id.toString() !== userId.toString())
                // console.log(updatedLikes)
                return res.status(201).json({
                    value:1
                })
               
            } else {
                await post.updateOne({ $push: { likes: userId } })
                await User.updateOne({ _id: userId }, { $push: { likedPosts: id } })
                const notification = new Notification({
                    from: userId,
                    to: post.user,
                    type: "like"
                })
                await notification.save()
                // const updatedLikes = post.likes;
                // console.log()
                return res.status(201).json({
                    value : 2
                })
            }

        } catch (err) {
            res.status(500).json({ error: err.message })
            console.log(err)
        }
    }
    static commentOnPost = async (req, res) => {
        try {
            const { id } = req.params
            const userId = req.user._id
            const { text } = req.body
            if (!text) {
                return res.status(400).json({ error: 'Text field is required' })
            }
            const post = await Post.findById(id)
            if (!post) {
                return res.status(404).json({
                    error:
                        'Post not found'
                })
            }
            const comment = { user: userId, text }
            post.comments.push(comment)
            await post.save()
            return res.status(200).json(post)



        } catch (err) {
            res.status(500).json({ error: "Internal server error" })
            console.log(err)
        }
    }
    static deletePost = async (req, res) => {
        try {
            const post = await Post.findById(req.params.id)
            if (!post) {
                return res.status(404).json({ error: 'Post not found' })
            }
            if (post.user.toString() !== req.user._id.toString()) {
                return res.status(401).json({ error: 'You are not authorized to delete this post' })
            }
            if (post.img) {
                const imgId = post.img.split("/").pop().split(".")[0]
                await cloudinary.uploader.destroy(imgId)
            }
            await Post.findByIdAndDelete(req.params.id)
            return res.status(200).json({ message: 'Post deleted successfully' })
        } catch (err) {
            console.log("Error in deletePost controller ", err)
            res.status(500).json({ error: 'Internal server error' })

        }
    }
    static getAllPosts = async (req, res) => {
        try {
            const posts = await Post.find().sort({ createdAt: -1 }).populate({
                path: 'user',
                select: '-password'
            }).populate({
                path: "comments.user",
                select: "-password"
            })

            if (posts.length === 0) {
                return res.status(200).json([])
            }
            return res.status(200).json(posts)
        } catch (err) {
            console.log(err.message)
            res.status(500).json({ error: 'Internal server error' })
        }
    }
    static getLikedPosts = async (req, res) => {
        try {
            const userId = req.params.id
            const user = await User.findById(userId)
            if (!user) {
                return res.status(404).json({ error: 'User not found' })
            }
            const posts = await Post.find({ _id: { $in: user?.likedPosts } }).populate({
                path: 'user',
                select: '-password',
            }).populate({
                path: 'comments.user',
                select: '-password',
            })
            res.status(200).json(posts)

        } catch (err) {
            console.log(err.message)
            res.status(500).json({ error: 'Internal server error' })

        }
    }
    static getFollowingPosts = async (req, res) => {
        try {
            const userId = req.user._id
            const user = await User.findById(userId)
            if (!user) {
                return res.status(404).json({
                    error:
                        'User not found'
                })
            }
            const following = user.following
            const feedPosts = await Post.find({ user: { $in: following } }).sort({ createdAt: -1 })
                .populate({
                    path: 'user',
                    select: '-password',
                }).populate({
                    path: 'comments.user',
                    select: '-password'
                })
            return res.status(200).json(feedPosts)

        } catch (err) {
            console.log(err.message)
            res.status(500).json({ error: 'Internal server error' })
        }
    }
    static getUserPosts = async (req,res)=>{
        try{
            const {username} = req.params
            const  user = await User.findOne({username})
            if(!user)return res.status(404).json({error:'User not found'})
            const posts = await Post.find({user:user._id}).sort({createdAt:-1}).populate({
                path: 'user',
                select: '-password',
            }).populate({
                path: 'comments.user',
                select: '-password'
            })
           return res.status(200).json(posts)
        }catch(err){
            console.log(err.message)
            res.status(500).json({ error: 'Internal server error' })
        }
    }

}
export default postController