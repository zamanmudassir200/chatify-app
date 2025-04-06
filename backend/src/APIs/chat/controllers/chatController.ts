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
    addUserIntoChat: asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
        try {
            const req = request as IAuthenticateRequest2

            const user = req.authenticatedUser
            const { userId } = req.params
            if (!user) {
                return httpError(next, new Error('Unauthorized access'), req, 401)
            }
            console.log(user, userId)

            const updatedUser = await userModel.findByIdAndUpdate(
                user._id,
                {
                    $addToSet: { chats: userId }
                },
                { new: true }
            )
            console.log(updatedUser)
            response.status(200).json({ message: 'user added to chat' })
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
