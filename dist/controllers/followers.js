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
exports.getFollowing = exports.getFollowers = exports.followUser = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const prisma_1 = __importStar(require("./../prisma"));
const followUser = async (req, res, next) => {
    const { userIdToFollow } = req.body;
    const { userId } = req.user;
    try {
        const userToFollow = await prisma_1.default.user.findUnique({
            where: { id: userIdToFollow },
        });
        if (!userToFollow)
            throw (0, http_errors_1.default)(404, "User not found");
        if (userIdToFollow === userId)
            throw (0, http_errors_1.default)(400, "You cannot follow yourself");
        const existingFollow = await prisma_1.default.follows.findUnique({
            where: {
                followerId_followingId: {
                    followerId: userId,
                    followingId: userIdToFollow,
                },
            },
        });
        if (existingFollow) {
            await prisma_1.default.follows.delete({
                where: {
                    followerId_followingId: {
                        followerId: userId,
                        followingId: userIdToFollow,
                    },
                },
            });
            return res.json({ message: "Unfollowed successfully" });
        }
        else {
            await prisma_1.default.follows.create({
                data: { followerId: userId, followingId: userIdToFollow },
            });
            return res.json({ message: "Followed successfully" });
        }
    }
    catch (error) {
        next(error);
    }
};
exports.followUser = followUser;
const getFollowers = async (req, res) => {
    const { id } = req.params;
    try {
        const followers = await prisma_1.default.user.findUnique({
            where: { id: +id },
            select: {
                followers: {
                    select: {
                        follower: prisma_1.userSelects,
                    },
                },
            },
        });
        if (!followers)
            throw (0, http_errors_1.default)(404, "User not found");
        return res.json({
            followers: followers.followers.map((follow) => follow.follower),
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.getFollowers = getFollowers;
const getFollowing = async (req, res, next) => {
    const { id } = req.params;
    try {
        const following = await prisma_1.default.user.findUnique({
            where: { id: +id },
            select: {
                following: {
                    select: {
                        following: prisma_1.userSelects,
                    },
                },
            },
        });
        if (!following)
            throw (0, http_errors_1.default)(404, "User not found");
        return res.json({
            following: following.following.map((follow) => follow.following),
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getFollowing = getFollowing;
//# sourceMappingURL=followers.js.map