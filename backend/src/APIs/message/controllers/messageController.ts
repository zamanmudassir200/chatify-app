import asyncHandler from '../../../handlers/async'
import { Request, Response, NextFunction } from 'express'
import httpError from '../../../handlers/errorHandler/httpError'

import messageModel from '../models/messageModel'

export default {
    getAllMessages: asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
        try {
            const messages = await messageModel.find()
            console.log('messages', messages)
            response.status(200).json({ Allmessage: 'all messages', messages, success: true })
        } catch (error) {
            httpError(next, error, request, 500)
        }
    })
}
