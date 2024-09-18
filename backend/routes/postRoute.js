import express from 'express'
import postController from '../controllers/postController.js'
import isAuthenticated from '../middlewares/isAuthenticated.js'
const router = express.Router()
router.use(isAuthenticated)
router.get("/all",postController.getAllPosts)
router.get("/following",postController.getFollowingPosts)
router.get("/user/:username",postController.getUserPosts)
router.get("/likes/:id",postController.getLikedPosts)
router.post('/create',postController.createPost)
router.get('/like/:id',postController.likeUnlikePost)
router.delete('/:id',postController.deletePost)
router.post('/comment/:id',postController.commentOnPost)
export default router