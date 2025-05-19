import { Router } from 'express'
import authenticate from '../../../middlewares/authenticate'
import messageController from '../controllers/messageController'
const router = Router()

router.route('/').get(authenticate, messageController.getAllMessages)
router.route('/sendMessage/:chatId').post(authenticate, messageController.sendMessage)
router.route('/:chatId').get(authenticate, messageController.getAllMessagesByChatId)

export default router
