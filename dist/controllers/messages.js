"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchInChat = exports.getUserConversations = exports.deleteConversation = exports.getMessagesForConversation = exports.handleNewMessage = exports.createMessage = exports.findExistingConversation = exports.createConversation = void 0;
const prisma_1 = __importStar(require("../prisma"));
const http_errors_1 = __importDefault(require("http-errors"));
const socket_1 = require("./../socket");
async function createConversation(senderId, receiverId) {
    try {
        const newConversation = await prisma_1.default.conversation.create({
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
    }
    catch (error) {
        throw error;
    }
}
exports.createConversation = createConversation;
async function findExistingConversation(senderId, receiverId) {
    try {
        const conversation = await prisma_1.default.conversation.findFirst({
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
    }
    catch (error) {
        throw error;
    }
}
exports.findExistingConversation = findExistingConversation;
async function createMessage(conversationId, messageData) {
    try {
        const newMessage = await prisma_1.default.message.create({
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
    }
    catch (error) {
        throw error;
    }
}
exports.createMessage = createMessage;
const getReceiverSocket = (io, receiverId) => socket_1.userSockets.get(receiverId) || null;
async function handleNewMessage(io, socket, messageData) {
    try {
        console.log("Received a message:");
        const existingConversation = await findExistingConversation(messageData.senderId, messageData.receiverId);
        let newMessage = {};
        if (!existingConversation) {
            const newConversation = await createConversation(messageData.senderId, messageData.receiverId);
            newMessage = await createMessage(newConversation.id, messageData);
        }
        else {
            newMessage = await createMessage(existingConversation.id, messageData);
        }
        const receiverSocket = getReceiverSocket(io, messageData.receiverId);
        if (receiverSocket)
            receiverSocket.emit("messageReceived", newMessage);
        const senderSocket = getReceiverSocket(io, messageData.senderId);
        if (senderSocket)
            senderSocket.emit("messageSent", newMessage);
    }
    catch (error) {
        console.error("Error handling message:", error);
    }
}
exports.handleNewMessage = handleNewMessage;
const getMessagesForConversation = async (req, res, next) => {
    try {
        const { receiverId } = req.params;
        const senderId = req.user.userId;
        const conversation = await prisma_1.default.conversation.findFirst({
            where: {
                AND: [
                    { senderId: parseInt(senderId) },
                    { receiverId: parseInt(receiverId) },
                ],
            },
            include: {
                messages: {
                    orderBy: {
                        createdAt: "asc",
                    },
                },
            },
        });
        if (!conversation) {
            throw (0, http_errors_1.default)(404, "Conversation not found");
        }
        res.json({ messages: conversation.messages });
    }
    catch (error) {
        next(error);
    }
};
exports.getMessagesForConversation = getMessagesForConversation;
const deleteConversation = async (req, res, next) => {
    try {
        const { receiverId } = req.params;
        const senderId = req.user.userId;
        const conversation = await prisma_1.default.conversation.findFirst({
            where: {
                AND: [
                    { senderId: parseInt(senderId) },
                    { receiverId: parseInt(receiverId) },
                ],
            },
        });
        if (!conversation)
            throw (0, http_errors_1.default)(404, "Conversation not found");
        await prisma_1.default.message.deleteMany({
            where: {
                conversationId: conversation.id,
            },
        });
        await prisma_1.default.conversation.delete({
            where: {
                id: conversation.id,
            },
        });
        res.json({ status: 204, message: "Conversation and messages deleted" });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteConversation = deleteConversation;
const getUserConversations = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const userConversations = await prisma_1.default.conversation.findMany({
            where: {
                OR: [{ senderId: userId }, { receiverId: userId }],
            },
            include: {
                messages: {
                    orderBy: {
                        createdAt: "desc",
                    },
                    take: 1,
                },
                sender: { ...prisma_1.userSelects },
                receiver: { ...prisma_1.userSelects },
            },
        });
        res.json({ conversations: userConversations });
    }
    catch (error) {
        next(error);
    }
};
exports.getUserConversations = getUserConversations;
const searchInChat = async (req, res, next) => {
    try {
        const senderId = req.user.userId;
        const { searchTerm } = req.query;
        const userConversations = await prisma_1.default.conversation.findMany({
            where: {
                OR: [{ senderId }, { receiverId: senderId }],
            },
            include: {
                messages: {
                    where: {
                        OR: [
                            { message: { contains: searchTerm } },
                            { mediaUrl: { contains: searchTerm } },
                        ],
                    },
                    orderBy: {
                        createdAt: "asc",
                    },
                },
                sender: true,
                receiver: true,
            },
        });
        const matchingMessages = userConversations.flatMap((conversation) => conversation.messages.filter((message) => message.message.includes(searchTerm) ||
            (message.mediaUrl && message.mediaUrl.includes(searchTerm))));
        res.json({ messages: matchingMessages });
    }
    catch (error) {
        next(error);
    }
};
exports.searchInChat = searchInChat;
//# sourceMappingURL=messages.js.map