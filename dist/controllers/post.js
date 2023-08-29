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
exports.editCommentToPost = exports.updatePost = exports.deleteComment = exports.deletePost = exports.explorePosts = exports.addCommentToPost = exports.unlikePost = exports.likePost = exports.getPostById = exports.getFeedForUser = exports.createPost = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const prisma_1 = __importStar(require("../prisma"));
const createPost = async (req, res, next) => {
    try {
        const { image, caption, description } = req.body;
        const userId = req.user.userId;
        if (!userId)
            throw (0, http_errors_1.default)(401, "Unauthorized");
        const post = await prisma_1.default.post.create({
            data: {
                image,
                caption,
                description,
                author: {
                    connect: { id: userId },
                },
            },
        });
        res.json({ post });
    }
    catch (error) {
        next(error);
    }
};
exports.createPost = createPost;
const getFeedForUser = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = Number(req.query.size) || Number(process.env.PAGE_SIZE);
        const userId = req.user.userId;
        const totalPosts = await prisma_1.default.post.count();
        const totalPages = Math.ceil(totalPosts / pageSize);
        const followingPosts = await prisma_1.default.post.findMany({
            where: {
                author: {
                    followers: {
                        some: { followerId: userId },
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
            ...prisma_1.postIncludes,
            skip: (page - 1) * pageSize,
            take: pageSize,
        });
        const followingIds = (await prisma_1.default.follows.findMany({
            where: { followingId: userId },
            select: { followerId: true },
        })).map((follow) => follow.followerId);
        const restOfPosts = await prisma_1.default.post.findMany({
            where: {
                author: {
                    followers: {
                        none: { followerId: userId },
                    },
                },
                authorId: {
                    notIn: followingIds,
                },
            },
            orderBy: {
                createdAt: "desc",
            },
            ...prisma_1.postIncludes,
            skip: (page - 1) * pageSize,
            take: pageSize,
        });
        const posts = [...followingPosts, ...restOfPosts];
        res.json({ posts, totalPages });
    }
    catch (error) {
        next(error);
    }
};
exports.getFeedForUser = getFeedForUser;
const getPostById = async (req, res, next) => {
    try {
        const postId = parseInt(req.params.id, 10);
        const post = await prisma_1.default.post.findUnique({
            where: {
                id: postId,
            },
            ...prisma_1.postIncludes,
        });
        if (!post)
            throw (0, http_errors_1.default)(404, "Post not found");
        res.json({ post });
    }
    catch (error) {
        next(error);
    }
};
exports.getPostById = getPostById;
const likePost = async (req, res, next) => {
    try {
        const postId = parseInt(req.params.id, 10);
        const userId = Number(req.user.userId);
        if (!userId)
            throw (0, http_errors_1.default)(401, "Unauthorized");
        const post = await prisma_1.default.post.findUnique({
            where: {
                id: postId,
            },
        });
        if (!post)
            throw (0, http_errors_1.default)(404, "Post not found");
        const like = await prisma_1.default.like.findFirst({
            where: {
                postId: postId,
                userId: userId,
            },
        });
        if (like)
            throw (0, http_errors_1.default)(400, "Post already liked");
        const likedPost = await prisma_1.default.like.create({
            data: {
                post: {
                    connect: {
                        id: postId,
                    },
                },
                user: {
                    connect: {
                        id: userId,
                    },
                },
            },
            include: {
                post: true,
            },
        });
        res.json({ post: likedPost.post });
    }
    catch (error) {
        next(error);
    }
};
exports.likePost = likePost;
const unlikePost = async (req, res, next) => {
    try {
        const postId = parseInt(req.params.id, 10);
        const userId = Number(req.user.userId);
        if (!userId)
            throw (0, http_errors_1.default)(401, "Unauthorized");
        const post = await prisma_1.default.post.findUnique({
            where: {
                id: postId,
            },
        });
        if (!post)
            throw (0, http_errors_1.default)(404, "Post not found");
        const like = await prisma_1.default.like.findFirst({
            where: {
                postId: postId,
                userId: userId,
            },
        });
        if (!like)
            throw (0, http_errors_1.default)(400, "Post not liked");
        await prisma_1.default.like.delete({
            where: {
                id: like.id,
            },
        });
        res.json({ message: "Post successfully unliked" });
    }
    catch (error) {
        next(error);
    }
};
exports.unlikePost = unlikePost;
const addCommentToPost = async (req, res, next) => {
    try {
        const { content } = req.body;
        const postId = parseInt(req.params.id, 10);
        const userId = Number(req.user.userId);
        const post = await prisma_1.default.post.findUnique({
            where: {
                id: postId,
            },
        });
        if (!post)
            throw (0, http_errors_1.default)(404, "Post not found");
        const comment = await prisma_1.default.comment.create({
            data: {
                content,
                postId,
                userId,
            },
        });
        res.json({ comment });
    }
    catch (error) {
        next(error);
    }
};
exports.addCommentToPost = addCommentToPost;
const explorePosts = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = Number(req.query.size) || Number(process.env.PAGE_SIZE);
        const totalPosts = await prisma_1.default.post.count();
        const totalPages = Math.ceil(totalPosts / pageSize);
        const posts = await prisma_1.default.post.findMany({
            orderBy: {
                createdAt: "desc",
            },
            ...prisma_1.postIncludes,
            skip: (page - 1) * pageSize,
            take: pageSize,
        });
        res.json({ posts, totalPages });
    }
    catch (error) {
        next(error);
    }
};
exports.explorePosts = explorePosts;
const deletePost = async (req, res, next) => {
    try {
        const postId = parseInt(req.params.id, 10);
        const userId = Number(req.user.userId);
        if (!userId)
            throw (0, http_errors_1.default)(401, "Unauthorized");
        const post = await prisma_1.default.post.findUnique({
            where: {
                id: postId,
            },
        });
        if (!post)
            throw (0, http_errors_1.default)(404, "Post not found");
        if (post.authorId !== userId)
            throw (0, http_errors_1.default)(403, "Forbidden");
        await prisma_1.default.post.delete({
            where: {
                id: postId,
            },
        });
        res.json({ message: "Post successfully deleted" });
    }
    catch (error) {
        next(error);
    }
};
exports.deletePost = deletePost;
const deleteComment = async (req, res, next) => {
    try {
        const commentId = parseInt(req.params.commentId, 10);
        const userId = Number(req.user.userId);
        if (!userId)
            throw (0, http_errors_1.default)(401, "Unauthorized");
        const comment = await prisma_1.default.comment.findUnique({
            where: {
                id: commentId,
            },
            include: {
                post: true,
            },
        });
        if (!comment)
            throw (0, http_errors_1.default)(404, "Comment not found");
        if (comment.userId !== userId && comment.post.authorId !== userId) {
            throw (0, http_errors_1.default)(403, "Forbidden");
        }
        await prisma_1.default.comment.delete({
            where: {
                id: commentId,
            },
        });
        res.json({ message: "Comment successfully deleted" });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteComment = deleteComment;
const updatePost = async (req, res, next) => {
    try {
        const postId = parseInt(req.params.id, 10);
        const userId = Number(req.user.userId);
        if (!userId)
            throw (0, http_errors_1.default)(401, "Unauthorized");
        const post = await prisma_1.default.post.findUnique({
            where: {
                id: postId,
            },
        });
        if (!post)
            throw (0, http_errors_1.default)(404, "Post not found");
        if (post.authorId !== userId)
            throw (0, http_errors_1.default)(403, "Forbidden");
        const { image, caption, description } = req.body;
        const updatedPost = await prisma_1.default.post.update({
            where: {
                id: postId,
            },
            data: {
                image,
                caption,
                description,
            },
        });
        res.json({ post: updatedPost });
    }
    catch (error) {
        next(error);
    }
};
exports.updatePost = updatePost;
const editCommentToPost = async (req, res, next) => {
    try {
        const commentId = +req.params.id;
        const userId = Number(req.user.userId);
        const { content } = req.body;
        if (!userId)
            throw (0, http_errors_1.default)(401, "Unauthorized");
        if (!commentId)
            throw (0, http_errors_1.default)(404, "Not Found");
        const comment = await prisma_1.default.comment.findUnique({
            where: {
                id: commentId,
            },
            include: {
                post: {
                    select: {
                        authorId: true,
                    },
                },
            },
        });
        if (!comment)
            throw (0, http_errors_1.default)(404, "Comment not found");
        if (comment.userId !== userId)
            throw (0, http_errors_1.default)(403, "Forbidden");
        const updatedComment = await prisma_1.default.comment.update({
            where: {
                id: commentId,
            },
            data: {
                content,
            },
        });
        res.json({ comment: updatedComment });
    }
    catch (error) {
        next(error);
    }
};
exports.editCommentToPost = editCommentToPost;
//# sourceMappingURL=post.js.map