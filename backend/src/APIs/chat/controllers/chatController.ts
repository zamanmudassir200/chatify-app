import { Response, Request, NextFunction } from 'express'
import asyncHandler from '../../../handlers/async'
import httpError from '../../../handlers/errorHandler/httpError'
import chatModel from '../models/chatModel'
import { IUserWithId } from '../../user/_shared/types/users.interface'
import userModel from '../../user/_shared/models/user.model'

interface IAuthenticateRequest2 extends Request {
    authenticatedUser: IUserWithId
}
export default {
    getAllChats: asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
        try {
            const allChats = await chatModel.find()
            if (!allChats) {
                response.status(404).json({ message: 'No chats found', success: false })
            }
            response.status(200).json({ message: 'Chats found', count: allChats.length, chats: allChats, success: true })
        } catch (error) {
            httpError(next, error, request, 500)
        }
    }),
    accessChat: asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
        try {
            const req = request as IAuthenticateRequest2
            const user = req.authenticatedUser
            const { userId } = req.params
            const existingUser = await userModel.findById(userId)
            console.log('existing user', existingUser)
            if (!userId) {
                response.status(400).json({ message: 'Userid not available', success: false })
                return
            }

            let isChat = await chatModel
                .find({
                    isGroupChat: false,
                    $and: [{ users: { $elemMatch: { $eq: user._id } } }, { users: { $elemMatch: { $eq: userId } } }]
                })
                .populate('users', '-password')
                .populate('latestMessage')

            // isChat = await userModel.populate(isChat, {
            //     path: 'latestMessage.sender',
            //     select: 'name email profilePic'
            // })

            if (isChat.length > 0) {
                response.status(200).json(isChat)
                return
            } else {
                const chatData = {
                    chatName: existingUser?.name,
                    isGroupChat: false,
                    users: [user._id, userId]
                }

                try {
                    const createdChat = await chatModel.create(chatData)
                    const fullChat = await chatModel.findOne({ _id: createdChat._id }).populate('users', '-password')
                    response.status(201).json({
                        message: 'Chat created',
                        chat: fullChat,
                        success: true
                    })
                    return
                } catch (error) {
                    httpError(next, error, request, 500)
                    return
                }
            }
        } catch (error) {
            httpError(next, error, request, 500)
        }
    }),
    fetchChats: asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
        try {
            const req = request as IAuthenticateRequest2
            const user = req.authenticatedUser
            const chat = await chatModel
                .find({ users: { $elemMatch: { $eq: user._id } } })
                .populate('users', '-password')
                .populate('latestMessage')
                .populate('groupAdmin', '-password')
            if (!chat) {
                response.status(200).json({ message: 'No chat found', success: true })
            }
            response.status(200).json({ message: 'Chat found', chatCount: chat.length, chats: chat, success: true })
            return
        } catch (error) {
            httpError(next, error, request, 500)
            return
        }
    }),
    deleteChat: asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
        try {
            const { chatId } = request.params
            if (!chatId) {
                response.status(404).json({ message: 'Invalid chatId', success: false })
                return
            }
            const chat = await chatModel.findById(chatId)
            if (!chat) {
                response.status(400).json({ message: 'Chat not found', success: false })
                return
            }
            const deletedChat = await chatModel.findByIdAndDelete(chat._id)

            response.status(200).json({ message: 'Chat has been deleted ', deletedChat, success: true })
            return
        } catch (error) {
            httpError(next, error, request, 500)
            return
        }
    }),
    renameChat: asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
        try {
            const { chatId } = request.params
            const { chatName } = request.body
            if (!chatId) {
                response.status(404).json({ message: 'Invalid chatId', success: false })
                return
            }
            if (!chatName) {
                response.status(400).json({ message: 'Chatname is required', success: false })
                return
            }
            const chat = await chatModel.findById(chatId)
            if (!chat) {
                response.status(400).json({ message: 'Chat not found', success: false })
                return
            }
            const renameChat = await chatModel.findByIdAndUpdate(
                { _id: chat._id },
                {
                    chatName: chatName
                },
                {
                    new: true
                }
            )
            response.status(201).json({ message: 'Chat has been renamed', success: true, renameChat })
            return
        } catch (error) {
            httpError(next, error, request, 500)
            return
        }
    }),

    searchChats: asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
        try {
            const req = request as IAuthenticateRequest2
            const user = req.authenticatedUser
            const keyword = req.query.search

            if (!keyword) {
                response.status(404).json({ message: 'Please enter chatName', success: false })
                return
            }

            const searchChats = await chatModel.find({
                chatName: { $regex: keyword, $options: 'i' }, // Search in chat name
                users: { $in: [user._id] } // Only chats where logged-in user is a participant
            })

            response.status(200).json({
                message: 'Search chats found',
                count: searchChats.length,
                searchChats,
                success: true
            })
            return
        } catch (error) {
            httpError(next, error, request as IAuthenticateRequest2, 500)
            return
        }
    }),
    createGroup: asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
        try {
            const req = request as IAuthenticateRequest2
            const user = req.authenticatedUser

            let { chatName, users } = req.body
            if (!chatName || !users) {
                response.status(404).json({ message: 'All fields are required', success: false })
                return
            }
            users = JSON.parse(users)
            if (users.length < 2) {
                response.status(400).json({ message: 'More than 2 users are required to form a group', success: false })
                return
            }
            users.push(user._id)
            const createGroupChat = await chatModel.create({
                chatName: chatName,
                users: users,
                isGroupChat: true,
                groupAdmin: user
            })

            const createdGroupChat = await chatModel
                .findOne({ _id: createGroupChat._id })
                .populate('users', '-password')
                .populate('groupAdmin', '-password')

            response.status(201).json({ message: 'Group chat created', createdGroupChat, success: true })
            return
        } catch (error) {
            httpError(next, error, request, 500)
            return
        }
    }),
    renameGroup: asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
        try {
            const req = request as IAuthenticateRequest2
            const user = req.authenticatedUser

            const { chatId } = req.params
            const { chatName } = req.body
            if (!chatId || !chatName) {
                response.status(400).json({ message: 'All fields are required', success: false })
                return
            }
            const existingGroupChat = await chatModel.findById(chatId)
            if (!existingGroupChat) {
                response.status(400).json({ message: 'Group chat not found', success: false })
                return
            }
            const renameGroup = await chatModel
                .findByIdAndUpdate(
                    { _id: existingGroupChat._id },
                    {
                        chatName: chatName
                    },
                    {
                        new: true
                    }
                )
                .populate('users', '-password')
                .populate('groupAdmin', '-password')

            response.status(201).json({ message: `Group name has been changed by ${user?.name}`, renameGroup, renamedBy: user, success: true })
            return
        } catch (error) {
            httpError(next, error, request, 500)
            return
        }
    }),
    addToGroup: asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
        try {
            const req = request as IAuthenticateRequest2
            // const user = req.authenticatedUser
            const { userId } = req.body
            const { chatId } = req.params
            if (!chatId) {
                response.status(400).json({ message: 'ChatID is required (params)', success: false })
                return
            }
            if (!userId) {
                response.status(400).json({ message: 'All fields are required', success: false })
                return
            }
            const added = await chatModel
                .findByIdAndUpdate(
                    chatId,
                    {
                        $addToSet: { users: userId }
                    },
                    { new: true }
                )
                .populate('users', '-password')
                .populate('groupAdmin', '-password')
            if (!added) {
                response.status(404).json({ message: 'Chat not found', success: false })
                return
            } else {
                response.status(201).json({ message: 'User added to the group', added, success: true })
                return
            }
        } catch (error) {
            httpError(next, error, request, 500)
            return
        }
    }),
    removeFromGroup: asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
        try {
            const req = request as IAuthenticateRequest2
            // const user = req.authenticatedUser
            const { userId } = req.body
            const { chatId } = req.params
            if (!chatId) {
                response.status(400).json({ message: 'ChatID is required (params)', success: false })
                return
            }
            if (!userId) {
                response.status(400).json({ message: 'User id is required', success: false })
                return
            }
            const removed = await chatModel
                .findByIdAndUpdate(
                    chatId,
                    {
                        $pull: { users: userId }
                    },
                    { new: true }
                )
                .populate('users', '-password')
                .populate('groupAdmin', '-password')
            if (!removed) {
                response.status(404).json({ message: 'Chat not found', success: false })
                return
            } else {
                response.status(201).json({ message: 'User removed from the group', removed, success: true })
                return
            }
        } catch (error) {
            httpError(next, error, request, 500)
            return
        }
    }),
    addUserIntoChat: asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
        try {
            const req = request as IAuthenticateRequest2

            const user = req.authenticatedUser
            const { userId } = req.params

            const existingUser = await userModel.findById(userId)

            if (!existingUser) {
                return httpError(next, new Error('User not found'), req, 404)
            }
            if (!user) {
                return httpError(next, new Error('Unauthorized access'), req, 401)
            }
            const createChat = await chatModel.create({
                chatName: existingUser.name,
                users: existingUser._id,
                groupAdmin: user._id
            })

            const updatedUser = await userModel.findByIdAndUpdate(
                user._id,
                {
                    $addToSet: { chats: createChat._id }
                },
                { new: true }
            )
            response.status(200).json({ message: 'user added to chat', updatedUser })
        } catch (error) {
            httpError(next, error, request, 500)
        }
    }),
    getAllChatsByUser: asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
        try {
            const req = request as IAuthenticateRequest2

            const user = req.authenticatedUser

            const loginUser = await userModel.findById(user._id).populate({
                path: 'chats',
                populate: {
                    path: 'users',
                    model: 'user', // make sure this matches your model name
                    select: '-password' // optional: exclude password
                }
            })

            response.status(200).json({ message: 'login user with chats', loginUser })
        } catch (error) {
            httpError(next, error, request, 500)
        }
    })
    // removeUserFromChat: asyncHandler(async (request: IAuthenticateRequest, response: Response, next: NextFunction) => {
    //     try {
    //         const user = request.authenticatedUser
    //         const { userId } = request.params
    //         if (!user) {
    //             return httpError(next, new Error('Unauthorized access'), request, 401)
    //         }

    //         const updatedUser = await userModel.findByIdAndDelete(
    //             user._id,

    //             { new: true }
    //         )
    //         console.log(updatedUser)
    //         response.status(200).json({ message: 'user added to chat' })
    //     } catch (error) {
    //         httpError(next, error, request, 500)
    //     }
    // })
}
