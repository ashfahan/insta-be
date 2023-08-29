import { Response, NextFunction } from "express";
import { CustomRequest } from "../middleware/verifyToken";
export declare const getMessagesForConversation: (req: CustomRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const deleteConversation: (req: CustomRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getUserConversations: (req: CustomRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const searchInChat: (req: CustomRequest, res: Response, next: NextFunction) => Promise<void>;
