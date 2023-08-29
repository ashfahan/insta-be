"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const search_1 = require("../controllers/search");
const router = express_1.default.Router();
router.get("/users", search_1.searchUsers);
router.get("/posts", search_1.searchPosts);
router.get("/products", search_1.searchProducts);
exports.default = router;
//# sourceMappingURL=search.js.map