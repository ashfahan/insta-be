"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const shopping_1 = require("../controllers/shopping");
const verifyToken_1 = require("../middleware/verifyToken");
const router = (0, express_1.Router)();
router.post("/product", [verifyToken_1.verifyToken], shopping_1.createProduct);
router.get("/products", shopping_1.getProducts);
router.get("/products/:id", shopping_1.getProductById);
router.post("/cart", [verifyToken_1.verifyToken], shopping_1.addToCart);
router.get("/get-cart", [verifyToken_1.verifyToken], shopping_1.getUserCart);
router.delete("/cart/:id", [verifyToken_1.verifyToken], shopping_1.removeFromCart);
router.delete("/empty-cart", [verifyToken_1.verifyToken], shopping_1.emptyCart);
router.post("/checkout", [verifyToken_1.verifyToken], shopping_1.checkout);
exports.default = router;
//# sourceMappingURL=shopping.js.map