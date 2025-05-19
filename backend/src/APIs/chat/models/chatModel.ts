import mongoose, { Schema, Types, Document } from 'mongoose'
import { IUser } from '../../user/_shared/types/users.interface'

export interface IChat extends Document {
    _id: string
    chatName?: string
    isGroupChat: boolean
    users: Types.ObjectId[] | IUser[] // Can be ObjectId or populated IUser
    latestMessage: Types.ObjectId
    groupAdmin?: Types.ObjectId
}
const chatSchema = new Schema<IChat>(
    {
        chatName: {
            type: String
        },
        isGroupChat: {
            type: Boolean,
            default: false
        },
        users: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'user'
            }
        ],
        latestMessage: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'message'
        },
        groupAdmin: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        }
    },
    {
        timestamps: true
    }
)

export default mongoose.model<IChat>('chat', chatSchema)
