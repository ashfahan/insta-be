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
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOrderNotificaiton = exports.sendFollowNotificaiton = exports.sendCommentNotificaiton = exports.sendLikeNotificaiton = void 0;
const convertObjectValuesToString_1 = require("../utils/convertObjectValuesToString");
const prisma_1 = __importStar(require("./../prisma"));
const sendNotification_1 = require("./sendNotification");
const getPostById = async (postId) => {
    return await prisma_1.default.post.findUnique({
        where: {
            id: postId,
        },
        ...prisma_1.postIncludes,
    });
};
const getUserById = async (userId) => {
    return await prisma_1.default.user.findUnique({
        where: {
            id: userId,
        },
        ...prisma_1.userSelects,
    });
};
const getProductById = async (productId) => {
    return await prisma_1.default.product.findUnique({
        where: {
            id: productId,
        },
        select: {
            ...prisma_1.productSelects,
        },
    });
};
const makeAndSendNotification = async (messageHead, messageStr, userId, data) => {
    if (!userId)
        return;
    try {
        const fcmTokens = await prisma_1.default.fCMToken.findMany({
            where: {
                user: {
                    id: userId,
                },
            },
        });
        console.log({ fcmTokens });
        const notifications = fcmTokens.map(({ token }) => ({
            notification: {
                title: messageHead,
                body: messageStr,
            },
            data: (0, convertObjectValuesToString_1.convertObjectValuesToString)(data),
            token: token,
        }));
        for (const notification of notifications) {
            (0, sendNotification_1.sendNotification)(notification);
        }
    }
    catch (error) {
        console.error("Error sending notification:", error);
    }
};
const sendLikeNotificaiton = async (postId, userId) => {
    const [post, user] = await Promise.all([
        getPostById(postId),
        getUserById(userId),
    ]);
    const author = post?.author;
    const messageHead = `Post Liked`;
    const messageStr = `${user?.username} liked your post ${post?.caption}`;
    console.log(`Like Notification Sent:: ${messageStr}`);
    makeAndSendNotification(messageHead, messageStr, author?.id, {
        postId,
        userId,
    });
};
exports.sendLikeNotificaiton = sendLikeNotificaiton;
const sendCommentNotificaiton = async (content, postId, userId) => {
    const [post, user] = await Promise.all([
        getPostById(postId),
        getUserById(userId),
    ]);
    const author = post?.author;
    const messageHead = `Comment Added`;
    const messageStr = `${user?.username} added comment ${content ? content : ""} on your post ${post?.caption}`;
    console.log(`Comment Added Notification Sent:: ${messageStr}`);
    makeAndSendNotification(messageHead, messageStr, author?.id, {
        postId,
        userId,
    });
};
exports.sendCommentNotificaiton = sendCommentNotificaiton;
const sendFollowNotificaiton = async (followerId, followingId) => {
    const [follower, following] = await Promise.all([
        getUserById(followerId),
        getUserById(followingId),
    ]);
    const messageHead = `Started Following`;
    const messageStr = `${follower?.username} started Following you`;
    console.log(`Started Following Notification Sent:: ${messageStr}`);
    makeAndSendNotification(messageHead, messageStr, following?.id, {
        followerId,
        followingId,
    });
};
exports.sendFollowNotificaiton = sendFollowNotificaiton;
const sendOrderNotificaiton = async (userId, productIds) => {
    const [user, product] = await Promise.all([
        getUserById(userId),
        getProductById(productIds[0]),
    ]);
    const author = product?.user;
    const messageHead = `Order Placed`;
    const messageStr = `${user?.username} placed order of ${productIds.length === 1 ? product?.name : productIds.length + " products"}`;
    console.log(`Order Placed Notification Sent:: ${messageStr}`);
    makeAndSendNotification(messageHead, messageStr, author?.id, {
        userId,
        productIds,
    });
};
exports.sendOrderNotificaiton = sendOrderNotificaiton;
//# sourceMappingURL=notifications.js.map