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
    // accessChat: asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
    //     try {
    //         const req = request as IAuthenticateRequest2
    //         const user = req.authenticatedUser
    //         const { userId } = req.params
    //         const existingUser = await userModel.findById(userId)

    //         if (!userId && !existingUser) {
    //             response.status(400).json({ message: 'Userid not available', success: false })
    //             return
    //         }

    //         // let isChat = await chatModel
    //         //     .find({
    //         //         isGroupChat: false,
    //         //         $and: [{ users: { $elemMatch: { $eq: user._id } } }, { users: { $elemMatch: { $eq: userId } } }]
    //         //     })
    //         //     .populate('users', '-password')
    //         //     .populate('latestMessage')
    //         // let isChat = await chatModel
    //         //     .find({
    //         //         isGroupChat: false,
    //         //         users: { $elemMatch: { $eq: user._id } }
    //         //     })
    //         //     .populate('users', '-password')
    //         //     .populate('latestMessage')
    //         // isChat = await userModel.populate(isChat, {
    //         //     path: 'latestMessage.sender',
    //         //     select: 'name email profilePic'
    //         // })

    //         // if (isChat.length > 0) {
    //         //     response.status(200).json({ chats: isChat })
    //         //     return
    //         // } else {
    //         const chatData = {
    //             chatName: existingUser?.name,
    //             isGroupChat: false,
    //             users: [user._id, userId]
    //         }

    //         try {
    //             const createdChat = await chatModel.create(chatData)
    //             const fullChat = await chatModel.findOne({ _id: createdChat._id }).populate('users', '-password')
    //             response.status(201).json({
    //                 message: 'Chat created',
    //                 chat: fullChat,
    //                 success: true
    //             })

    //             const chatSaved = await userModel.findByIdAndUpdate(
    //                 user._id,
    //                 {
    //                     $addToSet: { chats: fullChat?._id }
    //                 },
    //                 {
    //                     new: true
    //                 }
    //             )
    //             await chatSaved?.save()
    //             return
    //         } catch (error) {
    //             httpError(next, error, request, 500)
    //             return
    //         }
    //     } catch (error) {
    //         httpError(next, error, request, 500)
    //     }
    // }),
    // accessChat: asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
    //     try {
    //         const req = request as IAuthenticateRequest2
    //         const user = req.authenticatedUser
    //         const { userId } = req.params

    //         // Validate userId
    //         if (!userId) {
    //             response.status(400).json({
    //                 message: 'User ID is required',
    //                 success: false
    //             })
    //             return
    //         }

    //         // Check if the other user exists
    //         const existingUser = await userModel.findById(userId)
    //         if (!existingUser) {
    //             response.status(404).json({
    //                 message: 'User not found',
    //                 success: false
    //             })
    //             return
    //         }

    //         // Check for existing chat between these users
    //         const existingChat = await chatModel
    //             .findOne({
    //                 isGroupChat: false,
    //                 users: { $all: [user._id, userId] }
    //             })
    //             .populate('users', '-password')
    //             .populate('latestMessage')

    //         if (existingChat) {
    //             response.status(200).json({
    //                 message: 'Existing chat found',
    //                 chat: existingChat,
    //                 success: true
    //             })
    //             return
    //         }

    //         // Create new chat if none exists
    //         const chatData = {
    //             chatName: existingUser.name,
    //             isGroupChat: false,
    //             users: [user._id, userId]
    //         }

    //         const createdChat = await chatModel.create(chatData)
    //         const fullChat = await chatModel.findOne({ _id: createdChat._id }).populate('users', '-password')

    //         // Update both users' chat lists
    //         await userModel.findByIdAndUpdate(user._id, { $addToSet: { chats: createdChat._id } }, { new: true })

    //         await userModel.findByIdAndUpdate(userId, { $addToSet: { chats: createdChat._id } }, { new: true })

    //         response.status(201).json({
    //             message: 'New chat created',
    //             chat: fullChat,
    //             success: true
    //         })
    //         return
    //     } catch (error) {
    //         httpError(next, error, request, 500)
    //     }
    // }),

    // accessChat: asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
    //     try {
    //         const req = request as IAuthenticateRequest2
    //         const user = req.authenticatedUser
    //         const { userId } = req.params

    //         // Validate userId
    //         if (!userId) {
    //             response.status(400).json({
    //                 message: 'User ID is required',
    //                 success: false
    //             })
    //             return
    //         }

    //         // Check if the other user exists
    //         const existingUser = await userModel.findById(userId)
    //         if (!existingUser) {
    //             response.status(404).json({
    //                 message: 'User not found',
    //                 success: false
    //             })
    //             return
    //         }

    //         // Check for existing chat between these users
    //         const existingChat = await chatModel
    //             .findOne({
    //                 isGroupChat: false,
    //                 users: { $all: [user._id, userId] }
    //             })
    //             .populate('users', '-password')
    //             .populate('latestMessage')

    //         // ✅ Check if both users still have this chat
    //         const userHasChat = await userModel.findOne({ _id: user._id, chats: existingChat?._id })
    //         const otherUserHasChat = await userModel.findOne({ _id: userId, chats: existingChat?._id })

    //         if (existingChat && userHasChat && otherUserHasChat) {
    //             response.status(200).json({
    //                 message: 'Existing chat found',
    //                 chat: existingChat,
    //                 success: true
    //             })
    //             return
    //         }

    //         // Create new chat if none exists or chat was removed from either user's list
    //         const chatData = {
    //             chatName: existingUser.name,
    //             isGroupChat: false,
    //             users: [user._id, userId]
    //         }

    //         const createdChat = await chatModel.create(chatData)
    //         const fullChat = await chatModel.findOne({ _id: createdChat._id }).populate('users', '-password')

    //         // Update both users' chat lists
    //         await userModel.findByIdAndUpdate(user._id, { $addToSet: { chats: createdChat._id } }, { new: true })
    //         await userModel.findByIdAndUpdate(userId, { $addToSet: { chats: createdChat._id } }, { new: true })

    //         response.status(201).json({
    //             message: 'New chat created',
    //             chat: fullChat,
    //             success: true
    //         })
    //         return
    //     } catch (error) {
    //         httpError(next, error, request, 500)
    //     }
    // }),

    // accessChat: asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
    //     try {
    //         const req = request as IAuthenticateRequest2
    //         const user = req.authenticatedUser
    //         const { userId } = req.params

    //         // Validate userId
    //         if (!userId) {
    //             response.status(400).json({
    //                 message: 'User ID is required',
    //                 success: false
    //             })
    //             return
    //         }

    //         // Check if the other user exists
    //         const existingUser = await userModel.findById(userId)
    //         if (!existingUser) {
    //             response.status(404).json({
    //                 message: 'User not found',
    //                 success: false
    //             })
    //             return
    //         }

    //         // Check for existing chat between these users
    //         const existingChat = await chatModel
    //             .findOne({
    //                 isGroupChat: false,
    //                 users: { $all: [user._id, userId] }
    //             })
    //             .populate('users', '-password')
    //             .populate('latestMessage')

    //         const userHasChat = await userModel.findOne({ _id: user._id, chats: existingChat?._id })
    //         const otherUserHasChat = await userModel.findOne({ _id: userId, chats: existingChat?._id })

    //         if (existingChat && userHasChat && otherUserHasChat) {
    //             response.status(200).json({
    //                 message: 'Existing chat found',
    //                 chat: existingChat,
    //                 success: true
    //             })
    //             return
    //         }

    //         // Create new chat
    //         const chatData = {
    //             chatName: existingUser.name,
    //             isGroupChat: false,
    //             users: [user._id, userId]
    //         }

    //         const createdChat = await chatModel.create(chatData)
    //         const fullChat = await chatModel.findOne({ _id: createdChat._id }).populate('users', '-password')

    //         // ✅ Only add chat to current user's list for now
    //         await userModel.findByIdAndUpdate(user._id, { $addToSet: { chats: createdChat._id } }, { new: true })

    //         // ❌ Do NOT update other user's chats yet (wait until first message is sent)

    //         response.status(201).json({
    //             message: 'New chat created',
    //             chat: fullChat,
    //             success: true
    //         })
    //         return
    //     } catch (error) {
    //         httpError(next, error, request, 500)
    //     }
    // }),

    // accessChat: asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
    //     try {
    //         const req = request as IAuthenticateRequest2
    //         const user = req.authenticatedUser
    //         const { userId } = req.params

    //         if (!userId) {
    //             response.status(400).json({ message: 'User ID is required', success: false })
    //             return
    //         }

    //         const existingUser = await userModel.findById(userId)
    //         if (!existingUser) {
    //             response.status(404).json({ message: 'User not found', success: false })
    //             return
    //         }

    //         // Check if a chat already exists between both users
    //         let existingChat = await chatModel
    //             .findOne({
    //                 isGroupChat: false,
    //                 users: { $all: [user._id, userId] }
    //             })
    //             .populate('users', '-password')
    //             .populate('latestMessage')

    //         if (existingChat) {
    //             const userHasChat = await userModel.findOne({ _id: user._id, chats: existingChat._id })
    //             await userModel.findOne({ _id: userId, chats: existingChat._id })

    //             // ✅ If current user doesn't have the chat in their list, add it
    //             if (!userHasChat) {
    //                 await userModel.findByIdAndUpdate(user._id, {
    //                     $addToSet: { chats: existingChat._id }
    //                 })
    //             }

    //             response.status(200).json({
    //                 message: 'Existing chat found',
    //                 chat: existingChat,
    //                 success: true
    //             })
    //             return
    //         }

    //         // 🔧 Chat doesn't exist => create new one
    //         const chatData = {
    //             chatName: existingUser.name,
    //             isGroupChat: false,
    //             users: [user._id, userId]
    //         }

    //         const createdChat = await chatModel.create(chatData)
    //         const fullChat = await chatModel.findById(createdChat._id).populate('users', '-password')

    //         // ✅ Only add to current user's chat list
    //         await userModel.findByIdAndUpdate(user._id, {
    //             $addToSet: { chats: createdChat._id }
    //         })

    //         response.status(201).json({
    //             message: 'New chat created',
    //             chat: fullChat,
    //             success: true
    //         })
    //         return
    //     } catch (error) {
    //         httpError(next, error, request, 500)
    //     }
    // }),

    // accessChat: asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
    //     try {
    //         const req = request as IAuthenticateRequest2
    //         const user = req.authenticatedUser
    //         const { userId } = req.params

    //         if (!userId) {
    //             response.status(400).json({ message: 'User ID is required', success: false })
    //             return
    //         }

    //         const existingUser = await userModel.findById(userId)
    //         if (!existingUser) {
    //             response.status(404).json({ message: 'User not found', success: false })
    //             return
    //         }

    //         // Check if a chat already exists between both users
    //         let existingChat = await chatModel
    //             .findOne({
    //                 isGroupChat: false,
    //                 users: { $all: [user._id, userId] }
    //             })
    //             .populate('users', '-password')
    //             .populate('latestMessage')

    //         if (existingChat) {
    //             const userHasChat = await userModel.findOne({ _id: user._id, chats: existingChat._id })
    //             await userModel.findOne({ _id: userId, chats: existingChat._id })

    //             if (!userHasChat) {
    //                 await userModel.findByIdAndUpdate(user._id, {
    //                     $addToSet: { chats: existingChat._id }
    //                 })
    //             }

    //             const otherUser = existingChat.users.find((u: any) => u._id.toString() !== user._id.toString())
    //             const chatName = otherUser && typeof otherUser === 'object' && 'name' in otherUser ? (otherUser as IUser).name : 'Chat'

    //             response.status(200).json({
    //                 message: 'Existing chat found',
    //                 chat: {
    //                     ...existingChat.toObject(),
    //                     chatName
    //                 },
    //                 success: true
    //             })
    //             return
    //         }

    //         // 🔧 Chat doesn't exist => create new one
    //         const chatData = {
    //             chatName: existingUser.name, // Leave blank; dynamically set later
    //             isGroupChat: false,
    //             users: [user._id, userId]
    //         }

    //         const createdChat = await chatModel.create(chatData)
    //         const fullChat = await chatModel.findById(createdChat._id).populate('users', '-password')

    //         await userModel.findByIdAndUpdate(user._id, {
    //             $addToSet: { chats: createdChat._id }
    //         })

    //         const otherUser = fullChat?.users.find((u: any) => u._id.toString() !== user._id.toString())
    //         const chatName = otherUser && typeof otherUser === 'object' && 'name' in otherUser ? (otherUser as IUser).name : 'Chat'

    //         response.status(201).json({
    //             message: 'New chat created',
    //             chat: {
    //                 ...fullChat?.toObject(),
    //                 chatName: chatName
    //             },
    //             success: true
    //         })
    //         return
    //     } catch (error) {
    //         httpError(next, error, request, 500)
    //     }
    // }),

    accessChat: asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
        try {
            const req = request as IAuthenticateRequest2
            const user = req.authenticatedUser
            const { userId } = req.params

            if (!userId) {
                response.status(400).json({ message: 'User ID is required', success: false })
                return
            }

            const existingUser = await userModel.findById(userId)
            if (!existingUser) {
                response.status(404).json({ message: 'User not found', success: false })
                return
            }

            // Check if a chat already exists between both users
            let existingChat = await chatModel
                .findOne({
                    isGroupChat: false,
                    users: { $all: [user._id, userId] }
                })
                .populate<{ users: IUserWithId[] }>('users', '-password') // Explicitly type the populated users
                .populate('latestMessage')

            if (existingChat) {
                const userHasChat = await userModel.findOne({ _id: user._id, chats: existingChat._id })
                await userModel.findOne({ _id: userId, chats: existingChat._id })

                if (!userHasChat) {
                    await userModel.findByIdAndUpdate(user._id, {
                        $addToSet: { chats: existingChat._id }
                    })
                }

                const otherUser = existingChat.users.find((u: IUserWithId) => u._id.toString() !== user._id.toString())
                const chatName = otherUser?.name || 'Chat'

                response.status(200).json({
                    message: 'Existing chat found',
                    chat: {
                        ...existingChat.toObject(),
                        chatName
                    },
                    success: true
                })
                return
            }

            // Create new chat
            const chatData = {
                chatName: 'sender', // Temporary value
                isGroupChat: false,
                users: [user._id, userId]
            }

            const createdChat = await chatModel.create(chatData)
            const fullChat = await chatModel.findById(createdChat._id).populate<{ users: IUserWithId[] }>('users', '-password')

            await userModel.findByIdAndUpdate(user._id, {
                $addToSet: { chats: createdChat._id }
            })

            // Set chatName to the other user's name
            const otherUser = fullChat?.users.find((u: IUserWithId) => u._id.toString() !== user._id.toString())
            const chatName = otherUser?.name || 'Chat'

            // Update the chat with the correct chatName
            await chatModel.findByIdAndUpdate(createdChat._id, {
                chatName: chatName
            })

            response.status(201).json({
                message: 'New chat created',
                chat: {
                    ...fullChat?.toObject(),
                    chatName: chatName
                },
                success: true
            })
            return
        } catch (error) {
            httpError(next, error, request, 500)
        }
    }),

    // fetchChats: asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
    //     try {
    //         const req = request as IAuthenticateRequest2
    //         const user = req.authenticatedUser

    //         // Get all chats where user is part of
    //         // const chats = await chatModel
    //         //     .find({ users: user._id })
    //         //     .populate('users', '-password')
    //         //     .populate('latestMessage')
    //         //     .populate('groupAdmin', '-password')
    //         //     .sort({ updated: -1 })

    //         // Get user with populated chats
    //         const userWithChats = await userModel
    //             .findById(user._id)
    //             .populate({
    //                 path: 'chats',
    //                 populate: [{ path: 'users', select: '-password' }, { path: 'latestMessage' }, { path: 'groupAdmin', select: '-password' }]
    //             })
    //             .sort({ 'chats.updatedAt': -1 })

    //         const chats = userWithChats?.chats || []
    //         response.status(200).json({
    //             message: chats.length ? 'Chats found' : 'No chats found',
    //             chatCount: chats.length,
    //             chats: chats,
    //             success: true
    //         })
    //         return
    //     } catch (error) {
    //         httpError(next, error, request, 500)
    //         return
    //     }
    // }),

    fetchChats: asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
        try {
            const req = request as IAuthenticateRequest2
            const user = req.authenticatedUser

            // Get user with populated chats
            const userWithChats = await userModel
                .findById(user._id)
                .populate({
                    path: 'chats',
                    populate: [{ path: 'users', select: '-password' }, { path: 'latestMessage' }, { path: 'groupAdmin', select: '-password' }]
                })
                .sort({ 'chats.updatedAt': -1 })

            if (!userWithChats) {
                response.status(404).json({ message: 'User not found', success: false })
                return
            }

            // Process each chat to set the correct chatName
            const processedChats = userWithChats.chats.map((chat: any) => {
                // For group chats, use the stored chatName
                if (chat.isGroupChat) {
                    return chat
                }

                // For 1:1 chats, find the other user and use their name
                const otherUser = chat.users.find((u: any) => u._id.toString() !== user._id.toString())
                const chatName = otherUser?.name || 'Chat'

                return {
                    ...chat.toObject(),
                    chatName: chatName
                }
            })

            response.status(200).json({
                message: processedChats.length ? 'Chats found' : 'No chats found',
                chatCount: processedChats.length,
                chats: processedChats,
                success: true
            })
            return
        } catch (error) {
            httpError(next, error, request, 500)
            return
        }
    }),
    deleteChat: asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
        try {
            const req = request as IAuthenticateRequest2
            const user = req.authenticatedUser
            const { chatId } = req.params

            // Validate chatId
            if (!chatId) {
                response.status(400).json({
                    message: 'Chat ID is required',
                    success: false
                })
                return
            }

            // Verify the chat exists and user is a participant
            const chat = await chatModel.findOne({
                _id: chatId,
                users: user._id
            })

            if (!chat) {
                response.status(404).json({
                    message: 'Chat not found or you are not a participant',
                    success: false
                })
                return
            }

            // Remove chat from this user's chat list
            await userModel.findByIdAndUpdate(user._id, { $pull: { chats: chatId } }, { new: true })

            // ✅ Check if other user also deleted the chat
            const otherParticipants = await chatModel.findById(chatId).select('users')
            if (!otherParticipants) {
                response.status(404).json({ message: 'Chat not found', success: false })
                return
            }

            const remainingUser = otherParticipants.users.find((u: any) => u.toString() !== user._id.toString())
            const otherUserStillHasChat = await userModel.findOne({
                _id: remainingUser,
                chats: chatId
            })

            if (!otherUserStillHasChat) {
                // ✅ Both users deleted chat, delete it from chatModel
                await chatModel.findByIdAndDelete(chatId)
            }

            response.status(200).json({
                message: 'Chat removed from your list',
                success: true
            })
            return
        } catch (error) {
            httpError(next, error, request, 500)
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
                response.status(400).json({ message: 'Chat name is required', success: false })
                return
            }
            const chat = await chatModel.findById(chatId)
            if (!chat) {
                response.status(400).json({ message: 'Chat not found', success: false })
                return
            }
            const renameChat = await chatModel.findByIdAndUpdate(chatId, { chatName }, { new: true })

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
            // users = JSON.parse(users)
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

            await userModel.updateMany(
                { _id: { $in: users } },
                {
                    $addToSet: { chats: createGroupChat._id }
                },
                { new: true }
            )
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
            const { userIds } = req.body
            const { chatId } = req.params
            if (!chatId) {
                response.status(400).json({ message: 'ChatID is required (params)', success: false })
                return
            }
            if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
                response.status(400).json({ message: 'userIds array is required in body', success: false })
                return
            }

            const added = await chatModel
                .findByIdAndUpdate(
                    chatId,
                    {
                        $addToSet: { users: { $each: userIds } }
                    },
                    { new: true }
                )
                .populate('users', '-password')
                .populate('groupAdmin', '-password')

            await userModel.updateMany(
                { _id: userIds },
                {
                    $addToSet: { chats: chatId }
                },
                {
                    new: true
                }
            )
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
    searchUserToAddIntoGroup: asyncHandler(async (request: Request, _response: Response, next: NextFunction) => {
        try {
            const keyword = request.query.search
            console.log(keyword)
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

            await userModel.findByIdAndUpdate({ _id: userId }, { $pull: { chats: chatId } }, { new: true })
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
}
