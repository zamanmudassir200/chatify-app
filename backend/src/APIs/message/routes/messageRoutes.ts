import { Router } from 'express'
import authenticate from '../../../middlewares/authenticate'
import messageController from '../controllers/messageController'
const router = Router()

router.route('/').get(authenticate, messageController.getAllMessages)

export default router
