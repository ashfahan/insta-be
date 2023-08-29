export declare const sendLikeNotificaiton: (postId: number, userId: number) => Promise<void>;
export declare const sendCommentNotificaiton: (content: string, postId: number, userId: number) => Promise<void>;
export declare const sendFollowNotificaiton: (followerId: number, followingId: number) => Promise<void>;
export declare const sendOrderNotificaiton: (userId: number, productIds: number[]) => Promise<void>;
