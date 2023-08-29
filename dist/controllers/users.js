"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserPosts = exports.getUserComments = exports.getUserLikes = exports.resetPassword = exports.initiatePasswordReset = exports.updateUserProfile = exports.getUserProfileByToken = exports.logoutUser = exports.getUserProfile = exports.authenticateUser = exports.createUser = exports.saveFCMToken = void 0;
const getPasswordHash_1 = require("../utils/getPasswordHash");
const http_errors_1 = __importDefault(require("http-errors"));
const prisma_1 = __importStar(require("./../prisma"));
const jwt_1 = require("../utils/jwt");
const generateRecoveryKey_1 = __importDefault(require("../utils/generateRecoveryKey"));
const mailService_1 = require("../services/mailService");
const saveFCMToken = async (userId, token) => {
    try {
        const user = await prisma_1.default.user.findUnique({
            where: {
                id: userId,
            },
        });
        if (!user)
            throw (0, http_errors_1.default)(404, "User not found");
        await prisma_1.default.fCMToken.upsert({
            where: {
                token,
            },
            update: {
                user: {
                    connect: {
                        id: userId,
                    },
                },
            },
            create: {
                token,
                user: {
                    connect: {
                        id: userId,
                    },
                },
            },
        });
    }
    catch (error) {
        throw error;
    }
};
exports.saveFCMToken = saveFCMToken;
const createUser = async (req, res, next) => {
    try {
        const { username, email, password, avatar, about, fcmToken } = req.body;
        const hashedPassword = await (0, getPasswordHash_1.generateHash)(password);
        const createdUser = await prisma_1.default.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
                avatar,
                about,
            },
            ...prisma_1.userSelects,
        });
        if (fcmToken)
            await (0, exports.saveFCMToken)(createdUser.id, fcmToken);
        const token = (0, jwt_1.signToken)({ userId: createdUser.id }, process.env.JWT_TOKEN_INVALIDAITON_TIME);
        res.json({ token, user: createdUser });
    }
    catch (error) {
        next(error);
    }
};
exports.createUser = createUser;
const authenticateUser = async (req, res, next) => {
    try {
        const { email, password, fcmToken } = req.body;
        const user = await prisma_1.default.user.findUnique({
            where: {
                email,
            },
            select: {
                ...prisma_1.userSelects.select,
                password: true,
            },
        });
        if (!user)
            throw (0, http_errors_1.default)(404, "User not Found");
        const passwordMatch = await (0, getPasswordHash_1.comparePassword)(password, user.password);
        if (!passwordMatch)
            throw (0, http_errors_1.default)(401, "Invalid credentials");
        const token = (0, jwt_1.signToken)({ userId: user.id }, process.env.JWT_TOKEN_INVALIDAITON_TIME);
        if (fcmToken)
            await (0, exports.saveFCMToken)(user.id, fcmToken);
        user.password = "";
        res.json({ token, user });
    }
    catch (err) {
        next(err);
    }
};
exports.authenticateUser = authenticateUser;
const getUserProfile = async (req, res, next) => {
    try {
        const userId = parseInt(req.params.id, 10);
        const user = await prisma_1.default.user.findUnique({
            where: {
                id: userId,
            },
            ...prisma_1.userSelects,
        });
        if (!user)
            throw (0, http_errors_1.default)(404, "User not Found");
        res.json({ user });
    }
    catch (error) {
        next(error);
    }
};
exports.getUserProfile = getUserProfile;
const logoutUser = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        if (userId) {
            await prisma_1.default.fCMToken.deleteMany({
                where: {
                    userId,
                },
            });
        }
        res.status(204).send();
    }
    catch (error) {
        next(error);
    }
};
exports.logoutUser = logoutUser;
const getUserProfileByToken = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        if (!userId)
            throw (0, http_errors_1.default)(401, "Unauthorized");
        const user = await prisma_1.default.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                ...prisma_1.userSelects.select,
                createdAt: true,
                updatedAt: true,
            },
        });
        if (!user)
            throw (0, http_errors_1.default)(404, "User not Found");
        res.json({ user });
    }
    catch (error) {
        next(error);
    }
};
exports.getUserProfileByToken = getUserProfileByToken;
const updateUserProfile = async (req, res, next) => {
    try {
        const { username, avatar, about } = req.body;
        const userId = req.user?.userId;
        if (!userId)
            throw (0, http_errors_1.default)(401, "Unauthorized");
        const updatedUser = await prisma_1.default.user.update({
            where: {
                id: userId,
            },
            data: {
                username,
                avatar,
                about,
            },
        });
        const updatedUserObject = {
            id: updatedUser.id,
            username: updatedUser.username,
            avatar: updatedUser.avatar,
            about: updatedUser.about,
            createdAt: updatedUser.createdAt,
            updatedAt: updatedUser.updatedAt,
        };
        res.json({ user: updatedUserObject });
    }
    catch (error) {
        next(error);
    }
};
exports.updateUserProfile = updateUserProfile;
const initiatePasswordReset = async (req, res, next) => {
    try {
        const { email } = req.body;
        const recoveryKey = (0, generateRecoveryKey_1.default)();
        await prisma_1.default.user.update({
            where: {
                email,
            },
            data: {
                recoveryKey,
            },
        });
        const user = await prisma_1.default.user.findUnique({
            where: { email },
        });
        await (0, mailService_1.sendRecoveryKeyToUser)(user, recoveryKey);
        res.json({ message: "Recovery key sent to email" });
    }
    catch (err) {
        next(err);
    }
};
exports.initiatePasswordReset = initiatePasswordReset;
const resetPassword = async (req, res, next) => {
    try {
        const { email, recoveryKey, newPassword } = req.body;
        const user = await prisma_1.default.user.findUnique({
            where: {
                email,
            },
        });
        if (!user)
            throw (0, http_errors_1.default)(404, "User not found");
        const isValidRecoveryKey = user.recoveryKey === Number(recoveryKey);
        if (!isValidRecoveryKey)
            throw (0, http_errors_1.default)(401, "Invalid recovery key");
        const hashedPassword = await (0, getPasswordHash_1.generateHash)(newPassword);
        await prisma_1.default.user.update({
            where: {
                email,
            },
            data: {
                password: hashedPassword,
            },
        });
        res.json({ message: "Password successfully reset" });
    }
    catch (err) {
        next(err);
    }
};
exports.resetPassword = resetPassword;
const getUserLikes = async (req, res, next) => {
    try {
        const userId = parseInt(req.params.id, 10);
        const likes = await prisma_1.default.like.findMany({
            where: {
                userId,
            },
            include: {
                post: true,
            },
        });
        res.json({ likes });
    }
    catch (error) {
        next(error);
    }
};
exports.getUserLikes = getUserLikes;
const getUserComments = async (req, res, next) => {
    try {
        const userId = parseInt(req.params.id, 10);
        const comments = await prisma_1.default.comment.findMany({
            where: {
                userId,
            },
            include: {
                post: true,
            },
        });
        res.json({ comments });
    }
    catch (error) {
        next(error);
    }
};
exports.getUserComments = getUserComments;
const getUserPosts = async (req, res, next) => {
    try {
        const userId = parseInt(req.params.id, 10);
        const posts = await prisma_1.default.post.findMany({
            where: {
                authorId: userId,
            },
            ...prisma_1.postIncludes,
        });
        res.json({ posts });
    }
    catch (error) {
        next(error);
    }
};
exports.getUserPosts = getUserPosts;
//# sourceMappingURL=users.js.map