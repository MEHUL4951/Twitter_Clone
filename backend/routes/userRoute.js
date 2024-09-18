import express from 'express'
import isAuthenticated from '../middlewares/isAuthenticated.js'
import userController from '../controllers/userController.js'
const router = express.Router()
router.use(isAuthenticated)
router.get('/profile/:username',userController.getUserProfile)
router.get('/suggested',userController.getSuggestedUsers)
router.get('/follow/:id',userController.followUnfollowUser)
router.put('/update',userController.updateUser)
router.get('/getfollowing/:id',userController.getfollowingUser)
export default router