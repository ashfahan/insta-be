"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users_1 = require("../controllers/users");
const verifyToken_1 = require("../middleware/verifyToken");
const router = express_1.default.Router();
router.post("/register", users_1.createUser);
router.post("/login", users_1.authenticateUser);
router.post("/logout", [verifyToken_1.verifyToken], users_1.logoutUser);
router.get("/user-by-token", [verifyToken_1.verifyToken], users_1.getUserProfileByToken);
router.put("/user", [verifyToken_1.verifyToken], users_1.updateUserProfile);
router.post("/init-reset-password", users_1.initiatePasswordReset);
router.post("/reset-password", users_1.resetPassword);
router.get("/user/:id/profile", users_1.getUserProfile);
router.get("/user/:id/likes", users_1.getUserLikes);
router.get("/user/:id/comments", users_1.getUserComments);
router.get("/user/:id/posts", users_1.getUserPosts);
exports.default = router;
//# sourceMappingURL=users.js.map