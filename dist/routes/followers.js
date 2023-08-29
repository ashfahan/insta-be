"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const followers_1 = require("../controllers/followers");
const verifyToken_1 = require("../middleware/verifyToken");
const router = express_1.default.Router();
router.post("/", [verifyToken_1.verifyToken], followers_1.followUser);
router.get("/followers/:id", followers_1.getFollowers);
router.get("/following/:id", followers_1.getFollowing);
exports.default = router;
//# sourceMappingURL=followers.js.map