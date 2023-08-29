import prisma, { postIncludes, userSelects } from "../prisma";
import { Request, Response, NextFunction } from "express";
import createError from "http-errors";
import { CustomRequest } from "../middleware/verifyToken";
import { userSockets } from "./../socket";

export async function createConversation(senderId: any, receiverId: any) {
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

export async function findExistingConversation(senderId: any, receiverId: any) {
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

export async function createMessage(conversationId: any, messageData: any) {
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

const getReceiverSocket = (io: any, receiverId: any) =>
  userSockets.get(receiverId) || null;

export async function handleNewMessage(io: any, socket: any, messageData: any) {
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

export const getMessagesForConversation = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { receiverId } = req.params;
    const senderId = req.user.userId;

    const conversation = await prisma.conversation.findFirst({
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
      throw createError(404, "Conversation not found");
    }

    res.json({ messages: conversation.messages });
  } catch (error) {
    next(error);
  }
};

export const deleteConversation = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { receiverId } = req.params;
    const senderId = req.user.userId;

    const conversation = await prisma.conversation.findFirst({
      where: {
        AND: [
          { senderId: parseInt(senderId) },
          { receiverId: parseInt(receiverId) },
        ],
      },
    });

    if (!conversation) throw createError(404, "Conversation not found");

    await prisma.message.deleteMany({
      where: {
        conversationId: conversation.id,
      },
    });

    await prisma.conversation.delete({
      where: {
        id: conversation.id,
      },
    });

    res.json({ status: 204, message: "Conversation and messages deleted" });
  } catch (error) {
    next(error);
  }
};

export const getUserConversations = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user.userId;

    const userConversations = await prisma.conversation.findMany({
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
        sender: { ...userSelects },
        receiver: { ...userSelects },
      },
    });

    res.json({ conversations: userConversations });
  } catch (error) {
    next(error);
  }
};

export const searchInChat = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const senderId = req.user.userId;
    const { searchTerm } = req.query;

    const userConversations = await prisma.conversation.findMany({
      where: {
        OR: [{ senderId }, { receiverId: senderId }],
      },
      include: {
        messages: {
          where: {
            OR: [
              { message: { contains: searchTerm as string } },
              { mediaUrl: { contains: searchTerm as string } },
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

    const matchingMessages = userConversations.flatMap((conversation) =>
      conversation.messages.filter(
        (message) =>
          message.message.includes(searchTerm as string) ||
          (message.mediaUrl && message.mediaUrl.includes(searchTerm as string))
      )
    );

    res.json({ messages: matchingMessages });
  } catch (error) {
    next(error);
  }
};
