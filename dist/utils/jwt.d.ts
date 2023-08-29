import jwt from "jsonwebtoken";
export interface PayloadType {
    userId: number;
    iat?: number;
    exp?: number;
}
declare const signToken: (payload: PayloadType, expiresIn?: string) => string;
declare const verifyJWTToken: (token: string) => string | jwt.JwtPayload;
export { signToken, verifyJWTToken };
