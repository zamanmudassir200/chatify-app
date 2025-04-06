import { Types } from 'mongoose'
import { EUserRoles } from '../../../../constant/users'

export interface IUser {
    name: string
    email: string
    phoneNumber: {
        isoCode: string
        countryCode: string
        internationalNumber: string
    }
    timezone: string
    password: string
    profilePic: string
    role: EUserRoles
    accountConfimation: {
        status: boolean
        token: string
        code: string
        timestamp: Date | null
    }
    passwordReset: {
        token: string | null
        expiry: number | null
        lastResetAt: Date | null
    }
    lastLoginAt: Date | null
    consent: boolean
    chats: Types.ObjectId[]
}
export interface IUserWithId extends IUser {
    _id: string
}

