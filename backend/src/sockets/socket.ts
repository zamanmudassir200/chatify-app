// import http from 'http'
// import { Server } from 'socket.io'
// import app from '../app'

// export const server = http.createServer(app)

// const io = new Server(server, {
//     cors: {
//         origin: '*',
//         methods: ['GET', 'POST']
//     }
// })
// // Socket.io connection
// io.on('connection', (socket) => {
//     console.log('🟢 New client connected:', socket.id)

//     socket.on('joinChat', (chatId) => {
//         socket.join(chatId)
//         console.log(`🔗 User joined chat: ${chatId}`)
//     })
//     socket.on('sendMessage', (newMessage) => {
//         console.log('new message:', newMessage)
//         const chatId = newMessage.chat

//         if (!chatId) return console.log('chat.users not defined')

//         // Emit the new message to all users in the chat room
//         socket.to(chatId).emit('messageReceived', newMessage)
//     })

//     socket.on('disconnect', () => {
//         console.log('🔴 Client disconnected')
//     })
// })
// export { io }

import { Server as HTTPServer } from 'http'
import { Server as SocketIOServer } from 'socket.io'

let io: SocketIOServer

export const setupSocket = (server: HTTPServer) => {
    io = new SocketIOServer(server, {
        cors: {
            origin: ['http://localhost:3001'],
            methods: ['GET', 'POST'],
            credentials: true
        }
    })

    // io.on('connection', (socket) => {
    //     console.log('🔌 New client connected:', socket.id)

    //     // Join a room for a particular chat
    //     socket.on('joinChat', (chatId: string) => {
    //         socket.join(chatId)
    //         console.log(`🟢 Socket ${socket.id} joined chat room ${chatId}`)
    //     })

    //     // Send message only to that chat room
    //     socket.on('sendMessage', (data) => {
    //         console.log('📨 Message received:', data)
    //         const chatId = data.chat
    //         io.to(chatId).emit('receiveMessage', data) // Send only to specific room
    //     })

    //     socket.on('disconnect', () => {
    //         console.log('❌ Client disconnected:', socket.id)
    //     })
    // })

    let onlineUsers = new Map<string, string>() // userId -> socketId

    io.on('connection', (socket) => {
        console.log('🔌 New client connected:', socket.id)

        // Save mapping
        socket.on('addUser', (userId: string) => {
            onlineUsers.set(userId, socket.id)
            console.log(`✅ User ${userId} is online with socket ${socket.id}`)
        })

        socket.on('sendMessage', (data) => {
            const { sender, receiver, content, chat } = data
            const receiverSocketId = onlineUsers.get(receiver)

            if (receiverSocketId) {
                io.to(receiverSocketId).emit('receiveMessage', {
                    sender,
                    content,
                    chat
                })
                console.log(`📨 Sent to receiver ${receiver} at socket ${receiverSocketId}`)
            }

            // Also emit to sender for confirmation
            socket.emit('receiveMessage', { sender, content, chat })
        })

        socket.on('disconnect', () => {
            console.log('❌ Client disconnected:', socket.id)
            for (const [userId, socketId] of onlineUsers.entries()) {
                if (socketId === socket.id) {
                    onlineUsers.delete(userId)
                    break
                }
            }
        })
    })
}

export { io }
