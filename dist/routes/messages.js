"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const messages_1 = require("../controllers/messages");
const verifyToken_1 = require("../middleware/verifyToken");
const router = express_1.default.Router();
router.get("/:receiverId/history", [verifyToken_1.verifyToken], messages_1.getMessagesForConversation);
router.get("/conversations", [verifyToken_1.verifyToken], messages_1.getUserConversations);
router.get("/search", [verifyToken_1.verifyToken], messages_1.searchInChat);
router.delete("/:receiverId", [verifyToken_1.verifyToken], messages_1.deleteConversation);
exports.default = router;
//# sourceMappingURL=messages.js.map