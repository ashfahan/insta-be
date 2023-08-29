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
exports.searchProducts = exports.searchPosts = exports.searchUsers = void 0;
const prisma_1 = __importStar(require("../prisma"));
const searchUsers = async (req, res, next) => {
    try {
        const { q } = req.query;
        const query = q;
        const page = parseInt(req.query.page) || 1;
        const pageSize = Number(req.query.size) || Number(process.env.PAGE_SIZE);
        const skip = (page - 1) * pageSize;
        const [users, totalCount] = await Promise.all([
            prisma_1.default.user.findMany({
                where: {
                    OR: [
                        { username: { contains: query } },
                        { email: { contains: query } },
                    ],
                },
                ...prisma_1.userSelects,
                orderBy: {
                    createdAt: "desc",
                },
                skip,
                take: pageSize,
            }),
            prisma_1.default.user.count({
                where: {
                    OR: [
                        { username: { contains: query } },
                        { email: { contains: query } },
                    ],
                },
            }),
        ]);
        const totalPages = Math.ceil(totalCount / pageSize);
        res.json({ users, totalPages });
    }
    catch (error) {
        next(error);
    }
};
exports.searchUsers = searchUsers;
const searchPosts = async (req, res, next) => {
    try {
        const { q } = req.query;
        const query = q;
        const page = parseInt(req.query.page) || 1;
        const pageSize = Number(req.query.size) || Number(process.env.PAGE_SIZE);
        const skip = (page - 1) * pageSize;
        const [posts, totalCount] = await Promise.all([
            prisma_1.default.post.findMany({
                where: {
                    OR: [
                        { caption: { contains: query } },
                        { description: { contains: query } },
                    ],
                },
                orderBy: {
                    createdAt: "desc",
                },
                ...prisma_1.postIncludes,
                skip,
                take: pageSize,
            }),
            prisma_1.default.post.count({
                where: {
                    OR: [
                        { caption: { contains: query } },
                        { description: { contains: query } },
                    ],
                },
            }),
        ]);
        const totalPages = Math.ceil(totalCount / pageSize);
        res.json({ posts, totalPages });
    }
    catch (error) {
        next(error);
    }
};
exports.searchPosts = searchPosts;
const searchProducts = async (req, res, next) => {
    try {
        const { q } = req.query;
        const query = q;
        const page = parseInt(req.query.page) || 1;
        const pageSize = Number(req.query.size) || Number(process.env.PAGE_SIZE);
        const skip = (page - 1) * pageSize;
        const [products, totalCount] = await Promise.all([
            prisma_1.default.product.findMany({
                where: {
                    OR: [
                        { name: { contains: query } },
                        { description: { contains: query } },
                    ],
                },
                orderBy: {
                    createdAt: "desc",
                },
                skip,
                take: pageSize,
            }),
            prisma_1.default.product.count({
                where: {
                    OR: [
                        { name: { contains: query } },
                        { description: { contains: query } },
                    ],
                },
            }),
        ]);
        const totalPages = Math.ceil(totalCount / pageSize);
        res.json({ products, totalPages });
    }
    catch (error) {
        next(error);
    }
};
exports.searchProducts = searchProducts;
//# sourceMappingURL=search.js.map