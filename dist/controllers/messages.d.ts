import { Response, NextFunction } from "express";
import { CustomRequest } from "../middleware/verifyToken";
export declare function createConversation(senderId: any, receiverId: any): Promise<import("@prisma/client/runtime").GetResult<{
    id: number;
    senderId: number;
    receiverId: number;
    createdAt: Date;
    updatedAt: Date;
}, unknown> & {}>;
export declare function findExistingConversation(senderId: any, receiverId: any): Promise<(import("@prisma/client/runtime").GetResult<{
    id: number;
    senderId: number;
    receiverId: number;
    createdAt: Date;
    updatedAt: Date;
}, unknown> & {}) | null>;
export declare function createMessage(conversationId: any, messageData: any): Promise<import("@prisma/client/runtime").GetResult<{
    id: number;
    conversationId: number;
    senderId: number;
    message: string;
    messageType: string | null;
    mediaUrl: string | null;
    createdAt: Date;
    updatedAt: Date;
}, unknown> & {}>;
export declare function handleNewMessage(io: any, socket: any, messageData: any): Promise<void>;
export declare const getMessagesForConversation: (req: CustomRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const deleteConversation: (req: CustomRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getUserConversations: (req: CustomRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const searchInChat: (req: CustomRequest, res: Response, next: NextFunction) => Promise<void>;
