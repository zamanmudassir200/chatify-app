import { Router } from 'express'
import managementController from './management.controller'
import authenticate from '../../../middlewares/authenticate'
import rateLimiter from '../../../middlewares/rateLimiter'

const router = Router()

router.route('/me').get(rateLimiter, authenticate, managementController.me)
router.route('/getAllUsers').get(authenticate, managementController.getAllUsers)
router.route('/searchUser').get(authenticate, managementController.searchUser)
export default router

