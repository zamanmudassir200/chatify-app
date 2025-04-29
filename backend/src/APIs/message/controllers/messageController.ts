import asyncHandler from '../../../handlers/async'
import { Request, Response, NextFunction } from 'express'
import httpError from '../../../handlers/errorHandler/httpError'
import { Types } from 'mongoose' // make sure you have this at the top

import messageModel, { IMessage } from '../models/messageModel'
import { IUserWithId } from '../../user/_shared/types/users.interface'
import userModel from '../../user/_shared/models/user.model'
import chatModel from '../../chat/models/chatModel'
interface IAuthenticateRequest2 extends Request {
    authenticatedUser: IUserWithId
}
export default {
    getAllMessages: asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
        try {
            const messages = await messageModel.find()
            console.log('messages', messages)
            response.status(200).json({ Allmessage: 'all messages', messages, success: true })
        } catch (error) {
            httpError(next, error, request, 500)
        }
    }),
    sendMessage: asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
        try {
            const req = request as IAuthenticateRequest2
            const user = req.authenticatedUser
            const { chatId } = req.params
            const { content } = req.body

            // Check for empty message
            if (!content) {
                response.status(400).json({ message: "Message can't be empty", success: false })
            }

            // Check if user exists
            const loginUser = await userModel.findById(user._id)
            if (!loginUser) {
                response.status(404).json({ message: 'Unauthorized! User not found', success: false })
            }

            // Check if chat exists
            const existingChat = await chatModel.findById(chatId)
            if (!existingChat) {
                response.status(404).json({ message: 'Chat not found', success: false })
            }

            // Create the message
            const createMessage: IMessage = await messageModel.create({
                sender: loginUser?._id,
                content,
                chat: existingChat?._id
            })

            // Update latest message in the chat
            if (existingChat) {
                existingChat.latestMessage = createMessage._id as Types.ObjectId
                await existingChat.save()
            }

            // Success response
            response.status(200).json({
                message: 'Message sent',
                success: true,
                chat: existingChat,
                msg: createMessage
            })
        } catch (error) {
            httpError(next, error, request, 500)
        }
    }),
    getMessagesByChatId: asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { chatId } = req.params

            const messages = await messageModel.find({ chat: chatId }).populate('sender', 'name email')
            res.status(200).json({
                message: 'Messages fetched',
                success: true,
                messages
            })
        } catch (error) {
            httpError(next, error, req, 500)
        }
    })
}
