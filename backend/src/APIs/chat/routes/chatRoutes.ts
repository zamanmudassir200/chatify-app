import { Router } from 'express'
import authenticate from '../../../middlewares/authenticate'
import chatController from '../controllers/chatController'

const router = Router()

// Access a chat with a user
router.post('/accessChat/:userId', authenticate, chatController.accessChat)

// Fetch all chats for authenticated user
router.get('/fetchChats', authenticate, chatController.fetchChats)

// Delete a chat
router.delete('/:chatId', authenticate, chatController.deleteChat)

// Rename a chat
router.put('/:chatId', authenticate, chatController.renameChat)

// Add a user to a chat
router.post('/addUserIntoChat/:userId', authenticate, chatController.addUserIntoChat)

// Get all chats by a user
router.get('/getAllChatsByUser', authenticate, chatController.getAllChatsByUser)

// Create a group chat
router.post('/createGroup', authenticate, chatController.createGroup)

// Rename a group chat
router.put('/renameGroup/:chatId', authenticate, chatController.renameGroup)

// Add user to a group chat
router.put('/addToGroup/:chatId', authenticate, chatController.addToGroup)

router.get('/searchUser/AddIntoGroup/:chatId', authenticate, chatController.searchUserToAddIntoGroup)
// Remove user from a group chat
router.put('/removeFromGroup/:chatId', authenticate, chatController.removeFromGroup)

// Search chats
router.get('/searchChats', authenticate, chatController.searchChats)

export default router
