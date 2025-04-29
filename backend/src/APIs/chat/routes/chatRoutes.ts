import { Router } from 'express'
import authenticate from '../../../middlewares/authenticate'
import chatController from '../controllers/chatController'

const router = Router()

router.route('/').get(authenticate, chatController.getAllChats)
router.route('/addUserIntoChat/:userId').post(authenticate, chatController.addUserIntoChat)
router.route('/getAllChatsByUser').get(authenticate, chatController.getAllChatsByUser)
export default router
