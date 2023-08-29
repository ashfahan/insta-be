import { PrismaClient } from "@prisma/client";
declare const prisma: PrismaClient<import(".prisma/client").Prisma.PrismaClientOptions, never, import(".prisma/client").Prisma.RejectOnNotFound | import(".prisma/client").Prisma.RejectPerOperation | undefined, import("@prisma/client/runtime").DefaultArgs>;
export declare const userSelects: {
    select: {
        id: boolean;
        username: boolean;
        email: boolean;
        avatar: boolean;
        about: boolean;
    };
};
export declare const productSelects: {
    id: boolean;
    name: boolean;
    image: boolean;
    price: boolean;
    description: boolean;
    createdAt: boolean;
    user: {
        select: {
            id: boolean;
            username: boolean;
            email: boolean;
            avatar: boolean;
            about: boolean;
        };
    };
};
export declare const postIncludes: {
    include: {
        author: {
            select: {
                id: boolean;
                username: boolean;
                email: boolean;
                avatar: boolean;
                about: boolean;
            };
        };
        likes: {
            select: {
                id: boolean;
                user: {
                    select: {
                        id: boolean;
                        username: boolean;
                        email: boolean;
                        avatar: boolean;
                        about: boolean;
                    };
                };
            };
        };
        comments: {
            select: {
                id: boolean;
                content: boolean;
                user: {
                    select: {
                        id: boolean;
                        username: boolean;
                        email: boolean;
                        avatar: boolean;
                        about: boolean;
                    };
                };
            };
        };
    };
};
export default prisma;
