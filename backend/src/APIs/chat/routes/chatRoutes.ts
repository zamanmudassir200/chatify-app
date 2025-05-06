import { Router } from 'express'
import authenticate from '../../../middlewares/authenticate'
import chatController from '../controllers/chatController'

const router = Router()

// router.route('/').get(authenticate, chatController.getAllChats)
router.route('/accessChat/:userId').post(authenticate, chatController.accessChat)
router.route('/fetchChats').get(authenticate, chatController.fetchChats)

router.route('/:chatId').delete(authenticate, chatController.deleteChat)

router.route('/addUserIntoChat/:userId').post(authenticate, chatController.addUserIntoChat)
router.route('/getAllChatsByUser').get(authenticate, chatController.getAllChatsByUser)

router.route('/searchChats').get(authenticate, chatController.searchChats)
export default router
