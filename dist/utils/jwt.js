"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJWTToken = exports.signToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secret = process.env.JWT_SECRET || "";
const signToken = (payload, expiresIn = "1w") => jsonwebtoken_1.default.sign(payload, secret, { expiresIn });
exports.signToken = signToken;
const verifyJWTToken = (token) => jsonwebtoken_1.default.verify(token, secret);
exports.verifyJWTToken = verifyJWTToken;
//# sourceMappingURL=jwt.js.map