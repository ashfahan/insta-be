"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const jwt_1 = require("../utils/jwt");
const verifyToken = async (req, res, next) => {
    try {
        if (!req.headers.authorization)
            throw (0, http_errors_1.default)(401, "Unauthorized");
        const token = req.headers.authorization.split(" ")[1];
        const decodeValue = await (0, jwt_1.verifyJWTToken)(token);
        if (decodeValue) {
            req.user = decodeValue;
            next();
        }
        else {
            throw (0, http_errors_1.default)(401, "Unauthorized");
        }
    }
    catch (error) {
        const status = error.status || 500;
        const message = error.message || "Internal Server Error";
        res.status(status).send({ status, message });
    }
};
exports.verifyToken = verifyToken;
//# sourceMappingURL=verifyToken.js.map