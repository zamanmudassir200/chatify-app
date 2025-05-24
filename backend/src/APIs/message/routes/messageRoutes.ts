import { Router } from 'express'
import authenticate from '../../../middlewares/authenticate'
import messageController from '../controllers/messageController'
const router = Router()

router.get('/:chatId', authenticate, messageController.getAllMessagesForAChat)
router.route('/sendMessage/:chatId').post(authenticate, messageController.sendMessage)
// router.route('/:chatId').get(authenticate, messageController.getAllMessagesByChatId)
router.delete('/:messageId', authenticate, messageController.deleteMessage)
router.put('/:messageId', authenticate, messageController.editMessage)

export default router
