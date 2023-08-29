"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSocketCalls = exports.userSockets = void 0;
const messages_1 = require("./controllers/messages");
exports.userSockets = new Map();
function setupSocketCalls(io) {
    io.on("connection", (socket) => {
        console.log("Conn");
        socket.on("join", (userId) => {
            exports.userSockets.set(userId, socket);
            socket.userId = userId;
            console.log("A user connected");
        });
        socket.on("message", (messageData) => {
            (0, messages_1.handleNewMessage)(io, socket, messageData);
        });
        socket.on("disconnect", () => {
            if (socket.userId) {
                exports.userSockets.delete(socket.userId);
                console.log("A user disconnected", socket.userId);
            }
        });
    });
}
exports.setupSocketCalls = setupSocketCalls;
//# sourceMappingURL=socket.js.map