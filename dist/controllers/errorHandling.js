"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.serverError = exports.notFoundError = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const notFoundError = (req, res, next) => next((0, http_errors_1.default)(404, "Not Found"));
exports.notFoundError = notFoundError;
const serverError = (err, req, res, next) => {
    const status = err.status || 500;
    res.status(status);
    res.json({
        status,
        message: err.message,
    });
};
exports.serverError = serverError;
//# sourceMappingURL=errorHandling.js.map