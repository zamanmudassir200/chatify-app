import asyncHandler from '../../../handlers/async'
import { Request, Response, NextFunction } from 'express'
import httpError from '../../../handlers/errorHandler/httpError'
import { Types } from 'mongoose' // make sure you have this at the top

import messageModel from '../models/messageModel'
import { IUserWithId } from '../../user/_shared/types/users.interface'

import chatModel from '../../chat/models/chatModel'
interface IAuthenticateRequest2 extends Request {
    authenticatedUser: IUserWithId
}
export default {
    getAllMessages: asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
        try {
            const messages = await messageModel.find()
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
                return
            }

            // Check if chat exists
            const existingChat = await chatModel.findById(chatId)
            if (!existingChat) {
                response.status(404).json({ message: 'Chat not found', success: false })
                return
            }

            // Create the message
            let newMessage = await messageModel.create({
                sender: user?._id,
                content,
                chat: existingChat._id
            })

            // Update latestMessage in chat
            existingChat.latestMessage = newMessage._id as Types.ObjectId
            await existingChat.save()

            // Re-fetch and populate the message with nested chat data
            const foundMessage = await messageModel
                .findById(newMessage._id)
                .populate('sender', '-password')
                .populate({
                    path: 'chat',
                    populate: [
                        { path: 'users', select: '-password' },
                        {
                            path: 'latestMessage',
                            populate: { path: 'sender', select: '-password' }
                        }
                    ]
                })

            if (!foundMessage) {
                response.status(404).json({ message: 'Message not found after creation', success: false })
                return
            }

            newMessage = foundMessage // Now it's safe

            // Send response
            response.status(200).json({
                message: 'Message sent',
                success: true,
                msg: newMessage
            })
        } catch (error) {
            httpError(next, error, request, 500)
        }
    }),
    getAllMessagesByChatId: asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { chatId } = req.params

            const messages = await messageModel.find({ chat: chatId }).populate('sender', 'name email profilePic').populate('chat')
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
