"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const post_1 = require("../controllers/post");
const verifyToken_1 = require("../middleware/verifyToken");
const router = (0, express_1.Router)();
router.post("/", [verifyToken_1.verifyToken], post_1.createPost);
router.get("/feed/user", [verifyToken_1.verifyToken], post_1.getFeedForUser);
router.get("/explore", post_1.explorePosts);
router.get("/:id", post_1.getPostById);
router.post("/:id/like", [verifyToken_1.verifyToken], post_1.likePost);
router.post("/:id/unlike", [verifyToken_1.verifyToken], post_1.unlikePost);
router.post("/:id/comment", [verifyToken_1.verifyToken], post_1.addCommentToPost);
router.post("/:id/comment/edit", [verifyToken_1.verifyToken], post_1.editCommentToPost);
router.delete("/:id", [verifyToken_1.verifyToken], post_1.deletePost);
router.delete("/:postId/comment/:commentId", [verifyToken_1.verifyToken], post_1.deleteComment);
router.put("/:id", [verifyToken_1.verifyToken], post_1.updatePost);
exports.default = router;
//# sourceMappingURL=post.js.map