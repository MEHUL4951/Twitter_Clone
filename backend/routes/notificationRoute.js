import express from 'express'
import isAuthenticated from '../middlewares/isAuthenticated.js'
import { notificationController } from '../controllers/notificationController.js'
const router = express.Router()
router.use(isAuthenticated)
router.get('/',notificationController.getNotifications)
router.delete('/',notificationController.deleteNotifications)
router.delete('/:id',notificationController.deleteNotification)
export default router
