import { handleNewMessage } from "./controllers/messages";

export const userSockets = new Map();

export function setupSocketCalls(io: any) {
  io.on("connection", (socket: any) => {
    console.log("Conn");

    socket.on("join", (userId: string) => {
      userSockets.set(userId, socket);
      socket.userId = userId;
      console.log("A user connected");
    });

    socket.on("message", (messageData: any) => {
      handleNewMessage(io, socket, messageData);
    });

    socket.on("disconnect", () => {
      if (socket.userId) {
        userSockets.delete(socket.userId);
        console.log("A user disconnected", socket.userId);
      }
    });
  });
}
