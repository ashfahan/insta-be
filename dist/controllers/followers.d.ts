import { NextFunction, Request, Response } from "express";
import { CustomRequest } from "../middleware/verifyToken";
export declare const followUser: (req: CustomRequest, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getFollowers: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getFollowing: (req: CustomRequest, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
