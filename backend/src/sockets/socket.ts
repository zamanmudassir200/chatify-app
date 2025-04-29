import http from 'http'
import { Server } from 'socket.io'
import app from '../app'

export const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
})
// Socket.io connection
io.on('connection', (socket) => {
    console.log('🟢 New client connected:', socket.id)

    socket.on('joinChat', (chatId) => {
        socket.join(chatId)
        console.log(`🔗 User joined chat: ${chatId}`)
    })

    socket.on('disconnect', () => {
        console.log('🔴 Client disconnected')
    })
})
export { io }
