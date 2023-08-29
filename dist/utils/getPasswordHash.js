"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateHash = exports.comparePassword = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const generateHash = async (password) => {
    const hashedPassword = await bcrypt_1.default.hash(password, Number(process.env.BCRYPT_SALT_ROUNDS));
    return hashedPassword;
};
exports.generateHash = generateHash;
const comparePassword = async (password, comparedVal) => {
    return await bcrypt_1.default.compare(password, comparedVal);
};
exports.comparePassword = comparePassword;
//# sourceMappingURL=getPasswordHash.js.map