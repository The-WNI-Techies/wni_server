"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const auth_routes_1 = __importDefault(require("./auth/auth.routes"));
const user_routes_1 = __importDefault(require("./user/user.routes"));
const chat_routes_1 = __importDefault(require("./chat/chat.routes"));
const auth_middlewares_1 = __importDefault(require("./auth/auth.middlewares"));
const app = (0, express_1.default)();
const PATH = '/api/v1';
const corsOptions = {
    origin: '*',
    exposedHeaders: ['Authorization'],
};
app.use((0, cors_1.default)(corsOptions));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(`${PATH}/auth`, auth_routes_1.default);
app.use(`${PATH}/user`, auth_middlewares_1.default.requireAuth, user_routes_1.default);
app.use(`${PATH}/chat`, auth_middlewares_1.default.requireAuth, auth_middlewares_1.default.requireVerification, chat_routes_1.default);
app.get("/healthz", (_req, res) => res.send("Ready for some server-side shit!"));
mongoose_1.default.connect(process.env.MONGO_URI)
    .then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Listening on port ${process.env.PORT}`);
    });
})
    .catch(err => console.error(err));
