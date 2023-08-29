import { Server } from "socket.io";

import { createServer } from "http";
import { log } from "console";

const server = createServer();
const socket = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket"],
});

export const userSockets = new Map();

export async function createConversation(senderId, receiverId) {
  try {
    const newConversation = await prisma.conversation.create({
      data: {
        sender: {
          connect: { id: senderId },
        },
        receiver: {
          connect: { id: receiverId },
        },
      },
    });

    return newConversation;
  } catch (error) {
    throw error;
  }
}

export async function findExistingConversation(senderId, receiverId) {
  try {
    const conversation = await prisma.conversation.findFirst({
      where: {
        AND: [
          {
            OR: [
              { senderId: senderId, receiverId: receiverId },
              { senderId: receiverId, receiverId: senderId },
            ],
          },
        ],
      },
    });

    return conversation;
  } catch (error) {
    throw error;
  }
}

export async function createMessage(conversationId, messageData) {
  try {
    const newMessage = await prisma.message.create({
      data: {
        conversation: { connect: { id: conversationId } },
        messageSender: { connect: { id: messageData.senderId } },
        message: messageData?.message?.toString() || "",
        messageType: messageData.messageType || "text",
        mediaUrl: messageData.mediaUrl || null,
      },
    });

    console.log({ newMessage });

    return newMessage;
  } catch (error) {
    throw error;
  }
}

const getReceiverSocket = (io, receiverId) =>
  userSockets.get(receiverId) || null;

export async function handleNewMessage(io, socket, messageData) {
  try {
    console.log("Received a message:");

    const existingConversation = await findExistingConversation(
      messageData.senderId,
      messageData.receiverId
    );

    let newMessage = {};

    if (!existingConversation) {
      const newConversation = await createConversation(
        messageData.senderId,
        messageData.receiverId
      );

      newMessage = await createMessage(newConversation.id, messageData);
    } else {
      newMessage = await createMessage(existingConversation.id, messageData);
    }

    const receiverSocket = getReceiverSocket(io, messageData.receiverId);
    if (receiverSocket) receiverSocket.emit("messageReceived", newMessage);

    const senderSocket = getReceiverSocket(io, messageData.senderId);
    if (senderSocket) senderSocket.emit("messageSent", newMessage);
  } catch (error) {
    console.error("Error handling message:", error);
  }
}

export function setupSocketCalls(io) {
  io.on("connection", (socket) => {
    console.log("Conn");

    socket.on("join", (userId) => {
      userSockets.set(userId, socket);
      socket.userId = userId;
      console.log("A user connected");
    });

    socket.on("message", (messageData) => {
      log({ messageData });
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

socket.listen(5001);
