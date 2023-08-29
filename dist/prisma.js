"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postIncludes = exports.productSelects = exports.userSelects = void 0;
const client_1 = require("@prisma/client");
const notifications_1 = require("./services/notifications");
const prisma = new client_1.PrismaClient();
prisma.$use(async (params, next) => {
    if (params.model == "Like" && params.action == "create") {
        (0, notifications_1.sendLikeNotificaiton)(params.args.data.post.connect.id, params.args.data.user.connect.id);
    }
    if (params.model == "Comment" && params.action == "create") {
        (0, notifications_1.sendCommentNotificaiton)(params.args.data.connect, params.args.data.postId, params.args.data.userId);
    }
    if (params.model == "Follows" && params.action == "create") {
        (0, notifications_1.sendFollowNotificaiton)(params.args.data.followerId, params.args.data.followingId);
    }
    if (params.model == "Order" && params.action == "create") {
        (0, notifications_1.sendOrderNotificaiton)(params.args.data.userId, params.args.data.items.create.map((item) => item.product.connect.id));
    }
    return next(params);
});
exports.userSelects = {
    select: {
        id: true,
        username: true,
        email: true,
        avatar: true,
        about: true,
    },
};
exports.productSelects = {
    id: true,
    name: true,
    image: true,
    price: true,
    description: true,
    createdAt: true,
    user: {
        ...exports.userSelects,
    },
};
exports.postIncludes = {
    include: {
        author: {
            ...exports.userSelects,
        },
        likes: {
            select: {
                id: true,
                user: {
                    ...exports.userSelects,
                },
            },
        },
        comments: {
            select: {
                id: true,
                content: true,
                user: {
                    ...exports.userSelects,
                },
            },
        },
    },
};
exports.default = prisma;
//# sourceMappingURL=prisma.js.map