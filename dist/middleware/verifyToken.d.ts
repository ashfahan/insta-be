import { Request, Response, NextFunction } from "express";
export interface CustomRequest extends Request {
    user?: any;
}
export declare const verifyToken: (req: CustomRequest, res: Response, next: NextFunction) => Promise<void>;
