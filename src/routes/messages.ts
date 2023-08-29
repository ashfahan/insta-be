import express from "express";
import {
  getMessagesForConversation,
  deleteConversation,
  getUserConversations,
  searchInChat,
} from "../controllers/messages";
import { verifyToken } from "../middleware/verifyToken";

const router = express.Router();

router.get("/:receiverId/history", [verifyToken], getMessagesForConversation);
router.get("/conversations", [verifyToken], getUserConversations);
router.get("/search", [verifyToken], searchInChat);
router.delete("/:receiverId", [verifyToken], deleteConversation);

export default router;
