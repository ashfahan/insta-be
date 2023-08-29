"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const routes_1 = require("./routes");
const errorHandling_1 = require("./controllers/errorHandling");
const app = (0, express_1.default)();
const PORT = Number(process.env.PORT);
const BASE_API_PATH = process.env.BASE_API_PATH;
const MAX_REQUEST_SIZE = process.env.MAX_REQUEST_SIZE;
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json({ limit: `${MAX_REQUEST_SIZE}mb` }));
app.use(express_1.default.urlencoded({
    extended: true,
    limit: `${MAX_REQUEST_SIZE}mb`,
}));
app.use("/uploads", express_1.default.static("uploads"));
app.use(`${BASE_API_PATH}/users`, routes_1.users);
app.use(`${BASE_API_PATH}/posts`, routes_1.posts);
app.use(`${BASE_API_PATH}/search`, routes_1.search);
app.use(`${BASE_API_PATH}/follow`, routes_1.followers);
app.use(`${BASE_API_PATH}/shop`, routes_1.shopping);
app.use(`${BASE_API_PATH}/file`, routes_1.upload);
app.use(`${BASE_API_PATH}/message`, routes_1.messages);
app.use(errorHandling_1.notFoundError);
app.use(errorHandling_1.serverError);
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
//# sourceMappingURL=server.js.map