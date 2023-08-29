"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkout = exports.getUserCart = exports.emptyCart = exports.removeFromCart = exports.addToCart = exports.getProductById = exports.getProducts = exports.createProduct = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const prisma_1 = __importStar(require("../prisma"));
const stripe_1 = __importDefault(require("stripe"));
const stripe = new stripe_1.default(process.env.STRIPE_API_KEY_SECTRET, {
    apiVersion: "2022-11-15",
});
const createProduct = async (req, res, next) => {
    const { name, price, description, image } = req.body;
    const userId = req.user.userId;
    try {
        const product = await prisma_1.default.product.create({
            data: {
                name,
                price,
                image,
                description,
                userId,
            },
        });
        return res.json({ product });
    }
    catch (error) {
        next(error);
    }
};
exports.createProduct = createProduct;
const getProducts = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = Number(req.query.size) || Number(process.env.PAGE_SIZE);
        const totalProducts = await prisma_1.default.product.count();
        const totalPages = Math.ceil(totalProducts / pageSize);
        const products = await prisma_1.default.product.findMany({
            skip: (page - 1) * pageSize,
            take: pageSize,
            orderBy: {
                createdAt: "desc",
            },
            select: {
                ...prisma_1.productSelects,
                user: false,
                userId: true,
            },
        });
        res.json({ products, totalPages });
    }
    catch (error) {
        next(error);
    }
};
exports.getProducts = getProducts;
const getProductById = async (req, res, next) => {
    const { id } = req.params;
    try {
        const product = await prisma_1.default.product.findUnique({
            where: { id: +id },
            select: {
                ...prisma_1.productSelects,
            },
        });
        if (!product)
            throw (0, http_errors_1.default)(404, "Product not found");
        return res.json({ product });
    }
    catch (error) {
        next(error);
    }
};
exports.getProductById = getProductById;
const addToCart = async (req, res, next) => {
    const { productId, quantity } = req.body;
    const { userId } = req.user;
    try {
        const product = await prisma_1.default.product.findUnique({
            where: { id: +productId },
        });
        if (!product)
            throw (0, http_errors_1.default)(404, "Product not found");
        const cartItem = await prisma_1.default.cart.findUnique({
            where: {
                userId_productId: {
                    userId: userId,
                    productId: +productId,
                },
            },
        });
        if (cartItem) {
            throw (0, http_errors_1.default)(400, "Product is already in the cart");
        }
        else {
            await prisma_1.default.cart.create({
                data: {
                    userId,
                    quantity,
                    productId: +productId,
                },
            });
            return res.json({ message: "Product added to cart successfully" });
        }
    }
    catch (error) {
        next(error);
    }
};
exports.addToCart = addToCart;
const removeFromCart = async (req, res, next) => {
    const { id: productId } = req.params;
    const { userId } = req.user;
    try {
        const cartItem = await prisma_1.default.cart.findUnique({
            where: {
                userId_productId: {
                    userId: userId,
                    productId: +productId,
                },
            },
        });
        if (!cartItem)
            throw (0, http_errors_1.default)(404, "Product not found in cart");
        await prisma_1.default.cart.delete({
            where: {
                userId_productId: {
                    userId: userId,
                    productId: +productId,
                },
            },
        });
        return res.json({ message: "Product removed from cart successfully" });
    }
    catch (error) {
        next(error);
    }
};
exports.removeFromCart = removeFromCart;
const emptyCart = async (req, res, next) => {
    const { userId } = req.user;
    try {
        await prisma_1.default.cart.deleteMany({
            where: {
                userId,
            },
        });
        return res.json({ message: "Cart emptied successfully" });
    }
    catch (error) {
        next(error);
    }
};
exports.emptyCart = emptyCart;
const getUserCart = async (req, res, next) => {
    const { userId } = req.user;
    try {
        const userCart = await prisma_1.default.user.findUnique({
            where: { id: userId },
            include: {
                cart: {
                    include: {
                        product: {
                            select: {
                                ...prisma_1.productSelects,
                                user: false,
                            },
                        },
                    },
                },
            },
        });
        if (!userCart)
            throw (0, http_errors_1.default)(404, "User not found");
        return res.json({ cart: userCart.cart });
    }
    catch (error) {
        next(error);
    }
};
exports.getUserCart = getUserCart;
const checkout = async (req, res, next) => {
    try {
        const { userId } = req.user;
        const { paymentMethodId } = req.body;
        const userCart = await prisma_1.default.user.findUnique({
            where: { id: userId },
            include: {
                cart: {
                    include: {
                        product: true,
                    },
                },
            },
        });
        if (!userCart)
            throw (0, http_errors_1.default)(404, "Not Found");
        const amount = userCart.cart.reduce((total, cartItem) => total + cartItem.product.price * cartItem.quantity, 0);
        if (!userCart.stripeCustomerId) {
            const customer = await stripe.customers.create({
                email: userCart.email,
                name: userCart.username,
            });
            await prisma_1.default.user.update({
                where: {
                    id: userCart.id,
                },
                data: {
                    stripeCustomerId: customer.id,
                },
            });
        }
        const paymentIntent = await stripe.paymentIntents.create({
            payment_method: paymentMethodId,
            amount: amount * 100,
            currency: "usd",
            confirmation_method: "manual",
            confirm: true,
        });
        const order = await prisma_1.default.order.create({
            data: {
                userId,
                items: {
                    create: userCart.cart.map((item) => ({
                        product: { connect: { id: item.product.id } },
                        quantity: item.quantity,
                    })),
                },
            },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });
        await prisma_1.default.cart.deleteMany({
            where: {
                userId,
            },
        });
        return res.json({ success: true, order });
    }
    catch (error) {
        console.error("Error confirming payment intent:", error.message);
        next(error);
    }
};
exports.checkout = checkout;
//# sourceMappingURL=shopping.js.map