import mongoose, { Schema, Types, Document } from 'mongoose'

export interface IMessage extends Document {
    sender: Types.ObjectId
    content: string
    chat: Types.ObjectId
}

const messageSchema = new Schema<IMessage>(
    {
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        },
        content: {
            type: String,
            required: true
        },
        chat: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'chat'
        }
    },
    {
        timestamps: true
    }
)

export default mongoose.model<IMessage>('message', messageSchema)
