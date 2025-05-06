// // frontend/src/socket.ts
// import { io } from "socket.io-client";

// const socket = io("http://localhost:3000", {
//   withCredentials: true,
// });

// export default socket;

// utils/socket.ts
import { io, Socket } from "socket.io-client";

let socket: Socket;

export const connectSocket = () => {
  socket = io("http://localhost:3000", {
    withCredentials: true,
  });
};

export const getSocket = () => socket;
