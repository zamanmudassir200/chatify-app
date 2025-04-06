import mongoose, { Schema, Types, Document } from 'mongoose'

export interface IChat extends Document {
    chatName?: string
    isGroupChat: boolean
    users: Types.ObjectId[]
    latestMessage: Types.ObjectId
    groupAdmin?: Types.ObjectId
}

const chatSchema = new Schema<IChat>(
    {
        chatName: {
            type: String,
            required: true
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
