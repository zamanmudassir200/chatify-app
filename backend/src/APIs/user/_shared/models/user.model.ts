import mongoose from 'mongoose'
import { IUser } from '../types/users.interface'
import { EUserRoles } from '../../../../constant/users'

const userSchema = new mongoose.Schema<IUser>(
    {
        name: {
            type: String,
            minlength: 2,
            maxlength: 72,
            required: true
        },
        email: {
            type: String,
            unique: true,
            required: true
        },
        phoneNumber: {
            _id: false,
            isoCode: {
                type: String,
                required: true
            },
            countryCode: {
                type: String,
                required: true
            },
            internationalNumber: {
                type: String,
                required: true
            }
        },
        chats: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'chat'
            }
        ],
        timezone: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true,
            select: false
        },
        profilePic: {
            type: String,
            required: true,
            default:
                'https://w7.pngwing.com/pngs/39/283/png-transparent-user-user-people-linear-icon-user-infographic-people-monochrome-thumbnail.png'
        },
        role: {
            type: String,
            default: EUserRoles.USER,
            enum: EUserRoles,
            required: true
        },
        accountConfimation: {
            _id: false,
            status: {
                type: Boolean,
                default: false,
                required: true
            },
            token: {
                type: String,
                rquired: true
            },
            code: {
                type: String,
                rquired: true
            },
            timestamp: {
                type: Date,
                rquired: true
            }
        },
        passwordReset: {
            _id: false,
            token: {
                type: String,
                default: null
            },
            expiry: {
                type: Number,
                default: null
            },
            lastResetAt: {
                type: Date,
                default: null
            }
        },
        lastLoginAt: {
            type: Date,
            default: null
        },
        consent: {
            type: Boolean,
            default: true,
            required: true
        }
    },
    { timestamps: true }
)

export default mongoose.model<IUser>('user', userSchema)

