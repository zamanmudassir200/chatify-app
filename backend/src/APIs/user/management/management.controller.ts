import { NextFunction, Request, Response } from 'express'
import httpResponse from '../../../handlers/httpResponse'
import responseMessage from '../../../constant/responseMessage'
import httpError from '../../../handlers/errorHandler/httpError'
import { CustomError } from '../../../utils/errors'
import { IMyUser } from './types/management.interface'
import userModel from '../_shared/models/user.model'
import asyncHandler from '../../../handlers/async'
import { IUserWithId } from '../_shared/types/users.interface'

interface IAuthenticateRequest2 extends Request {
    authenticatedUser: IUserWithId
}
export default {
    me: (request: Request, response: Response, next: NextFunction) => {
        try {
            const { authenticatedUser } = request as unknown as IMyUser
            httpResponse(response, request, 201, responseMessage.SUCCESS, authenticatedUser)
        } catch (error) {
            if (error instanceof CustomError) {
                httpError(next, error, request, error.statusCode)
            } else {
                httpError(next, error, request, 500)
            }
        }
    },
    getAllUsers: asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
        try {
            const allUsers = await userModel.find()
            response.status(200).json({ message: 'All users', count: allUsers.length, users: allUsers, success: true })
        } catch (error) {
            httpError(next, error, request, 500)
        }
    }),
    searchUser: asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
        try {
            const req = request as IAuthenticateRequest2
            const user = req.authenticatedUser

            const keyword = req.query.search
                ? {
                      $or: [{ name: { $regex: req.query.search, $options: 'i' } }, { email: { $regex: req.query.search, $options: 'i' } }]
                  }
                : {}

            const users = await userModel.find(keyword).find({ _id: { $ne: user._id } })

            response.status(200).json({
                success: true,
                count: users.length,
                data: users
            })
        } catch (error) {
            httpError(next, error, request, 500)
        }
    })
}

