import prisma, { postIncludes, userSelects } from "../prisma";
import { Request, Response, NextFunction } from "express";
import createError from "http-errors";
import { CustomRequest } from "../middleware/verifyToken";

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
        sender: {...userSelects},
        receiver: {...userSelects},
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
        OR: [
          { senderId },
          { receiverId: senderId },
        ],
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
            createdAt: 'asc',
          },
        },
        sender: true,
        receiver: true,
      },
    });

    const matchingMessages = userConversations.flatMap(conversation =>
      conversation.messages.filter(message =>
        message.message.includes(searchTerm as string) ||
        (message.mediaUrl && message.mediaUrl.includes(searchTerm as string))
      )
    );

    res.json({ messages: matchingMessages });
  } catch (error) {
    next(error);
  }
};
