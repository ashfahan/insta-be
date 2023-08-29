"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fileUpload_1 = require("../services/fileUpload");
const multer_1 = __importDefault(require("multer"));
const http_errors_1 = __importDefault(require("http-errors"));
const upload = (0, multer_1.default)({
    dest: "uploads/",
    fileFilter: (req, file, callback) => {
        const allowedMimeTypes = ["image/jpeg", "image/png", "video/mp4"];
        if (allowedMimeTypes.includes(file.mimetype)) {
            callback(null, true);
        }
        else {
            callback((0, http_errors_1.default)(400, "Only image (jpeg, png) and video (mp4) files are allowed"));
        }
    },
});
const router = express_1.default.Router();
router.post(`/`, upload.single("file"), async (req, res) => {
    const file = req.file;
    if (!file)
        return (0, http_errors_1.default)(400, "No image file provided");
    const result = await (0, fileUpload_1.uploadImage)(file);
    res.json({ imageUrl: result });
});
exports.default = router;
//# sourceMappingURL=upload.js.map