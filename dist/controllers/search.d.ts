import { Response, NextFunction } from "express";
import { CustomRequest } from "../middleware/verifyToken";
export declare const searchUsers: (req: CustomRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const searchPosts: (req: CustomRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const searchProducts: (req: CustomRequest, res: Response, next: NextFunction) => Promise<void>;
