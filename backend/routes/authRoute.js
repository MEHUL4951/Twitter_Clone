import express from 'express'
import authController from '../controllers/authController.js'
import  isAuthenticated  from '../middlewares/isAuthenticated.js'
const router = express.Router()
router.post('/signup',authController.signup)
router.post('/login',authController.login)
router.get('/logout',authController.logout)
router.get('/me',isAuthenticated,authController.getMe)
export default router