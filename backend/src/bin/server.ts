import app from '../app'
import { bootstrap } from '../bootstrap'
import config from '../config/config'
import logger from '../handlers/logger'
import http from 'http'
import { Server } from 'socket.io'

// ✅ Step 1: Create raw HTTP server from Express app
const server = http.createServer(app)

// ✅ Step 2: Initialize socket.io with CORS settings
const io = new Server(server, {
    pingTimeout: 60000,
    cors: {
        origin: ['http://localhost:3001'], // frontend URL
        methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
        credentials: true
    }
})

// ✅ Step 3: Define socket.io events
io.on('connection', (socket) => {
    // logger.info('Socket connected', { meta: { socketId: socket.id } })
    console.log('conneted to socket.io')
    socket.on('setup', (user) => {
        socket.join(user?._id)
        console.log('user._id', user._id)
        socket.emit('connected')
    })
    socket.on('join chat', (room) => {
        socket.join(room)
        console.log('User joined room', room)
    })
    socket.on('newMessage', (newMessageReceieved) => {
        let chat = newMessageReceieved.chat

        if (!chat.users) return console.log('chat.users not defined')

        chat.users.forEach((user: any) => {
            if (user._id === newMessageReceieved.sender._id) return
            socket.in(user._id).emit('messageReceived', newMessageReceieved)
        })
    })
    socket.on('typing', (room) => socket.in(room).emit('typing'))
    socket.on('stopTyping', (room) => socket.in(room).emit('stopTyping'))
    socket.on('disconnect', () => {
        // logger.info('Socket disconnected', { meta: { socketId: socket.id } })
        console.log('Socket disconnected: socketId = ', socket.id)
    })
})
// const server = app.listen(config.PORT)

void (async () => {
    try {
        await bootstrap().then(() => {
            server.listen(config.PORT, () => {
                logger.info(`Application started on port ${config.PORT}`, {
                    meta: { SERVER_URL: config.SERVER_URL }
                })
            })
        })
    } catch (error) {
        logger.error(`Error starting server:`, { meta: error })
        server.close((err) => {
            if (err) logger.error(`error`, { meta: error })

            process.exit(1)
        })
    }
})()

export { io }

