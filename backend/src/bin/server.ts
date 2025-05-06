// import app from '../app'
// import { bootstrap } from '../bootstrap'
// import config from '../config/config'
// import logger from '../handlers/logger'
// // import { server } from '../sockets/socket'

// const server = app.listen(config.PORT)
// void (async () => {
//     try {
//         await bootstrap().then(() => {
//             logger.info(`Application started on port ${config.PORT}`, {
//                 meta: { SERVER_URL: config.SERVER_URL }
//             })
//         })
//     } catch (error) {
//         logger.error(`Error starting server:`, { meta: error })
//         server.close((err) => {
//             if (err) logger.error(`error`, { meta: error })

//             process.exit(1)
//         })
//     }
// })()

import http from 'http'
import app from '../app'
import { bootstrap } from '../bootstrap'
import config from '../config/config'
import logger from '../handlers/logger'
import { setupSocket } from '../sockets/socket' // ✅ custom socket setup

const server = http.createServer(app) // ✅ Create raw HTTP server

// ✅ Setup socket.io
setupSocket(server)

void (async () => {
    try {
        await bootstrap()
        server.listen(config.PORT, () => {
            logger.info(`Application started on port ${config.PORT}`, {
                meta: { SERVER_URL: config.SERVER_URL }
            })
        })
    } catch (error) {
        logger.error(`Error starting server:`, { meta: error })
        server.close(() => {
            process.exit(1)
        })
    }
})()

