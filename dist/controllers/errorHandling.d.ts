import { Request, Response, NextFunction } from "express";
declare const notFoundError: (req: Request, res: Response, next: NextFunction) => void;
declare const serverError: (err: any, req: Request, res: Response, next: NextFunction) => void;
export { notFoundError, serverError };
